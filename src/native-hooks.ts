/**
 * Native hook artifacts.
 *
 * Besides the command-shaped `hooks/hooks.yaml` entries, a team may place
 * tool-authored hook files under `hooks/native/` in the team repo:
 *
 *   hooks/native/<tool-id>/<id>.ts     opencode, omp, pi   (native plugin / extension)
 *   hooks/native/<tool-id>/<id>.json   claude, codex, cursor, zcode (native hooks subtree)
 *   hooks/native/<ns>/<tool-id>/�?     the same, for one active namespace
 *
 * A `.ts` file is copied verbatim to the tool's plugin/extension directory. A
 * `.json` file is the tool's native hooks object and is merged into the file
 * that tool reads.
 *
 * Deliverable tools are driven by `enabledAgents` (minus `disabledAgents`): a
 * whitelisted tool with no `hooks/native/<tool>/` directory is skipped, silently.
 * Landing follows the member's config scope �?the same resolvers the resource
 * sync uses (`resolveToolBaseDir` + `scopedToolPaths`), so a relocated tool root
 * (`CLAUDE_CONFIG_DIR`, `CODEX_HOME`) and a tool's user-scope path overrides are
 * honored with no extra handling. This is deliberately NOT `resolveHookScope`,
 * whose command-hook landing stays in HOME.
 */

import path from 'node:path';
import { createHash } from 'node:crypto';
import { readdir } from 'node:fs/promises';
import {
  areTeamHooksDisabled,
  getHooksSharing,
  getTeamaiHome,
  isAgentExcluded,
  resolveToolBaseDir,
  scopedToolPaths,
  type LocalConfig,
  type TeamaiConfig,
} from './types.js';
import { activeEntryNamespaces, entryLayout } from './namespaced-entries.js';
import {
  ensureDir,
  fileHash,
  pathExists,
  readFileSafe,
  readJson,
  remove,
  writeIfChanged,
  writeJson,
} from './utils/fs.js';
import { getUserHome } from './utils/home.js';
import { log } from './utils/logger.js';

/** Directory under the team repo's `hooks/` that holds native artifacts. */
export const NATIVE_HOOK_DIR = 'native';

/** Tools that receive a `.ts` script (native plugin / extension). */
export const NATIVE_TS_TOOLS = ['opencode', 'omp', 'pi'] as const;

/** Tools that receive a `.json` native hooks subtree (merged). */
export const NATIVE_JSON_TOOLS = ['claude', 'codex', 'cursor', 'zcode'] as const;

export type NativeKind = 'ts' | 'json';

const ALL_NATIVE_TOOLS: readonly string[] = [...NATIVE_TS_TOOLS, ...NATIVE_JSON_TOOLS];
const TS_TOOL_SET = new Set<string>(NATIVE_TS_TOOLS);
const JSON_TOOL_SET = new Set<string>(NATIVE_JSON_TOOLS);

/** Marker prefix on a merged Claude entry, so ownership survives a manifest loss. */
export const NATIVE_JSON_MARKER = '[teamai:file:';

/** `nativeHookKind` of `tool`, or null when the tool takes no native artifacts. */
export function nativeHookKind(tool: string): NativeKind | null {
  if (TS_TOOL_SET.has(tool)) return 'ts';
  if (JSON_TOOL_SET.has(tool)) return 'json';
  return null;
}

/** One resolved artifact in the team repo. */
export interface NativeHookFile {
  tool: string;
  kind: NativeKind;
  /** Basename without its extension. */
  id: string;
  /** null for the root, else the active namespace it came from. */
  namespace: string | null;
  /** Repo-relative path (`hooks/native/...`). */
  relativePath: string;
  absolutePath: string;
}

export interface NativeHookResolution {
  files: NativeHookFile[];
  /** Tools whose files did not resolve (a duplicate id); their artifacts are left as-is. */
  failedTools: Set<string>;
  warnings: string[];
}

/**
 * Read `hooks/native/` �?the root tool dirs plus, for each active namespace,
 * `hooks/native/<ns>/<tool>/`. Read-only. A duplicate id for one tool (root vs
 * namespace, or two namespaces) fails that tool alone.
 */
