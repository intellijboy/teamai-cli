/**
 * OpenCode hook injection.
 *
 * Unlike every other agent teamai targets, OpenCode has no settings.json-style
 * shell-command hook list. Instead it auto-loads JS/TS *plugins* — the config
 * loader scans `{plugin,plugins}/*.{ts,js}` under each `.opencode` dir (project
 * scope) and `~/.config/opencode` (user scope). A plugin is a module exporting a
 * function that returns a `Hooks` object; teamai subscribes to OpenCode's own
 * events and shells out to the same `teamai hook-dispatch` entry point every
 * other agent uses.
 *
 * Event mapping (OpenCode → teamai dispatch), chosen to mirror the Claude
 * built-in hook set as closely as OpenCode's event model allows:
 *   - `session.created`     → session-start  (report / sync / ack)
 *   - `session.idle`        → stop           (update / votes / contribute)
 *   - `chat.message`        → prompt-submit   (track-slash / dashboard)
 *   - `tool.execute.after`  → post-tool-use   (dashboard; matcher-scoped track)
 *
 * The generated plugin is fire-and-forget: OpenCode's `event` hook has no
 * channel to inject a hook's stdout back into the session, so — like the Hermes
 * and OpenClaw adapters — teamai runs the dispatch for its side effects and
 * never blocks the agent. Node's child-process errors are swallowed.
 */

import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { writeFile, writeIfChanged, ensureDir, pathExists, remove } from './utils/fs.js';
import { log } from './utils/logger.js';

/** Plugin directory name under an OpenCode config dir. OpenCode scans both
 *  `plugin/` and `plugins/`; we use the singular, matching the docs examples. */
export const OPENCODE_PLUGIN_DIR = 'plugin';

/** Filename of the teamai-managed OpenCode plugin. */
export const OPENCODE_HOOK_FILE = 'teamai-hooks.ts';

/** Filename prefix of a per-team-hook OpenCode plugin (`teamai-hook-<id>.ts`).
 *  Distinct from the agent-hook prefix (`teamai-agent-`) so the built-in hook
 *  removal and the agent-hook removal never touch each other's files. */
export const TEAM_HOOK_FILE_PREFIX = 'teamai-hook-';

/** Marker so `teamai doctor` / `uninstall` can recognize our generated plugin. */
const TEAMAI_MARKER = '[teamai]';

/**
 * Resolve the plugin directory for an OpenCode scope.
 *
 * - project scope: `<baseDir>/.opencode/plugin`
 * - user scope:    `<baseDir>/.config/opencode/plugin`
 *
 * (baseDir is the repo root in project scope and $HOME in user scope, matching
 * how teamai resolves every other OpenCode path.)
 */
export function resolveOpencodePluginDir(baseDir: string, scope: 'project' | 'user'): string {
  const configDir = scope === 'project' ? '.opencode' : path.join('.config', 'opencode');
  return path.join(baseDir, configDir, OPENCODE_PLUGIN_DIR);
}

/**
 * Build the teamai OpenCode plugin source.
 *
 * The plugin subscribes to OpenCode events and shells out to `teamai
 * hook-dispatch <event> --tool opencode [--matcher <m>]`, feeding the same JSON
 * payload on STDIN that every other agent's hooks send (`cwd`, `tool_name`,
 * `tool_input`, `prompt`). It uses Node's `child_process.spawn` with
 * `windowsHide: true` so a missing `teamai` binary or a non-zero exit never
 * surfaces as an error inside the agent session or opens a console window.
 *
 * Two OpenCode-specific bridges are required:
 *   - STDIN payload: hook-dispatch's track / track-slash / todowrite-hint
 *     handlers read `tool_name` / `tool_input` / `prompt` off STDIN, and the
 *     provider-config gate reads `cwd` to pick the project-scope config. Without
 *     a payload those handlers no-op and project gating falls back to the user
 *     config. We forward the plugin's `directory` as `cwd` plus the per-event
 *     fields. For recall attribution (#884) every event also carries the host's
 *     `session_id`, and PostToolUse the tool's output (`tool_response`), a
 *     normalized `tool_status`, and for a `task` call the `session_link` from
 *     the subagent's child session to its parent. `shell.env` names the session
 *     in the bash tool's environment (`TEAMAI_AGENT_SESSION_ID`).
 *   - Tool-id casing: OpenCode passes lowercase tool ids (`skill`, `todowrite`),
 *     but the handler registry keys matchers on Claude's PascalCase names
 *     (`Skill`, `TodoWrite`). We map the id back before dispatching a
 *     matcher-scoped pass.
 */
