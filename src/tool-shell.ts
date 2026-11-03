import path from 'node:path';
import { findGitBashWindows } from './bundled-runtime.js';
import { TOOLS, isToolId, type ShellSetting, type ToolDescriptor } from './tools.js';
import { getTeamaiHomeDir, type ToolId } from './types.js';
import { pathExists, readJsonObject, remove, writeJsonAtomic } from './utils/fs.js';
import { log } from './utils/logger.js';

// ─── The tool's own command shell ─────────────────────────────
//
//  On Windows the AI tools teamai targets run their Bash tool and agent
//  commands through PowerShell or cmd by default, while team hooks, skills and
//  docs assume a POSIX shell. Some tools accept an explicit interpreter path:
//  Claude Code and CodeBuddy take an env entry in settings.json, OpenCode takes
//  the top-level `shell` key. `teamai model inject` writes the machine's Git
//  Bash there, next to the model config it just delivered, and records what it
//  wrote so a user's own choice is never overwritten.

/** A tool this run delivered a model config to, and the file it wrote. */
export interface ToolShellTarget {
  /** The tool id `model inject` names. */
  readonly tool: string;
  /** The model config file this run wrote, absolute: the shell setting sits beside it. */
  readonly file: string;
}

/** A value teamai wrote into one tool's config. */
export interface ToolShellRecord {
  /** The absolute config file the value lives in. */
  readonly file: string;
  /** The value teamai wrote. */
  readonly value: string;
}

type ToolShellManifest = Record<string, ToolShellRecord>;

/** The machine-level record of the shell paths teamai wrote (`~/.teamai/tool-shell.json`). */
export const TOOL_SHELL_MANIFEST = 'tool-shell.json';

/** What the sync did, for tests and for a caller that wants to report it. */
export interface ToolShellSyncResult {
  /** Tools whose config teamai wrote or updated. */
  readonly written: readonly string[];
  /** Tools whose teamai-owned value teamai removed. */
  readonly cleared: readonly string[];
  /** Tools skipped because their config file is not a JSON object. */
  readonly skipped: readonly string[];
}

/**
 * The parts of the machine this module reads, injectable so the Windows branch
 * is testable on every platform.
 */
export interface ToolShellEnvironment {
  readonly platform: NodeJS.Platform;
  findGitBash(): string | null;
}

export interface ToolShellSyncOptions {
  /** The tools this run delivered a model config to. Nothing else is touched. */
  readonly targets: readonly ToolShellTarget[];
  /** The ownership record; defaults to `~/.teamai/tool-shell.json`. */
  readonly manifestPath?: string;
  readonly environment?: Partial<ToolShellEnvironment>;
}

function resolveEnvironment(overrides: Partial<ToolShellEnvironment> = {}): ToolShellEnvironment {
  return {
    platform: overrides.platform ?? process.platform,
    findGitBash: overrides.findGitBash ?? findGitBashWindows,
  };
}

function manifestPath(): string {
  return path.join(getTeamaiHomeDir(), TOOL_SHELL_MANIFEST);
}

/** The tool's declared shell setting, if it has one; the descriptor type keeps the union readable. */
function shellOf(tool: ToolId): ShellSetting | undefined {
  const descriptor: ToolDescriptor = TOOLS[tool];
  return descriptor.shell;
}

/**
 * The file `tool`'s shell path goes in, beside the model config this run wrote
 * for it, or null when the registry says the tool takes no such setting.
 */
export function toolShellConfigFile(tool: ToolId, modelConfigFile: string): string | null {
  const setting = shellOf(tool);
  if (!setting) return null;
  return path.join(path.dirname(modelConfigFile), setting.file);
}

/** Read the ownership record; missing, damaged or malformed entries read as empty. */
async function readManifest(file: string): Promise<ToolShellManifest> {
  const read = await readJsonObject(file);
  if (read.kind !== 'ok') return {};
  const manifest: ToolShellManifest = {};
  for (const [tool, record] of Object.entries(read.value)) {
    if (!record || typeof record !== 'object') continue;
    const { file: recordFile, value } = record as { file?: unknown; value?: unknown };
    if (typeof recordFile !== 'string' || typeof value !== 'string') continue;
    manifest[tool] = { file: recordFile, value };
  }
  return manifest;
}

function sameManifest(a: ToolShellManifest, b: ToolShellManifest): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => b[key]?.file === a[key].file && b[key]?.value === a[key].value);
}

/** The value `setting` names in `doc`, or undefined. */
function readSettingValue(doc: Record<string, unknown>, setting: ShellSetting): unknown {
  if (setting.kind === 'key') return doc[setting.key];
  const env = doc.env;
  return env && typeof env === 'object' && !Array.isArray(env)
    ? (env as Record<string, unknown>)[setting.key]
    : undefined;
}

