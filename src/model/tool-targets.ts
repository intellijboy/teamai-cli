import path from 'node:path';
import fse from 'fs-extra';
import type { ModelProvider, EndpointName, ProviderModel } from './providers.js';
import type { ConfigFormat } from './config-file.js';
import { isPlainObject, upsertBy, upsertById } from './merge.js';

export { contextSuffix } from './renderer.js';

/** View model handed to a tool's Handlebars template. */
export interface RenderContext {
  /** Provider id (e.g. `deepseek`). */
  provider: string;
  /** Provider display name (e.g. `DeepSeek`). */
  name: string;
  endpoint: EndpointName;
  baseUrl: string;
  /** Environment variable name the provider's key comes from. */
  apiKeyEnv: string;
  /** Resolved API-key value. */
  apiKey: string;
  /** Tier → model entry, for templates that need a specific tier (codex, hermes). */
  models: ModelProvider['models'];
  /** Unique models in tier order. */
  modelList: ProviderModel[];
  defaultModelId: string;
}

export type MergeFn = (existing: unknown, fragment: unknown) => unknown;

export interface ToolTarget {
  name: string;
  format: ConfigFormat;
  /** Name of the `.hbs` template rendered into this tool's native config text. */
  template: string;
  /** Endpoint used when the tool supports both and the user gives no override. */
  preferredEndpoint: EndpointName;
  /** Endpoint the tool's format mandates, ignoring any override. */
  forceEndpoint?: EndpointName;
  configPath(home: string): string;
  /** Merge a rendered fragment into the existing document; defaults to `deepMerge`. */
  merge?: MergeFn;
}

/** Expand a leading `~` in a path/env value; other values pass through. */
function expandTilde(value: string, home: string): string {
  if (value === '~') return home;
  if (value.startsWith('~/') || value.startsWith('~\\')) {
    return path.join(home, value.slice(2));
  }
  return value;
}

/** Resolve a config-dir env override, expanding a leading `~`; falls back when unset. */
function resolveDir(envValue: string | undefined, fallback: string, home: string): string {
  if (!envValue) return fallback;
  return expandTilde(envValue, home);
}

/**
 * CodeBuddy / WorkBuddy accept either the current object wrapper
 * (`{ models: [...] }`) or the legacy top-level array. Upsert models by id and
 * preserve the existing root shape; leave `availableModels` untouched (an
 * empty/absent list means "show every model").
 */
function mergeBuddyModels(existing: unknown, fragment: unknown): unknown {
  const incoming = isPlainObject(fragment) && Array.isArray(fragment.models)
    ? (fragment.models as Array<Record<string, unknown> & { id: string }>)
    : [];
  if (Array.isArray(existing)) {
    return upsertById(existing as Array<Record<string, unknown> & { id: string }>, incoming);
  }
  const doc = isPlainObject(existing) ? { ...existing } : {};
  const current = Array.isArray(doc.models)
    ? (doc.models as Array<Record<string, unknown> & { id: string }>)
    : [];
  doc.models = upsertById(current, incoming);
  return doc;
}

/**
 * Qoder's `modelConfigs.customModels` entries are keyed by `key` (not `id`), so
 * upsert them by key instead of the generic append; `model` and any other keys
 * merge shallowly.
 */
function mergeQoderModels(existing: unknown, fragment: unknown): unknown {
  const doc = isPlainObject(existing) ? { ...existing } : {};
  const frag = isPlainObject(fragment) ? fragment : {};

  const mergedModel = {
    ...(isPlainObject(doc.model) ? doc.model : {}),
    ...(isPlainObject(frag.model) ? frag.model : {}),
  };

  const docConfigs = isPlainObject(doc.modelConfigs) ? doc.modelConfigs : {};
  const fragConfigs = isPlainObject(frag.modelConfigs) ? frag.modelConfigs : {};
  const current = Array.isArray(docConfigs.customModels)
    ? (docConfigs.customModels as Array<Record<string, unknown>>)
    : [];
  const incoming = Array.isArray(fragConfigs.customModels)
    ? (fragConfigs.customModels as Array<Record<string, unknown>>)
    : [];
  const customModels = upsertBy(current, incoming, (item) => (
    typeof item.key === 'string' ? item.key : undefined
  ));

  return {
    ...doc,
    model: mergedModel,
    modelConfigs: { ...docConfigs, ...fragConfigs, customModels },
  };
}

const define = (target: ToolTarget): [string, ToolTarget] => [target.name, target];

