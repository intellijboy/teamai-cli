import { describe, expect, it } from 'vitest';

import {
  deepMerge,
  isPlainObject,
  upsertBy,
  upsertById,
  type MergeStrategy,
} from '../model/merge.js';

describe('deepMerge', () => {
  it('overwrites scalars and merges nested objects', () => {
    expect(deepMerge({ a: 1, b: 2 }, { b: 9, c: 3 })).toEqual({ a: 1, b: 9, c: 3 });
    expect(deepMerge({ env: { A: '1', B: '2' } }, { env: { B: '9', C: '3' } })).toEqual({
      env: { A: '1', B: '9', C: '3' },
    });
  });

  it('appends arrays without duplicates', () => {
    expect(deepMerge({ list: ['a', 'b'] }, { list: ['b', 'c'] })).toEqual({ list: ['a', 'b', 'c'] });
  });

  it('upserts object arrays by id instead of appending a second entry', () => {
    const merged = deepMerge(
      { models: [{ id: 'a', key: 'old' }, { id: 'b' }] },
      { models: [{ id: 'a', key: 'new' }, { id: 'c' }] },
    );
    expect(merged.models).toEqual([{ id: 'a', key: 'new' }, { id: 'b' }, { id: 'c' }]);
  });

  it('does not mutate its inputs', () => {
    const base = { models: [{ id: 'a' }], env: { A: '1' } };
    const patch = { models: [{ id: 'b' }], env: { B: '2' } };
    const snapshot = JSON.stringify({ base, patch });
    deepMerge(base, patch);
    expect(JSON.stringify({ base, patch })).toBe(snapshot);
  });
});

describe('deepMerge prototype safety', () => {
  it('does not pollute from a top-level __proto__ patch key', () => {
    const patch = JSON.parse('{"__proto__":{"polluted":"yes"}}') as Record<string, unknown>;
    const merged = deepMerge({ safe: true }, patch);

    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(merged, '__proto__')).toBe(false);
    expect(merged.safe).toBe(true);
  });

  it('does not pollute from a nested __proto__ patch key', () => {
    const patch = JSON.parse('{"nested":{"__proto__":{"polluted":"yes"}}}') as Record<string, unknown>;
    const merged = deepMerge({ nested: { safe: true } }, patch);
    const nested = merged.nested as Record<string, unknown>;

    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.getPrototypeOf(nested)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(nested, '__proto__')).toBe(false);
    expect(nested.safe).toBe(true);
  });

  it('ignores prototype and constructor patch keys', () => {
    const patch = JSON.parse(
      '{"prototype":{"bad":true},"constructor":{"bad":true}}',
    ) as Record<string, unknown>;
    const merged = deepMerge({ safe: true }, patch);

    expect(Object.prototype.hasOwnProperty.call(merged, 'prototype')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(merged, 'constructor')).toBe(false);
    expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
    expect(merged.safe).toBe(true);
  });

  it('does not pollute when a reserved key is present in the base', () => {
    const base = JSON.parse('{"__proto__":{"polluted":"yes"}}') as Record<string, unknown>;
    const merged = deepMerge(base, { safe: true });

    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
    expect(merged.safe).toBe(true);
  });
});

describe('merge helpers', () => {
  it('isPlainObject accepts objects but not arrays or null', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject('x')).toBe(false);
  });

  it('upsertBy replaces matching keys and appends the rest', () => {
    const base = [{ id: 'a' }, { id: 'b' }];
    const patch = [{ id: 'a' }, { id: 'c' }];
    expect(upsertBy(base, patch, (item) => item.id)).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    expect(upsertById(base, patch)).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
  });

  it('exposes the merge strategy names', () => {
    const strategies: MergeStrategy[] = ['recursive', 'upsert-by-id', 'append-unique', 'overwrite'];
    expect(strategies).toHaveLength(4);
  });
});
