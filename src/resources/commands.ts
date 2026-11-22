import path from 'node:path';
import fs from 'node:fs/promises';
import { isToolInstalledForConfig, ResourceHandler, type PlacementRecords } from './base.js';
import type { ResourceItem, ResourceItemStatus, DeliveryTarget, TeamaiConfig, LocalConfig } from '../types.js';
import { resolveToolBaseDir, resolveToolPath, isAgentExcluded, scopedToolPaths, SELF_KNOWLEDGE_SCAN_KEY } from '../types.js';
import { listFilesRecursive, pathExists, copyFile, ensureDir, remove, fileContentEqual, getFileMtime, fileHash } from '../utils/fs.js';
import { log } from '@teamai/shared/log';
import { assertWithinRoot } from '../utils/path-safety.js';
import { loadStateForScope } from '../config.js';
import { resolveResourceNamespaces } from '../resource-namespaces.js';
import { placedResourcePath } from '../push-namespaces.js';
import { isLink, keepsEditedCopy, keepsTrackedCopy, recordDelivered, removeDelivered, type DeliveryLedger } from './delivered-copies.js';

// ─── Commands handler ───────────────────────────────────
//
//  A command is a single Markdown file (`commands/<name>.md`, or
//  `commands/<namespace>/<name>.md`) delivered to every installed tool with a
//  commands directory (Claude Code, Cursor, CodeBuddy, OpenCode). The file is
//  copied verbatim: unlike rules there is no per-tool format, and unlike skills
//  a command is one file rather than a directory.
//
//  The namespace selects who receives a command; it is not part of the name a
//  tool sees. Every command lands flat in the tool's commands directory, so
//  `commands/frontend/deploy.md` is delivered as `commands/deploy.md`.

const COMMANDS_DIR = 'commands';
const MD = '.md';

const flatName = (name: string): string => path.posix.basename(name);

export class CommandsHandler extends ResourceHandler {
  readonly type = 'commands' as const;

  async scanTeamForPull(_teamConfig: TeamaiConfig, localConfig: LocalConfig): Promise<ResourceItem[]> {
    const commandsDir = path.join(localConfig.repo.localPath, COMMANDS_DIR);

    if (!await pathExists(commandsDir)) return [];
    const items: ResourceItem[] = [];

    for (const file of await listFilesRecursive(commandsDir)) {
      if (!file.endsWith(MD)) continue;
      const segments = file.slice(0, -MD.length).split('/');

      // Root command, or one namespace level. A deeper path is not a command.
      if (segments.length > 2) continue;
      const name = segments.join('/');
      const namespace = segments.length === 2 ? segments[0] : undefined;
      items.push({
        name,
        type: 'commands',
        sourcePath: path.join(commandsDir, file),
        relativePath: `${COMMANDS_DIR}/${file}`,
        ...(namespace ? { namespace } : {}),
      });
    }

    return items;
  }