/**
 * How the generated plugin re-invokes the teamai CLI.
 *
 * Resolved at inject time and embedded verbatim so the plugin never depends on
 * `teamai` being on the host's PATH: with a resolved entry we spawn the Node
 * binary directly (`node <dist/index.js> hook-dispatch …`); only when the entry
 * cannot be resolved do we fall back to the bare `teamai` command.
 */
export interface TeamaiCliInvocation {
  /** Executable to spawn: an absolute Node path, or `teamai` as a last-resort fallback. */
  command: string;
  /** Fixed argv prefix (the CLI entry script path); empty for the `teamai` fallback. */
  argsPrefix: string[];
  /** Whether the spawn needs a shell (true only for the bare `teamai` fallback on Windows). */
  shell: boolean;
}

export function buildPluginSource(invocation: TeamaiCliInvocation = {
  command: 'teamai',
  argsPrefix: [],
  shell: process.platform === 'win32',
}): string {
  return `// ${TEAMAI_MARKER} hooks plugin — generated by teamai, do not edit by hand.
//
// Bridges OpenCode's plugin events to \`teamai hook-dispatch\`, mirroring the
// Claude built-in hook set. Feeds the same STDIN JSON payload other agents send
// so the track / hint handlers and project-scope gating work. Errors are
// swallowed; OpenCode cannot inject a hook's stdout back into the session, so
// this runs the dispatch purely for its side effects (status report / sync /
// update).
//
// NOTE: OpenCode awaits its named hooks (chat.message, tool.execute.after), so
// the dispatch is not truly fire-and-forget for those two — see the timeout
// note below.

/** OpenCode lowercase tool ids → Claude PascalCase matcher names. */
const TOOL_MATCHER = { skill: 'Skill', todowrite: 'TodoWrite' };

/** A host field read defensively: a non-empty string, or undefined. */
const nonEmpty = (value) => (typeof value === 'string' && value ? value : undefined);

/** How to re-invoke the teamai CLI (resolved at inject time; no PATH reliance). */
const CLI_COMMAND = ${JSON.stringify(invocation.command)};
const CLI_ARGS_PREFIX = ${JSON.stringify(invocation.argsPrefix)};
const CLI_SHELL = ${JSON.stringify(invocation.shell)};

/** @param {{ directory?: string, worktree?: string }} ctx */
export const TeamaiHooks = async ({ directory, worktree }) => {
  const cwd = directory || worktree;
  // Dispatch one hook event, forwarding a JSON payload on STDIN. \`payload\`
  // fields (cwd / tool_name / tool_input / prompt) match what hook-dispatch's
  // handlers read; \`matcher\` scopes PostToolUse handlers (Skill / TodoWrite).
  const dispatch = async (event, matcher, payload) => {
    try {
      const args = [...CLI_ARGS_PREFIX, 'hook-dispatch', event, '--tool', 'opencode'];
      if (matcher) {
        args.push('--matcher', matcher);
      }
      const stdin = JSON.stringify({ cwd, ...(payload || {}) });
      const { spawn } = await import('node:child_process');
      await new Promise((resolve) => {
        const child = spawn(CLI_COMMAND, args, {
          shell: CLI_SHELL,
          windowsHide: true,
          stdio: ['pipe', 'ignore', 'ignore'],
        });
        const finish = () => {
          child.removeListener('error', finish);
          child.removeListener('close', finish);
          resolve();
        };
        child.once('error', finish);
        child.once('close', finish);
        child.stdin.write(stdin);
        child.stdin.end();
      });
    } catch {
      // never block the agent
    }
  };

  return {
    // Lifecycle events name their session in event.properties: sessionID, or
    // on an older host's session.created only the session info.
    event: async ({ event }) => {
      const props = (event && event.properties) || {};
      const session = { session_id: nonEmpty(props.sessionID) || nonEmpty(props.info && props.info.id) };
      if (event.type === 'session.created') {
        await dispatch('session-start', undefined, session);
      } else if (event.type === 'session.idle') {
        await dispatch('stop', undefined, session);
      }
    },
    // A new user message maps to Claude's UserPromptSubmit. The prompt text
    // lives in output.parts (text parts); forward it so track-slash can see
    // slash-command usage.
    'chat.message': async (input, output) => {
      let prompt = '';
      const parts = (output && output.parts) || [];
      for (const part of parts) {
        if (part && part.type === 'text' && typeof part.text === 'string') {
          prompt += part.text;
        }
      }
      await dispatch('prompt-submit', undefined, { session_id: nonEmpty(input && input.sessionID), prompt });
    },
    // Fires after every tool call. Dispatch the wildcard matcher always, plus a
    // matcher-scoped pass so Skill / TodoWrite handlers can fire. input.tool is
    // the lowercase OpenCode tool id; input.args is the tool input; output.output
    // is what the model saw. There is no error flag: only bash reports an exit
    // code, so any other tool's status is unknown. A task call names the
    // child session its subagent ran in, which links it to this session.
    'tool.execute.after': async (input, output) => {
      const tool = (input && input.tool) || '';
      const matcher = TOOL_MATCHER[tool];
      const metadata = (output && output.metadata) || {};
      const exit = tool === 'bash' ? metadata.exit : undefined;
      const payload = {
        session_id: nonEmpty(input && input.sessionID),
        tool_name: matcher || tool,
        tool_input: (input && input.args) || {},
        tool_response: typeof (output && output.output) === 'string' ? output.output : undefined,
        tool_status: typeof exit === 'number' ? (exit === 0 ? 'success' : 'failure') : 'unknown',
      };
      const child = tool === 'task' ? nonEmpty(metadata.sessionId) : undefined;
      const parent = nonEmpty(metadata.parentSessionId) || payload.session_id;
      if (child && parent) {
        payload.session_link = { child, parent };
      }
      await dispatch('post-tool-use', undefined, payload);
      if (matcher) {
        await dispatch('post-tool-use', matcher, payload);
      }
    },
    // Names the session in the bash tool's environment, so teamai recall
    // run there records its run under the session its hooks carry.
    'shell.env': async (input, output) => {
      const session = nonEmpty(input && input.sessionID);
      if (session && output && output.env) {
        output.env.TEAMAI_AGENT_SESSION_ID = session;
      }
    },
  };
};
`;
}

