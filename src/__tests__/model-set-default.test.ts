import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';

vi.mock('../utils/logger.js', () => ({
  log: { info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), dim: vi.fn() },
}));

import { log } from '../utils/logger.js';
import { modelInject, modelList, modelSetDefault } from '../model-cmd.js';
import {
  candidatesFrom,
  collectToolSelections,
  getDefaultModelPath,
  loadDefaultModel,
  saveDefaultModel,
} from '../model/default-model.js';
import { getToolTarget } from '../model/tool-targets.js';

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
let originalKeys: Record<string, string | undefined>;

beforeEach(async () => {
  home = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-set-default-'));
  originalHome = process.env.HOME;
  process.env.HOME = home;
  originalDirs = {};
  for (const key of DIR_OVERRIDES) {
    originalDirs[key] = process.env[key];
    delete process.env[key];
  }
  originalKeys = {};
  for (const key of ['DEEPSEEK_API_KEY', 'GLM_API_KEY']) {
    originalKeys[key] = process.env[key];
  }
  process.env.DEEPSEEK_API_KEY = 'deepseek-test-key';
  process.env.GLM_API_KEY = 'glm-test-key';
});

afterEach(async () => {
  if (originalHome === undefined) delete process.env.HOME;
  else process.env.HOME = originalHome;
  for (const [key, value] of Object.entries(originalDirs)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  for (const [key, value] of Object.entries(originalKeys)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  process.exitCode = undefined;
  vi.restoreAllMocks();
  await fse.remove(home);
});

const opencodeFile = () => path.join(home, '.config', 'opencode', 'opencode.jsonc');
const claudeFile = () => path.join(home, '.claude', 'settings.json');

async function readJson<T = Record<string, unknown>>(file: string): Promise<T> {
  return fse.readJson(file) as Promise<T>;
}

describe('tool read-back', () => {
  it('reads the provider and models an injected opencode config contains', async () => {
    await modelInject({ provider: 'deepseek', tool: 'opencode' });

    const [group] = collectToolSelections(home);
    expect(group.tool).toBe('opencode');
    expect(group.selections).toHaveLength(1);
    expect(group.selections[0].provider).toBe('deepseek');
    expect(group.selections[0].defaultModel).toBe('deepseek-v4-flash-vision-exp');
    expect(group.selections[0].models).toContain('deepseek-v4-pro');
  });

  it('maps a claude config back to its provider via base_url and strips context suffixes', async () => {
    await modelInject({ provider: 'deepseek', tool: 'claude' });

    const [group] = collectToolSelections(home);
    expect(group.tool).toBe('claude');
    expect(group.selections[0].provider).toBe('deepseek');
    expect(group.selections[0].defaultModel).toBe('deepseek-v4-flash-vision-exp');
    expect(group.selections[0].models).toEqual([
      'deepseek-v4-flash',
      'deepseek-v4-flash-vision-exp',
      'deepseek-v4-pro',
    ]);
  });

  it('reports the vendor-grouped models of a buddy tool without a default field', async () => {
    await modelInject({ provider: 'deepseek', tool: 'codebuddy' });

    const [group] = collectToolSelections(home);
    expect(group.tool).toBe('codebuddy');
    expect(group.selections[0].provider).toBe('deepseek');
    expect(group.selections[0].defaultModel).toBeUndefined();
    expect(group.selections[0].models).toContain('deepseek-v4-pro');
    expect(getToolTarget('codebuddy').supportsDefaultModel).toBe(false);
  });

  it('exposes each injected provider as a candidate with its source tool', async () => {
    await modelInject({ provider: 'deepseek', tool: 'opencode,claude,codex' });

    const candidates = candidatesFrom(collectToolSelections(home));
    // opencode+claude list every model; codex only records its default model.
    const pro = candidates.find((c) => c.provider === 'deepseek' && c.model === 'deepseek-v4-pro');
    expect(pro?.tools.sort()).toEqual(['claude', 'opencode']);
    const def = candidates.find(
      (c) => c.provider === 'deepseek' && c.model === 'deepseek-v4-flash-vision-exp',
    );
    expect(def?.tools.sort()).toEqual(['claude', 'codex', 'opencode']);
  });
});

describe('modelSetDefault', () => {
  it('sets, persists, and re-injects a directly named model', async () => {
    await modelInject({ provider: 'deepseek', tool: 'opencode,claude' });

    await modelSetDefault('deepseek/deepseek-v4-pro');

    const opencode = await readJson<{ model: string }>(opencodeFile());
    expect(opencode.model).toBe('deepseek/deepseek-v4-pro');
    const claude = await readJson<{ env: Record<string, string> }>(claudeFile());
    expect(claude.env.ANTHROPIC_DEFAULT_SONNET_MODEL).toBe('deepseek-v4-pro[1m]');
    expect(await loadDefaultModel()).toEqual({ provider: 'deepseek', model: 'deepseek-v4-pro' });
  });

  it('skips tools whose config does not hold the chosen provider', async () => {
    await modelInject({ provider: 'deepseek', tool: 'opencode' });
    await modelInject({ provider: 'glm', tool: 'qoder' });

    await modelSetDefault('deepseek/deepseek-v4-pro');

    expect(log.info).toHaveBeenCalledWith(expect.stringContaining('Skipped'));
    const opencode = await readJson<{ model: string }>(opencodeFile());
    expect(opencode.model).toBe('deepseek/deepseek-v4-pro');
  });

  it('reports the tools without a default-model field', async () => {
    await modelInject({ provider: 'deepseek', tool: 'codebuddy' });

    await modelSetDefault('deepseek/deepseek-v4-pro');

    expect(log.info).toHaveBeenCalledWith(expect.stringContaining('No default-model field'));
    expect(await loadDefaultModel()).toEqual({ provider: 'deepseek', model: 'deepseek-v4-pro' });
  });

  it('rejects a provider that is not configured in any installed tool', async () => {
    await modelInject({ provider: 'deepseek', tool: 'opencode' });

    await modelSetDefault('glm/glm-4.7');

    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('not configured in any installed tool'));
    expect(process.exitCode).toBe(1);
    expect(await loadDefaultModel()).toBeUndefined();
  });

  it('rejects a model the provider catalog does not declare', async () => {
    await modelInject({ provider: 'deepseek', tool: 'opencode' });

    await modelSetDefault('deepseek/does-not-exist');

    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('has no model'));
    expect(process.exitCode).toBe(1);
  });

  it('rejects a malformed argument', async () => {
    await modelSetDefault('deepseek');

    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('Expected <provider>/<model>'));
    expect(process.exitCode).toBe(1);
  });

  it('prints the current default without prompting when non-interactive', async () => {
    await saveDefaultModel({ provider: 'deepseek', model: 'deepseek-v4-pro' });
    const lines: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      lines.push(args.join(' '));
    });

    await modelSetDefault();

    expect(lines.join('\n')).toContain('Default model: deepseek/deepseek-v4-pro');
  });
});

