import { isPlainObject, upsertById } from '../../merge.js';

/**
 * CodeBuddy / WorkBuddy accept either the current object wrapper
 * (`{ models: [...] }`) or the legacy top-level array. Upsert models by id and
 * preserve the existing root shape.
 *
 * A non-empty `availableModels` whitelist is extended with the incoming model
 * ids (deduped, order preserved), mirroring the backend, so injected models are
 * not hidden. An empty/absent list means "show every model" and stays untouched.
 */
export function mergeBuddyModels(existing: unknown, fragment: unknown): unknown {
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
  if (Array.isArray(doc.availableModels) && doc.availableModels.length > 0) {
    const available = doc.availableModels.filter((id): id is string => typeof id === 'string');
    for (const model of incoming) {
      if (!available.includes(model.id)) available.push(model.id);
    }
    doc.availableModels = available;
  }
  return doc;
}