/**
 * Resolve how the generated OpenCode plugin should re-invoke the teamai CLI.
 *
 * Prefer an absolute `node <entry>` pair so the plugin never depends on
 * `teamai` being on the host's PATH (the bare command failed under OpenCode,
 * whose subprocess PATH often lacks `~/.teamai/bin`). Falls back to the bare
 * `teamai` command only when the CLI entry cannot be resolved.
 */
async function resolveCliInvocation(): Promise<TeamaiCliInvocation> {
  try {
    const { resolveCliEntry } = await import('./builtin-hooks.js');
    const entry = resolveCliEntry();
    if (entry) {
      return { command: process.execPath, argsPrefix: [entry], shell: false };
    }
  } catch {
    /* fall through to the bare command */
  }
  return { command: 'teamai', argsPrefix: [], shell: process.platform === 'win32' };
}

/**
 * Inject (or refresh) the teamai OpenCode plugin for a scope.
 * Idempotent — writes and reports the plugin file only when its content changes.
 */
export async function injectOpencodeHooks(baseDir: string, scope: 'project' | 'user'): Promise<void> {
  const file = path.join(resolveOpencodePluginDir(baseDir, scope), OPENCODE_HOOK_FILE);
  if (await writeIfChanged(file, buildPluginSource(await resolveCliInvocation()))) {
    log.success(`Injected teamai OpenCode hook into ${file}`);
  } else {
    log.debug(`teamai OpenCode hook already up-to-date in ${file}`);
  }
}