  async scanLocalForPush(teamConfig: TeamaiConfig, localConfig: LocalConfig): Promise<ResourceItem[]> {
    const teamItems = await this.scanTeamForPull(teamConfig, localConfig);
    const teamByName = new Map(teamItems.map((item) => [item.name, item]));
    const tombstones = await this.readTombstones(localConfig);
    const placedCommands = (await loadStateForScope(localConfig)).placedCommands;
    const activeKnowledge = (await resolveResourceNamespaces(localConfig))?.activeNamespaces.knowledge;

    const candidates = new Map<string, {
      sourcePath: string; mtime: number; status: ResourceItemStatus; relativePath: string; namespace?: string;
    }>();

    for (const [tool, toolPath] of Object.entries(scopedToolPaths(teamConfig, localConfig))) {
      if (!toolPath.commands) continue;

      // The single-repo scan source is not a tool; an excluded tool's copy is
      // not one we write, so it is not a push source either.
      if (tool !== SELF_KNOWLEDGE_SCAN_KEY && isAgentExcluded(localConfig, tool)) continue;
      const commandsDir = resolveToolPath(resolveToolBaseDir(tool, localConfig), toolPath.commands);

      if (!await pathExists(commandsDir)) continue;

      for (const file of await listFilesRecursive(commandsDir)) {
        if (!file.endsWith(MD)) continue;
        const localName = file.slice(0, -MD.length);

        if (tombstones.has(localName)) continue;

        // The author's root copy of a command published into a namespace maps
        // back to its team file through the placement record, not its basename.
        const placed = localName.includes('/')
          ? null
          : placedResourcePath(placedCommands, COMMANDS_DIR, localName);

        const placedName = placed ? placed.slice(COMMANDS_DIR.length + 1, -MD.length) : null;
        const localFilePath = path.join(commandsDir, file);
        // A command delivered from a namespace keeps only its file name here.
        // Its namespace file replaces the root command of the same name, so an
        // active namespace's file is what the copy came from.
        const sameFlat = localName.includes('/') ? [] : teamItems.filter((item) => flatName(item.name) === localName);
        const activeFlat = sameFlat.filter((item) => item.namespace !== undefined && activeKnowledge?.includes(item.namespace));

        const teamItem = placedName !== null
          ? teamByName.get(placedName)
          : activeFlat.length === 1 ? activeFlat[0] : teamByName.get(localName) ?? (sameFlat.length === 1 ? sameFlat[0] : undefined);

        const teamName = teamItem?.name ?? placedName ?? localName;

        if (teamItem) {
          if (await fileContentEqual(localFilePath, teamItem.sourcePath)) continue;
          const mtime = await getFileMtime(localFilePath);
          const existing = candidates.get(teamName);

          if (!existing || mtime > existing.mtime) {
            candidates.set(teamName, {
              sourcePath: localFilePath,
              mtime,
              status: 'modified',
              relativePath: `${COMMANDS_DIR}/${teamName}${MD}`,
              ...(teamItem.namespace ? { namespace: teamItem.namespace } : {}),
            });
          }
        } else {
          const mtime = await getFileMtime(localFilePath);
          const existing = candidates.get(localName);

          if (!existing || (existing.status === 'new' && mtime > existing.mtime)) {
            candidates.set(localName, {
              sourcePath: localFilePath,
              mtime,
              status: 'new',
              relativePath: `${COMMANDS_DIR}/${localName}${MD}`,
            });
          }
        }
      }
    }

    return [...candidates.entries()].map(([name, candidate]) => ({
      name,
      type: 'commands',
      sourcePath: candidate.sourcePath,
      relativePath: candidate.relativePath,
      status: candidate.status,
      ...(candidate.namespace ? { namespace: candidate.namespace } : {}),
    }));
  }

  async pushItem(item: ResourceItem, _teamConfig: TeamaiConfig, localConfig: LocalConfig): Promise<void> {
    const commandsRoot = path.join(localConfig.repo.localPath, COMMANDS_DIR);
    const dest = path.resolve(localConfig.repo.localPath, item.relativePath);
    assertWithinRoot(commandsRoot, dest, `Invalid command destination outside team repo commands directory: ${item.relativePath}`);
    await ensureDir(path.dirname(dest));
    await copyFile(item.sourcePath, dest);
    log.debug(`Copied command ${item.name} -> team repo`);
  }

  async deliveryTargets(teamConfig: TeamaiConfig, localConfig: LocalConfig, item: ResourceItem): Promise<DeliveryTarget[]> {
    const toolRel = `${flatName(item.name)}${MD}`;
    const targets: DeliveryTarget[] = [];

    for (const [tool, toolPath] of Object.entries(scopedToolPaths(teamConfig, localConfig))) {
      if (!toolPath.commands) continue;

      if (isAgentExcluded(localConfig, tool)) continue;

      if (!await isToolInstalledForConfig(tool, toolPath.commands, localConfig)) continue;
      targets.push({
        tool,
        dest: resolveToolPath(resolveToolBaseDir(tool, localConfig), toolPath.commands, toolRel),
      });
    }

    return targets;
  }

