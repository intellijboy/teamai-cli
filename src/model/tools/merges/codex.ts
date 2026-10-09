import { deepMerge, isPlainObject } from '../../merge.js';

/**
 * Merge a rendered Codex fragment into `config.toml`.
 *
 * `model_reasoning_effort` is written only while the default model's thinking
 * can be disabled. Drop a stale one when the fragment omits it, so switching to
 * a provider whose default model always thinks cannot leave `"none"` behind.
 */
export function mergeCodexConfig(existing: unknown, fragment: unknown): unknown {
  const patch = isPlainObject(fragment) ? fragment : {};
  const merged = deepMerge(isPlainObject(existing) ? existing : {}, patch);
  if (!('model_reasoning_effort' in patch)) delete merged.model_reasoning_effort;
  return merged;
}
