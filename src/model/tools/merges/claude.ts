import { deepMerge, isPlainObject } from '../../merge.js';

/**
 * Merge a rendered Claude fragment into `settings.json`.
 *
 * `modelPicker` is a whole-lineup field: Claude Code never combines rows from
 * two sources, and rows carry no `id`, so the default deep-merge would append a
 * stale option from a previous provider instead of replacing it. Replace the
 * lineup from the fragment, and clear any existing one when the provider adds
 * no rows. `theme` is only defaulted to dark when the user has not chosen one.
 */
export function mergeClaudeSettings(existing: unknown, fragment: unknown): unknown {
  const patch = isPlainObject(fragment) ? fragment : {};
  const merged = deepMerge(isPlainObject(existing) ? existing : {}, patch);
  if ('modelPicker' in patch) merged.modelPicker = patch.modelPicker;
  else delete merged.modelPicker;
  if (merged.theme === undefined) merged.theme = 'dark';
  return merged;
}
