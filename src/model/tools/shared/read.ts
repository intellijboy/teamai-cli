import { ConfigFile, type ConfigFormat } from '../../config-file.js';
import { listProviders, providerIds } from '../../providers.js';
import type { ToolSelection } from './types.js';

/** A plain object, not an array or null. */
export function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/** The keys of a plain object, or an empty list for anything else. */
export function keysOf(value: unknown): string[] {
  return Object.keys(asRecord(value));
}

/** The string value at a key, or undefined for a non-string/empty value. */
export function stringAt(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Normalize a URL for comparison: strip trailing slashes. */
export function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/** Whether an id is one of the built-in catalog providers. */
export function isKnownProvider(id: string): boolean {
  return providerIds().includes(id);
}

/**
 * The built-in provider whose anthropic/openai endpoint matches `baseUrl`, or
 * undefined for an unknown/custom host (which cannot be re-injected).
 */
export function providerForBaseUrl(baseUrl?: unknown): string | undefined {
  if (typeof baseUrl !== 'string' || baseUrl.length === 0) return undefined;
  const target = normalizeUrl(baseUrl);
  for (const provider of listProviders()) {
    if (normalizeUrl(provider.endpoints.anthropic.baseUrl) === target) return provider.provider;
    if (normalizeUrl(provider.endpoints.openai.baseUrl) === target) return provider.provider;
  }
  return undefined;
}

/** Drop a trailing Claude context suffix (`[1m]` / `[128k]` / `[200000]`). */
export function stripContextSuffix(value: string): string {
  return value.replace(/\[[^\]]*\]$/, '');
}

/** Split a `<provider>/<model>` reference from a config field; first slash wins. */
export function splitModelRef(value?: unknown): { provider: string; model: string } | undefined {
  if (typeof value !== 'string') return undefined;
  const index = value.indexOf('/');
  if (index <= 0 || index === value.length - 1) return undefined;
  return { provider: value.slice(0, index), model: value.slice(index + 1) };
}

/** Parse a tool's config document; `{}` when absent or unparseable. */
export function readToolConfig(format: ConfigFormat, filePath: string): unknown {
  try {
    return new ConfigFile(filePath, format).read();
  } catch {
    return {};
  }
}

/** De-duplicate model ids while preserving order. */
export function uniqueModels(models: string[]): string[] {
  return [...new Set(models.filter((model) => model.length > 0))];
}

/** A selection entry only when the provider resolves to a built-in one. */
export function knownSelection(selection: ToolSelection): ToolSelection | undefined {
  return isKnownProvider(selection.provider) ? selection : undefined;
}

/**
 * CodeBuddy/WorkBuddy store a flat model list whose `vendor` field is the
 * provider id (object-wrapped, or the legacy top-level array). Group by vendor.
 */
export function readBuddySelections(filePath: string): ToolSelection[] {
  const doc = readToolConfig('json', filePath);
  const list = Array.isArray(doc) ? doc : asRecord(doc).models;
  if (!Array.isArray(list)) return [];
  const byProvider = new Map<string, string[]>();
  for (const item of list) {
    const entry = asRecord(item);
    const provider = stringAt(entry, 'vendor');
    const id = stringAt(entry, 'id');
    if (!provider || !id || !isKnownProvider(provider)) continue;
    const models = byProvider.get(provider) ?? [];
    models.push(id);
    byProvider.set(provider, models);
  }
  return [...byProvider.entries()].map(([provider, models]) => ({
    provider,
    models: uniqueModels(models),
  }));
}
