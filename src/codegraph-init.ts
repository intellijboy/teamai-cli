import fs from 'node:fs';
import path from 'node:path';
import { execCommand, type CommandExecutor } from './utils/exec.js';
import { isOnPath } from './utils/lookpath.js';
import { log, spinner } from './utils/logger.js';

/**
 * Directory codegraph writes its index into. teamai keeps everything under
 * `.teamai/`, so it passes this as CODEGRAPH_DIR to move the default
 * `.codegraph` aside; codegraph reads it as a single relative directory name.
 */
export const CODEGRAPH_DIR_NAME = '.teamai';

/** Indexing a large repo can take a long time; give it half an hour. */
export const CODEGRAPH_INDEX_TIMEOUT_MS = 30 * 60_000;

export interface CodegraphInitOptions {
  cwd?: string;
  forceReindex?: boolean;
  executor?: CommandExecutor;
  isInstalled?: () => boolean;
}

/** codegraph names its index database `codegraph.db` inside its output dir. */
function indexDbPath(cwd: string): string {
  return path.join(cwd, CODEGRAPH_DIR_NAME, 'codegraph.db');
}

/** The first non-empty, trimmed line of a possibly multi-line blob. */
function firstLine(text: string): string {
  return text.split(/\r?\n/).map(line => line.trim()).find(Boolean) ?? '';
}

/**
 * Build a CodeGraph index for `cwd` with the `codegraph` CLI. Best-effort:
 * a missing binary, a non-zero exit, or a timeout only warns — init must never
 * fail on this step.
 */
export async function initCodegraph(options: CodegraphInitOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const executor = options.executor ?? execCommand;
  const isInstalled = options.isInstalled ?? (() => isOnPath('codegraph'));

  if (!isInstalled()) {
    log.debug('codegraph is not installed; skipping the code graph index.');
    return;
  }

  // An existing database means the repo is already indexed.
  const initialized = fs.existsSync(indexDbPath(cwd));
  if (initialized && !options.forceReindex) {
    log.debug('CodeGraph index already exists; skipping (pass forceReindex to rebuild).');
    return;
  }

  // `init` creates the database from scratch; `index` refreshes the existing one.
  const args = initialized ? ['index'] : ['init'];
  const spin = (await spinner('Building the CodeGraph index...')).start();
  try {
    const result = await executor('codegraph', args, {
      cwd,
      env: { ...process.env, CODEGRAPH_DIR: CODEGRAPH_DIR_NAME },
      timeoutMs: CODEGRAPH_INDEX_TIMEOUT_MS,
    });
    if (result.code === 0) {
      spin.succeed(`CodeGraph index ready in ${CODEGRAPH_DIR_NAME}/`);
      return;
    }
    spin.stop();
    const reason = firstLine(result.stderr) || firstLine(result.stdout) || `exited with code ${result.code}`;
    log.warn(`CodeGraph indexing skipped: ${reason}`);
  } catch (error) {
    spin.stop();
    const reason = firstLine(error instanceof Error ? error.message : String(error));
    log.warn(`CodeGraph indexing skipped: ${reason}`);
  }
}
