import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { reconcileNativeHooks, resolveNativeHookFiles } from '../native-hooks.js';
import type { LocalConfig, TeamaiConfig } from '../types.js';

let home: string;
let repo: string;
let prevHome: string | undefined;

function config(overrides: Partial<LocalConfig> = {}): LocalConfig {
  return {
    repo: { localPath: repo, remote: 'https://example.com/x.git', kind: 'git' },
    username: 'tester',
    scope: 'user',
    additionalRoles: [],
    ...overrides,
  } as LocalConfig;
}

function team(): TeamaiConfig {
  return {
    team: 't',
    repo: 'https://example.com/x.git',
    toolPaths: {
      claude: { settings: '.claude/settings.json' },
      codex: { settings: '.codex/hooks.json' },
      cursor: { settings: '.cursor/hooks.json' },
      zcode: { settings: '.zcode/cli/config.json' },
      opencode: {},
      omp: {},
      pi: {},
    },
  } as unknown as TeamaiConfig;
}

function nativeFile(tool: string, name: string, content: string): void {
  const dir = path.join(repo, 'hooks', 'native', tool);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), content);
}

function json(p: string): Record<string, any> {
  return JSON.parse(fs.readFileSync(path.join(home, p), 'utf-8'));
}

beforeEach(() => {
  home = fs.mkdtempSync(path.join(os.tmpdir(), 'native-hooks-home-'));
  repo = fs.mkdtempSync(path.join(os.tmpdir(), 'native-hooks-repo-'));
  prevHome = process.env.HOME;
  process.env.HOME = home;
  process.env.USERPROFILE = home;
});

afterEach(() => {
  if (prevHome === undefined) delete process.env.HOME; else process.env.HOME = prevHome;
  fs.rmSync(home, { recursive: true, force: true });
  fs.rmSync(repo, { recursive: true, force: true });
  vi.unstubAllEnvs();
});

describe('resolveNativeHookFiles', () => {
  it('reads the root tool dirs and flags a mismatched extension', async () => {
    nativeFile('opencode', 'a.ts', 'export {};');
    nativeFile('claude', 'b.json', '{}');
    nativeFile('claude', 'c.ts', 'export {};');
    const { files, failedTools, warnings } = await resolveNativeHookFiles(config());
    expect(files.map((f) => `${f.tool}/${f.id}`).sort()).toEqual(['claude/b', 'opencode/a']);
    expect(failedTools.size).toBe(0);
    expect(warnings.join('\n')).toContain('claude/c.ts');
  });
});

describe('reconcileNativeHooks — ts copies', () => {
  it('copies a .ts artifact to the tool plugin dir when the tool is installed', async () => {
    nativeFile('opencode', 'notify.ts', 'export const x = 1;\n');
    fs.mkdirSync(path.join(home, '.config', 'opencode'), { recursive: true });

    await reconcileNativeHooks(team(), config());

    const dest = path.join(home, '.config', 'opencode', 'plugin', 'teamai-notify.ts');
    expect(fs.readFileSync(dest, 'utf-8')).toBe('export const x = 1;\n');
  });

  it('skips a tool that is not installed', async () => {
    nativeFile('opencode', 'notify.ts', 'export {};');
    await reconcileNativeHooks(team(), config());
    expect(fs.existsSync(path.join(home, '.config', 'opencode', 'plugin', 'teamai-notify.ts'))).toBe(false);
  });

  it('honors the enabledAgents whitelist and skips tools without a definition', async () => {
    nativeFile('opencode', 'notify.ts', 'export {};');
    nativeFile('pi', 'extra.ts', 'export {};');
    fs.mkdirSync(path.join(home, '.config', 'opencode'), { recursive: true });
    fs.mkdirSync(path.join(home, '.pi', 'agent', 'extensions'), { recursive: true });

    await reconcileNativeHooks(team(), config({ enabledAgents: ['opencode'] }));

    expect(fs.existsSync(path.join(home, '.config', 'opencode', 'plugin', 'teamai-notify.ts'))).toBe(true);
    expect(fs.existsSync(path.join(home, '.pi', 'agent', 'extensions', 'teamai-extra.ts'))).toBe(false);
  });

  it('removes a stale copy and keeps a locally edited one', async () => {
    nativeFile('opencode', 'notify.ts', 'export const x = 1;\n');
    fs.mkdirSync(path.join(home, '.config', 'opencode'), { recursive: true });
    await reconcileNativeHooks(team(), config());
    const dest = path.join(home, '.config', 'opencode', 'plugin', 'teamai-notify.ts');

    // Team deletes the artifact; an unedited copy is torn down.
    fs.rmSync(path.join(repo, 'hooks', 'native', 'opencode', 'notify.ts'));
    await reconcileNativeHooks(team(), config());
    expect(fs.existsSync(dest)).toBe(false);

    // Re-add, deploy, edit locally, then the team deletes it: the edit is kept.
    nativeFile('opencode', 'notify.ts', 'export const x = 1;\n');
    await reconcileNativeHooks(team(), config());
    fs.writeFileSync(dest, 'export const x = 2; // mine\n');
    fs.rmSync(path.join(repo, 'hooks', 'native', 'opencode', 'notify.ts'));
    await reconcileNativeHooks(team(), config());
    expect(fs.readFileSync(dest, 'utf-8')).toBe('export const x = 2; // mine\n');
  });
});