/** Remove the teamai OpenCode plugin for a scope if present. */
export async function removeOpencodeHooks(baseDir: string, scope: 'project' | 'user'): Promise<void> {
  const dir = resolveOpencodePluginDir(baseDir, scope);
  const file = path.join(dir, OPENCODE_HOOK_FILE);
  if (await pathExists(file)) {
    await remove(file);
    log.success(`Removed teamai OpenCode hook from ${file}`);
  }
}

/**
 * Reject slugs that could escape the plugin directory when used as a filename.
 * Agent-hook slugs come from the backend command and are not otherwise
 * validated on the OpenCode path (skill / rule slugs go through validateSlug in
 * local-agent), so a slug like `../../evil` would write outside the plugin dir.
 */
function assertSafeSlug(slug: string): void {
  if (!slug || slug.includes('/') || slug.includes('\\') || slug.includes('..') || path.isAbsolute(slug)) {
    throw new Error(`Invalid agent-hook slug: ${slug}`);
  }
}

/** Map Claude PascalCase agent-hook events → OpenCode plugin event dispatch. */
const CLAUDE_TO_OPENCODE_EVENTS: Record<string, string> = {
  SessionStart: 'session.created',
  Stop: 'session.idle',
  UserPromptSubmit: 'chat.message',
  PostToolUse: 'tool.execute.after',
};

/**
 * Build an agent-hook plugin source that runs a fixed shell `command` on a
 * single OpenCode event. Used by the HTTP-source agent-hook pipeline (issue
 * #238) so an enterprise-pushed hook installs as a real OpenCode plugin rather
 * than silently landing in a Claude settings file OpenCode never reads.
 *
 * `matcher` scopes a `tool.execute.after` hook to a single tool (e.g. only run
 * after the Bash tool). OpenCode passes lowercase tool ids while matchers use
 * Claude's PascalCase names, so the generated gate compares case-insensitively.
 * A missing or `*` matcher runs on every tool call. For non-tool events the
 * matcher has no meaning and is ignored.
 */
export function buildAgentHookPluginSource(
  slug: string,
  ocEvent: string,
  command: string,
  matcher?: string,
  shellCommand: string = 'bash',
): string {
  const scoped = ocEvent === 'tool.execute.after' && !!matcher && matcher !== '*';
  let body: string;
  if (ocEvent === 'tool.execute.after') {
    // Tool hook: optionally gate on the tool id (case-insensitive).
    body = scoped
      ? `  return {
    "tool.execute.after": async (input) => {
      const tool = (input && input.tool) || '';
      if (tool.toLowerCase() === ${JSON.stringify(matcher!.toLowerCase())}) { await run(); }
    },
  };`
      : `  return {
    "tool.execute.after": async () => { await run(); },
  };`;
  } else if (ocEvent === 'chat.message') {
    body = `  return {
    "chat.message": async () => { await run(); },
  };`;
  } else {
    // session.* events arrive via the generic `event` hook (event.type).
    body = `  return {
    event: async ({ event }) => {
      if (event.type === ${JSON.stringify(ocEvent)}) { await run(); }
    },
  };`;
  }
  return `// ${TEAMAI_MARKER} agent hook [${slug}] — generated by teamai, do not edit by hand.
/** @param {{ $: any }} ctx */
export const TeamaiAgentHook_${slug.replace(/[^A-Za-z0-9_]/g, '_')} = async ({ $ }) => {
  // The resolved shell interprets the command: an absolute Git Bash path on
  // Windows (there is no sh, and a bare bash resolves to the WSL launcher).
  const SHELL_COMMAND = ${JSON.stringify(shellCommand)};
  const COMMAND = ${JSON.stringify(command)};
  const run = async () => {
    try {
      // .quiet() suppresses output; .nothrow() keeps a non-zero exit from
      // throwing into the agent session. Fire-and-forget — never blocks.
      await $\`\${SHELL_COMMAND} -lc \${COMMAND}\`.quiet().nothrow();
    } catch {
      // never block the agent
    }
  };
${body}
};
`;
}

