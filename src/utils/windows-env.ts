import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { writeFile as fsWriteFile, rm } from 'node:fs/promises';
import { windowsPowerShell } from './powershell.js';
import { readJson, writeJsonAtomic, remove } from './fs.js';

/**
 * Windows user-environment delivery (`HKCU\Environment`).
 *
 * `injectShellProfile` reaches a POSIX shell (Git Bash / zsh); on Windows it
 * never reaches cmd, PowerShell, an IDE or a GUI app, because those do not read
 * a bash profile. This module is the other target: it writes the resolved
 * variables straight into the user environment, which every NEW process
 * inherits regardless of how it was launched.
 *
 * Global and plaintext by nature, so it is off unless `sharing.env.injectSystemEnv`
 * is enabled and only records the keys it actually wrote: a key that already
 * holds a user-owned value is left alone (unless forced), and only recorded keys
 * are ever deleted. The record is the module's ownership ledger and the unit
 * `teamai uninstall` / `doctor` reason about.
 */

/** Name of the ownership record beside `env.sh` / the plaintext env backup. */
export const SYSTEM_ENV_RECORD_NAME = 'env.system.json';

/** The path of the teamai-owned user-environment record inside a data home. */
export function systemEnvRecordPath(dataHome: string): string {
  return path.join(dataHome, SYSTEM_ENV_RECORD_NAME);
}

/** A variable as the env delivery pipeline passes it (key/value only). */
export interface SystemEnvVariable {
  key: string;
  value: string;
}

/** The keys teamai wrote into the user environment, and the values it wrote. */
export interface SystemEnvRecord {
  keys: Record<string, string>;
}

/** The outcome of one reconcile, for logging and tests. */
export interface SystemEnvApplyResult {
  /** Keys written to `HKCU\Environment`. */
  set: string[];
  /** Keys deleted from `HKCU\Environment`. */
  removed: string[];
  /** Desired keys left alone because the user owns them (no `--force`). */
  skipped: string[];
}

/**
 * A key this module will write, and the only shape it reads back. Mirrors the
 * env.sh identifier rule (`resources/env.ts`): a non-identifier name cannot be
 * written by `export`, and a Windows environment name with `=`/`;`/NUL would be
 * rejected or truncated by the OS, so both sides agree on what is deliverable.
 */
export const SYSTEM_ENV_KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Decide what to write to `HKCU\Environment`, given the variables to deliver,
 * the keys teamai already owns (its record), and the values currently there.
 *
 * Pure and IO-free so the policy is unit-testable on any platform:
 *   - a key teamai has never written that already holds a value is the user's
 *     own and is left alone unless `force`;
 *   - a key in the record that is no longer delivered is removed;
 *   - a key whose value already matches is not rewritten (no needless broadcast).
 */
export function reconcileSystemEnv(input: {
  desired: SystemEnvVariable[];
  owned: Record<string, string>;
  current: Record<string, string | null>;
  force?: boolean;
}): { set: Record<string, string>; remove: string[]; owned: Record<string, string>; skipped: string[] } {
  const desired = new Map<string, string>();
  for (const variable of input.desired) {
    if (SYSTEM_ENV_KEY_RE.test(variable.key)) desired.set(variable.key, variable.value);
  }

  const set: Record<string, string> = {};
  const owned: Record<string, string> = {};
  const skipped: string[] = [];

  for (const [key, value] of desired) {
    const isOurs = Object.prototype.hasOwnProperty.call(input.owned, key);
    const existing = input.current[key];
    const isForeign = !isOurs && existing !== null && existing !== undefined;
    if (isForeign && !input.force) {
      skipped.push(key);
      continue;
    }
    if (existing !== value) set[key] = value;
    owned[key] = value;
  }

  const remove = Object.keys(input.owned).filter((key) => !desired.has(key));
  return { set, remove, owned, skipped };
}

/** Read the ownership record; a missing or malformed file reads as "owns nothing". */
export async function readSystemEnvRecord(recordPath: string): Promise<SystemEnvRecord> {
  const raw = await readJson<{ keys?: unknown }>(recordPath);
  const keys = raw && typeof raw.keys === 'object' && raw.keys !== null
    ? raw.keys as Record<string, string>
    : {};
  return { keys };
}

export interface SystemEnvIO {
  /** Current `HKCU\Environment` values for `names` (`null` when unset). */
  read(names: string[]): Promise<Record<string, string | null>>;
  /** Apply the diff: set each key, then delete each name. */
  apply(payload: { set: Record<string, string>; remove: string[] }): Promise<void>;
}

const READ_SCRIPT = [
  "$ErrorActionPreference = 'Stop'",
  '$names = [Console]::In.ReadToEnd() | ConvertFrom-Json',
  '$out = @{}',
  'foreach ($n in $names) { $out[[string]$n] = [Environment]::GetEnvironmentVariable([string]$n, \'User\') }',
  '$out | ConvertTo-Json -Compress',
].join('\n');

const APPLY_SCRIPT = [
  "$ErrorActionPreference = 'Stop'",
  '$data = [Console]::In.ReadToEnd() | ConvertFrom-Json',
  'if ($data.remove) { foreach ($k in $data.remove) { [Environment]::SetEnvironmentVariable([string]$k, $null, \'User\') } }',
  'if ($data.set) { foreach ($p in $data.set.PSObject.Properties) { [Environment]::SetEnvironmentVariable([string]$p.Name, [string]$p.Value, \'User\') } }',
].join('\n');

