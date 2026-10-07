import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  TOOL_DIRS_BLOCK_START,
  TOOL_DIRS_BLOCK_END,
  teamaiGitignoreEntries,
  buildToolDirsBlock,
  readToolDirsBlock,
  withToolDirsBlock,
  syncProjectToolGitignore,
  removeProjectToolGitignore,
} from '../tool-gitignore.js';
import type { LocalConfig, TeamaiConfig } from '../types.js';

let projectRoot: string;

function projectConfig(opts: {
  enabledAgents?: string[];
  disabledAgents?: string[];
  kind?: string;
} = {}): LocalConfig {
  return {
    repo: {
      localPath: path.join(projectRoot, '.teamai', 'team-repo'),
      remote: 'https://example.com/team.git',
      ...(opts.kind ? { kind: opts.kind } : {}),
    },
    username: 'ci',
    scope: 'project',
    projectRoot,
    ...(opts.enabledAgents ? { enabledAgents: opts.enabledAgents } : {}),
    ...(opts.disabledAgents ? { disabledAgents: opts.disabledAgents } : {}),
  } as LocalConfig;
}

const noTeam = null as unknown as TeamaiConfig;

function gitignorePath(): string {
  return path.join(projectRoot, '.gitignore');
}

function readGitignore(): string {
  return fs.readFileSync(gitignorePath(), 'utf8');
}

beforeEach(() => {
  projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'teamai-tool-gitignore-'));
});

afterEach(() => {
  fs.rmSync(projectRoot, { recursive: true, force: true });
});

describe('tool-dir block helpers', () => {
  it('renders a marked block with one entry per line', () => {
    expect(buildToolDirsBlock(['.teamai/', '.claude/']))
      .toBe(`${TOOL_DIRS_BLOCK_START}\n.teamai/\n.claude/\n${TOOL_DIRS_BLOCK_END}\n`);
  });

  it('renders nothing for an empty entry list', () => {
    expect(buildToolDirsBlock([])).toBe('');
  });

  it('reads the entries back out of a block', () => {
    expect(readToolDirsBlock(buildToolDirsBlock(['.teamai/', '.codex/'])))
      .toEqual(['.teamai/', '.codex/']);
  });

  it('reports no block when there is none', () => {
    expect(readToolDirsBlock('node_modules/\n')).toBeNull();
  });
});

describe('withToolDirsBlock', () => {
  it('creates the block when the file is absent', () => {
    const entries = ['.teamai/', '.claude/'];
    expect(withToolDirsBlock(null, entries)).toBe(buildToolDirsBlock(entries));
  });

  it('appends the block after existing user content', () => {
    const out = withToolDirsBlock('node_modules/\n', ['.teamai/']);
    expect(out.startsWith('node_modules/')).toBe(true);
    expect(readToolDirsBlock(out)).toEqual(['.teamai/']);
  });

  it('replaces the block in place, preserving content outside it', () => {
    const before = `node_modules/\n\n${buildToolDirsBlock(['.teamai/', '.claude/'])}\ndist/\n`;
    const out = withToolDirsBlock(before, ['.teamai/', '.codex/']);
    expect(out).toContain('node_modules/');
    expect(out).toContain('dist/');
    expect(readToolDirsBlock(out)).toEqual(['.teamai/', '.codex/']);
  });

  it('is idempotent for the same entries', () => {
    const once = withToolDirsBlock('node_modules/\n', ['.teamai/', '.claude/']);
    expect(withToolDirsBlock(once, ['.teamai/', '.claude/'])).toBe(once);
  });

  it('removes the block (and leaves the rest) for an empty entry list', () => {
    const out = withToolDirsBlock('node_modules/\n', ['.teamai/']);
    expect(withToolDirsBlock(out, [])).toBe('node_modules/\n');
  });
});

describe('teamaiGitignoreEntries', () => {
  it('lists .teamai/ plus each enabled tool root', () => {
    expect(teamaiGitignoreEntries(noTeam, projectConfig({ enabledAgents: ['claude', 'codex'] })))
      .toEqual(['.teamai/', '.claude/', '.codex/']);
  });

  it('omits .teamai/ in single-repo mode but keeps tool roots', () => {
    expect(teamaiGitignoreEntries(noTeam, projectConfig({ kind: 'self', enabledAgents: ['claude'] })))
      .toEqual(['.claude/']);
  });

  it('skips a disabled tool', () => {
    expect(teamaiGitignoreEntries(noTeam, projectConfig({ enabledAgents: ['claude', 'cursor'], disabledAgents: ['cursor'] })))
      .toEqual(['.teamai/', '.claude/']);
  });
});

describe('syncProjectToolGitignore', () => {
  it('writes a marked .gitignore block for the enabled tools', async () => {
    const config = projectConfig({ enabledAgents: ['claude', 'codex'] });
    expect(await syncProjectToolGitignore(noTeam, config)).toBe(true);
    expect(readToolDirsBlock(readGitignore())).toEqual(['.teamai/', '.claude/', '.codex/']);
  });

  it('is a no-op on the second run', async () => {
    const config = projectConfig({ enabledAgents: ['claude'] });
    await syncProjectToolGitignore(noTeam, config);
    expect(await syncProjectToolGitignore(noTeam, config)).toBe(false);
  });

  it('preserves existing user lines', async () => {
    fs.writeFileSync(gitignorePath(), 'node_modules/\ndist/\n');
    await syncProjectToolGitignore(noTeam, projectConfig({ enabledAgents: ['claude'] }));
    const text = readGitignore();
    expect(text).toContain('node_modules/');
    expect(text).toContain('dist/');
  });

  it('does nothing outside project scope', async () => {
    const user = { repo: { localPath: projectRoot, remote: 'x' }, username: 'ci', scope: 'user' } as LocalConfig;
    expect(await syncProjectToolGitignore(noTeam, user)).toBe(false);
    expect(fs.existsSync(gitignorePath())).toBe(false);
  });

  it('ignores the tool roots that already exist when no agents are enabled', async () => {
    fs.mkdirSync(path.join(projectRoot, '.cursor'));
    await syncProjectToolGitignore(noTeam, projectConfig({}));
    expect(readToolDirsBlock(readGitignore())).toEqual(['.teamai/', '.cursor/']);
  });
});

describe('removeProjectToolGitignore', () => {
  it('removes the block and keeps the rest', async () => {
    fs.writeFileSync(gitignorePath(), 'node_modules/\n');
    await syncProjectToolGitignore(noTeam, projectConfig({ enabledAgents: ['claude'] }));
    expect(await removeProjectToolGitignore(projectRoot)).toBe(true);
    expect(readGitignore()).toBe('node_modules/\n');
  });

  it('is a no-op when there is no block', async () => {
    fs.writeFileSync(gitignorePath(), 'node_modules/\n');
    expect(await removeProjectToolGitignore(projectRoot)).toBe(false);
  });
});
