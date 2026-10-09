import { deepMerge, isPlainObject } from '../../merge.js';
import { asRecord } from '../shared/read.js';

/**
 * Merge a rendered OpenCode fragment into `opencode.json(c)`.
 *
 * A thinking-disablable model carries a `variants.minimal` entry. When the
 * catalog later stops marking that model the fragment omits the entry, so drop
 * the stale `variants.minimal` rather than leaving a thinking-off option
 * selectable for a model that can no longer disable thinking.
 */
export function mergeOpencodeConfig(existing: unknown, fragment: unknown): unknown {
  const patch = isPlainObject(fragment) ? fragment : {};
  const merged = deepMerge(isPlainObject(existing) ? existing : {}, patch);
  const patchProviders = asRecord(patch.provider);
  const mergedProviders = asRecord(merged.provider);
  for (const [providerId, patchProvider] of Object.entries(patchProviders)) {
    const patchModels = asRecord(asRecord(patchProvider).models);
    const mergedModels = asRecord(asRecord(mergedProviders[providerId]).models);
    for (const [modelId, patchModel] of Object.entries(patchModels)) {
      if ('minimal' in asRecord(asRecord(patchModel).variants)) continue;
      const mergedModel = asRecord(mergedModels[modelId]);
      const variants = mergedModel.variants;
      if (!isPlainObject(variants) || !('minimal' in variants)) continue;
      delete variants.minimal;
      if (Object.keys(variants).length === 0) delete mergedModel.variants;
    }
  }
  return merged;
}
