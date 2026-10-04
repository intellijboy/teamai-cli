import { z } from 'zod';
import { ApiKey } from './api-key.js';
import providersData from './providers.json';

/**
 * Provider-agnostic model catalog.
 *
 * A provider declares its two API endpoints (Anthropic- and OpenAI-compatible),
 * a `${ENV_VAR}` API-key placeholder, and a flat model list. Each model may tag
 * one or more tiers (`fast` / `default` / `powerful`); an untiered model still
 * renders into every tool's flat model list. `teamai model inject` renders this
 * catalog into each AI tool's native model config.
 */

export type ModelTier = 'fast' | 'default' | 'powerful';
export type EndpointName = 'anthropic' | 'openai';

const ModelTierSchema = z.enum(['fast', 'default', 'powerful']);

const ModalitiesSchema = z.object({
  input: z.array(z.string()),
  output: z.array(z.string()),
});

const ModelEntrySchema = z.object({
  id: z.string().min(1),
  /**
   * Max input tokens. Required: opencode's schema mandates `limit.context`, so a
   * catalog entry without it would render an invalid config.
   */
  contextWindow: z.number().int().positive(),
  /** Max output tokens; tools that mandate an output limit (opencode) fall back to a default. */
  outputWindow: z.number().int().positive().optional(),
  /** Declared input/output modalities (informational today; no tool renders them yet). */
  modalities: ModalitiesSchema.optional(),
  /** Tiers this model serves. Omitted = untiered (flat model lists only). */
  tiers: z.array(ModelTierSchema).optional(),
});

/** One model catalog entry. */
export type ModelEntry = z.infer<typeof ModelEntrySchema>;

/** Tier → model entry, resolved from the model list for tier-aware templates. */
export type TierModels = Partial<Record<ModelTier, ModelEntry>>;

const ProviderSchema = z.object({
  provider: z.string().min(1),
  name: z.string().min(1),
  /** Optional Chinese display name, e.g. `深度求索`; used only for human-facing labels. */
  nameZh: z.string().min(1).optional(),
  /** `${ENV_VAR}` placeholder (or a literal key, though the built-ins are all placeholders). */
  apiKey: z.string().min(1),
  /** True when the provider can be used without an API key (e.g. a local server). */
  apiKeyOptional: z.boolean().optional(),
  /** Endpoint used when a tool supports both; defaults to `openai`. */
  defaultEndpoint: z.enum(['anthropic', 'openai']).optional(),
  endpoints: z.object({
    anthropic: z.object({ baseUrl: z.string().min(1) }),
    openai: z.object({ baseUrl: z.string().min(1) }),
  }),
  models: z.array(ModelEntrySchema).min(1),
});

type ProviderData = z.infer<typeof ProviderSchema>;

const TIERS: ModelTier[] = ['fast', 'default', 'powerful'];
const ENDPOINTS: EndpointName[] = ['anthropic', 'openai'];

/** Provider used when `--provider` is omitted. */
export const DEFAULT_PROVIDER = 'deepseek';

/** Built-in provider catalog, validated below; the source of truth is `providers.json`. */
const BUILTIN_PROVIDERS: unknown[] = providersData;

export interface ProviderModel {
  tier?: ModelTier;
  id: string;
  contextWindow: number;
  outputWindow?: number;
  modalities?: ModelEntry['modalities'];
}

export interface ResolvedApiKey {
  /** True when the provider declares a `${ENV_VAR}` placeholder rather than a literal. */
  isPlaceholder: boolean;
  /** Environment variable name for a placeholder; undefined for a literal. */
  envName?: string;
  /** Resolved key value; empty when a placeholder's env var is unset. */
  value: string;
}

/**
 * A validated provider catalog entry.
 *
 * The class owns the provider's behavior (endpoint lookup, tier resolution,
 * API-key declaration) so callers never reach into the raw JSON structure.
 */
export class ModelProvider {
  readonly provider: string;
  readonly name: string;
  readonly nameZh?: string;
  readonly apiKey: string;
  readonly apiKeyOptional: boolean;
  readonly defaultEndpoint?: EndpointName;
  readonly endpoints: ProviderData['endpoints'];
  readonly models: ProviderData['models'];