describe('modelInject default-model integration', () => {
  it('uses the persisted default when --provider is omitted', async () => {
    await saveDefaultModel({ provider: 'deepseek', model: 'deepseek-v4-pro' });

    await modelInject({ tool: 'opencode' });

    const opencode = await readJson<{ model: string }>(opencodeFile());
    expect(opencode.model).toBe('deepseek/deepseek-v4-pro');
  });

  it('ignores the persisted default when --provider is given', async () => {
    await saveDefaultModel({ provider: 'deepseek', model: 'deepseek-v4-pro' });

    await modelInject({ provider: 'glm', tool: 'opencode' });

    const opencode = await readJson<{ model: string }>(opencodeFile());
    expect(opencode.model).toBe('glm/glm-4.7');
  });

  it('warns and falls back when the persisted default is no longer in the catalog', async () => {
    await fse.outputJson(getDefaultModelPath(), { provider: 'deepseek', model: 'retired-model' });

    await modelInject({ tool: 'opencode' });

    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining('no longer in the catalog'));
    const opencode = await readJson<{ model: string }>(opencodeFile());
    expect(opencode.model).toBe('deepseek/deepseek-v4-flash-vision-exp');
  });
});

describe('modelList', () => {
  it('prints the configured default model', async () => {
    await saveDefaultModel({ provider: 'deepseek', model: 'deepseek-v4-pro' });
    const lines: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      lines.push(args.join(' '));
    });

    await modelList({});

    expect(lines.join('\n')).toContain('Default model: deepseek/deepseek-v4-pro');
  });
});