describe('reconcileNativeHooks — json merges', () => {
  const CLAUDE = JSON.stringify({
    Stop: [{ matcher: '*', hooks: [{ type: 'command', command: 'echo team' }] }],
  });

  it('merges a claude fragment, preserving user entries, and marks it', async () => {
    fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
    fs.writeFileSync(
      path.join(home, '.claude', 'settings.json'),
      JSON.stringify({ hooks: { Stop: [{ matcher: '*', hooks: [{ type: 'command', command: 'echo mine' }] }] } }),
    );
    nativeFile('claude', 'nightly.json', CLAUDE);

    await reconcileNativeHooks(team(), config());

    const settings = json('.claude/settings.json');
    const stop = settings.hooks.Stop;
    expect(stop.some((e: any) => e.hooks?.[0]?.command === 'echo mine')).toBe(true);
    const mine = stop.find((e: any) => e.hooks?.[0]?.command === 'echo team');
    expect(mine.description).toContain('[teamai:file:nightly]');
  });

  it('tears a claude fragment down on removeAll and keeps user entries', async () => {
    fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
    fs.writeFileSync(
      path.join(home, '.claude', 'settings.json'),
      JSON.stringify({ hooks: { Stop: [{ matcher: '*', hooks: [{ type: 'command', command: 'echo mine' }] }] } }),
    );
    nativeFile('claude', 'nightly.json', CLAUDE);
    await reconcileNativeHooks(team(), config());

    await reconcileNativeHooks(team(), config(), { removeAll: true });

    const settings = json('.claude/settings.json');
    expect(settings.hooks.Stop.some((e: any) => e.hooks?.[0]?.command === 'echo team')).toBe(false);
    expect(settings.hooks.Stop.some((e: any) => e.hooks?.[0]?.command === 'echo mine')).toBe(true);
  });

  it('merges codex, cursor and zcode fragments', async () => {
    fs.mkdirSync(path.join(home, '.codex'), { recursive: true });
    fs.mkdirSync(path.join(home, '.cursor'), { recursive: true });
    fs.mkdirSync(path.join(home, '.zcode', 'cli'), { recursive: true });
    nativeFile('codex', 'x.json', JSON.stringify({ Stop: [{ hooks: [{ type: 'command', command: 'cx' }] }] }));
    nativeFile('cursor', 'y.json', JSON.stringify({ stop: [{ command: 'cur' }] }));
    nativeFile('zcode', 'z.json', JSON.stringify({ Stop: [{ hooks: [{ type: 'process', command: 'zc' }] }] }));

    await reconcileNativeHooks(team(), config());

    expect(json('.codex/hooks.json').hooks.Stop.some((e: any) => e.hooks?.[0]?.command === 'cx')).toBe(true);
    expect(json('.cursor/hooks.json').hooks.stop.some((e: any) => e.command === 'cur')).toBe(true);
    const zcode = json('.zcode/cli/config.json');
    expect(zcode.hooks.enabled).toBe(true);
    expect(zcode.hooks.events.Stop.some((e: any) => e.hooks?.[0]?.command === 'zc')).toBe(true);
  });

  it('warns and skips a malformed json fragment', async () => {
    fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
    nativeFile('claude', 'bad.json', '{ not json');
    await reconcileNativeHooks(team(), config());
    expect(fs.existsSync(path.join(home, '.claude', 'settings.json'))).toBe(false);
  });
});

describe('reconcileNativeHooks — gates', () => {
  it('holds artifacts when autoApply is false during an automatic run', async () => {
    nativeFile('opencode', 'notify.ts', 'export {};');
    fs.mkdirSync(path.join(home, '.config', 'opencode'), { recursive: true });
    const t = { ...team(), sharing: { hooks: { autoApply: false, requireTeamScripts: false } } } as unknown as TeamaiConfig;

    await reconcileNativeHooks(t, config(), { auto: true });
    expect(fs.existsSync(path.join(home, '.config', 'opencode', 'plugin', 'teamai-notify.ts'))).toBe(false);

    await reconcileNativeHooks(t, config(), { auto: false });
    expect(fs.existsSync(path.join(home, '.config', 'opencode', 'plugin', 'teamai-notify.ts'))).toBe(true);
  });

  it('drops artifacts when TEAMAI_HOOKS_DISABLED is set', async () => {
    vi.stubEnv('TEAMAI_HOOKS_DISABLED', '1');
    nativeFile('opencode', 'notify.ts', 'export {};');
    fs.mkdirSync(path.join(home, '.config', 'opencode'), { recursive: true });
    await reconcileNativeHooks(team(), config());
    expect(fs.existsSync(path.join(home, '.config', 'opencode', 'plugin', 'teamai-notify.ts'))).toBe(false);
  });
});
