import path from 'node:path';
import { z } from 'zod';
import { getTeamaiHomeDir } from '../types.js';
import { readJson, writeJsonAtomic } from '../utils/fs.js';
import { getProvider, providerIds } from './providers.js';
import { getToolTarget, supportedToolNames } from './tool-targets.js';
import type { ToolSelection } from './tools/shared/types.js';

/**
 * The user's chosen default model for `team model inject`, persisted locally.
 * Kept separate from the shipped provider catalog so a re-inject keeps the
 * choice instead of reverting to the catalog's `default` tier.
 */
export const StoredDefaultModelSchema = z
  .object({ provider: z.string().min(1), model: z.string().min(1) })
  .strict();
export type StoredDefaultModel = z.infer<typeof StoredDefaultModelSchema>;

export function getDefaultModelPath(): string {
  return path.join(getTeamaiHomeDir(), 'models', 'default.json');
}

/** The persisted default, or undefined when unset/unreadable/invalid. */
export async function loadDefaultModel(): Promise<StoredDefaultModel | undefined> {
  const raw = await readJson<unknown>(getDefaultModelPath());
  if (raw === null) return undefined;
  const parsed = StoredDefaultModelSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

export async function saveDefaultModel(value: StoredDefaultModel): Promise<void> {
  await writeJsonAtomic(getDefaultModelPath(), StoredDefaultModelSchema.parse(value), { mode: 0o600 });
}

/** A tool's config and the providers/models it currently holds. */
export interface ToolSelections {
  tool: string;
  selections: ToolSelection[];
}

/** Read every installed tool that can report its providers/models. */
export function collectToolSelections(home: string): ToolSelections[] {
  const groups: ToolSelections[] = [];
  for (const tool of supportedToolNames()) {
    const target = getToolTarget(tool);
    if (!target.readSelections || !target.isInstalled(home)) continue;
    let selections: ToolSelection[] = [];
    try {
      selections = target.readSelections(home);
    } catch {
      selections = [];
    }
    if (selections.length > 0) groups.push({ tool, selections });
  }
  return groups;
}

/** One selectable default: a provider/model pair and the tools that hold it. */
export interface DefaultCandidate {
  provider: string;
  model: string;
  tools: string[];
}

/** Merge tool read-back into a sorted, de-duplicated `provider/model` list. */
export function candidatesFrom(groups: readonly ToolSelections[]): DefaultCandidate[] {
  const byKey = new Map<string, DefaultCandidate>();
  for (const { tool, selections } of groups) {
    for (const selection of selections) {
      const models = new Set(selection.models);
      if (selection.defaultModel) models.add(selection.defaultModel);
      for (const model of models) {
        const key = `${selection.provider}/${model}`;
        const candidate = byKey.get(key) ?? { provider: selection.provider, model, tools: [] };
        if (!candidate.tools.includes(tool)) candidate.tools.push(tool);
        byKey.set(key, candidate);
      }
    }
  }
  return [...byKey.values()].sort(
    (a, b) => a.provider.localeCompare(b.provider) || a.model.localeCompare(b.model),
  );
}

/** Providers that appear in at least one tool's config. */
export function providersFrom(groups: readonly ToolSelections[]): Set<string> {
  const providers = new Set<string>();
  for (const { selections } of groups) {
    for (const selection of selections) providers.add(selection.provider);
  }
  return providers;
}

/** Validate a `<provider>/<model>` choice against built-in providers and the catalog. */
export function validateSelection(provider: string, model: string, available: ReadonlySet<string>): void {
  if (!providerIds().includes(provider)) {
    throw new Error(`Unknown provider "${provider}" (available: ${providerIds().join(', ')})`);
  }
  if (!available.has(provider)) {
    throw new Error(
      `Provider "${provider}" is not configured in any installed tool. Run \`team model inject --provider ${provider}\` first.`,
    );
  }
  const known = getProvider(provider).models.some((entry) => entry.id === model);
  if (!known) throw new Error(`Provider "${provider}" has no model ${model}`);
}
