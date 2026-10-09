import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';

vi.mock('../utils/logger.js', () => ({
  log: { info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), dim: vi.fn() },
}));

import { contextSuffix, type RenderContext } from '../model/tool-targets.js';
import { deepMerge } from '../model/merge.js';
import {
  DEFAULT_PROVIDER,
  ModelProvider,
  getProvider,
  listProviders,
  resolveApiKey,
  uniqueModels,
} from '../model/providers.js';
import { Renderer } from '../model/renderer.js';
import { ModelConfigService } from '../model/service.js';
import { mergeBuddyModels } from '../model/tools/merges/buddy.js';
import { mergeClaudeSettings } from '../model/tools/merges/claude.js';
import { mergeCodexConfig } from '../model/tools/merges/codex.js';
import { mergeOpencodeConfig } from '../model/tools/merges/opencode.js';

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
  home = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-model-'));
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
  vi.restoreAllMocks();
  await fse.remove(home);
});

const service = new ModelConfigService();

describe('contextSuffix', () => {
  it('emits [1m] for a 1M-or-larger window and nothing otherwise', () => {
    expect(contextSuffix(1_000_000)).toBe('[1m]');
    // The catalog spells a 1M window in several ways (binary 2^20 and 1024k) — all are 1M.
    expect(contextSuffix(1_048_576)).toBe('[1m]');
    expect(contextSuffix(1_024_000)).toBe('[1m]');
    // Claude Code has no [Nk]/[N] suffix, so a smaller window gets no suffix at all.
    expect(contextSuffix(262_144)).toBe('');
    expect(contextSuffix(256_000)).toBe('');
    expect(contextSuffix(128_000)).toBe('');
  });

  it('returns empty for invalid values', () => {
    expect(contextSuffix(undefined)).toBe('');
    expect(contextSuffix(0)).toBe('');
    expect(contextSuffix(-1)).toBe('');
    expect(contextSuffix(1.5)).toBe('');
  });
});

describe('deepMerge', () => {
  it('overwrites scalars and merges nested objects', () => {
    expect(deepMerge({ a: 1, b: 2 }, { b: 9, c: 3 })).toEqual({ a: 1, b: 9, c: 3 });
    expect(deepMerge({ env: { A: '1', B: '2' } }, { env: { B: '9', C: '3' } })).toEqual({
      env: { A: '1', B: '9', C: '3' },
    });
  });

  it('appends arrays without duplicates', () => {
    expect(deepMerge({ list: ['a', 'b'] }, { list: ['b', 'c'] })).toEqual({ list: ['a', 'b', 'c'] });
  });

  it('upserts object arrays by id instead of appending a second entry', () => {
    const merged = deepMerge(
      { models: [{ id: 'a', key: 'old' }, { id: 'b' }] },
      { models: [{ id: 'a', key: 'new' }, { id: 'c' }] },
    );
    expect(merged.models).toEqual([{ id: 'a', key: 'new' }, { id: 'b' }, { id: 'c' }]);
  });

  it('does not mutate its inputs', () => {
    const base = { models: [{ id: 'a' }], env: { A: '1' } };
    const patch = { models: [{ id: 'b' }], env: { B: '2' } };
    const snapshot = JSON.stringify({ base, patch });
    deepMerge(base, patch);
    expect(JSON.stringify({ base, patch })).toBe(snapshot);
  });
});

describe('providers', () => {
  it('defaults to deepseek and lists the built-ins', () => {
    expect(DEFAULT_PROVIDER).toBe('deepseek');
    expect(getProvider('deepseek').name).toBe('DeepSeek');
    expect(() => getProvider('nope')).toThrow(/available/);
  });

  it('exposes a Chinese name and a combined display name', () => {
    const deepseek = getProvider('deepseek');
    expect(deepseek.nameZh).toBe('深度求索');
    expect(deepseek.displayName).toBe('DeepSeek(深度求索)');
  });

  it('falls back to the English name when no Chinese name is set', () => {
    expect(getProvider('ollama').nameZh).toBeUndefined();
    expect(getProvider('ollama').displayName).toBe('Ollama');
  });

  it('deduplicates models reused across tiers', () => {
    expect(uniqueModels(getProvider('deepseek')).map((m) => m.id)).toEqual([
      'deepseek-flash',
      'deepseek-v4-pro',
    ]);
    expect(uniqueModels(getProvider('qwen')).map((m) => m.id)).toEqual(['qwen3-coder-plus']);
  });

  it('resolves the api-key placeholder from the environment', () => {
    expect(resolveApiKey(getProvider('deepseek'))).toEqual({
      isPlaceholder: true,
      envName: 'DEEPSEEK_API_KEY',
      value: 'test-key',
    });
  });

  it('rejects a catalog model without a context window', () => {
    expect(() => new ModelProvider({
      provider: 'acme',
      name: 'Acme',
      apiKey: '${ACME_API_KEY}',
      defaultEndpoint: 'openai',
      endpoints: {
        anthropic: { baseUrl: 'https://acme.example/anthropic' },
        openai: { baseUrl: 'https://acme.example/v1' },
      },
      models: [{ id: 'acme-1' }],
    })).toThrow(/contextWindow/);
  });
});