/**
 * Install a server-pushed agent hook as an OpenCode plugin file.
 * Events with no OpenCode equivalent are logged and skipped.
 */
export async function applyOpencodeAgentHook(def: {
  slug: string;
  event: string;
  command: string;
  baseDir: string;
  scope: 'project' | 'user';
  matcher?: string;
}): Promise<void> {
  assertSafeSlug(def.slug);
  const ocEvent = CLAUDE_TO_OPENCODE_EVENTS[def.event];
  if (!ocEvent) {
    log.warn(`OpenCode does not support event "${def.event}" — skipping hook [${def.slug}]`);
    return;
  }
  const dir = resolveOpencodePluginDir(def.baseDir, def.scope);
  await ensureDir(dir);
  const file = path.join(dir, `teamai-agent-${def.slug}.ts`);
  const { resolveHookShell } = await import('./builtin-hooks.js');
  const shell = resolveHookShell();
  await writeFile(file, buildAgentHookPluginSource(def.slug, ocEvent, def.command, def.matcher, shell.command));
  log.success(`Installed OpenCode agent hook [${def.slug}] in ${file}`);
}

/** Remove a server-pushed agent-hook plugin file for OpenCode. */
export async function removeOpencodeAgentHook(opts: {
  slug: string;
  baseDir: string;
  scope: 'project' | 'user';
}): Promise<void> {
  assertSafeSlug(opts.slug);
  const dir = resolveOpencodePluginDir(opts.baseDir, opts.scope);
  const file = path.join(dir, `teamai-agent-${opts.slug}.ts`);
  if (await pathExists(file)) {
    await remove(file);
    log.success(`Removed OpenCode agent hook [${opts.slug}] from ${file}`);
  }
}

/** A team hook (from `hooks/hooks.yaml`) projected onto OpenCode's event model. */
export interface TeamHookForOpencode {
  key: string;
  event: string;
  command: string;
  matcher?: string;
}

/**
 * Build a team-hook plugin source that runs a fixed shell `command` on a single
 * OpenCode event. The command runs through OpenCode's Bun shell with the
 * project directory as cwd, so relative paths resolve as the member expects.
 * Fire-and-forget: output is suppressed and a non-zero exit never throws into
 * the session.
 *
 * A hook delivered at project scope only runs when the host's `directory`
 * matches that project — checked in JS (normalized separators + case) rather
 * than with the settings tools' `$PWD` shell gate, because on Windows the host's
 * shell reports a POSIX/WSL path that never equaled the gate's Windows path.
 *
 * This is the counterpart of `buildAgentHookPluginSource` for hooks declared in
 * `hooks/hooks.yaml`; OpenCode is the one tool whose adapter must translate
 * those into plugins instead of settings entries.
 */