/**
 * Run one PowerShell script, feeding `stdin` to it and returning its stdout.
 *
 * The script is a fixed literal written to a temp file and launched with
 * `-File`, so an env value (arbitrary quotes, `$`, newlines) is never
 * interpolated into a command line — it travels as JSON on stdin and is parsed
 * by `ConvertFrom-Json`. `[Environment]::SetEnvironmentVariable(...,'User')`
 * broadcasts `WM_SETTINGCHANGE` itself, so already-running Explorer new
 * processes pick the change up without an extra broadcast step.
 */
async function runScript(script: string, stdin: string): Promise<string> {
  const tmp = path.join(
    os.tmpdir(),
    `teamai-env-${process.pid}-${crypto.randomBytes(6).toString('hex')}.ps1`,
  );
  await fsWriteFile(tmp, script, 'utf-8');
  try {
    return await new Promise<string>((resolve, reject) => {
      const child = spawn(
        windowsPowerShell(),
        ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', tmp],
        { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] },
      );
      let out = '';
      let err = '';
      child.stdout.on('data', (chunk) => { out += chunk.toString(); });
      child.stderr.on('data', (chunk) => { err += chunk.toString(); });
      child.once('error', reject);
      child.once('close', (code) => {
        if (code === 0) resolve(out);
        else reject(new Error(`PowerShell exited with code ${code ?? 'null'}: ${err.trim()}`));
      });
      child.stdin.write(stdin);
      child.stdin.end();
    });
  } finally {
    await rm(tmp, { force: true }).catch(() => undefined);
  }
}

const defaultIO: SystemEnvIO = {
  async read(names) {
    if (names.length === 0) return {};
    const stdout = await runScript(READ_SCRIPT, JSON.stringify(names));
    const text = stdout.trim();
    if (!text) return {};
    const parsed = JSON.parse(text) as Record<string, string | null>;
    return parsed;
  },
  async apply(payload) {
    if (Object.keys(payload.set).length === 0 && payload.remove.length === 0) return;
    await runScript(APPLY_SCRIPT, JSON.stringify(payload));
  },
};

/**
 * The current `HKCU\Environment` values for `names` (`null` when unset), read
 * directly. `applySystemEnv` reads through the same script; exposed so `doctor`
 * can tell a variable that is actually present — whoever set it — from one that
 * is absent, rather than trusting only the ownership record.
 */
export async function readSystemEnv(names: string[]): Promise<Record<string, string | null>> {
  return defaultIO.read(names);
}

/**
 * Reconcile the resolved variables against the user environment and persist the
 * ownership record. Idempotent: a run that changes nothing invokes no
 * PowerShell and rewrites no file. `dryRun` computes the diff and returns it
 * without touching the registry or the record.
 *
 * Windows only; callers guard on `process.platform`. `io` is injectable so the
 * policy can be exercised without spawning PowerShell.
 */
export async function applySystemEnv(
  variables: SystemEnvVariable[],
  recordPath: string,
  options: { dryRun?: boolean; force?: boolean; io?: SystemEnvIO } = {},
): Promise<SystemEnvApplyResult> {
  const io = options.io ?? defaultIO;
  const record = await readSystemEnvRecord(recordPath);

  const desired = variables.filter((variable) => SYSTEM_ENV_KEY_RE.test(variable.key));
  const probe = [...new Set([...desired.map((v) => v.key), ...Object.keys(record.keys)])];
  const current = await io.read(probe);

  const reconciled = reconcileSystemEnv({
    desired,
    owned: record.keys,
    current,
    force: options.force,
  });

  const result: SystemEnvApplyResult = {
    set: Object.keys(reconciled.set),
    removed: reconciled.remove,
    skipped: reconciled.skipped,
  };
  if (options.dryRun) return result;

  // Nothing to change and the owned set is unchanged: skip the PowerShell
  // round-trip and the record rewrite, so a session-start pull that finds the
  // environment already correct stays silent (and never broadcasts).
  const unchanged = result.set.length === 0
    && result.removed.length === 0
    && sameEnvMap(reconciled.owned, record.keys);
  if (unchanged) return result;

  await io.apply({ set: reconciled.set, remove: reconciled.remove });
  await writeJsonAtomic(recordPath, { keys: reconciled.owned });
  return result;
}

/** Whether two key→value maps hold the same entries (order-independent). */
function sameEnvMap(a: Record<string, string>, b: Record<string, string>): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key]);
}

/**
 * Delete every key teamai owns from the user environment and drop the record.
 * Used by `teamai uninstall`; keys not in the record are never touched.
 */
export async function clearSystemEnv(
  recordPath: string,
  options: { io?: SystemEnvIO } = {},
): Promise<string[]> {
  const record = await readSystemEnvRecord(recordPath);
  const keys = Object.keys(record.keys);
  if (keys.length > 0) {
    const io = options.io ?? defaultIO;
    await io.apply({ set: {}, remove: keys });
  }
  await remove(recordPath);
  return keys;
}