describe('rendering per tool', () => {
  it('claude maps tiers to ANTHROPIC env vars with context suffixes', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'claude' });
    const fragment = plan.fragment as { env: Record<string, string>; model: string; modelPicker?: unknown };
    const env = fragment.env;
    expect(plan.endpointName).toBe('anthropic');
    expect(env.ANTHROPIC_BASE_URL).toBe('https://api.deepseek.com/anthropic');
    expect(env.ANTHROPIC_AUTH_TOKEN).toBe('test-key');
    expect(env.ANTHROPIC_DEFAULT_HAIKU_MODEL).toBe('deepseek-flash[1m]');
    expect(env.ANTHROPIC_DEFAULT_SONNET_MODEL).toBe('deepseek-flash[1m]');
    expect(env.ANTHROPIC_DEFAULT_OPUS_MODEL).toBe('deepseek-v4-pro[1m]');
    expect(env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS).toBe('1');
    // The default model is set at the top level with the same suffix as the sonnet alias.
    expect(fragment.model).toBe('deepseek-flash[1m]');
    // Every deepseek model is a tier, so the picker adds nothing.
    expect(fragment.modelPicker).toBeUndefined();
  });

  it('claude leaves the picker empty when every catalog model is a tier', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'claude', defaultModelId: 'deepseek-v4-pro' });
    const fragment = plan.fragment as { model: string; modelPicker?: unknown };
    expect(fragment.model).toBe('deepseek-v4-pro[1m]');
    // deepseek-flash still covers the fast tier, so no model is displaced into the picker.
    expect(fragment.modelPicker).toBeUndefined();
  });

  it('claude offers every untiered model in modelPicker, suffixing only 1M windows with [1m]', () => {
    process.env.ARK_API_KEY = 'test-key';
    try {
      const plan = service.buildPlan({ providerId: 'volcengine', tool: 'claude' });
      const fragment = plan.fragment as { modelPicker: { options: Array<{ model: string }> } };
      // Only a 1M window gets Claude's `[1m]`; 256K models carry no suffix (Claude has no 256K
      // form), never the catalog's raw byte count.
      const models = fragment.modelPicker.options.map((row) => row.model);
      expect(models).toEqual([
        'deepseek-v4.1-flash[1m]',
        'deepseek-v4-pro[1m]',
        'doubao-seed-2.0-mini',
        'doubao-seed-2.1-lite[1m]',
        'doubao-seed-2.1-pro[1m]',
        'doubao-seed-evolving[1m]',
        'glm-5.3[1m]',
        'kimi-k2.8-preview[1m]',
        'kimi-k2.7-code',
        'minimax-m3[1m]',
      ]);
    } finally {
      delete process.env.ARK_API_KEY;
    }
  });

  it('codex renders the provider block and env_key', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'codex' });
    const fragment = plan.fragment as Record<string, any>;
    expect(fragment.model).toBe('deepseek-flash');
    expect(fragment.model_provider).toBe('deepseek');
    expect(fragment.model_context_window).toBe(1000000);
    expect(fragment.model_providers.deepseek).toEqual({
      name: 'DeepSeek(深度求索)',
      base_url: 'https://api.deepseek.com/v1',
      env_key: 'DEEPSEEK_API_KEY',
      wire_api: 'responses',
    });
  });

  it('opencode renders a provider entry and default model', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'opencode' });
    const fragment = plan.fragment as Record<string, any>;
    const entry = fragment.provider.deepseek;
    expect(entry.name).toBe('DeepSeek(深度求索)');
    expect(entry.options.baseURL).toBe('https://api.deepseek.com/v1');
    expect(entry.options.apiKey).toBe('test-key');
    expect(fragment.model).toBe('deepseek/deepseek-flash');
    // opencode requires limit.output; with no outputWindow in the catalog it defaults.
    expect(entry.models['deepseek-flash'].limit).toEqual({ context: 1000000, output: 8192 });
  });

  it('opencode writes both limit.context and limit.output for every model', () => {
    process.env.GLM_API_KEY = 'test-key';
    try {
      const plan = service.buildPlan({ providerId: 'glm', tool: 'opencode' });
      const entry = (plan.fragment as Record<string, any>).provider.glm;
      // contextWindow is required in the catalog; output falls back to 8192 without outputWindow.
      expect(entry.models['glm-4.7'].limit).toEqual({ context: 200000, output: 8192 });
      for (const model of Object.values(entry.models) as Array<{ limit: Record<string, number> }>) {
        expect(model.limit.context).toBeGreaterThan(0);
        expect(model.limit.output).toBeGreaterThan(0);
      }
    } finally {
      delete process.env.GLM_API_KEY;
    }
  });

  it('dsh renders llm-pi-ai providers and the default model', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'dsh' });
    const fragment = plan.fragment as Record<string, any>;
    const entry = fragment['llm-pi-ai'].providers.deepseek;
    expect(entry.apiKeyEnv).toBe('DEEPSEEK_API_KEY');
    expect(entry.api).toBe('openai-completions');
    expect(entry.baseURL).toBe('https://api.deepseek.com/v1');
    expect(fragment['agent-default-model'].model).toBe('deepseek-flash');
  });

  it.each(['codebuddy', 'workbuddy'])('%s renders a flat OpenAI-compatible model list', (tool) => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool });
    const fragment = plan.fragment as { models: Array<Record<string, any>> };
    expect(fragment.models).toHaveLength(2);
    expect(fragment.models[0]).toMatchObject({
      id: 'deepseek-flash',
      vendor: 'deepseek',
      apiKey: 'test-key',
      maxInputTokens: 1000000,
      maxOutputTokens: 4096,
      url: 'https://api.deepseek.com/v1/chat/completions',
      supportsToolCall: true,
    });
  });

  it('buddy falls back to 4096 maxOutputTokens and honors a declared outputWindow', () => {
    // The catalog mixes models that declare outputWindow (volcengine) with ones
    // that don't (deepseek); buddy must render both — hence the fallback below.
    expect(uniqueModels(getProvider('deepseek')).some((model) => model.outputWindow !== undefined)).toBe(false);
    expect(
      listProviders().some((provider) => uniqueModels(provider).some((model) => model.outputWindow !== undefined)),
    ).toBe(true);

    const renderer = new Renderer();
    const context: RenderContext = {
      provider: 'deepseek',
      displayName: 'DeepSeek(深度求索)',
      endpoint: 'openai',
      baseUrl: 'https://api.deepseek.com/v1',
      apiKeyEnv: 'DEEPSEEK_API_KEY',
      apiKey: 'test-key',
      models: {
        fast: { id: 'deepseek-flash', contextWindow: 1000000 },
        default: { id: 'deepseek-flash', contextWindow: 1000000 },
        powerful: { id: 'deepseek-v4-pro', contextWindow: 1000000 },
      },
      modelList: [{ tier: 'fast', id: 'deepseek-flash', contextWindow: 1000000 }],
      pickerModels: [],
      defaultModelId: 'deepseek-flash',
    };

    const fallback = JSON.parse(renderer.render('buddy', context)) as {
      models: Array<Record<string, any>>;
    };
    expect(fallback.models[0].maxOutputTokens).toBe(4096);

    const withWindow = JSON.parse(
      renderer.render('buddy', {
        ...context,
        modelList: [{ tier: 'fast', id: 'deepseek-flash', contextWindow: 1000000, outputWindow: 65536 }],
      }),
    ) as { models: Array<Record<string, any>> };
    expect(withWindow.models[0].maxOutputTokens).toBe(65536);
  });

  it('openclaw renders models.providers and the agent default model', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'openclaw' });
    const fragment = plan.fragment as Record<string, any>;
    const entry = fragment.models.providers.deepseek;
    expect(entry.baseUrl).toBe('https://api.deepseek.com/v1');
    expect(entry.apiKey).toBe('test-key');
    expect(entry.api).toBe('openai-completions');
    expect(entry.models[0]).toMatchObject({ id: 'deepseek-flash', contextWindow: 1000000 });
    expect(fragment.agents.defaults.model.primary).toBe('deepseek/deepseek-flash');
  });

  it('openclaw uses the anthropic adapter for the anthropic endpoint', () => {
    const plan = service.buildPlan({ tool: 'openclaw', endpoint: 'anthropic' });
    const fragment = plan.fragment as Record<string, any>;
    expect(fragment.models.providers.deepseek.api).toBe('anthropic-messages');
    expect(fragment.models.providers.deepseek.baseUrl).toBe('https://api.deepseek.com/anthropic');
  });

  it('hermes renders a custom-endpoint model block', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'hermes' });
    expect(plan.endpointName).toBe('openai');
    expect((plan.fragment as Record<string, any>).model).toEqual({
      provider: 'custom',
      default: 'deepseek-flash',
      base_url: 'https://api.deepseek.com/v1',
      api_key: 'test-key',
      context_length: 1000000,
    });
  });

  it('qoder renders customModels and the active model', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'qoder' });
    const fragment = plan.fragment as Record<string, any>;
    expect(fragment.modelConfigs.customModels).toHaveLength(2);
    expect(fragment.modelConfigs.customModels[0]).toMatchObject({
      provider: 'deepseek',
      apiKey: 'test-key',
      model: 'deepseek-flash',
      baseURL: 'https://api.deepseek.com/v1',
      key: 'deepseek-flash',
      format: 'openai',
      maxInputTokens: 1000000,
    });
    expect(fragment.model.name).toBe('deepseek-flash');
  });

  it('zcode renders a provider registry entry and main/lite models', () => {
    const plan = service.buildPlan({ providerId: 'deepseek', tool: 'zcode' });
    const fragment = plan.fragment as Record<string, any>;
    const entry = fragment.provider.deepseek;
    expect(entry.name).toBe('DeepSeek(深度求索)');
    expect(entry.kind).toBe('openai-compatible');
    expect(entry.options).toEqual({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: 'test-key',
      apiKeyRequired: true,
    });
    expect(entry.models['deepseek-v4-pro']).toMatchObject({ contextWindow: 1000000 });
    expect(fragment.model).toEqual({
      main: 'deepseek/deepseek-flash',
      lite: 'deepseek/deepseek-flash',
    });
  });

  it('zcode uses the anthropic kind for the anthropic endpoint', () => {
    const plan = service.buildPlan({ tool: 'zcode', endpoint: 'anthropic' });
    expect((plan.fragment as Record<string, any>).provider.deepseek.kind).toBe('anthropic');
  });

  it('defaults to deepseek when the provider is omitted', () => {
    expect(service.buildPlan({ tool: 'opencode' }).provider.provider).toBe('deepseek');
  });

  it('errors when the provider api-key env var is unset', () => {
    delete process.env.DEEPSEEK_API_KEY;
    expect(() => service.buildPlan({ providerId: 'deepseek', tool: 'opencode' })).toThrow(/DEEPSEEK_API_KEY/);
  });
});