export async function resolveNativeHookFiles(localConfig: LocalConfig): Promise<NativeHookResolution> {
  const warnings: string[] = [];
  const repoPath = localConfig.repo.localPath;
  const rootDir = path.join(repoPath, 'hooks', NATIVE_HOOK_DIR);

  const places: { ns: string | null; dir: string }[] = [{ ns: null, dir: rootDir }];
  const nsResult = await activeEntryNamespaces(localConfig, entryLayout('hooks'));
  if (nsResult.ok && nsResult.active) {
    for (const ns of nsResult.active) {
      if (ALL_NATIVE_TOOLS.includes(ns)) {
        warnings.push(`hooks/native/${ns}: namespace name collides with a tool id; skipped`);
        continue;
      }
      places.push({ ns, dir: path.join(rootDir, ns) });
    }
  }

  const perTool = new Map<string, NativeHookFile[]>();
  for (const place of places) {
    for (const tool of ALL_NATIVE_TOOLS) {
      const kind = nativeHookKind(tool)!;
      const ext = kind === 'ts' ? '.ts' : '.json';
      const toolDir = path.join(place.dir, tool);
      let names: string[];
      try {
        names = await readdir(toolDir);
      } catch {
        continue;
      }
      for (const name of names.sort()) {
        if (name.startsWith('.')) continue;
        if (!name.endsWith(ext)) {
          if (name.endsWith('.ts') || name.endsWith('.json')) {
            warnings.push(`hooks/native/${tool}/${name}: ${tool} takes ${ext} artifacts, not this extension; skipped`);
          }
          continue;
        }
        const id = name.slice(0, -ext.length);
        if (kind === 'ts' && isReservedTsDest(`teamai-${id}.ts`)) {
          warnings.push(`hooks/native/${tool}/${name}: destination collides with a teamai-owned file; skipped`);
          continue;
        }
        const list = perTool.get(tool) ?? [];
        list.push({
          tool,
          kind,
          id,
          namespace: place.ns,
          relativePath: ['hooks', NATIVE_HOOK_DIR, ...(place.ns ? [place.ns] : []), tool, name].join('/'),
          absolutePath: path.join(toolDir, name),
        });
        perTool.set(tool, list);
      }
    }
  }

  const files: NativeHookFile[] = [];
  const failedTools = new Set<string>();
  for (const [tool, list] of perTool) {
    const seen = new Set<string>();
    for (const file of list) {
      if (seen.has(file.id)) {
        warnings.push(
          `hooks/native: duplicate ${nativeHookKind(tool)} hook "${file.id}" for ${tool}; its native hooks were not applied.`,
        );
        failedTools.add(tool);
        break;
      }
      seen.add(file.id);
    }
    if (!failedTools.has(tool)) files.push(...list);
  }

  return { files, failedTools, warnings };
}

/** `teamai-<id>.ts` names teamai owns for its built-in, team-command and agent plugins. */
function isReservedTsDest(name: string): boolean {
  return name === 'teamai-hooks.ts' || name.startsWith('teamai-hook-') || name.startsWith('teamai-agent-');
}

// ─── Manifest ───────────────────────────────────────────────

interface NativeHookRecord {
  tool: string;
  kind: NativeKind;
  id: string;
  namespace: string | null;
  /** Repo-relative source path. */
  source: string;
  /** Absolute destination, for a `ts` copy. */
  dest?: string;
  /** sha256 of the source at the last write (a `ts` copy). */
  hash: string;
  /** The native event-map fragment written, for a `json` merge. */
  fragment?: Record<string, unknown[]>;
}

type NativeManifest = Record<string, NativeHookRecord[]>;

function nativeManifestPath(localConfig: LocalConfig): string {
  return path.join(getTeamaiHome(localConfig.scope, localConfig.projectRoot), 'native-hooks.json');
}

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

// ─── Per-tool destination ───────────────────────────────────

/** The directory a `.ts` artifact lands in for `tool` at the config's scope. */
async function tsPluginDir(tool: string, base: string, scope: 'user' | 'project'): Promise<string | null> {
  if (tool === 'opencode') {
    const { resolveOpencodePluginDir } = await import('./opencode-hooks.js');
    return resolveOpencodePluginDir(base, scope);
  }
  if (tool === 'pi') {
    const { resolvePiExtensionsDir, resolvePiProjectExtensionsDir } = await import('./pi-hooks.js');
    return scope === 'project' ? resolvePiProjectExtensionsDir(base) : resolvePiExtensionsDir();
  }
  if (tool === 'omp') {
    const { resolveOmpExtensionsDir, resolveOmpProjectExtensionsDir } = await import('./omp-hooks.js');
    return scope === 'project' ? resolveOmpProjectExtensionsDir(base) : resolveOmpExtensionsDir();
  }
  return null;
}

