import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fse from 'fs-extra';

vi.mock('../utils/logger.js', () => ({
  log: {
    info: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    dim: vi.fn(),
  },
}));

import { TOOLS } from '../tools.js';
import { syncToolShellSettings, toolShellConfigFile } from '../tool-shell.js';
import { log } from '../utils/logger.js';

const GIT_BASH = 'C:\\Program Files\\Git\\bin\\bash.exe';

let tmpDir: string;
let home: string;

function windowsHost(gitBash: string | null = GIT_BASH) {
  return { platform: 'win32' as NodeJS.Platform, findGitBash: () => gitBash };
}

async function readJson(file: string): Promise<Record<string, unknown>> {
  return JSON.parse(await fse.readFile(file, 'utf-8')) as Record<string, unknown>;
}

function claudeSettings(): string {
  return path.join(home, '.claude', 'settings.json');
}

function opencodeConfig(): string {
  return path.join(home, '.config', 'opencode', 'opencode.json');
}

function claudeTarget(): { tool: string; file: string } {
  return { tool: 'claude', file: claudeSettings() };
}

function opencodeTarget(): { tool: string; file: string } {
  return { tool: 'opencode', file: path.join(home, '.config', 'opencode', 'opencode.jsonc') };
}

async function seedDir(file: string): Promise<void> {
  await fse.ensureDir(path.dirname(file));
}

function manifestFile(): string {
  return path.join(home, '.teamai', 'tool-shell.json');
}