/**
 * Write `value` at `setting`'s key, leaving every other key alone. Returns
 * false when the existing value is not an object teamai may extend
 * (`env` holding a string, say) so the caller can leave the file untouched.
 */
function applySettingValue(doc: Record<string, unknown>, setting: ShellSetting, value: string): boolean {
  if (setting.kind === 'key') {
    if (doc[setting.key] === value) return false;
    doc[setting.key] = value;
    return true;
  }
  const raw = doc.env;
  if (raw === undefined) {
    doc.env = { [setting.key]: value };
    return true;
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const env = raw as Record<string, unknown>;
  if (env[setting.key] === value) return false;
  env[setting.key] = value;
  return true;
}

/** Delete `setting`'s key from `doc`, reporting whether anything was removed. */
function clearSettingValue(doc: Record<string, unknown>, setting: ShellSetting): boolean {
  if (setting.kind === 'key') {
    if (!(setting.key in doc)) return false;
    delete doc[setting.key];
    return true;
  }
  const env = doc.env;
  if (!env || typeof env !== 'object' || Array.isArray(env)) return false;
  if (!(setting.key in env)) return false;
  delete (env as Record<string, unknown>)[setting.key];
  return true;
}

/** Remove the value teamai still owns in `record`, reporting whether it did. */
async function removeOwnedValue(setting: ShellSetting, record: ToolShellRecord): Promise<boolean> {
  const read = await readJsonObject(record.file);
  if (read.kind !== 'ok') return false;
  if (readSettingValue(read.value, setting) !== record.value) return false;
  if (!clearSettingValue(read.value, setting)) return false;
  await writeJsonAtomic(record.file, read.value);
  return true;
}

/**
 * Write the machine's Git Bash into each tool this run delivered a model config
 * to, keep teamai's record of what it wrote, and drop only the values teamai
 * still owns when the target leaves or Git Bash is gone.
 *
 * Windows-only. Never overwrites a value the record does not claim, and never
 * reads or writes a tool outside `targets`.
 */
export async function syncToolShellSettings(options: ToolShellSyncOptions): Promise<ToolShellSyncResult> {
  const environment = resolveEnvironment(options.environment);
  const written: string[] = [];
  const cleared: string[] = [];
  const skipped: string[] = [];
  // Nothing to write off Windows, and no record to read: the file only exists
  // where teamai wrote a Windows path.
  if (environment.platform !== 'win32') return { written, cleared, skipped };

  const recordFile = options.manifestPath ?? manifestPath();
  const previous = await readManifest(recordFile);
  const next: ToolShellManifest = { ...previous };

  // One entry per shell-capable target; a repeated tool keeps its last file.
  const files = new Map<string, { tool: ToolId; file: string }>();
  for (const target of options.targets) {
    if (!isToolId(target.tool)) continue;
    const file = toolShellConfigFile(target.tool, target.file);
    if (file) files.set(target.tool, { tool: target.tool, file });
  }

  const gitBash = environment.findGitBash();
  if (!gitBash) {
    log.warn(
      'Git Bash was not found, so teamai skipped writing it into the AI tools\' settings. '
      + 'Install Git for Windows (https://git-scm.com/download/win) and re-run.',
    );
    for (const target of files.values()) {
      const record = previous[target.tool];
      if (!record) continue;
      const setting = shellOf(target.tool);
      if (setting && await removeOwnedValue(setting, record)) {
        cleared.push(target.tool);
        log.debug(`Removed teamai's shell path from ${record.file}`);
      }
      delete next[target.tool];
    }
  } else {
    for (const target of files.values()) {
      const tool = target.tool;
      const file = target.file;
      const setting = shellOf(tool);
      if (!setting) continue;
      if (!await pathExists(path.dirname(file))) continue;

      const read = await readJsonObject(file);
      if (read.kind === 'invalid') {
        log.warn(`Skipped the command shell in ${file}: it is not a JSON object teamai can extend.`);
        skipped.push(tool);
        continue;
      }
      const doc = read.kind === 'ok' ? read.value : {};
      const current = readSettingValue(doc, setting);
      const record = previous[tool];
      const owned = record !== undefined && current === record.value;
      if (current !== undefined && !owned) {
        log.debug(`Kept the user's own command shell in ${file}`);
        continue;
      }
      if (!applySettingValue(doc, setting, gitBash)) {
        if (current === gitBash) continue;
        log.warn(`Skipped the command shell in ${file}: env is not an object teamai can extend.`);
        skipped.push(tool);
        continue;
      }
      await writeJsonAtomic(file, doc);
      next[tool] = { file, value: gitBash };
      written.push(tool);
    }
  }

  if (!sameManifest(previous, next)) {
    if (Object.keys(next).length === 0) await remove(recordFile);
    else await writeJsonAtomic(recordFile, next);
  }
  return { written, cleared, skipped };
}
