/**
 * Project-root `.gitignore` management for teamai's deployment directories.
 *
 * A project-scope `teamai pull` deploys team resources into each tool's root
 * under the working tree (`.claude/`, `.codex/`, `.cursor/`, …) and keeps its
 * machine-local state in `.teamai/`. Those are not the member's sources — they
 * are regenerated on every pull — so teamai lists them in the project's own
 * `.gitignore`, inside a marker block it owns. Entries are exact (the block is
 * teamai's whole set), so a tool the member stopped using disappears on the
 * next write; everything outside the block is left untouched.
 *
 * Single-repo mode is the exception: there `.teamai/` holds the committed
 * knowledge (`skills/`, `rules/`, `env/`) with its own inner `.gitignore`, so it
 * is never added. The tool roots still are, since they stay deployment output.
 */

import path from 'node:path';
import { KNOWN_AGENTS } from './known-agents.js';
import { projectToolInstallRoot } from './project-agent-root.js';
import { isSelfMode, scopedToolPaths, type LocalConfig, type TeamaiConfig } from './types.js';
import { pathExists, readFileSafe, writeFile } from './utils/fs.js';

export const TOOL_DIRS_BLOCK_START = '# >>> teamai tool dirs (managed by teamai) >>>';
export const TOOL_DIRS_BLOCK_END = '# <<< teamai tool dirs <<<';

/** The marker-delimited block listing `entries`, or '' when there are none. */
export function buildToolDirsBlock(entries: readonly string[]): string {
  if (entries.length === 0) return '';
  return `${TOOL_DIRS_BLOCK_START}\n${entries.join('\n')}\n${TOOL_DIRS_BLOCK_END}\n`;
}

/** The entries inside `text`'s block, or null when it has none. */
export function readToolDirsBlock(text: string): string[] | null {
  const lines = text.split('\n');
  const start = lines.indexOf(TOOL_DIRS_BLOCK_START);
  if (start < 0) return null;
  const end = lines.indexOf(TOOL_DIRS_BLOCK_END, start + 1);
  if (end < 0) return null;
  return lines.slice(start + 1, end);
}

/**
 * `text` with its block set to `entries`; an empty list removes the block.
 * Idempotent: the same entries yield a byte-identical string, so a caller can
 * compare and skip the write.
 */
export function withToolDirsBlock(text: string | null, entries: readonly string[]): string {
  const rest = withoutToolDirsBlock(text ?? '');
  const block = buildToolDirsBlock(entries);
  if (!block) return rest;
  if (!rest) return block;
  return rest.endsWith('\n') ? `${rest}\n${block}` : `${rest}\n\n${block}`;
}

/** `text` without the block (and the single blank separator line above it). */
function withoutToolDirsBlock(text: string): string {
  const lines = text.split('\n');
  const start = lines.indexOf(TOOL_DIRS_BLOCK_START);
  if (start < 0) return text;
  const end = lines.indexOf(TOOL_DIRS_BLOCK_END, start + 1);
  if (end < 0) return text;
  const from = start > 0 && lines[start - 1] === '' ? start - 1 : start;
  return [...lines.slice(0, from), ...lines.slice(end + 1)].join('\n');
}

/** The `.gitignore` entries for the tools in `tools` that deploy under a checkout. */
export function toolDirEntries(
  tools: readonly string[],
  teamConfig: TeamaiConfig | null,
  localConfig: LocalConfig,
): string[] {
  const out: string[] = [];
  for (const tool of tools) {
    const root = projectToolInstallRoot(tool, teamConfig, localConfig);
    if (root) out.push(`${root}/`);
  }
  return [...new Set(out)];
}

/**
 * Every `.gitignore` entry teamai manages for a project: `.teamai/` (except in
 * single-repo mode) followed by the enabled tools' roots. When the member has
 * not chosen tools, `existingToolIds` supplies the candidates.
 */
export function teamaiGitignoreEntries(
  teamConfig: TeamaiConfig | null,
  localConfig: LocalConfig,
  existingToolIds: readonly string[] = [],
): string[] {
  const entries: string[] = [];
  if (!isSelfMode(localConfig)) entries.push('.teamai/');
  const enabled = localConfig.enabledAgents ?? [];
  const tools = enabled.length > 0 ? enabled : existingToolIds;
  entries.push(...toolDirEntries(tools, teamConfig, localConfig));
  return [...new Set(entries)];
}

/** Tools whose install root already exists under the checkout. */
async function existingToolIds(teamConfig: TeamaiConfig | null, localConfig: LocalConfig): Promise<string[]> {
  const root = localConfig.projectRoot as string;
  const candidates = [...new Set([
    ...KNOWN_AGENTS.map((agent) => agent.id),
    ...Object.keys(teamConfig ? scopedToolPaths(teamConfig, localConfig) : {}),
  ])];
  const present: string[] = [];
  for (const tool of candidates) {
    const dir = projectToolInstallRoot(tool, teamConfig, localConfig);
    if (dir && await pathExists(path.join(root, dir))) present.push(tool);
  }
  return present;
}

/**
 * Reconcile the project's root `.gitignore` to the block teamai manages.
 * Returns whether the file changed. No-op outside project scope.
 */
export async function syncProjectToolGitignore(
  teamConfig: TeamaiConfig | null,
  localConfig: LocalConfig,
): Promise<boolean> {
  if (localConfig.scope !== 'project' || !localConfig.projectRoot) return false;
  const existing = (localConfig.enabledAgents?.length ?? 0) > 0
    ? []
    : await existingToolIds(teamConfig, localConfig);
  const entries = teamaiGitignoreEntries(teamConfig, localConfig, existing);
  const file = path.join(localConfig.projectRoot, '.gitignore');
  const current = await readFileSafe(file);
  const next = withToolDirsBlock(current, entries);
  if (next === current || (next === '' && current === null)) return false;
  await writeFile(file, next);
  return true;
}

/** Remove teamai's block from a project's root `.gitignore`. Returns whether it changed. */
export async function removeProjectToolGitignore(projectRoot: string): Promise<boolean> {
  const file = path.join(projectRoot, '.gitignore');
  const current = await readFileSafe(file);
  if (current === null || readToolDirsBlock(current) === null) return false;
  const next = withToolDirsBlock(current, []);
  if (next === current) return false;
  await writeFile(file, next);
  return true;
}