/** Whether `tool` is installed at the target scope (so teamai does not grow a config dir). */
async function tsToolInstalled(tool: string, base: string, scope: 'user' | 'project'): Promise<boolean> {
  const home = getUserHome();
  if (tool === 'opencode') {
    return scope === 'user'
      ? pathExists(path.join(home, '.config', 'opencode'))
      : await pathExists(path.join(base, '.opencode')) || await pathExists(path.join(base, 'opencode.json'));
  }
  if (tool === 'omp') {
    return scope === 'user' ? pathExists(path.join(home, '.omp')) : pathExists(path.join(base, '.omp'));
  }
  if (tool === 'pi') {
    return scope === 'user' ? pathExists(path.join(home, '.pi')) : pathExists(path.join(base, '.pi'));
  }
  return false;
}

/** The settings file a `.json` artifact merges into, or null when the tool has none. */
function jsonSettingsPath(teamConfig: TeamaiConfig, localConfig: LocalConfig, tool: string): string | null {
  const paths = scopedToolPaths(teamConfig, localConfig)[tool];
  if (!paths?.settings) return null;
  return path.join(resolveToolBaseDir(tool, localConfig), paths.settings);
}

// ─── JSON merge helpers ─────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Locate (creating) the event-map object a tool merges into. */
function jsonContainer(doc: Record<string, unknown>, tool: string, enable: boolean): Record<string, unknown[]> | null {
  if (tool === 'zcode') {
    const hooks = isPlainObject(doc['hooks']) ? { ...doc['hooks'] } as Record<string, unknown> : {};
    const events = isPlainObject(hooks['events']) ? { ...hooks['events'] } as Record<string, unknown[]> : {};
    hooks['events'] = events;
    // Config-file hooks are off by default in ZCode; force the runner on when
    // installing, but never re-enable on a removal-only reconcile.
    if (enable) hooks['enabled'] = true;
    doc['hooks'] = hooks;
    return events;
  }
  const hooks = isPlainObject(doc['hooks']) ? { ...doc['hooks'] } as Record<string, unknown[]> : {};
  doc['hooks'] = hooks;
  if (tool === 'cursor' && typeof doc['version'] !== 'number') doc['version'] = 1;
  return hooks;
}

/** Parse a `.json` artifact into an event �?entries fragment, or null when malformed. */
function parseFragment(text: string): Record<string, unknown[]> | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isPlainObject(raw)) return null;
  const out: Record<string, unknown[]> = {};
  for (const [event, value] of Object.entries(raw)) {
    if (!Array.isArray(value)) return null;
    out[event] = value;
  }
  return out;
}

/** Transform an entry as it is written for `tool` (Claude gains an ownership marker). */
function transformEntry(tool: string, id: string, entry: unknown): unknown {
  if (tool !== 'claude' || !isPlainObject(entry)) return entry;
  const existing = typeof entry['description'] === 'string' ? entry['description'] : '';
  return { ...entry, description: `${NATIVE_JSON_MARKER}${id}]${existing ? ` ${existing}` : ''}` };
}

/** Remove from `container` the entries a prior fragment contributed, by exact value. */
function stripFragment(
  container: Record<string, unknown[]>,
  fragment: Record<string, unknown[]>,
): boolean {
  let changed = false;
  for (const [event, entries] of Object.entries(fragment)) {
    const current = container[event];
    if (!Array.isArray(current)) continue;
    let next = current;
    for (const entry of entries) {
      const index = next.findIndex((candidate) => JSON.stringify(candidate) === JSON.stringify(entry));
      if (index >= 0) {
        next = [...next.slice(0, index), ...next.slice(index + 1)];
        changed = true;
      }
    }
    if (next.length === 0) delete container[event];
    else container[event] = next;
  }
  return changed;
}

// ─── Reconcile ──────────────────────────────────────────────

export interface NativeReconcileOptions {
  removeAll?: boolean;
  /** With `removeAll`, limit the teardown to these tools (a targeted uninstall). */
  tools?: string[];
  /** `enabledAgents`-or-unset whitelist, as resolved by the caller. */
  filterAgents?: string[];
  auto?: boolean;
  silent?: boolean;
  dryRun?: boolean;
}

/**
 * Deliver (or remove) the team's native hook artifacts for one config scope.
 * Idempotent: a reconcile strips every fragment it previously wrote and merges
 * the current set, writing only on a real change.
 */