  async pullItem(item: ResourceItem, teamConfig: TeamaiConfig, localConfig: LocalConfig, ledger?: DeliveryLedger): Promise<void> {
    for (const target of await this.deliveryTargets(teamConfig, localConfig, item)) {
      const { tool, dest } = target;

      try {
        if (ledger && await keepsEditedCopy(ledger, item, target)) continue;
        await ensureDir(path.dirname(dest));
        await copyFile(item.sourcePath, dest);

        if (ledger) await recordDelivered(ledger.hashes, dest);
        log.debug(`Synced command ${item.name} -> ${tool}`);
      } catch (e) {
        log.warn(`Failed to sync command ${item.name} to ${tool}: ${(e as Error).message}`);
      }
    }
  }

  /**
   * Remove the copies the namespace layout left in a tool's commands
   * directory: `<ns>/<name>.md` from before commands were delivered flat, and
   * the flat copy of a command whose namespace is no longer active. Only a
   * copy teamai recorded delivering, unchanged since, goes; a member's edit
   * or an untracked file stays.
   */
  async cleanupInactiveNamespaces(
    teamConfig: TeamaiConfig,
    localConfig: LocalConfig,
    activeNamespaces: readonly string[],
    ledger?: DeliveryLedger,
  ): Promise<void> {
    const items = await this.scanTeamForPull(teamConfig, localConfig);
    const namespaced = items.filter((item) => item.namespace !== undefined);

    if (namespaced.length === 0 || !ledger?.previous) return;

    const deliveredFlat = new Set(items
      .filter((item) => item.namespace === undefined || activeNamespaces.includes(item.namespace))
      .map((item) => flatName(item.name)));

    for (const [tool, toolPath] of Object.entries(scopedToolPaths(teamConfig, localConfig))) {
      if (!toolPath.commands || isAgentExcluded(localConfig, tool)) continue;
      const commandsDir = resolveToolPath(resolveToolBaseDir(tool, localConfig), toolPath.commands);

      for (const item of namespaced) {
        const flat = flatName(item.name);

        if (await this.removeRecordedCopy(ledger, path.join(commandsDir, `${item.name}${MD}`))) {
          log.debug(`Removed the namespace copy of command ${item.name} from ${tool}`);
        }

        if (!deliveredFlat.has(flat) && await this.removeRecordedCopy(ledger, path.join(commandsDir, `${flat}${MD}`))) {
          log.debug(`Removed command ${flat} from ${tool}: its namespace is not active`);
        }
      }

      for (const namespace of new Set(namespaced.flatMap((item) => item.namespace === undefined ? [] : [item.namespace]))) {
        try {
          await fs.rmdir(path.join(commandsDir, namespace));
        } catch {
          // Not empty, or already gone.
        }
      }
    }
  }

  private async removeRecordedCopy(ledger: DeliveryLedger, file: string): Promise<boolean> {
    if (ledger.previous?.[file] === undefined) return false;

    if (await isLink(file) || await keepsTrackedCopy(file)) return false;

    if (await fileHash(file) !== ledger.previous[file]) return false;

    await removeDelivered(ledger, file);

    return true;
  }

  async removeItem(name: string, teamConfig: TeamaiConfig, localConfig: LocalConfig): Promise<string[]> {
    const removed: string[] = [];
    const teamFile = path.join(localConfig.repo.localPath, COMMANDS_DIR, `${name}${MD}`);

    if (await pathExists(teamFile)) {
      await remove(teamFile);
      removed.push(teamFile);
    }

    await this.addTombstone(name, localConfig);

    for (const [tool, toolPath] of Object.entries(scopedToolPaths(teamConfig, localConfig))) {
      if (!toolPath.commands) continue;

      if (isAgentExcluded(localConfig, tool)) continue;
      const localFile = resolveToolPath(resolveToolBaseDir(tool, localConfig), toolPath.commands, `${flatName(name)}${MD}`);

      if (await pathExists(localFile)) {
        await remove(localFile);
        removed.push(localFile);
        log.debug(`Removed command ${name} from ${tool}`);
      }
    }

    return removed;
  }

  async publishedNameFor(name: string, localConfig: LocalConfig, records: PlacementRecords): Promise<string | null> {
    const placed = placedResourcePath(records.placedCommands, COMMANDS_DIR, name);

    if (!placed) return null;

    if (!await pathExists(path.join(localConfig.repo.localPath, placed))) return null;

    return placed.slice(COMMANDS_DIR.length + 1, -MD.length);
  }
}
