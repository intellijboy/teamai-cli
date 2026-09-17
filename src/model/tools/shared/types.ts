import type { ModelProvider, EndpointName, ProviderModel } from '../../providers.js';
import type { ConfigFormat } from '../../config-file.js';

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
  /** Whether the tool's config directory exists, i.e. the tool is installed. */
  isInstalled(home: string): boolean;
  /** Merge a rendered fragment into the existing document; defaults to `deepMerge`. */
  merge?: MergeFn;
}