export async function reconcileNativeHooks(
  teamConfig: TeamaiConfig,
  localConfig: LocalConfig,
  opts: NativeReconcileOptions = {},
): Promise<void> {
  const manifestPath = nativeManifestPath(localConfig);
  const manifest: NativeManifest = (await readJson<NativeManifest>(manifestPath)) ?? {};
  const scope = localConfig.scope;

  if (opts.removeAll) {
    if (opts.dryRun) return;
    const only = opts.tools ? new Set(opts.tools) : null;
    let changed = false;
    for (const tool of Object.keys(manifest)) {
      if (only && !only.has(tool)) continue;
      await removeDeployedRecords(teamConfig, localConfig, tool, manifest[tool] ?? []);
      delete manifest[tool];
      changed = true;
    }
    if (changed) await writeJson(manifestPath, manifest);
    return;
  }

  if (areTeamHooksDisabled()) {
    log.warn('Team hooks disabled (TEAMAI_HOOKS_DISABLED) �?skipping native hook artifacts');
    return;
  }
  const sharing = getHooksSharing(teamConfig);
  if (opts.auto && sharing.autoApply === false) {
    log.info('Native hook artifacts are pending �?run \'teamai hooks inject\' to apply them (sharing.hooks.autoApply=false)');
    return;
  }

  const enabled = new Set(
    (opts.filterAgents ?? Object.keys(scopedToolPaths(teamConfig, localConfig)))
      .filter((tool) => ALL_NATIVE_TOOLS.includes(tool) && !isAgentExcluded(localConfig, tool)),
  );

  const { files, failedTools, warnings } = await resolveNativeHookFiles(localConfig);
  for (const warning of warnings) log.warn(warning);
  for (const tool of failedTools) enabled.delete(tool);

  const byTool = new Map<string, NativeHookFile[]>();
  for (const file of files) {
    if (!enabled.has(file.tool)) continue;
    byTool.set(file.tool, [...(byTool.get(file.tool) ?? []), file]);
  }

  const applied: string[] = [];
  // Reconcile every enabled tool, even one with no artifacts, so a removed
  // source is torn down from its targets.
  for (const tool of enabled) {
    const desired = byTool.get(tool) ?? [];
    if (desired.length === 0 && !(manifest[tool]?.length)) continue;
    const records = await reconcileTool(
      teamConfig, localConfig, tool, desired, manifest[tool] ?? [], scope, opts.dryRun ?? false,
    );
    if (records.length > 0) manifest[tool] = records;
    else delete manifest[tool];
    for (const file of desired) applied.push(`${file.relativePath}`);
  }

  if (!opts.dryRun) await writeJson(manifestPath, manifest);

  if (applied.length > 0 && !opts.silent) {
    log.info(opts.dryRun
      ? `Would apply ${applied.length} native hook file(s):`
      : `Applied ${applied.length} native hook file(s):`);
    for (const item of applied) log.info(`  [native] ${item}`);
  }
}

