import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';

import {
  TOOL_TARGETS,
  getToolTarget,
  supportedToolNames,
  unsupportedTools,
} from '../model/tool-targets.js';

const TOOL_NAMES = [
  'claude',
  'codex',
  'opencode',
  'dsh',
  'codebuddy',
  'workbuddy',
  'openclaw',
  'hermes',
  'qoder',
  'zcode',
];

const ENV_KEYS = [
  'CLAUDE_CONFIG_DIR',
  'CODEX_HOME',
  'XDG_CONFIG_HOME',
  'DSH_HOME',
  'OPENCLAW_CONFIG_PATH',
  'OPENCLAW_STATE_DIR',
  'HERMES_HOME',
  'QODER_CONFIG_DIR',
];

let home: string;
let originalEnv: Record<string, string | undefined>;

beforeEach(async () => {
  home = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-tool-targets-'));
  originalEnv = {};
  for (const key of ENV_KEYS) {
    originalEnv[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(async () => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  await fse.remove(home);
});

describe('TOOL_TARGETS', () => {
  it('registers every supported tool', () => {
    expect([...TOOL_TARGETS.keys()]).toEqual(TOOL_NAMES);
    expect(supportedToolNames()).toEqual(TOOL_NAMES);
    for (const name of TOOL_NAMES) {
      expect(getToolTarget(name).name).toBe(name);
    }
  });

  it('reports Cursor as unsupported', () => {
    expect(unsupportedTools()).toEqual([
      { name: 'cursor', reason: expect.stringContaining('Cursor') },
    ]);
    expect(() => getToolTarget('cursor')).toThrow(/not supported/);
  });

  it('throws for an unknown tool', () => {
    expect(() => getToolTarget('nope')).toThrow(/Unknown tool "nope"/);
  });
});

describe('config paths', () => {
  it('resolves the default home-relative paths', () => {
    expect(getToolTarget('claude').configPath(home)).toBe(path.join(home, '.claude', 'settings.json'));
    expect(getToolTarget('codex').configPath(home)).toBe(path.join(home, '.codex', 'config.toml'));
    expect(getToolTarget('codebuddy').configPath(home)).toBe(path.join(home, '.codebuddy', 'models.json'));
    expect(getToolTarget('workbuddy').configPath(home)).toBe(path.join(home, '.workbuddy', 'models.json'));
    expect(getToolTarget('dsh').configPath(home)).toBe(path.join(home, '.dsh', 'settings.yaml'));
    expect(getToolTarget('hermes').configPath(home)).toBe(path.join(home, '.hermes', 'config.yaml'));
    expect(getToolTarget('qoder').configPath(home)).toBe(path.join(home, '.qoder', 'settings.json'));
    expect(getToolTarget('zcode').configPath(home)).toBe(path.join(home, '.zcode', 'cli', 'config.json'));
    expect(getToolTarget('openclaw').configPath(home)).toBe(path.join(home, '.openclaw', 'openclaw.json'));
    expect(getToolTarget('opencode').configPath(home)).toBe(
      path.join(home, '.config', 'opencode', 'opencode.jsonc'),
    );
  });

  it('honors config-dir env overrides and expands ~', () => {
    process.env.CLAUDE_CONFIG_DIR = path.join(home, 'claude-cfg');
    process.env.CODEX_HOME = '~/.codex-alt';
    process.env.DSH_HOME = path.join(home, 'dsh-cfg');
    process.env.QODER_CONFIG_DIR = path.join(home, 'qoder-cfg');
    process.env.HERMES_HOME = '~/.hermes-alt';

    expect(getToolTarget('claude').configPath(home)).toBe(path.join(home, 'claude-cfg', 'settings.json'));
    expect(getToolTarget('codex').configPath(home)).toBe(path.join(home, '.codex-alt', 'config.toml'));
    expect(getToolTarget('dsh').configPath(home)).toBe(path.join(home, 'dsh-cfg', 'settings.yaml'));
    expect(getToolTarget('qoder').configPath(home)).toBe(path.join(home, 'qoder-cfg', 'settings.json'));
    expect(getToolTarget('hermes').configPath(home)).toBe(path.join(home, '.hermes-alt', 'config.yaml'));
  });

  it('honors XDG_CONFIG_HOME and the openclaw overrides', () => {
    process.env.XDG_CONFIG_HOME = path.join(home, 'xdg-cfg');
    expect(getToolTarget('opencode').configPath(home)).toBe(
      path.join(home, 'xdg-cfg', 'opencode', 'opencode.jsonc'),
    );

    process.env.OPENCLAW_STATE_DIR = path.join(home, 'oc-state');
    expect(getToolTarget('openclaw').configPath(home)).toBe(path.join(home, 'oc-state', 'openclaw.json'));

    process.env.OPENCLAW_CONFIG_PATH = '~/oc/custom.json';
    expect(getToolTarget('openclaw').configPath(home)).toBe(path.join(home, 'oc', 'custom.json'));
  });

  it('prefers an existing opencode .json over the seeded .jsonc', async () => {
    const dir = path.join(home, '.config', 'opencode');
    const json = path.join(dir, 'opencode.json');
    await fse.outputJson(json, {});
    expect(getToolTarget('opencode').configPath(home)).toBe(json);
  });
});

describe('isInstalled', () => {
  it('is false when the config directory is absent', () => {
    expect(getToolTarget('claude').isInstalled(home)).toBe(false);
    expect(getToolTarget('codebuddy').isInstalled(home)).toBe(false);
  });

  it('is true once the config directory exists', async () => {
    await fse.ensureDir(path.join(home, '.claude'));
    expect(getToolTarget('claude').isInstalled(home)).toBe(true);
    expect(getToolTarget('codex').isInstalled(home)).toBe(false);
  });

  it('tracks a config-dir env override', async () => {
    process.env.CLAUDE_CONFIG_DIR = path.join(home, 'claude-cfg');
    expect(getToolTarget('claude').isInstalled(home)).toBe(false);
    await fse.ensureDir(path.join(home, 'claude-cfg'));
    expect(getToolTarget('claude').isInstalled(home)).toBe(true);
  });
});
