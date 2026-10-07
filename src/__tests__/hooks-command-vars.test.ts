import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';
import {
  expandCommandVars,
  expandHookDefs,
  resolveTeamHooks,
} from '../resources/hooks.js';
import type { HookDef, LocalConfig, TeamaiConfig } from '../types.js';

let repo: string;
let dataHome: string;

beforeEach(async () => {
  const base = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-hook-vars-'));
  repo = path.join(base, 'repo');
  dataHome = path.join(base, 'data');
  await fse.ensureDir(repo);
  await fse.ensureDir(dataHome);
});

afterEach(async () => {
  await fse.remove(path.dirname(repo));
});

function def(command: string, key = 'h'): HookDef {
  return { source: 'team', key, event: 'SessionStart', matcher: '*', command, description: `[teamai:hook:${key}] x` };
}

/** The env backup file buildVarTable falls back to (HTTP mode) — the KEY=value set. */
async function writeEnvBackup(lines: string): Promise<void> {
  await fse.writeFile(path.join(dataHome, 'env'), lines);
}

function member(): LocalConfig {
  return {
    repo: { localPath: repo, remote: 'https://example.com/team.git', kind: 'http' },
    username: 'tester',
    scope: 'user',
    dataHome,
  } as LocalConfig;
}

async function writeHooksYaml(content: string): Promise<void> {
  await fse.ensureDir(path.join(repo, 'hooks'));
  await fse.writeFile(path.join(repo, 'hooks', 'hooks.yaml'), content);
}

describe('expandCommandVars', () => {
  it('substitutes a known variable', () => {
    expect(expandCommandVars('echo ${FOO}', { FOO: 'bar' })).toEqual({ command: 'echo bar', missing: [] });
  });

  it('leaves an unknown variable in place and reports it', () => {
    expect(expandCommandVars('echo ${FOO} ${BAZ}', { FOO: 'bar' }))
      .toEqual({ command: 'echo bar ${BAZ}', missing: ['BAZ'] });
  });

  it('treats an empty value as missing', () => {
    expect(expandCommandVars('echo ${FOO}', { FOO: '' }))
      .toEqual({ command: 'echo ${FOO}', missing: ['FOO'] });
  });

  it('is a no-op on a command with no placeholders', () => {
    expect(expandCommandVars('codegraph init', {})).toEqual({ command: 'codegraph init', missing: [] });
  });
});

describe('expandHookDefs', () => {
  it('keeps defs whose variables all resolve, with the command expanded', () => {
    const { defs, skipped } = expandHookDefs([def('CODEGRAPH_DIR=${CODEGRAPH_DIR} codegraph init')], { CODEGRAPH_DIR: '.teamai' });
    expect(skipped).toEqual([]);
    expect(defs[0]?.command).toBe('CODEGRAPH_DIR=.teamai codegraph init');
  });

  it('drops a def with an unresolved variable and reports it', () => {
    const { defs, skipped } = expandHookDefs([def('echo ${MISSING}', 'gone'), def('echo ok', 'keep')], {});
    expect(defs.map((d) => d.key)).toEqual(['keep']);
    expect(skipped).toEqual([{ key: 'gone', missing: ['MISSING'] }]);
  });
});

describe('resolveTeamHooks variable expansion', () => {
  const teamConfig = {} as TeamaiConfig;

  it('expands a team hook command from the resolved env', async () => {
    await writeHooksYaml(`
hooks:
  - id: codegraph-init
    description: reindex codegraph
    event: SessionStart
    command: 'command -v codegraph >/dev/null 2>&1 && CODEGRAPH_DIR=\${CODEGRAPH_DIR} codegraph init || true'
`);
    await writeEnvBackup('CODEGRAPH_DIR=.teamai\n');

    const result = await resolveTeamHooks(teamConfig, member(), { silent: true });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.defs.map((d) => d.command)).toEqual([
      'command -v codegraph >/dev/null 2>&1 && CODEGRAPH_DIR=.teamai codegraph init || true',
    ]);
  });

  it('drops a team hook whose variable is not set', async () => {
    await writeHooksYaml(`
hooks:
  - id: codegraph-init
    description: reindex codegraph
    event: SessionStart
    command: 'CODEGRAPH_DIR=\${CODEGRAPH_DIR} codegraph init'
`);
    // No env backup: CODEGRAPH_DIR is unresolved.
    const result = await resolveTeamHooks(teamConfig, member(), { silent: true });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.defs).toEqual([]);
  });
});