/** Reconcile one tool's artifacts; returns the manifest records to keep. */
async function reconcileTool(
  teamConfig: TeamaiConfig,
  localConfig: LocalConfig,
  tool: string,
  desired: NativeHookFile[],
  priorRecords: NativeHookRecord[],
  scope: 'user' | 'project',
  dryRun: boolean,
): Promise<NativeHookRecord[]> {
  const base = resolveToolBaseDir(tool, localConfig);
  const kind = nativeHookKind(tool)!;
  const desiredIds = new Set(desired.map((f) => f.id));

  if (kind === 'ts') {
    if (!(await tsToolInstalled(tool, base, scope))) return pruneRecords(priorRecords, desiredIds);
    const dir = await tsPluginDir(tool, base, scope);
    if (!dir) return priorRecords;
    if (dryRun) return priorRecords;
    await removeDeployedRecords(teamConfig, localConfig, tool, priorRecords.filter((r) => r.kind === 'ts' && !desiredIds.has(r.id)));
    const records: NativeHookRecord[] = [];
    for (const file of desired) {
      const content = await readFileSafe(file.absolutePath);
      if (content === null) continue;
      const dest = path.join(dir, `teamai-${file.id}.ts`);
      const prior = priorRecords.find((r) => r.kind === 'ts' && r.id === file.id);
      if (prior?.dest) {
        const destHash = await fileHash(prior.dest);
        if (destHash && destHash !== prior.hash) {
          log.warn(`Kept ${prior.dest}: you changed it since teamai delivered it.`);
          records.push(prior);
          continue;
        }
      }
      await writeIfChanged(dest, content);
      records.push({
        tool, kind: 'ts', id: file.id, namespace: file.namespace,
        source: file.relativePath, dest, hash: sha256(content),
      });
    }
    return records;
  }

  // json
  const settings = jsonSettingsPath(teamConfig, localConfig, tool);
  if (!settings) return pruneRecords(priorRecords, desiredIds);
  const paths = scopedToolPaths(teamConfig, localConfig)[tool];
  const { isToolInstalledForConfig } = await import('./resources/base.js');
  if (!(await isToolInstalledForConfig(tool, paths.settings!, localConfig))) {
    return pruneRecords(priorRecords, desiredIds);
  }

  const doc: Record<string, unknown> = (await readJson<Record<string, unknown>>(settings)) ?? {};
  const container = jsonContainer(doc, tool, desired.length > 0);
  if (!container) return priorRecords;
  const before = JSON.stringify(doc);

  // Strip everything we previously wrote for this tool, then merge the current set.
  for (const record of priorRecords) {
    if (record.fragment) stripFragment(container, record.fragment);
  }

  const records: NativeHookRecord[] = [];
  for (const file of desired) {
    const text = await readFileSafe(file.absolutePath);
    if (text === null) continue;
    const parsed = parseFragment(text);
    if (parsed === null) {
      log.warn(`${file.relativePath} is not a valid hooks object (expected an object of event arrays) �?skipped`);
      continue;
    }
    const fragment: Record<string, unknown[]> = {};
    for (const [event, entries] of Object.entries(parsed)) {
      const written = entries.map((entry) => transformEntry(tool, file.id, entry));
      container[event] = [...(container[event] ?? []), ...written];
      fragment[event] = written;
    }
    records.push({
      tool, kind: 'json', id: file.id, namespace: file.namespace,
      source: file.relativePath, hash: sha256(text), fragment,
    });
  }

  if (!dryRun) {
    if (JSON.stringify(doc) !== before) {
      await ensureDir(path.dirname(settings));
      await writeJson(settings, doc);
    }
  }
  return records;
}

/** Keep only records whose id is still desired. */
function pruneRecords(priorRecords: NativeHookRecord[], desiredIds: Set<string>): NativeHookRecord[] {
  return priorRecords.filter((r) => desiredIds.has(r.id));
}

/** Remove the deployed artifacts of `records` (a `ts` copy, or a `json` fragment). */
async function removeDeployedRecords(
  teamConfig: TeamaiConfig,
  localConfig: LocalConfig,
  tool: string,
  records: NativeHookRecord[],
): Promise<void> {
  if (records.length === 0) return;
  const kind = nativeHookKind(tool)!;
  if (kind === 'ts') {
    for (const record of records) {
      if (!record.dest) continue;
      const destHash = await fileHash(record.dest);
      if (destHash && destHash !== record.hash) {
        log.warn(`Kept ${record.dest}: you changed it since teamai delivered it.`);
        continue;
      }
      await remove(record.dest);
    }
    return;
  }
  const settings = jsonSettingsPath(teamConfig, localConfig, tool);
  if (!settings) return;
  const doc: Record<string, unknown> = (await readJson<Record<string, unknown>>(settings)) ?? {};
  const container = jsonContainer(doc, tool, false);
  if (!container) return;
  let changed = false;
  for (const record of records) {
    if (record.fragment && stripFragment(container, record.fragment)) changed = true;
  }
  if (changed) await writeJson(settings, doc);
}

/**
 * Diagnostics for `doctor`: the enabled native artifacts that are not delivered
 * on this machine — no manifest record, or (for a `ts` copy) a missing file.
 * Read-only.
 */
export async function missingNativeHookArtifacts(
  teamConfig: TeamaiConfig,
  localConfig: LocalConfig,
): Promise<string[]> {
  const manifest: NativeManifest = (await readJson<NativeManifest>(nativeManifestPath(localConfig))) ?? {};
  const enabled = new Set(
    (localConfig.enabledAgents ?? Object.keys(scopedToolPaths(teamConfig, localConfig)))
      .filter((tool) => ALL_NATIVE_TOOLS.includes(tool) && !isAgentExcluded(localConfig, tool)),
  );
  const { files } = await resolveNativeHookFiles(localConfig);
  const missing: string[] = [];
  for (const file of files) {
    if (!enabled.has(file.tool)) continue;
    const record = (manifest[file.tool] ?? []).find((r) => r.id === file.id);
    if (!record) {
      missing.push(`${file.relativePath} → ${file.tool}`);
    } else if (file.kind === 'ts' && record.dest && !(await pathExists(record.dest))) {
      missing.push(`${file.relativePath} → ${record.dest}`);
    }
  }
  return missing;
}
