import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';

vi.mock('../utils/logger.js', () => ({
  log: { info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), dim: vi.fn() },
}));

import { listProviders, providerIds } from '../model/providers.js';
import { ModelConfigService } from '../model/service.js';

const DIR_OVERRIDES = [
  'CLAUDE_CONFIG_DIR',
  'XDG_CONFIG_HOME',
  'DSH_HOME',
  'CODEX_HOME',
  'OPENCLAW_STATE_DIR',
  'OPENCLAW_CONFIG_PATH',
];

let home: string;
let originalHome: string | undefined;
let originalDirs: Record<string, string | undefined>;
let originalDeepseekKey: string | undefined;
let originalOllamaKey: string | undefined;

beforeEach(async () => {
  home = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-model-endpoint-'));
  originalHome = process.env.HOME;
  process.env.HOME = home;
  originalDirs = {};
  for (const key of DIR_OVERRIDES) {
    originalDirs[key] = process.env[key];
    delete process.env[key];
  }
  originalDeepseekKey = process.env.DEEPSEEK_API_KEY;
  process.env.DEEPSEEK_API_KEY = 'test-key';
  originalOllamaKey = process.env.OLLAMA_API_KEY;
  delete process.env.OLLAMA_API_KEY;
});

afterEach(async () => {
  if (originalHome === undefined) delete process.env.HOME;
  else process.env.HOME = originalHome;
  for (const [key, value] of Object.entries(originalDirs)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  if (originalDeepseekKey === undefined) delete process.env.DEEPSEEK_API_KEY;
  else process.env.DEEPSEEK_API_KEY = originalDeepseekKey;
  if (originalOllamaKey === undefined) delete process.env.OLLAMA_API_KEY;
  else process.env.OLLAMA_API_KEY = originalOllamaKey;
  vi.restoreAllMocks();
  await fse.remove(home);
});

const service = new ModelConfigService();

describe('endpoint policy for protocol-mandated tools', () => {
  it.each(['codex', 'opencode', 'dsh'])(
    '%s rejects an explicit anthropic override',
    (tool) => {
      expect(() => service.buildPlan({ tool, endpoint: 'anthropic' })).toThrow(
        `Tool "${tool}" only supports the "openai" endpoint`,
      );
    },
  );

  it.each(['codex', 'opencode', 'dsh'])(
    '%s defaults to the openai endpoint and /v1 base url',
    (tool) => {
      const plan = service.buildPlan({ tool });
      expect(plan.endpointName).toBe('openai');
      expect(plan.context.baseUrl).toBe('https://api.deepseek.com/v1');
    },
  );

  it('claude rejects an explicit openai override (force anthropic)', () => {
    expect(() => service.buildPlan({ tool: 'claude', endpoint: 'openai' })).toThrow(
      'Tool "claude" only supports the "anthropic" endpoint',
    );
  });

  it('openclaw still honors an anthropic override', () => {
    const plan = service.buildPlan({ tool: 'openclaw', endpoint: 'anthropic' });
    expect(plan.endpointName).toBe('anthropic');
    expect(plan.context.baseUrl).toBe('https://api.deepseek.com/anthropic');
  });
});

describe('optional api keys', () => {
  it('ollama builds without OLLAMA_API_KEY set', () => {
    expect(process.env.OLLAMA_API_KEY).toBeUndefined();
    const plan = service.buildPlan({ providerId: 'ollama', tool: 'opencode' });
    expect(plan.context.apiKey).toBe('');
  });

  it('deepseek still requires DEEPSEEK_API_KEY', () => {
    delete process.env.DEEPSEEK_API_KEY;
    expect(() => service.buildPlan({ providerId: 'deepseek', tool: 'opencode' })).toThrow(
      /DEEPSEEK_API_KEY is not set/,
    );
  });
});

describe('provider catalog immutability', () => {
  it('listProviders returns a copy that cannot mutate the catalog', () => {
    const providers = listProviders();
    const before = providerIds();
    providers.length = 0;
    expect(providerIds()).toEqual(before);
    expect(listProviders().length).toBe(before.length);
  });
});
