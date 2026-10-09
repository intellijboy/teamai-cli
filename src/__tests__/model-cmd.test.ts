import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';

vi.mock('../utils/logger.js', () => ({
  log: { info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), dim: vi.fn() },
}));

import { log } from '../utils/logger.js';
import { modelInject, modelList } from '../model-cmd.js';

const DIR_OVERRIDES = [
  'CLAUDE_CONFIG_DIR',
  'XDG_CONFIG_HOME',
  'DSH_HOME',
  'CODEX_HOME',
  'OPENCLAW_STATE_DIR',
  'OPENCLAW_CONFIG_PATH',
  'HERMES_HOME',
  'QODER_CONFIG_DIR',
];

let home: string;
let originalHome: string | undefined;
let originalDirs: Record<string, string | undefined>;
let originalKey: string | undefined;

beforeEach(async () => {
  home = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-model-cmd-'));
  originalHome = process.env.HOME;
  process.env.HOME = home;
  originalDirs = {};
  for (const key of DIR_OVERRIDES) {
    originalDirs[key] = process.env[key];
    delete process.env[key];
  }
  originalKey = process.env.DEEPSEEK_API_KEY;
  process.env.DEEPSEEK_API_KEY = 'test-key';
});

afterEach(async () => {
  if (originalHome === undefined) delete process.env.HOME;
  else process.env.HOME = originalHome;
  for (const [key, value] of Object.entries(originalDirs)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  if (originalKey === undefined) delete process.env.DEEPSEEK_API_KEY;
  else process.env.DEEPSEEK_API_KEY = originalKey;
  process.exitCode = undefined;
  vi.restoreAllMocks();
  await fse.remove(home);
});

/** With no opencode config on disk, injection creates the .jsonc OpenCode itself seeds. */
const opencodeFile = () => path.join(home, '.config', 'opencode', 'opencode.jsonc');

describe('modelInject', () => {
  it('injects into an explicitly named tool', async () => {
    await modelInject({ provider: 'deepseek', tool: 'opencode' });
    expect(await fse.pathExists(opencodeFile())).toBe(true);
    expect(await fse.pathExists(path.join(home, '.claude', 'settings.json'))).toBe(false);
  });

  it('accepts a comma-separated tool list', async () => {
    await modelInject({ tool: 'opencode,codex' });
    expect(await fse.pathExists(opencodeFile())).toBe(true);
    expect(await fse.pathExists(path.join(home, '.codex', 'config.toml'))).toBe(true);
  });

  it('targets every installed tool when --tool is omitted', async () => {
    await fse.ensureDir(path.join(home, '.claude'));
    await fse.ensureDir(path.join(home, '.config', 'opencode'));

    await modelInject({});

    expect(await fse.pathExists(path.join(home, '.claude', 'settings.json'))).toBe(true);
    expect(await fse.pathExists(opencodeFile())).toBe(true);
    expect(await fse.pathExists(path.join(home, '.dsh', 'settings.yaml'))).toBe(false);
  });

  it('reports an error and exits non-zero when no supported tool is installed', async () => {
    await expect(modelInject({})).resolves.toBeUndefined();
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('No installed AI tools'));
    expect(process.exitCode).toBe(1);
  });

  it('reports an empty --tool value instead of auto-detecting', async () => {
    await expect(modelInject({ tool: '' })).resolves.toBeUndefined();
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('--tool requires at least one tool id'));
    expect(process.exitCode).toBe(1);
  });

  it('dry run prints the merged config without writing', async () => {
    const writes: string[] = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk: unknown) => {
      writes.push(String(chunk));
      return true;
    });

    await modelInject({ tool: 'opencode', dryRun: true });

    expect(await fse.pathExists(opencodeFile())).toBe(false);
    expect(writes.join('')).toContain('deepseek/deepseek-flash');
  });

  it('dry run masks the resolved api key', async () => {
    const writes: string[] = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk: unknown) => {
      writes.push(String(chunk));
      return true;
    });

    await modelInject({ tool: 'opencode', dryRun: true });

    const output = writes.join('');
    expect(output).toContain('***');
    expect(output).not.toContain('test-key');
  });

  it('reports Cursor as unsupported and exits non-zero', async () => {
    await modelInject({ tool: 'cursor' });
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('cursor'));
    expect(String((log.error as ReturnType<typeof vi.fn>).mock.calls[0][0])).toMatch(/not supported/);
    expect(process.exitCode).toBe(1);
  });

  it('reports an unknown provider and exits non-zero before touching disk', async () => {
    await expect(modelInject({ provider: 'nope', tool: 'opencode' })).resolves.toBeUndefined();
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('Unknown provider'));
    expect(process.exitCode).toBe(1);
    expect(await fse.pathExists(opencodeFile())).toBe(false);
  });

  it('keeps processing valid tools when one tool fails, then exits non-zero', async () => {
    await modelInject({ tool: 'opencode,cursor' });

    expect(await fse.pathExists(opencodeFile())).toBe(true);
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('cursor'));
    expect(process.exitCode).toBe(1);
  });

  it('writes with the default deepseek provider', async () => {
    await modelInject({ tool: 'opencode' });
    const doc = await fse.readJson(opencodeFile());
    expect(doc.provider.deepseek).toBeDefined();
  });

  it('edits an existing opencode.json in place instead of creating a .jsonc', async () => {
    const json = path.join(home, '.config', 'opencode', 'opencode.json');
    await fse.outputJson(json, { model: 'anthropic/claude-sonnet-4-5' });

    await modelInject({ tool: 'opencode' });

    expect(await fse.pathExists(opencodeFile())).toBe(false);
    const doc = await fse.readJson(json);
    expect(doc.model).toBe('deepseek/deepseek-flash');
  });
});

describe('modelList', () => {
  it('prints providers and per-tool support status', async () => {
    const lines: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      lines.push(args.join(' '));
    });

    await modelList({});

    const output = lines.join('\n');
    expect(output).toContain('deepseek');
    expect(output).toContain('DEEPSEEK_API_KEY');
    expect(output).toContain('opencode');
    expect(output).toContain('openclaw');
    expect(output).toContain('hermes');
    expect(output).toContain('qoder');
    expect(output).toContain('zcode');
    expect(output).toContain('cursor');
    expect(output).toContain('unsupported');
  });
});
