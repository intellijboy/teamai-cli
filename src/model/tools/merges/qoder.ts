import { isPlainObject, upsertBy } from '../../merge.js';

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
