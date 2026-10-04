import type { EndpointName, ProviderModel, TierModels } from '../../providers.js';
import type { ConfigFormat } from '../../config-file.js';

/** View model handed to a tool's Handlebars template. */
export interface RenderContext {
  /** Provider id (e.g. `deepseek`). */
  provider: string;
  /** Provider name with its Chinese name when set (e.g. `DeepSeek(深度求索)`), else the English name. */
  displayName: string;
  endpoint: EndpointName;
  baseUrl: string;
  /** Environment variable name the provider's key comes from. */
  apiKeyEnv: string;
  /** Resolved API-key value. */
  apiKey: string;
  /** Tier → model entry (only the tiers the catalog tags), for templates that render a specific tier (claude, codex, hermes). */
  models: TierModels;
  /** All models in catalog order, de-duplicated by id. */
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
  /** Whether the tool's config directory exists, i.e. the tool is installed. */
  isInstalled(home: string): boolean;
  /** Merge a rendered fragment into the existing document; defaults to `deepMerge`. */
  merge?: MergeFn;
}
