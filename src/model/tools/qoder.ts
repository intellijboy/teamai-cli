import path from 'node:path';
import type { ToolTarget } from './types.js';
import { configDirExists, resolveDir } from './paths.js';
import { isPlainObject, upsertBy } from '../merge.js';

/**
 * Qoder's `modelConfigs.customModels` entries are keyed by `key` (not `id`), so
 * upsert them by key instead of the generic append; `model` and any other keys
 * merge shallowly.
 */
export function mergeQoderModels(existing: unknown, fragment: unknown): unknown {
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

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.QODER_CONFIG_DIR, path.join(home, '.qoder'), home),
    'settings.json',
  );
}

export const qoder: ToolTarget = {
  name: 'qoder',
  format: 'json5',
  template: 'qoder',
  preferredEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  merge: mergeQoderModels,
};