describe('thinking disable', () => {
  it('claude writes MAX_THINKING_TOKENS=0 only when the fast-tier model can disable thinking', () => {
    const deepseek = service.buildPlan({ providerId: 'deepseek', tool: 'claude' }).fragment as {
      env: Record<string, string>;
    };
    expect(deepseek.env.MAX_THINKING_TOKENS).toBe('0');

    process.env.MOONSHOT_API_KEY = 'test-key';
    try {
      // kimi's fast model (kimi-k2.7-code-highspeed) always thinks, so nothing is written.
      const kimi = service.buildPlan({ providerId: 'kimi', tool: 'claude' }).fragment as {
        env: Record<string, string>;
      };
      expect(kimi.env).not.toHaveProperty('MAX_THINKING_TOKENS');
    } finally {
      delete process.env.MOONSHOT_API_KEY;
    }
  });

  it('opencode adds a minimal thinking-disabled variant per disablable model', () => {
    const deepseek = service.buildPlan({ providerId: 'deepseek', tool: 'opencode' }).fragment as Record<string, any>;
    const models = deepseek.provider.deepseek.models;
    expect(models['deepseek-flash'].variants).toEqual({ minimal: { thinking: { type: 'disabled' } } });
    expect(models['deepseek-v4-pro'].variants).toEqual({ minimal: { thinking: { type: 'disabled' } } });

    process.env.MOONSHOT_API_KEY = 'test-key';
    try {
      // kimi's models always think, so none carries the variant.
      const kimi = service.buildPlan({ providerId: 'kimi', tool: 'opencode' }).fragment as Record<string, any>;
      for (const model of Object.values(kimi.provider.kimi.models) as Array<Record<string, unknown>>) {
        expect(model).not.toHaveProperty('variants');
      }
    } finally {
      delete process.env.MOONSHOT_API_KEY;
    }
  });

  it('codex disables reasoning only when the default model can disable thinking', () => {
    const deepseek = service.buildPlan({ providerId: 'deepseek', tool: 'codex' }).fragment as Record<string, unknown>;
    expect(deepseek.model_reasoning_effort).toBe('none');

    process.env.MOONSHOT_API_KEY = 'test-key';
    try {
      const kimi = service.buildPlan({ providerId: 'kimi', tool: 'codex' }).fragment as Record<string, unknown>;
      expect(kimi).not.toHaveProperty('model_reasoning_effort');
    } finally {
      delete process.env.MOONSHOT_API_KEY;
    }
  });

  it('codebuddy/workbuddy mark a disablable model as reasoning-capable', () => {
    const deepseek = service.buildPlan({ providerId: 'deepseek', tool: 'codebuddy' }).fragment as {
      models: Array<Record<string, unknown>>;
    };
    for (const model of deepseek.models) expect(model.supportsReasoning).toBe(true);

    process.env.MOONSHOT_API_KEY = 'test-key';
    try {
      const kimi = service.buildPlan({ providerId: 'kimi', tool: 'workbuddy' }).fragment as {
        models: Array<Record<string, unknown>>;
      };
      for (const model of kimi.models) expect(model).not.toHaveProperty('supportsReasoning');
    } finally {
      delete process.env.MOONSHOT_API_KEY;
    }
  });

  it('claude merge drops a stale MAX_THINKING_TOKENS when the fragment omits it', () => {
    const merged = mergeClaudeSettings(
      { env: { MAX_THINKING_TOKENS: '0', KEEP: '1' } },
      { env: { ANTHROPIC_BASE_URL: 'https://example' } },
    ) as { env: Record<string, string> };
    expect(merged.env).not.toHaveProperty('MAX_THINKING_TOKENS');
    expect(merged.env.KEEP).toBe('1');
  });

  it('codex merge drops a stale model_reasoning_effort when the fragment omits it', () => {
    const merged = mergeCodexConfig(
      { model: 'old', model_reasoning_effort: 'none' },
      { model: 'new' },
    ) as Record<string, unknown>;
    expect(merged).not.toHaveProperty('model_reasoning_effort');
    expect(merged.model).toBe('new');

    const kept = mergeCodexConfig({}, { model: 'new', model_reasoning_effort: 'none' }) as Record<string, unknown>;
    expect(kept.model_reasoning_effort).toBe('none');
  });

  it('opencode merge drops a stale variants.minimal but keeps other variants', () => {
    const merged = mergeOpencodeConfig(
      {
        provider: {
          deepseek: {
            models: { 'deepseek-flash': { name: 'x', variants: { minimal: {}, user: { reasoningEffort: 'high' } } } },
          },
        },
      },
      { provider: { deepseek: { models: { 'deepseek-flash': { name: 'x', limit: {} } } } } },
    ) as Record<string, any>;
    expect(merged.provider.deepseek.models['deepseek-flash'].variants).toEqual({ user: { reasoningEffort: 'high' } });

    const kept = mergeOpencodeConfig(
      { provider: { deepseek: { models: { 'deepseek-flash': { variants: { minimal: {} } } } } } },
      { provider: { deepseek: { models: { 'deepseek-flash': { variants: { minimal: { thinking: { type: 'disabled' } } } } } } } },
    ) as Record<string, any>;
    expect(kept.provider.deepseek.models['deepseek-flash'].variants.minimal)
      .toEqual({ thinking: { type: 'disabled' } });
  });

  it('apply drops the stale thinking config end-to-end when switching providers', async () => {
    process.env.MOONSHOT_API_KEY = 'test-key';
    try {
      const claudeFile = path.join(home, '.claude', 'settings.json');
      const codexFile = path.join(home, '.codex', 'config.toml');
      await service.apply({ providerId: 'deepseek', tool: 'claude' });
      await service.apply({ providerId: 'deepseek', tool: 'codex' });
      expect((await fse.readJson(claudeFile)).env.MAX_THINKING_TOKENS).toBe('0');
      expect(await fse.readFile(codexFile, 'utf-8')).toContain('model_reasoning_effort = "none"');

      await service.apply({ providerId: 'kimi', tool: 'claude' });
      await service.apply({ providerId: 'kimi', tool: 'codex' });
      expect((await fse.readJson(claudeFile)).env).not.toHaveProperty('MAX_THINKING_TOKENS');
      expect(await fse.readFile(codexFile, 'utf-8')).not.toContain('model_reasoning_effort');
    } finally {
      delete process.env.MOONSHOT_API_KEY;
    }
  });
});

