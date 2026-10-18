import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';

import {
  CODEGRAPH_DIR_NAME,
  CODEGRAPH_INDEX_TIMEOUT_MS,
  initCodegraph,
} from '../codegraph-init.js';
import type { CommandExecutor, ExecResult } from '../utils/exec.js';
import { _resetState, _setLogFilePath, setSilent } from '../utils/logger.js';

describe('initCodegraph', () => {
  let tmpDir: string;
  let cwd: string;

  const ok: ExecResult = { stdout: '', stderr: '', code: 0 };

  beforeEach(async () => {
    tmpDir = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-codegraph-'));
    cwd = path.join(tmpDir, 'project');
    await fse.ensureDir(cwd);
    // Keep debug output off the console and out of the real HOME.
    _setLogFilePath(path.join(tmpDir, 'debug.log'));
    setSilent(true);
  });

  afterEach(async () => {
    setSilent(false);
    _resetState();
    await fse.remove(tmpDir);
  });

  const dbPath = (): string => path.join(cwd, CODEGRAPH_DIR_NAME, 'codegraph.db');
  const installed = (): boolean => true;

  it('skips without spawning when codegraph is not installed', async () => {
    const executor = vi.fn();
    await initCodegraph({ cwd, executor, isInstalled: () => false });
    expect(executor).not.toHaveBeenCalled();
  });

  it('runs `codegraph init` in a fresh directory with CODEGRAPH_DIR set', async () => {
    const executor = vi.fn<CommandExecutor>(async () => ok);
    await initCodegraph({ cwd, executor, isInstalled: installed });

    expect(executor).toHaveBeenCalledTimes(1);
    const [command, args, options] = executor.mock.calls[0];
    expect(command).toBe('codegraph');
    expect(args).toEqual(['init']);
    expect(options?.cwd).toBe(cwd);
    expect(options?.env?.CODEGRAPH_DIR).toBe(CODEGRAPH_DIR_NAME);
    expect(options?.timeoutMs).toBe(CODEGRAPH_INDEX_TIMEOUT_MS);
  });

  it('runs `codegraph index` on an existing index when forceReindex is set', async () => {
    await fse.outputFile(dbPath(), '');
    const executor = vi.fn<CommandExecutor>(async () => ok);
    await initCodegraph({ cwd, executor, isInstalled: installed, forceReindex: true });

    expect(executor).toHaveBeenCalledTimes(1);
    expect(executor.mock.calls[0][1]).toEqual(['index']);
  });

  it('skips without spawning when the index exists and forceReindex is not set', async () => {
    await fse.outputFile(dbPath(), '');
    const executor = vi.fn();
    await initCodegraph({ cwd, executor, isInstalled: installed });
    expect(executor).not.toHaveBeenCalled();
  });

  it('resolves without throwing on a non-zero exit', async () => {
    const executor = vi.fn(async () => ({ stdout: '', stderr: 'boom', code: 1 }));
    await expect(initCodegraph({ cwd, executor, isInstalled: installed })).resolves.toBeUndefined();
  });

  it('resolves without throwing when the command rejects', async () => {
    const executor = vi.fn(async () => { throw new Error('Command timed out after 1800000ms'); });
    await expect(initCodegraph({ cwd, executor, isInstalled: installed })).resolves.toBeUndefined();
  });
});