  constructor(data: unknown) {
    const parsed: ProviderData = ProviderSchema.parse(data);
    this.provider = parsed.provider;
    this.name = parsed.name;
    this.nameZh = parsed.nameZh;
    this.apiKey = parsed.apiKey;
    this.apiKeyOptional = parsed.apiKeyOptional ?? false;
    this.defaultEndpoint = parsed.defaultEndpoint;
    this.endpoints = parsed.endpoints;
    this.models = parsed.models;
  }

  /** Human-facing label: `DeepSeek(深度求索)` when a Chinese name is set, else the English name. */
  get displayName(): string {
    return this.nameZh ? `${this.name}(${this.nameZh})` : this.name;
  }

  /** Id of the default-tier model, falling back to `fast`, then the first entry. */
  get defaultModelId(): string {
    return this.modelForTier('default')?.id ?? this.modelForTier('fast')?.id ?? this.models[0].id;
  }

  /** First model tagged with `tier`, or undefined when the catalog tags none. */
  modelForTier(tier: ModelTier): ModelEntry | undefined {
    return this.models.find((model) => model.tiers?.includes(tier));
  }

  /** Tier → model entry, for templates that render a specific tier (claude, codex, hermes). */
  tierModels(): TierModels {
    const result: TierModels = {};
    for (const tier of TIERS) {
      const model = this.modelForTier(tier);
      if (model) result[tier] = model;
    }
    return result;
  }

  /** The API-key declaration as a value object. */
  get apiKeyValue(): ApiKey {
    return new ApiKey(this.apiKey);
  }

  /** Resolve the base URL for an endpoint; throws listing the available endpoints. */
  endpointBaseUrl(endpoint: EndpointName): string {
    const baseUrl = this.endpoints[endpoint]?.baseUrl;
    if (!baseUrl) {
      throw new Error(
        `Provider "${this.provider}" has no "${endpoint}" endpoint (available: ${ENDPOINTS.join(', ')})`,
      );
    }
    return baseUrl;
  }

  /**
   * The full model list in catalog order, de-duplicated by id. `tier` is the
   * first tier the entry is tagged with (undefined for untiered entries); each
   * tool renders this as a flat list.
   */
  uniqueModels(): ProviderModel[] {
    const seen = new Set<string>();
    const result: ProviderModel[] = [];
    for (const model of this.models) {
      if (seen.has(model.id)) continue;
      seen.add(model.id);
      result.push({
        tier: TIERS.find((tier) => model.tiers?.includes(tier)),
        id: model.id,
        contextWindow: model.contextWindow,
        outputWindow: model.outputWindow,
        modalities: model.modalities,
      });
    }
    return result;
  }
}

const PROVIDERS: ModelProvider[] = BUILTIN_PROVIDERS.map((entry) => new ModelProvider(entry));
const BY_ID = new Map(PROVIDERS.map((provider) => [provider.provider, provider]));

export function listProviders(): ModelProvider[] {
  return [...PROVIDERS];
}

export function providerIds(): string[] {
  return PROVIDERS.map((provider) => provider.provider);
}

/** Load a built-in provider; throws with the available ids when unknown. */
export function getProvider(id: string): ModelProvider {
  const provider = BY_ID.get(id);
  if (!provider) {
    throw new Error(`Unknown provider "${id}" (available: ${providerIds().join(', ')})`);
  }
  return provider;
}

/** Resolve the base URL for an endpoint; throws listing the available endpoints. */
export function endpointBaseUrl(provider: ModelProvider, endpoint: EndpointName): string {
  return provider.endpointBaseUrl(endpoint);
}

/** Model list in catalog order, de-duplicated by id. */
export function uniqueModels(provider: ModelProvider): ProviderModel[] {
  return provider.uniqueModels();
}

/** Resolve a provider's API-key declaration against the environment. */
export function resolveApiKey(provider: ModelProvider, env: NodeJS.ProcessEnv = process.env): ResolvedApiKey {
  const key = provider.apiKeyValue;
  if (key.isPlaceholder) {
    return { isPlaceholder: true, envName: key.envName, value: key.resolve(env) };
  }
  return { isPlaceholder: false, value: key.resolve(env) };
}