describe('config paths', () => {
  it('honors each tool config-dir env override and expands ~', () => {
    process.env.CLAUDE_CONFIG_DIR = path.join(home, 'claude-cfg');
    process.env.XDG_CONFIG_HOME = path.join(home, 'xdg-cfg');
    process.env.DSH_HOME = path.join(home, 'dsh-cfg');
    process.env.CODEX_HOME = '~/.codex-alt';

    expect(service.buildPlan({ tool: 'claude' }).configFile.filePath)
      .toBe(path.join(home, 'claude-cfg', 'settings.json'));
    expect(service.buildPlan({ tool: 'opencode' }).configFile.filePath)
      .toBe(path.join(home, 'xdg-cfg', 'opencode', 'opencode.jsonc'));
    expect(service.buildPlan({ tool: 'dsh' }).configFile.filePath)
      .toBe(path.join(home, 'dsh-cfg', 'settings.yaml'));
    expect(service.buildPlan({ tool: 'codex' }).configFile.filePath)
      .toBe(path.join(home, '.codex-alt', 'config.toml'));
  });

  it('defaults to the home-relative config path', () => {
    expect(service.buildPlan({ tool: 'codebuddy' }).configFile.filePath)
      .toBe(path.join(home, '.codebuddy', 'models.json'));
  });

  it('honors the phase-2 tool config-dir overrides', () => {
    process.env.OPENCLAW_STATE_DIR = path.join(home, 'oc-state');
    process.env.HERMES_HOME = '~/.hermes-alt';
    process.env.QODER_CONFIG_DIR = path.join(home, 'qoder-cfg');

    expect(service.buildPlan({ tool: 'openclaw' }).configFile.filePath)
      .toBe(path.join(home, 'oc-state', 'openclaw.json'));
    expect(service.buildPlan({ tool: 'hermes' }).configFile.filePath)
      .toBe(path.join(home, '.hermes-alt', 'config.yaml'));
    expect(service.buildPlan({ tool: 'qoder' }).configFile.filePath)
      .toBe(path.join(home, 'qoder-cfg', 'settings.json'));
    expect(service.buildPlan({ tool: 'zcode' }).configFile.filePath)
      .toBe(path.join(home, '.zcode', 'cli', 'config.json'));
  });

  it('prefers OPENCLAW_CONFIG_PATH over the state dir', () => {
    process.env.OPENCLAW_STATE_DIR = path.join(home, 'oc-state');
    process.env.OPENCLAW_CONFIG_PATH = '~/oc/custom.json';
    expect(service.buildPlan({ tool: 'openclaw' }).configFile.filePath)
      .toBe(path.join(home, 'oc', 'custom.json'));
  });

  it('resolves the opencode config across both extensions', async () => {
    const dir = path.join(home, '.config', 'opencode');
    const jsonc = path.join(dir, 'opencode.jsonc');
    const json = path.join(dir, 'opencode.json');

    // Neither on disk: OpenCode seeds a .jsonc when it has no config at all.
    expect(service.buildPlan({ tool: 'opencode' }).configFile.filePath).toBe(jsonc);

    await fse.outputJson(json, {});
    expect(service.buildPlan({ tool: 'opencode' }).configFile.filePath).toBe(json);

    // OpenCode merges the .json and then the .jsonc, so the .jsonc wins.
    await fse.outputJson(jsonc, {});
    expect(service.buildPlan({ tool: 'opencode' }).configFile.filePath).toBe(jsonc);
  });
});