beforeEach(async () => {
  tmpDir = await fse.realpath(await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-tool-shell-')));
  home = path.join(tmpDir, 'home');
  await fse.ensureDir(home);
  vi.stubEnv('HOME', home);
  vi.stubEnv('USERPROFILE', home);
  vi.mocked(log.warn).mockClear();
  vi.mocked(log.debug).mockClear();
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await fse.remove(tmpDir);
});

describe('tool shell registry', () => {
  it('declares a shell setting only for the tools with a documented one', () => {
    const declared = Object.entries(TOOLS)
      .filter(([, descriptor]) => (descriptor as { shell?: unknown }).shell !== undefined)
      .map(([tool]) => tool)
      .sort();
    expect(declared).toEqual(['claude', 'codebuddy', 'opencode']);
    expect(TOOLS.claude.shell).toMatchObject({ kind: 'env', file: 'settings.json', key: 'CLAUDE_CODE_GIT_BASH_PATH' });
    expect(TOOLS.codebuddy.shell).toMatchObject({ kind: 'env', file: 'settings.json', key: 'CODEBUDDY_CODE_GIT_BASH_PATH' });
    expect(TOOLS.opencode.shell).toMatchObject({ kind: 'key', file: 'opencode.json', key: 'shell' });
  });
});

describe('toolShellConfigFile', () => {
  it('puts the shell setting beside the model config file', () => {
    expect(toolShellConfigFile('claude', claudeSettings())).toBe(claudeSettings());
    expect(toolShellConfigFile('codebuddy', path.join(home, '.codebuddy', 'settings.json')))
      .toBe(path.join(home, '.codebuddy', 'settings.json'));
  });

  it('uses the registered file name in the model config directory', () => {
    expect(toolShellConfigFile('opencode', path.join(home, '.config', 'opencode', 'opencode.jsonc')))
      .toBe(opencodeConfig());
  });

  it('returns null for a tool that declares no shell setting', () => {
    expect(toolShellConfigFile('codex', path.join(home, '.codex', 'config.toml'))).toBeNull();
  });
});

describe('syncToolShellSettings', () => {
  it('writes Git Bash into each target and records it', async () => {
    await seedDir(claudeSettings());
    await seedDir(opencodeConfig());
    await fse.writeFile(claudeSettings(), JSON.stringify({ theme: 'dark', env: { KEEP: '1' } }));

    const result = await syncToolShellSettings({
      targets: [claudeTarget(), opencodeTarget(), { tool: 'codex', file: path.join(home, '.codex', 'config.toml') }],
      environment: windowsHost(),
    });

    expect([...result.written].sort()).toEqual(['claude', 'opencode']);
    const claude = await readJson(claudeSettings());
    expect((claude.env as Record<string, unknown>).CLAUDE_CODE_GIT_BASH_PATH).toBe(GIT_BASH);
    expect((claude.env as Record<string, unknown>).KEEP).toBe('1');
    expect(claude.theme).toBe('dark');
    expect((await readJson(opencodeConfig())).shell).toBe(GIT_BASH);
    const manifest = await readJson(manifestFile());
    expect(Object.keys(manifest).sort()).toEqual(['claude', 'opencode']);
  });

  it('keeps a value the user set', async () => {
    await seedDir(claudeSettings());
    const userValue = 'C:\\Other\\Git\\bin\\bash.exe';
    await fse.writeFile(claudeSettings(), JSON.stringify({ env: { CLAUDE_CODE_GIT_BASH_PATH: userValue } }));

    const result = await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost() });

    expect(result.written).toEqual([]);
    expect((await readJson(claudeSettings())).env).toEqual({ CLAUDE_CODE_GIT_BASH_PATH: userValue });
    expect(await fse.pathExists(manifestFile())).toBe(false);
  });

  it('updates its own value when Git Bash moves, and does not rewrite an unchanged file', async () => {
    await seedDir(claudeSettings());
    await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost('C:\\Git1\\bash.exe') });
    expect((await readJson(claudeSettings())).env).toEqual({ CLAUDE_CODE_GIT_BASH_PATH: 'C:\\Git1\\bash.exe' });

    const before = await fse.stat(claudeSettings());
    await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost('C:\\Git1\\bash.exe') });
    expect((await fse.stat(claudeSettings())).mtimeMs).toBe(before.mtimeMs);

    await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost('C:\\Git2\\bash.exe') });
    expect((await readJson(claudeSettings())).env).toEqual({ CLAUDE_CODE_GIT_BASH_PATH: 'C:\\Git2\\bash.exe' });
  });

  it('does nothing off Windows', async () => {
    await seedDir(claudeSettings());
    const result = await syncToolShellSettings({
      targets: [claudeTarget()],
      environment: { platform: 'linux', findGitBash: () => GIT_BASH },
    });
    expect(result).toEqual({ written: [], cleared: [], skipped: [] });
    expect(await fse.pathExists(claudeSettings())).toBe(false);
    expect(await fse.pathExists(manifestFile())).toBe(false);
    expect(log.warn).not.toHaveBeenCalled();
  });

  it('warns and writes nothing when Git Bash is missing', async () => {
    await seedDir(claudeSettings());
    const result = await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost(null) });
    expect(result.written).toEqual([]);
    expect(await fse.pathExists(claudeSettings())).toBe(false);
    expect(log.warn).toHaveBeenCalledTimes(1);
  });

  it('clears its own value in a target when Git Bash is gone', async () => {
    await seedDir(claudeSettings());
    await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost() });
    const result = await syncToolShellSettings({
      targets: [claudeTarget()],
      environment: windowsHost(null),
    });
    expect(result.cleared).toEqual(['claude']);
    expect((await readJson(claudeSettings())).env).toEqual({});
    expect(await fse.pathExists(manifestFile())).toBe(false);
  });

  it('leaves a tool outside the run untouched', async () => {
    await seedDir(claudeSettings());
    await seedDir(opencodeConfig());
    await syncToolShellSettings({ targets: [claudeTarget(), opencodeTarget()], environment: windowsHost() });

    const result = await syncToolShellSettings({
      targets: [opencodeTarget()],
      environment: windowsHost(null),
    });

    expect(result.cleared).toEqual(['opencode']);
    expect((await readJson(claudeSettings())).env).toEqual({ CLAUDE_CODE_GIT_BASH_PATH: GIT_BASH });
    expect((await readJson(opencodeConfig())).shell).toBeUndefined();
    const manifest = await readJson(manifestFile());
    expect(Object.keys(manifest)).toEqual(['claude']);
  });

  it('keeps a value the user changed after teamai wrote it', async () => {
    await seedDir(claudeSettings());
    await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost() });
    const userValue = 'C:\\Mine\\bash.exe';
    await fse.writeFile(claudeSettings(), JSON.stringify({ env: { CLAUDE_CODE_GIT_BASH_PATH: userValue } }));

    const result = await syncToolShellSettings({
      targets: [claudeTarget()],
      environment: windowsHost(null),
    });

    expect(result.cleared).toEqual([]);
    expect((await readJson(claudeSettings())).env).toEqual({ CLAUDE_CODE_GIT_BASH_PATH: userValue });
  });

  it('skips a config file that is not JSON and leaves it untouched', async () => {
    await seedDir(claudeSettings());
    await fse.writeFile(claudeSettings(), '{ not json');
    const result = await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost() });
    expect(result.skipped).toEqual(['claude']);
    expect(await fse.readFile(claudeSettings(), 'utf-8')).toBe('{ not json');
    expect(log.warn).toHaveBeenCalled();
  });

  it('skips an env value that is not an object', async () => {
    await seedDir(claudeSettings());
    await fse.writeFile(claudeSettings(), JSON.stringify({ env: 'nope' }));
    const result = await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost() });
    expect(result.skipped).toEqual(['claude']);
    expect((await readJson(claudeSettings())).env).toBe('nope');
  });

  it('ignores tools without a shell setting', async () => {
    await seedDir(path.join(home, '.codex', 'config.toml'));
    const result = await syncToolShellSettings({
      targets: [{ tool: 'codex', file: path.join(home, '.codex', 'config.toml') }, { tool: 'nope', file: path.join(home, 'x.json') }],
      environment: windowsHost(),
    });
    expect(result).toEqual({ written: [], cleared: [], skipped: [] });
    expect(await fse.pathExists(manifestFile())).toBe(false);
  });

  it('ignores a damaged ownership record', async () => {
    await seedDir(claudeSettings());
    await fse.ensureDir(path.dirname(manifestFile()));
    await fse.writeFile(manifestFile(), 'not json');
    const result = await syncToolShellSettings({ targets: [claudeTarget()], environment: windowsHost() });
    expect(result.written).toEqual(['claude']);
    expect((await readJson(claudeSettings())).env).toEqual({ CLAUDE_CODE_GIT_BASH_PATH: GIT_BASH });
  });
});
