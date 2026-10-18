import path from 'node:path';
import { autoDetectInit } from './config.js';
import { getHandler } from './resources/index.js';
import { log } from './utils/logger.js';
import { listFilesRecursive } from './utils/fs.js';
import {
  resolveToolBaseDir,
  scopedToolPaths,
  type GlobalOptions,
  type LocalConfig,
  type ResourceItem,
  type TeamaiConfig,
} from './types.js';

interface LoadedConfig {
  localConfig: LocalConfig;
  teamConfig: TeamaiConfig;
}

/** A team-repo command, as the commands handler describes it. */
interface TeamCommand {
  name: string;
  namespace?: string;
  repoPath: string;
}

/** A command found in one installed tool's commands directory. */
interface LocalCommand {
  name: string;
  tool: string;
  path: string;
}

/**
 * Load the local and team config, reporting a broken or missing setup in
 * English instead of letting the caller trace through an exception.
 * Read-only: the load never persists a migration (#893).
 */
async function loadConfig(): Promise<LoadedConfig | null> {
  try {
    return await autoDetectInit(undefined, { dryRun: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.error(`The teamai config could not be loaded: ${message}`);
    log.dim('Run `teamai init` first to set up the team repo.');
    process.exitCode = 1;
    return null;
  }
}

function teamCommandOf(item: ResourceItem): TeamCommand {
  return { name: item.name, namespace: item.namespace, repoPath: item.relativePath };
}

/** Team commands, sorted by name (`X` and `ns/X` are both valid names). */
async function scanTeamCommands(config: LoadedConfig): Promise<TeamCommand[]> {
  const items = await getHandler('commands').scanTeamForPull(config.teamConfig, config.localConfig);
  return items.map(teamCommandOf).sort((a, b) => a.name.localeCompare(b.name));
}

/** Commands that exist in the commands directory of every tool configured for them. */
async function scanLocalCommands(config: LoadedConfig): Promise<LocalCommand[]> {
  const { localConfig, teamConfig } = config;
  const found: LocalCommand[] = [];
  for (const [tool, paths] of Object.entries(scopedToolPaths(teamConfig, localConfig))) {
    if (!paths.commands) continue;
    const commandsDir = path.join(resolveToolBaseDir(tool, localConfig), paths.commands);
    for (const rel of await listFilesRecursive(commandsDir)) {
      if (!rel.endsWith('.md')) continue;
      found.push({ name: rel.slice(0, -'.md'.length), tool, path: path.join(commandsDir, rel) });
    }
  }
  return found.sort((a, b) => a.tool.localeCompare(b.tool) || a.name.localeCompare(b.name));
}

function teamTag(command: TeamCommand): string {
  return command.namespace ? `[team:${command.namespace}]` : '[team]';
}

/**
 * `teamai commands` / `teamai commands list` — the team repo's commands and
 * the commands already present in each configured local tool directory.
 */
export async function commandsList(options: GlobalOptions & { json?: boolean }): Promise<void> {
  const config = await loadConfig();
  if (!config) return;

  const team = await scanTeamCommands(config);
  const local = await scanLocalCommands(config);

  if (options.json) {
    const commands = [
      ...team.map((c) => ({ name: c.name, source: 'team' as const, namespace: c.namespace, repoPath: c.repoPath })),
      ...local.map((c) => ({ name: c.name, source: 'local' as const, tool: c.tool, path: c.path })),
    ];
    console.log(JSON.stringify({ commands }, null, 2));
    return;
  }

  console.log('=== TEAM COMMANDS ===');
  if (team.length === 0) {
    console.log('  (none)');
  } else {
    for (const c of team) console.log(`  ${c.name}  ${teamTag(c)}`);
  }
  console.log('');

  console.log('=== LOCAL COMMANDS ===');
  if (local.length === 0) {
    console.log('  (none)');
  } else {
    for (const c of local) console.log(`  ${c.name}  [${c.tool}]`);
  }
}

/**
 * `teamai commands show <name>` — print one team command's source, namespace,
 * repo path and the local destination of every tool that receives it.
 * `name` is `X` for a root command and `ns/X` for a namespaced one.
 */
export async function commandsShow(name: string, _options: GlobalOptions): Promise<void> {
  const config = await loadConfig();
  if (!config) return;

  const items = await getHandler('commands').scanTeamForPull(config.teamConfig, config.localConfig);
  const item = items.find((i) => i.name === name);
  if (!item) {
    log.error(`Command "${name}" not found in the team repo.`);
    process.exitCode = 1;
    return;
  }

  console.log('');
  console.log(`  Command    : ${item.name}`);
  console.log(`  Source     : team`);
  if (item.namespace) console.log(`  Namespace  : ${item.namespace}`);
  console.log(`  Repo path  : ${item.relativePath}`);

  const targets = await getHandler('commands').deliveryTargets(config.teamConfig, config.localConfig, item);
  if (targets.length === 0) {
    console.log(`  Installs in : (no installed tool receives it)`);
  } else {
    const [first, ...rest] = targets;
    console.log(`  Installs in : ${first.tool} -> ${first.dest}`);
    for (const t of rest) console.log(`                ${t.tool} -> ${t.dest}`);
  }
  console.log('');
}
