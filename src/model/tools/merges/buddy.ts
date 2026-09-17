import { isPlainObject, upsertById } from '../../merge.js';

/**
 * CodeBuddy / WorkBuddy accept either the current object wrapper
 * (`{ models: [...] }`) or the legacy top-level array. Upsert models by id and
 * preserve the existing root shape; leave `availableModels` untouched (an
 * empty/absent list means "show every model").
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
  return doc;
}