/** Supported tool registry (Phase 1). */
export const TOOL_TARGETS = new Map<string, ToolTarget>([
  define({
    name: 'claude',
    format: 'json',
    template: 'claude',
    preferredEndpoint: 'anthropic',
    forceEndpoint: 'anthropic',
    configPath: (home) =>
      path.join(resolveDir(process.env.CLAUDE_CONFIG_DIR, path.join(home, '.claude'), home), 'settings.json'),
  }),
  define({
    name: 'codex',
    format: 'toml',
    template: 'codex',
    preferredEndpoint: 'openai',
    configPath: (home) =>
      path.join(resolveDir(process.env.CODEX_HOME, path.join(home, '.codex'), home), 'config.toml'),
  }),
  define({
    name: 'opencode',
    // OpenCode parses both extensions with a comment-tolerant parser, so read as
    // json5 (which also accepts strict JSON) and write back strict JSON.
    format: 'json5',
    template: 'opencode',
    preferredEndpoint: 'openai',
    // OpenCode merges config.json → opencode.json → opencode.jsonc, i.e. a .jsonc
    // wins on conflicting keys, so edit the .jsonc whenever the user has one and
    // fall back to the .json. With neither on disk, create the .jsonc OpenCode
    // would seed itself.
    configPath: (home) => {
      const dir = path.join(
        resolveDir(process.env.XDG_CONFIG_HOME, path.join(home, '.config'), home),
        'opencode',
      );
      const jsonc = path.join(dir, 'opencode.jsonc');
      if (fse.existsSync(jsonc)) return jsonc;
      const json = path.join(dir, 'opencode.json');
      if (fse.existsSync(json)) return json;
      return jsonc;
    },
  }),
  define({
    name: 'dsh',
    format: 'yaml',
    template: 'dsh',
    preferredEndpoint: 'openai',
    configPath: (home) =>
      path.join(resolveDir(process.env.DSH_HOME, path.join(home, '.dsh'), home), 'settings.yaml'),
  }),
  define({
    name: 'codebuddy',
    format: 'json',
    template: 'buddy',
    preferredEndpoint: 'openai',
    forceEndpoint: 'openai',
    configPath: (home) => path.join(home, '.codebuddy', 'models.json'),
    merge: mergeBuddyModels,
  }),
  define({
    name: 'workbuddy',
    format: 'json',
    template: 'buddy',
    preferredEndpoint: 'openai',
    forceEndpoint: 'openai',
    configPath: (home) => path.join(home, '.workbuddy', 'models.json'),
    merge: mergeBuddyModels,
  }),
  define({
    name: 'openclaw',
    format: 'json5',
    template: 'openclaw',
    preferredEndpoint: 'openai',
    // OPENCLAW_CONFIG_PATH points straight at the file; OPENCLAW_STATE_DIR at the
    // state directory that holds openclaw.json. Both fall back to ~/.openclaw.
    configPath: (home) => {
      const direct = process.env.OPENCLAW_CONFIG_PATH;
      if (direct) return expandTilde(direct, home);
      const stateDir = process.env.OPENCLAW_STATE_DIR;
      if (stateDir) return path.join(expandTilde(stateDir, home), 'openclaw.json');
      return path.join(home, '.openclaw', 'openclaw.json');
    },
  }),
  define({
    name: 'hermes',
    format: 'yaml',
    template: 'hermes',
    preferredEndpoint: 'openai',
    // Hermes custom endpoints are OpenAI-compatible; keep it on the openai endpoint.
    forceEndpoint: 'openai',
    configPath: (home) =>
      path.join(resolveDir(process.env.HERMES_HOME, path.join(home, '.hermes'), home), 'config.yaml'),
  }),
  define({
    name: 'qoder',
    format: 'json5',
    template: 'qoder',
    preferredEndpoint: 'openai',
    configPath: (home) =>
      path.join(resolveDir(process.env.QODER_CONFIG_DIR, path.join(home, '.qoder'), home), 'settings.json'),
    merge: mergeQoderModels,
  }),
  define({
    name: 'zcode',
    format: 'json',
    template: 'zcode',
    preferredEndpoint: 'openai',
    configPath: (home) => path.join(home, '.zcode', 'cli', 'config.json'),
  }),
]);

/** Tools that exist but cannot accept a custom provider/model config. */
const UNSUPPORTED_TOOLS: Record<string, string> = {
  cursor:
    'Cursor CLI does not support custom model providers (BYOK); it authenticates only through a Cursor account',
};

export function supportedToolNames(): string[] {
  return [...TOOL_TARGETS.keys()];
}

export function unsupportedTools(): Array<{ name: string; reason: string }> {
  return Object.entries(UNSUPPORTED_TOOLS).map(([name, reason]) => ({ name, reason }));
}

export function getToolTarget(name: string): ToolTarget {
  const target = TOOL_TARGETS.get(name);
  if (target) return target;
  if (UNSUPPORTED_TOOLS[name]) {
    throw new Error(`Tool "${name}" is not supported: ${UNSUPPORTED_TOOLS[name]}`);
  }
  throw new Error(`Unknown tool "${name}" (available: ${supportedToolNames().join(', ')})`);
}
