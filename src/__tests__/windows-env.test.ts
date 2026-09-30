import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fse from 'fs-extra';
import {
  reconcileSystemEnv,
  applySystemEnv,
  clearSystemEnv,
  readSystemEnvRecord,
  systemEnvRecordPath,
  type SystemEnvIO,
} from '../utils/windows-env.js';

interface ApplyCall {
  set: Record<string, string>;
  remove: string[];
}

function fakeIO(current: Record<string, string | null>): {
  io: SystemEnvIO;
  applied: ApplyCall[];
  readNames: string[][];
} {
  const applied: ApplyCall[] = [];
  const readNames: string[][] = [];
  return {
    applied,
    readNames,
    io: {
      async read(names) {
        readNames.push(names);
        const out: Record<string, string | null> = {};
        for (const name of names) out[name] = current[name] ?? null;
        return out;
      },
      async apply(payload) {
        applied.push(payload);
      },
    },
  };
}

describe('reconcileSystemEnv', () => {
  it('sets desired keys it does not own yet', () => {
    const result = reconcileSystemEnv({
      desired: [{ key: 'AMAP_KEY', value: 'a' }],
      owned: {},
      current: {},
    });
    expect(result.set).toEqual({ AMAP_KEY: 'a' });
    expect(result.owned).toEqual({ AMAP_KEY: 'a' });
    expect(result.remove).toEqual([]);
    expect(result.skipped).toEqual([]);
  });

  it('does not rewrite a key whose value already matches', () => {
    const result = reconcileSystemEnv({
      desired: [{ key: 'AMAP_KEY', value: 'a' }],
      owned: { AMAP_KEY: 'a' },
      current: { AMAP_KEY: 'a' },
    });
    expect(result.set).toEqual({});
    expect(result.owned).toEqual({ AMAP_KEY: 'a' });
  });

  it('leaves a user-owned key alone unless forced', () => {
    const skipped = reconcileSystemEnv({
      desired: [{ key: 'AMAP_KEY', value: 'team' }],
      owned: {},
      current: { AMAP_KEY: 'mine' },
    });
    expect(skipped.set).toEqual({});
    expect(skipped.skipped).toEqual(['AMAP_KEY']);
    expect(skipped.owned).toEqual({});

    const forced = reconcileSystemEnv({
      desired: [{ key: 'AMAP_KEY', value: 'team' }],
      owned: {},
      current: { AMAP_KEY: 'mine' },
      force: true,
    });
    expect(forced.set).toEqual({ AMAP_KEY: 'team' });
    expect(forced.owned).toEqual({ AMAP_KEY: 'team' });
    expect(forced.skipped).toEqual([]);
  });

  it('removes an owned key that is no longer delivered', () => {
    const result = reconcileSystemEnv({
      desired: [],
      owned: { OLD_KEY: 'x' },
      current: { OLD_KEY: 'x' },
    });
    expect(result.remove).toEqual(['OLD_KEY']);
    expect(result.owned).toEqual({});
  });

  it('drops keys that are not valid environment names', () => {
    const result = reconcileSystemEnv({
      desired: [{ key: 'bad key', value: 'x' }, { key: '1NOPE', value: 'y' }],
      owned: {},
      current: {},
    });
    expect(result.set).toEqual({});
    expect(result.owned).toEqual({});
  });
});

describe('applySystemEnv', () => {
  let tmpDir: string;
  let recordPath: string;

  beforeEach(async () => {
    tmpDir = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-winenv-test-'));
    recordPath = systemEnvRecordPath(tmpDir);
  });

  afterEach(async () => {
    await fse.remove(tmpDir);
  });

  it('writes the resolved vars and persists the ownership record', async () => {
    const { io, applied, readNames } = fakeIO({});
    const result = await applySystemEnv(
      [{ key: 'AMAP_KEY', value: 'team' }, { key: 'ENDPOINT', value: 'https://x' }],
      recordPath,
      { io },
    );

    expect(result.set).toEqual(['AMAP_KEY', 'ENDPOINT']);
    expect(applied).toEqual([{ set: { AMAP_KEY: 'team', ENDPOINT: 'https://x' }, remove: [] }]);
    expect(readNames[0]).toEqual(['AMAP_KEY', 'ENDPOINT']);
    expect(await readSystemEnvRecord(recordPath)).toEqual({
      keys: { AMAP_KEY: 'team', ENDPOINT: 'https://x' },
    });
  });

  it('is idempotent: a second run with the same values applies nothing', async () => {
    const first = fakeIO({});
    await applySystemEnv([{ key: 'A', value: '1' }], recordPath, { io: first.io });

    const second = fakeIO({ A: '1' });
    const result = await applySystemEnv([{ key: 'A', value: '1' }], recordPath, { io: second.io });
    expect(result.set).toEqual([]);
    expect(second.applied).toEqual([]);
  });

  it('dry-run returns the diff without applying or writing the record', async () => {
    const { io, applied } = fakeIO({});
    const result = await applySystemEnv([{ key: 'A', value: '1' }], recordPath, { io, dryRun: true });
    expect(result.set).toEqual(['A']);
    expect(applied).toEqual([]);
    expect(await fse.pathExists(recordPath)).toBe(false);
  });

  it('removes a previously owned key that left the resolved set', async () => {
    const first = fakeIO({});
    await applySystemEnv([{ key: 'OLD', value: 'x' }, { key: 'KEEP', value: 'y' }], recordPath, { io: first.io });

    const second = fakeIO({ OLD: 'x', KEEP: 'y' });
    const result = await applySystemEnv([{ key: 'KEEP', value: 'y' }], recordPath, { io: second.io });
    expect(result.removed).toEqual(['OLD']);
    expect(second.applied).toEqual([{ set: {}, remove: ['OLD'] }]);
    expect(await readSystemEnvRecord(recordPath)).toEqual({ keys: { KEEP: 'y' } });
  });
});

describe('clearSystemEnv', () => {
  it('deletes owned keys and drops the record, touching nothing else', async () => {
    const tmpDir = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-winenv-clear-'));
    try {
      const recordPath = systemEnvRecordPath(tmpDir);
      const first = fakeIO({});
      await applySystemEnv([{ key: 'A', value: '1' }], recordPath, { io: first.io });

      const { io, applied } = fakeIO({ A: '1', MINE: 'keep' });
      const removed = await clearSystemEnv(recordPath, { io });
      expect(removed).toEqual(['A']);
      expect(applied).toEqual([{ set: {}, remove: ['A'] }]);
      expect(await fse.pathExists(recordPath)).toBe(false);
    } finally {
      await fse.remove(tmpDir);
    }
  });
});
