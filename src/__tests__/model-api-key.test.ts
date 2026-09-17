import { describe, expect, it } from 'vitest';
import { ApiKey } from '../model/api-key.js';
import {
  endpointBaseUrl,
  getProvider,
  providerIds,
  resolveApiKey,
  uniqueModels,
} from '../model/providers.js';

describe('ApiKey', () => {
  it('detects a ${ENV_VAR} placeholder and resolves it from the environment', () => {
    const key = new ApiKey('${MY_KEY}');
    expect(key.isPlaceholder).toBe(true);
    expect(key.envName).toBe('MY_KEY');
    expect(key.resolve({ MY_KEY: 'secret' })).toBe('secret');
    expect(key.resolve({})).toBe('');
    expect(key.toString()).toBe('${MY_KEY}');
  });

  it('treats a literal as non-placeholder and resolves it verbatim', () => {
    const key = new ApiKey('sk-literal');
    expect(key.isPlaceholder).toBe(false);
    expect(key.envName).toBeUndefined();
    expect(key.resolve({})).toBe('sk-literal');
  });

  it('rejects an empty key', () => {
    expect(() => new ApiKey('')).toThrow(/non-empty/);
  });
});

describe('resolveApiKey', () => {
  it('returns the placeholder shape for a built-in provider', () => {
    expect(resolveApiKey(getProvider('deepseek'), { DEEPSEEK_API_KEY: 'test-key' })).toEqual({
      isPlaceholder: true,
      envName: 'DEEPSEEK_API_KEY',
      value: 'test-key',
    });
  });
});

describe('ModelProvider domain methods', () => {
  it('resolves endpoint base urls', () => {
    const provider = getProvider('deepseek');
    expect(provider.endpointBaseUrl('anthropic')).toBe('https://api.deepseek.com/anthropic');
    expect(provider.endpointBaseUrl('openai')).toBe('https://api.deepseek.com/v1');
    expect(endpointBaseUrl(provider, 'openai')).toBe('https://api.deepseek.com/v1');
  });

  it('throws listing available endpoints for an unknown endpoint', () => {
    expect(() => getProvider('deepseek').endpointBaseUrl('nope' as never)).toThrow(
      /has no "nope" endpoint \(available: anthropic, openai\)/,
    );
  });

  it('exposes the default model id', () => {
    expect(getProvider('deepseek').defaultModelId).toBe('deepseek-v4-flash-vision-exp');
  });

  it('deduplicates models reused across tiers', () => {
    expect(uniqueModels(getProvider('qwen')).map((m) => m.id)).toEqual(['qwen3-coder-plus']);
    expect(getProvider('qwen').uniqueModels().map((m) => m.id)).toEqual(['qwen3-coder-plus']);
  });

  it('lists provider ids and rejects unknown ones with the available list', () => {
    expect(providerIds()).toContain('deepseek');
    expect(() => getProvider('nope')).toThrow(/Unknown provider "nope" \(available: .*deepseek/);
  });
});