describe('apply', () => {
  it('merges into an existing opencode.json, preserving unrelated keys, and writes a backup', async () => {
    const file = path.join(home, '.config', 'opencode', 'opencode.json');
    await fse.outputJson(file, { instructions: ['CONTRIBUTING.md'], mcp: { srv: { type: 'local' } } });

    await service.apply({ providerId: 'deepseek', tool: 'opencode' });

    const doc = await fse.readJson(file);
    expect(doc.instructions).toEqual(['CONTRIBUTING.md']);
    expect(doc.mcp).toEqual({ srv: { type: 'local' } });
    expect(doc.provider.deepseek.options.apiKey).toBe('test-key');
    expect(doc.model).toBe('deepseek/deepseek-flash');
    expect(await fse.pathExists(`${file}.bak`)).toBe(true);
    const backup = await fse.readJson(`${file}.bak`);
    expect(backup.provider).toBeUndefined();
  });

  it('merges into an existing opencode.jsonc, comments and all', async () => {
    const dir = path.join(home, '.config', 'opencode');
    const file = path.join(dir, 'opencode.jsonc');
    await fse.outputFile(file, '{\n  // keep my servers\n  "mcp": { "srv": { "type": "local" } },\n}\n');

    await service.apply({ providerId: 'deepseek', tool: 'opencode' });

    const doc = await fse.readJson(file);
    expect(doc.mcp).toEqual({ srv: { type: 'local' } });
    expect(doc.provider.deepseek.options.apiKey).toBe('test-key');
    expect(await fse.pathExists(path.join(dir, 'opencode.json'))).toBe(false);
  });

  it('writes claude settings.json with the literal token and 0600 perms', async () => {
    const plan = await service.apply({ providerId: 'deepseek', tool: 'claude' });
    const settings = await fse.readJson(plan.configFile.filePath);
    expect(settings.env.ANTHROPIC_AUTH_TOKEN).toBe('test-key');
    if (process.platform !== 'win32') {
      expect((await fs.promises.stat(plan.configFile.filePath)).mode & 0o777).toBe(0o600);
    }
  });

  it('corrects a stale claude model and modelPicker while preserving unrelated settings', async () => {
    const file = path.join(home, '.claude', 'settings.json');
    await fse.outputJson(file, {
      model: 'personal-model',
      modelPicker: { options: [{ model: 'personal-model' }], replaceBuiltInOptions: true },
      theme: 'light',
      permissions: { allow: ['Read'] },
      env: { KEEP: 'yes' },
    });

    await service.apply({ providerId: 'deepseek', tool: 'claude', defaultModelId: 'deepseek-v4-pro' });

    const settings = await fse.readJson(file);
    expect(settings.model).toBe('deepseek-v4-pro[1m]');
    // deepseek-flash still covers the fast tier, so the picker has no displaced row to keep.
    expect(settings.modelPicker).toBeUndefined();
    // A theme the user chose is kept.
    expect(settings.theme).toBe('light');
    expect(settings.permissions).toEqual({ allow: ['Read'] });
    expect(settings.env.KEEP).toBe('yes');
  });

  it('defaults claude theme to dark and clears a stale picker when the provider adds no rows', async () => {
    const file = path.join(home, '.claude', 'settings.json');
    await fse.outputJson(file, {
      model: 'personal-model',
      modelPicker: { options: [{ model: 'personal-model' }], replaceBuiltInOptions: true },
    });

    await service.apply({ providerId: 'deepseek', tool: 'claude' });

    const settings = await fse.readJson(file);
    expect(settings.model).toBe('deepseek-flash[1m]');
    expect(settings.theme).toBe('dark');
    expect(settings.modelPicker).toBeUndefined();
  });

  it('upserts CodeBuddy models by id without duplicating or dropping user models', async () => {
    const file = path.join(home, '.codebuddy', 'models.json');
    await fse.outputJson(file, {
      models: [{ id: 'personal', name: 'Personal', vendor: 'Custom' }],
      availableModels: ['personal'],
    });

    await service.apply({ providerId: 'deepseek', tool: 'codebuddy' });
    process.env.DEEPSEEK_API_KEY = 'rotated-key';
    await service.apply({ providerId: 'deepseek', tool: 'codebuddy' });

    const doc = await fse.readJson(file);
    const ids = doc.models.map((m: { id: string }) => m.id);
    expect(ids).toEqual([
      'personal',
      'deepseek-flash',
      'deepseek-v4-pro',
    ]);
    expect(doc.models.find((m: { id: string }) => m.id === 'deepseek-v4-pro').apiKey).toBe('rotated-key');
    expect(doc.availableModels).toEqual([
      'personal',
      'deepseek-flash',
      'deepseek-v4-pro',
    ]);
  });

  it('leaves an empty or absent CodeBuddy availableModels untouched', () => {
    const fragment = { models: [{ id: 'injected' }] };
    expect(mergeBuddyModels({ models: [], availableModels: [] }, fragment)).toEqual({
      models: [{ id: 'injected' }],
      availableModels: [],
    });
    expect(mergeBuddyModels({ models: [] }, fragment)).toEqual({ models: [{ id: 'injected' }] });
  });

  it('preserves a legacy top-level array CodeBuddy file', async () => {
    const file = path.join(home, '.codebuddy', 'models.json');
    await fse.outputJson(file, [{ id: 'legacy', name: 'Legacy' }]);

    await service.apply({ providerId: 'deepseek', tool: 'codebuddy' });

    const doc = await fse.readJson(file);
    expect(Array.isArray(doc)).toBe(true);
    expect(doc.map((m: { id: string }) => m.id)).toContain('legacy');
    expect(doc.map((m: { id: string }) => m.id)).toContain('deepseek-v4-pro');
  });

  it('reads an existing file that starts with a UTF-8 BOM', async () => {
    const file = path.join(home, '.codebuddy', 'models.json');
    await fse.ensureDir(path.dirname(file));
    await fse.writeFile(file, '\uFEFF' + JSON.stringify({ models: [{ id: 'personal', name: 'Personal' }] }));

    await service.apply({ providerId: 'deepseek', tool: 'codebuddy' });

    const doc = await fse.readJson(file);
    const ids = doc.models.map((m: { id: string }) => m.id);
    expect(ids).toContain('personal');
    expect(ids).toContain('deepseek-v4-pro');
  });

  it('parses and upserts a Qoder settings.json containing JSON5 comments', async () => {
    const file = path.join(home, '.qoder', 'settings.json');
    await fse.outputFile(
      file,
      '{\n  // personal models stay put\n  "modelConfigs": { "customModels": [ { "key": "personal", "model": "personal" } ] }\n}\n',
    );

    await service.apply({ providerId: 'deepseek', tool: 'qoder' });
    process.env.DEEPSEEK_API_KEY = 'rotated-key';
    await service.apply({ providerId: 'deepseek', tool: 'qoder' });

    const doc = await fse.readJson(file);
    const keys = doc.modelConfigs.customModels.map((m: { key: string }) => m.key);
    expect(keys).toEqual([
      'personal',
      'deepseek-flash',
      'deepseek-v4-pro',
    ]);
    expect(doc.modelConfigs.customModels.find((m: { key: string }) => m.key === 'deepseek-v4-pro').apiKey)
      .toBe('rotated-key');
  });

  it('upserts OpenClaw provider models by id without duplicating', async () => {
    const file = path.join(home, '.openclaw', 'openclaw.json');
    await fse.outputFile(
      file,
      '{\n  // keep my gateway\n  "models": { "providers": { "deepseek": { "models": [ { "id": "deepseek-v4-pro", "name": "old" } ] } } }\n}\n',
    );

    await service.apply({ providerId: 'deepseek', tool: 'openclaw' });
    await service.apply({ providerId: 'deepseek', tool: 'openclaw' });

    const doc = await fse.readJson(file);
    const ids = doc.models.providers.deepseek.models.map((m: { id: string }) => m.id);
    expect(ids.filter((id: string) => id === 'deepseek-v4-pro')).toHaveLength(1);
    expect(ids).toContain('deepseek-flash');
    expect(doc.agents.defaults.model.primary).toBe('deepseek/deepseek-flash');
  });

  it('writes through a symlinked config file without replacing the link', async () => {
    const target = path.join(home, 'dotfiles', 'workbuddy-models.json');
    const link = path.join(home, '.workbuddy', 'models.json');
    await fse.outputJson(target, { models: [] });
    await fse.ensureDir(path.dirname(link));
    await fse.symlink(target, link);

    await service.apply({ providerId: 'deepseek', tool: 'workbuddy' });

    expect((await fse.lstat(link)).isSymbolicLink()).toBe(true);
    const doc = await fse.readJson(target);
    expect(doc.models.map((m: { id: string }) => m.id)).toContain('deepseek-v4-pro');
  });
});