export function buildTeamHookPluginSource(
  id: string,
  ocEvent: string,
  command: string,
  matcher?: string,
  projectRoot?: string,
  shellCommand: string = 'bash',
): string {
  const scoped = ocEvent === 'tool.execute.after' && !!matcher && matcher !== '*';
  let body: string;
  if (ocEvent === 'tool.execute.after') {
    body = scoped
      ? `  return {
    "tool.execute.after": async (input) => {
      const tool = (input && input.tool) || '';
      if (tool.toLowerCase() === ${JSON.stringify(matcher!.toLowerCase())}) { await run(); }
    },
  };`
      : `  return {
    "tool.execute.after": async () => { await run(); },
  };`;
  } else if (ocEvent === 'chat.message') {
    body = `  return {
    "chat.message": async () => { await run(); },
  };`;
  } else {
    body = `  return {
    event: async ({ event }) => {
      if (event.type === ${JSON.stringify(ocEvent)}) { await run(); }
    },
  };`;
  }
  return `// ${TEAMAI_MARKER} team hook [${id}] — generated by teamai, do not edit by hand.
/** @param {{ $: any, directory?: string, worktree?: string }} ctx */
export const TeamaiTeamHook_${id.replace(/[^A-Za-z0-9_]/g, '_')} = async ({ $, directory, worktree }) => {
  const cwd = directory || worktree;
  // The resolved shell interprets the command: an absolute Git Bash path on
  // Windows (there is no sh, and a bare bash resolves to the WSL launcher).
  const SHELL_COMMAND = ${JSON.stringify(shellCommand)};
  const COMMAND = ${JSON.stringify(command)};
  // Project gate, in JS so it survives Windows' POSIX-looking host cwd.
  const PROJECT_ROOT = ${JSON.stringify(projectRoot ?? '')};
  const normalize = (value) => {
    const BACKSLASH = String.fromCharCode(92);
    let out = '';
    for (const ch of String(value || '')) out += ch === BACKSLASH ? '/' : ch;
    while (out.endsWith('/')) out = out.slice(0, -1);
    return out.toLowerCase();
  };
  const underProject = () => {
    if (!PROJECT_ROOT || !cwd) return true;
    const root = normalize(PROJECT_ROOT);
    const dir = normalize(cwd);
    return dir === root || dir.startsWith(root + '/');
  };
  const run = async () => {
    try {
      if (!underProject()) return;
      // .quiet() hides output; .nothrow() keeps a non-zero exit from throwing.
      let shell = $\`\${SHELL_COMMAND} -lc \${COMMAND}\`;
      if (cwd) shell = shell.cwd(cwd);
      await shell.quiet().nothrow();
    } catch {
      // never block the agent
    }
  };
${body}
};
`;
}

/** List the team-hook ids that currently have a generated plugin file. */
async function listTeamHookIds(dir: string): Promise<string[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }
  return names
    .filter((n) => n.startsWith(TEAM_HOOK_FILE_PREFIX) && n.endsWith('.ts'))
    .map((n) => n.slice(TEAM_HOOK_FILE_PREFIX.length, -'.ts'.length));
}

/**
 * Write one plugin per team hook for a scope and delete the files of hooks that
 * are no longer declared (so removing a hook from `hooks/hooks.yaml` removes it
 * from OpenCode on the next pull). Events OpenCode cannot express are skipped
 * with a warning, matching `teamai hooks list`'s honesty about coverage.
 */
export async function syncOpencodeTeamHooks(
  defs: TeamHookForOpencode[],
  baseDir: string,
  scope: 'project' | 'user',
  projectRoot?: string,
): Promise<void> {
  const dir = resolveOpencodePluginDir(baseDir, scope);
  const desired = new Map<string, { ocEvent: string; command: string; matcher?: string }>();
  for (const def of defs) {
    const ocEvent = CLAUDE_TO_OPENCODE_EVENTS[def.event];
    if (!ocEvent) {
      log.warn(`OpenCode does not support event "${def.event}" — skipping team hook [${def.key}]`);
      continue;
    }
    desired.set(def.key, { ocEvent, command: def.command, matcher: def.matcher });
  }
  if (desired.size > 0) {
    // Resolve the shell only when a team hook actually applies, so a machine
    // without Git Bash is refused only for hooks that need it (and loudly).
    const { resolveHookShell } = await import('./builtin-hooks.js');
    const shell = resolveHookShell();
    await ensureDir(dir);
    for (const [id, d] of desired) {
      const file = path.join(dir, `${TEAM_HOOK_FILE_PREFIX}${id}.ts`);
      await writeIfChanged(file, buildTeamHookPluginSource(id, d.ocEvent, d.command, d.matcher, projectRoot, shell.command));
    }
  }
  for (const id of await listTeamHookIds(dir)) {
    if (!desired.has(id)) await remove(path.join(dir, `${TEAM_HOOK_FILE_PREFIX}${id}.ts`));
  }
}

/** Remove every generated team-hook plugin for a scope. */
export async function removeOpencodeTeamHooks(baseDir: string, scope: 'project' | 'user'): Promise<void> {
  const dir = resolveOpencodePluginDir(baseDir, scope);
  for (const id of await listTeamHookIds(dir)) {
    await remove(path.join(dir, `${TEAM_HOOK_FILE_PREFIX}${id}.ts`));
  }
}
