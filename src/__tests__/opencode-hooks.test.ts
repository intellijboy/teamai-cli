import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { EventEmitter } from 'node:events';
import fse from 'fs-extra';

/** Assert a generated ESM plugin body parses as valid JS (strip `export`). */
function assertValidJs(src: string): void {
  expect(() => new vm.Script(src.replace(/export const /g, 'const '))).not.toThrow();
}

vi.mock('../utils/logger.js', () => ({
  log: { info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), dim: vi.fn() },
}));

import {
  resolveOpencodePluginDir,
  injectOpencodeHooks,
  removeOpencodeHooks,
  applyOpencodeAgentHook,
  removeOpencodeAgentHook,
  buildPluginSource,
  buildAgentHookPluginSource,
  buildTeamHookPluginSource,
  syncOpencodeTeamHooks,
  removeOpencodeTeamHooks,
  OPENCODE_HOOK_FILE,
  TEAM_HOOK_FILE_PREFIX,
} from '../opencode-hooks.js';
import { reconcileHooksToAllTools } from '../hooks.js';
import { resolveHookShell } from '../builtin-hooks.js';
import { loadOpencodePlugin } from './helpers/opencode-plugin.js';
import { log } from '../utils/logger.js';

describe('resolveOpencodePluginDir', () => {
  it('project scope → <base>/.opencode/plugin', () => {
    expect(resolveOpencodePluginDir('/repo', 'project')).toBe(path.join('/repo', '.opencode', 'plugin'));
  });
  it('user scope → <base>/.config/opencode/plugin', () => {
    expect(resolveOpencodePluginDir('/home/u', 'user')).toBe(path.join('/home/u', '.config', 'opencode', 'plugin'));
  });
});

describe('buildPluginSource', () => {
  const src = buildPluginSource();
  it('maps the four Claude built-in events to OpenCode events and teamai dispatch', () => {
    expect(src).toContain("event.type === 'session.created'");
    expect(src).toContain("dispatch('session-start',");
    expect(src).toContain("event.type === 'session.idle'");
    expect(src).toContain("dispatch('stop',");
    expect(src).toContain("'chat.message'");
    expect(src).toContain("'prompt-submit'");
    expect(src).toContain("'tool.execute.after'");
    expect(src).toContain("'post-tool-use'");
  });
  it('spawns teamai hook-dispatch with hidden Windows consoles and swallowed errors', () => {
    expect(src).toContain("'hook-dispatch'");
    expect(src).toContain("'--tool', 'opencode'");
    expect(src).toContain("import('node:child_process')");
    expect(src).toContain('windowsHide: true');
    expect(src).not.toContain('.quiet().nothrow()');
  });
  it('forwards a STDIN payload (cwd + per-event fields) through child_process', () => {
    // cwd comes from the plugin ctx (directory / worktree), fed on STDIN so the
    // provider-config gate and track/hint handlers work.
    expect(src).toContain('directory');
    expect(src).toContain('worktree');
    expect(src).toContain('JSON.stringify({ cwd');
    expect(src).toContain('child.stdin.write(stdin)');
    expect(src).not.toContain('new Response(stdin)');
  });
  it('maps lowercase OpenCode tool ids back to PascalCase matchers', () => {
    // OpenCode passes `skill` / `todowrite`; the handler registry keys matchers
    // on `Skill` / `TodoWrite`.
    expect(src).toContain("skill: 'Skill'");
    expect(src).toContain("todowrite: 'TodoWrite'");
    expect(src).toContain('TOOL_MATCHER[tool]');
    // The dead PascalCase id comparison must be gone.
    expect(src).not.toContain("tool === 'Skill'");
  });
  it('forwards tool_name / tool_input on post-tool-use and prompt on chat.message', () => {
    expect(src).toContain('tool_name');
    expect(src).toContain('tool_input');
    expect(src).toContain('prompt');
  });
  it('is syntactically valid JavaScript', () => {
    assertValidJs(src);
  });

  it('does not retain child-process listeners across repeated dispatches', async () => {
    const spawns: Array<{ child: any; options: any }> = [];
    const fakeSpawn = vi.fn((_command: string, _args: string[], options: any) => {
      const child = new EventEmitter() as any;
      child.stdin = {
        write: vi.fn(),
        end: vi.fn(() => Promise.resolve().then(() => child.emit('close', 0))),
      };
      spawns.push({ child, options });
      return child;
    });
    const executable = src
      .replace('await import(\'node:child_process\')', 'globalThis.__childProcess')
      .replace('export const TeamaiHooks =', 'globalThis.TeamaiHooks =');
    const context = {
      __childProcess: { spawn: fakeSpawn },
      process: { platform: 'win32' },
    } as any;
    vm.runInNewContext(executable, context);
    const hooks = await context.TeamaiHooks({ directory: 'C:/workspace' });

    for (let i = 0; i < 12; i += 1) {
      await hooks.event({ event: { type: 'session.created' } });
    }

    expect(fakeSpawn).toHaveBeenCalledTimes(12);
    expect(spawns.every(({ options }) => options.windowsHide === true)).toBe(true);
    expect(spawns.every(({ options }) => options.stdio[0] === 'pipe')).toBe(true);
    expect(spawns.every(({ child }) => child.listenerCount('close') === 0)).toBe(true);
    expect(spawns.every(({ child }) => child.listenerCount('error') === 0)).toBe(true);
  });
});

// #884: every dispatch carries the host session, so recall attribution joins
// the OpenCode session instead of a pid fallback.
describe('OpenCode plugin: bridge payloads (#884)', () => {
  const PARENT = 'ses_parent';
  const CHILD = 'ses_child';

  it('sends the host session id on session start, prompt submission and Stop', async () => {
    const { hooks, dispatches } = await loadOpencodePlugin({ directory: '/work/proj' });
    await hooks.event({ event: { type: 'session.created', properties: { sessionID: PARENT, info: { id: PARENT } } } });
    // Older hosts: session.created carries only the session info.
    await hooks.event({ event: { type: 'session.created', properties: { info: { id: CHILD, parentID: PARENT } } } });
    await hooks['chat.message']({ sessionID: PARENT }, { parts: [{ type: 'text', text: '/retry now' }] });
    await hooks.event({ event: { type: 'session.idle', properties: { sessionID: PARENT } } });

    expect(dispatches.map((d) => [d.args[1], d.payload])).toEqual([
      ['session-start', { cwd: '/work/proj', session_id: PARENT }],
      ['session-start', { cwd: '/work/proj', session_id: CHILD }],
      ['prompt-submit', { cwd: '/work/proj', session_id: PARENT, prompt: '/retry now' }],
      ['stop', { cwd: '/work/proj', session_id: PARENT }],
    ]);
  });

  it('sends PostToolUse with the session, the tool output and a status normalized from what the host reports', async () => {
    const { hooks, dispatches } = await loadOpencodePlugin({ directory: '/work/proj' });
    const after = hooks['tool.execute.after'];
    await after({ tool: 'bash', sessionID: PARENT, callID: 'c1', args: { command: 'cat a.md' } },
      { title: 'cat a.md', output: 'hello', metadata: { exit: 0, output: 'hello' } });
    await after({ tool: 'bash', sessionID: PARENT, callID: 'c2', args: { command: 'cat b.md' } },
      { title: 'cat b.md', output: 'cat: b.md: No such file', metadata: { exit: 1 } });
    // Only bash reports an exit code; the other tools have no status to read.
    await after({ tool: 'read', sessionID: PARENT, callID: 'c3', args: { filePath: '/kb/a.md' } },
      { title: 'a.md', output: '<path>/kb/a.md</path>', metadata: {} });

    expect(dispatches.map((d) => d.payload)).toEqual([
      { cwd: '/work/proj', session_id: PARENT, tool_name: 'bash', tool_input: { command: 'cat a.md' }, tool_response: 'hello', tool_status: 'success' },
      { cwd: '/work/proj', session_id: PARENT, tool_name: 'bash', tool_input: { command: 'cat b.md' }, tool_response: 'cat: b.md: No such file', tool_status: 'failure' },
      { cwd: '/work/proj', session_id: PARENT, tool_name: 'read', tool_input: { filePath: '/kb/a.md' }, tool_response: '<path>/kb/a.md</path>', tool_status: 'unknown' },
    ]);
  });

  it('still dispatches when the host passes no output or session (older OpenCode)', async () => {
    const { hooks, dispatches } = await loadOpencodePlugin({ directory: '/work/proj' });
    await hooks['tool.execute.after']({ tool: 'bash' });
    await hooks.event({ event: { type: 'session.idle' } });
    expect(dispatches.map((d) => d.payload)).toEqual([
      { cwd: '/work/proj', tool_name: 'bash', tool_input: {}, tool_status: 'unknown' },
      { cwd: '/work/proj' },
    ]);
  });

  it('turns a task completion into a link from the child session to its parent', async () => {
    const { hooks, dispatches } = await loadOpencodePlugin({ directory: '/work/proj' });
    await hooks['tool.execute.after']({ tool: 'task', sessionID: PARENT, callID: 'c1', args: { prompt: 'find docs' } },
      { title: 'find docs', output: '<task id="ses_child" state="completed">', metadata: { sessionId: CHILD, parentSessionId: PARENT, model: {} } });
    // Older hosts: the metadata names only the child; the task ran in the parent.
    await hooks['tool.execute.after']({ tool: 'task', sessionID: PARENT, callID: 'c2', args: {} },
      { title: 'x', output: '', metadata: { sessionId: 'ses_child2' } });
    // No child id: no link.
    await hooks['tool.execute.after']({ tool: 'task', sessionID: PARENT, callID: 'c3', args: {} }, { title: 'x', output: '', metadata: {} });

    expect(dispatches.map((d) => d.payload.session_link)).toEqual([
      { child: CHILD, parent: PARENT },
      { child: 'ses_child2', parent: PARENT },
      undefined,
    ]);
  });

  it('sets TEAMAI_AGENT_SESSION_ID in the bash environment to the session the command runs in', async () => {
    const { hooks } = await loadOpencodePlugin({ directory: '/work/proj' });
    const output = { env: { KEEP: '1' } as Record<string, string> };
    await hooks['shell.env']({ cwd: '/work/proj', sessionID: CHILD, callID: 'c1' }, output);
    expect(output.env).toEqual({ KEEP: '1', TEAMAI_AGENT_SESSION_ID: CHILD });

    // A terminal with no session: nothing to name.
    const pty = { env: {} as Record<string, string> };
    await hooks['shell.env']({ cwd: '/work/proj' }, pty);
    expect(pty.env).toEqual({});
  });
});

describe('buildAgentHookPluginSource is valid JS across event kinds and tricky commands', () => {
  it('session event', () => assertValidJs(buildAgentHookPluginSource('s', 'session.created', 'echo hi')));
  it('chat event with quotes in command', () => assertValidJs(buildAgentHookPluginSource('c', 'chat.message', `do "q" and 'q'`)));
  it('tool event with backtick in command', () => assertValidJs(buildAgentHookPluginSource('t', 'tool.execute.after', 'run `x`')));
  it('slug with hyphens produces a valid identifier', () => {
    const s = buildAgentHookPluginSource('my-cool-hook', 'session.idle', 'x');
    expect(s).toContain('TeamaiAgentHook_my_cool_hook');
    assertValidJs(s);
  });
});

describe('injectOpencodeHooks / removeOpencodeHooks', () => {
  let tmp: string;
  beforeEach(async () => { tmp = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-oc-hooks-')); });
  afterEach(async () => { await fse.remove(tmp); });

  it('project scope writes .opencode/plugin/teamai-hooks.ts', async () => {
    await injectOpencodeHooks(tmp, 'project');
    const file = path.join(tmp, '.opencode', 'plugin', OPENCODE_HOOK_FILE);
    expect(await fse.pathExists(file)).toBe(true);
    expect(await fse.readFile(file, 'utf8')).toContain('[teamai] hooks plugin');
  });

  it('user scope writes .config/opencode/plugin/teamai-hooks.ts', async () => {
    await injectOpencodeHooks(tmp, 'user');
    const file = path.join(tmp, '.config', 'opencode', 'plugin', OPENCODE_HOOK_FILE);
    expect(await fse.pathExists(file)).toBe(true);
  });

  it('is idempotent — re-inject produces identical bytes', async () => {
    await injectOpencodeHooks(tmp, 'project');
    const file = path.join(tmp, '.opencode', 'plugin', OPENCODE_HOOK_FILE);
    const first = await fse.readFile(file, 'utf8');
    await injectOpencodeHooks(tmp, 'project');
    expect(await fse.readFile(file, 'utf8')).toBe(first);
  });

  it('reports the injection only when the plugin changes', async () => {
    await injectOpencodeHooks(tmp, 'project');
    expect(log.success).toHaveBeenCalledWith(expect.stringContaining('Injected teamai OpenCode hook'));
    vi.mocked(log.success).mockClear();

    await injectOpencodeHooks(tmp, 'project');
    expect(log.success).not.toHaveBeenCalled();
  });

  it('remove deletes the plugin file; safe when absent', async () => {
    await removeOpencodeHooks(tmp, 'project'); // no-op, no throw
    await injectOpencodeHooks(tmp, 'project');
    const file = path.join(tmp, '.opencode', 'plugin', OPENCODE_HOOK_FILE);
    expect(await fse.pathExists(file)).toBe(true);
    await removeOpencodeHooks(tmp, 'project');
    expect(await fse.pathExists(file)).toBe(false);
  });
});

describe('agent-hook plugins', () => {
  let tmp: string;
  beforeEach(async () => { tmp = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-oc-ah-')); });
  afterEach(async () => { await fse.remove(tmp); });

  it('installs a named plugin file for a supported event', async () => {
    await applyOpencodeAgentHook({ slug: 'my-hook', event: 'SessionStart', command: 'echo hi', baseDir: tmp, scope: 'user' });
    const file = path.join(tmp, '.config', 'opencode', 'plugin', 'teamai-agent-my-hook.ts');
    expect(await fse.pathExists(file)).toBe(true);
    const content = await fse.readFile(file, 'utf8');
    expect(content).toContain('event.type === "session.created"');
    expect(content).toContain('echo hi');
  });

  it('routes prompt / tool events to their named hooks', async () => {
    await applyOpencodeAgentHook({ slug: 'p', event: 'UserPromptSubmit', command: 'x', baseDir: tmp, scope: 'user' });
    const content = await fse.readFile(path.join(tmp, '.config', 'opencode', 'plugin', 'teamai-agent-p.ts'), 'utf8');
    expect(content).toContain('"chat.message": async');
  });

  it('skips events with no OpenCode equivalent', async () => {
    await applyOpencodeAgentHook({ slug: 'bad', event: 'PreToolUse', command: 'x', baseDir: tmp, scope: 'user' });
    expect(await fse.pathExists(path.join(tmp, '.config', 'opencode', 'plugin', 'teamai-agent-bad.ts'))).toBe(false);
  });

  it('remove deletes the agent-hook plugin', async () => {
    await applyOpencodeAgentHook({ slug: 'gone', event: 'Stop', command: 'x', baseDir: tmp, scope: 'user' });
    const file = path.join(tmp, '.config', 'opencode', 'plugin', 'teamai-agent-gone.ts');
    expect(await fse.pathExists(file)).toBe(true);
    await removeOpencodeAgentHook({ slug: 'gone', baseDir: tmp, scope: 'user' });
    expect(await fse.pathExists(file)).toBe(false);
  });

  it('gates a matcher-scoped tool hook on the tool id (case-insensitive)', async () => {
    await applyOpencodeAgentHook({ slug: 'scoped', event: 'PostToolUse', command: 'x', baseDir: tmp, scope: 'user', matcher: 'Bash' });
    const content = await fse.readFile(path.join(tmp, '.config', 'opencode', 'plugin', 'teamai-agent-scoped.ts'), 'utf8');
    // Compares the lowercase OpenCode id against the lowercased matcher.
    expect(content).toContain("tool.toLowerCase() === \"bash\"");
  });

  it('runs a tool hook unconditionally when matcher is absent or *', async () => {
    await applyOpencodeAgentHook({ slug: 'wild', event: 'PostToolUse', command: 'x', baseDir: tmp, scope: 'user', matcher: '*' });
    const content = await fse.readFile(path.join(tmp, '.config', 'opencode', 'plugin', 'teamai-agent-wild.ts'), 'utf8');
    expect(content).toContain('"tool.execute.after": async () => { await run(); }');
    expect(content).not.toContain('toLowerCase()');
  });

  it('rejects a slug with path-traversal (../) — no file escapes the plugin dir', async () => {
    await expect(
      applyOpencodeAgentHook({ slug: '../../evil', event: 'PostToolUse', command: 'x', baseDir: tmp, scope: 'user' }),
    ).rejects.toThrow(/Invalid agent-hook slug/);
    // Nothing was written outside the plugin dir.
    expect(await fse.pathExists(path.join(tmp, '.config', 'evil.ts'))).toBe(false);
  });
});

describe('reconcileHooksToAllTools routes opencode to the plugin adapter', () => {
  let tmp: string;
  let home: string;
  let projectRoot: string;
  let prevHome: string | undefined;

  beforeEach(async () => {
    tmp = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-oc-recon-'));
    home = path.join(tmp, 'home');
    projectRoot = path.join(tmp, 'project');
    await fse.ensureDir(home);
    await fse.ensureDir(projectRoot);
    prevHome = process.env.HOME;
    process.env.HOME = home;
  });
  afterEach(async () => {
    if (prevHome === undefined) delete process.env.HOME;
    else process.env.HOME = prevHome;
    await fse.remove(tmp);
  });

  const toolPaths = { opencode: { skills: '.opencode/skills' } } as Record<string, { settings?: string }>;
  const manifest = () => path.join(tmp, 'managed-hooks.json');
  const userPlugin = () => path.join(home, '.config', 'opencode', 'plugin', OPENCODE_HOOK_FILE);
  const projectPlugin = () => path.join(projectRoot, '.opencode', 'plugin', OPENCODE_HOOK_FILE);

  it('does nothing when OpenCode is not installed (no user config dir)', async () => {
    await reconcileHooksToAllTools(toolPaths, projectRoot, [], manifest());
    expect(await fse.pathExists(userPlugin())).toBe(false);
    expect(await fse.pathExists(projectPlugin())).toBe(false);
  });

  it('injects into the user plugin dir when ~/.config/opencode exists', async () => {
    await fse.ensureDir(path.join(home, '.config', 'opencode'));
    await reconcileHooksToAllTools(toolPaths, home, [], manifest());
    expect(await fse.pathExists(userPlugin())).toBe(true);
  });

  it('keeps a single copy when reconciling a project-scope base dir', async () => {
    // OpenCode loads BOTH ~/.config/opencode/plugin and <project>/.opencode/plugin,
    // so a project copy next to the user one would dispatch every event twice.
    await fse.ensureDir(path.join(home, '.config', 'opencode'));
    await fse.ensureDir(path.join(projectRoot, '.opencode'));
    await reconcileHooksToAllTools(toolPaths, projectRoot, [], manifest());
    expect(await fse.pathExists(userPlugin())).toBe(true);
    expect(await fse.pathExists(projectPlugin())).toBe(false);
  });

  it('deletes a project-scope plugin left by an earlier layout', async () => {
    await fse.ensureDir(path.join(home, '.config', 'opencode'));
    await injectOpencodeHooks(projectRoot, 'project');
    expect(await fse.pathExists(projectPlugin())).toBe(true);
    await reconcileHooksToAllTools(toolPaths, projectRoot, [], manifest());
    expect(await fse.pathExists(projectPlugin())).toBe(false);
    expect(await fse.pathExists(userPlugin())).toBe(true);
  });

  it('removeAll deletes the plugin in both locations', async () => {
    await fse.ensureDir(path.join(home, '.config', 'opencode'));
    await reconcileHooksToAllTools(toolPaths, home, [], manifest());
    await injectOpencodeHooks(projectRoot, 'project');
    await reconcileHooksToAllTools(toolPaths, projectRoot, [], manifest(), { removeAll: true });
    expect(await fse.pathExists(userPlugin())).toBe(false);
    expect(await fse.pathExists(projectPlugin())).toBe(false);
  });
});

// #719 review: the PR claimed the Stop hint "reaches the user" on OpenCode. It
// does not. The generated plugin spawns hook-dispatch with stdout ignored, so
// neither the Stop payload nor the UserPromptSubmit payload ever gets back into
// the session — a gap that predates #719 and is tracked separately. Pinning it
// here means the next change that starts relying on OpenCode stdout has to come
// through this test, instead of the claim being made again from a hook-dispatch
// run that never went through the adapter.
describe('OpenCode plugin: hook stdout is discarded (#719 review)', () => {
  it('spawns hook-dispatch with stdout and stderr ignored', () => {
    expect(buildPluginSource()).toContain("stdio: ['pipe', 'ignore', 'ignore']");
  });

  it('says so in the generated file, so a reader is not misled', () => {
    expect(buildPluginSource()).toContain('cannot inject a hook');
  });
});

describe('buildPluginSource embeds a resolved CLI invocation (no PATH reliance)', () => {
  it('spawns node with the CLI entry as an argv prefix', () => {
    const src = buildPluginSource({ command: '/usr/bin/node', argsPrefix: ['/opt/teamai/dist/index.js'], shell: false });
    expect(src).toContain('const CLI_COMMAND = "/usr/bin/node"');
    expect(src).toContain('const CLI_ARGS_PREFIX = ["/opt/teamai/dist/index.js"]');
    expect(src).toContain('spawn(CLI_COMMAND, args, {');
    assertValidJs(src);
  });

  it('falls back to the bare teamai command with an empty prefix', () => {
    const src = buildPluginSource();
    expect(src).toContain('const CLI_COMMAND = "teamai"');
    expect(src).toContain('const CLI_ARGS_PREFIX = []');
  });
});

describe('team-hook plugins (hooks/hooks.yaml → OpenCode)', () => {
  let tmp: string;
  beforeEach(async () => { tmp = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-oc-team-')); });
  afterEach(async () => { await fse.remove(tmp); });
  const userDir = () => path.join(tmp, '.config', 'opencode', 'plugin');

  it('builds a valid plugin that runs the command via the resolved shell (no sh -c)', () => {
    const src = buildTeamHookPluginSource('hook-demo', 'chat.message', 'echo hi >> log', undefined, undefined, 'C:/Git/bin/bash.exe');
    expect(src).toContain('TeamaiTeamHook_hook_demo');
    expect(src).toContain('"chat.message": async () => { await run(); }');
    expect(src).toContain('.cwd(cwd)');
    expect(src).toContain('const SHELL_COMMAND = "C:/Git/bin/bash.exe"');
    expect(src).toContain('${SHELL_COMMAND} -lc ${COMMAND}');
    expect(src).not.toContain('sh -c');
    assertValidJs(src);
  });

  it('resolveHookShell: bash -lc on POSIX, Git Bash -lc on Windows, hard error when missing', () => {
    expect(resolveHookShell({ platform: 'linux' })).toEqual({ command: 'bash', argsPrefix: ['-lc'] });
    expect(resolveHookShell({ platform: 'win32', findGitBash: () => 'C:/Program Files/Git/bin/bash.exe' }))
      .toEqual({ command: 'C:/Program Files/Git/bin/bash.exe', argsPrefix: ['-lc'] });
    expect(() => resolveHookShell({ platform: 'win32', findGitBash: () => null })).toThrow(/Git Bash is required/);
  });

  it('gates a matcher-scoped tool hook case-insensitively', () => {
    const src = buildTeamHookPluginSource('scoped', 'tool.execute.after', 'x', 'Bash');
    expect(src).toContain('tool.toLowerCase() === "bash"');
    assertValidJs(src);
  });

  it('gates delivery to the project root in JS (Windows-safe) when one is given', () => {
    const withRoot = buildTeamHookPluginSource('g', 'chat.message', 'x', undefined, '/work/proj');
    expect(withRoot).toContain('const PROJECT_ROOT = "/work/proj"');
    expect(withRoot).toContain('if (!underProject()) return;');
    assertValidJs(withRoot);

    const noRoot = buildTeamHookPluginSource('g', 'chat.message', 'x');
    expect(noRoot).toContain('const PROJECT_ROOT = ""');
    assertValidJs(noRoot);
  });

  it('writes one plugin per hook, and removes the stale ones', async () => {
    await syncOpencodeTeamHooks([
      { key: 'codegraph-init', event: 'SessionStart', command: 'codegraph init' },
      { key: 'hook-demo', event: 'UserPromptSubmit', command: 'echo hi' },
    ], tmp, 'user');
    expect(await fse.pathExists(path.join(userDir(), `${TEAM_HOOK_FILE_PREFIX}codegraph-init.ts`))).toBe(true);
    expect(await fse.pathExists(path.join(userDir(), `${TEAM_HOOK_FILE_PREFIX}hook-demo.ts`))).toBe(true);

    await syncOpencodeTeamHooks([
      { key: 'hook-demo', event: 'UserPromptSubmit', command: 'echo hi' },
    ], tmp, 'user');
    expect(await fse.pathExists(path.join(userDir(), `${TEAM_HOOK_FILE_PREFIX}codegraph-init.ts`))).toBe(false);
    expect(await fse.pathExists(path.join(userDir(), `${TEAM_HOOK_FILE_PREFIX}hook-demo.ts`))).toBe(true);
  });

  it('skips events OpenCode cannot express', async () => {
    await syncOpencodeTeamHooks([{ key: 'pre', event: 'PreToolUse', command: 'x' }], tmp, 'user');
    expect(await fse.pathExists(path.join(userDir(), `${TEAM_HOOK_FILE_PREFIX}pre.ts`))).toBe(false);
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining('does not support event "PreToolUse"'));
  });

  it('removeOpencodeTeamHooks deletes every generated team-hook plugin', async () => {
    await syncOpencodeTeamHooks([{ key: 'a', event: 'Stop', command: 'x' }], tmp, 'user');
    expect(await fse.pathExists(path.join(userDir(), `${TEAM_HOOK_FILE_PREFIX}a.ts`))).toBe(true);
    await removeOpencodeTeamHooks(tmp, 'user');
    expect(await fse.pathExists(path.join(userDir(), `${TEAM_HOOK_FILE_PREFIX}a.ts`))).toBe(false);
  });
});

describe('reconcileHooksToAllTools: OpenCode scope + team hooks', () => {
  let tmp: string;
  let home: string;
  let projectRoot: string;
  let prevHome: string | undefined;

  beforeEach(async () => {
    tmp = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-oc-scope-'));
    home = path.join(tmp, 'home');
    projectRoot = path.join(tmp, 'project');
    await fse.ensureDir(home);
    await fse.ensureDir(projectRoot);
    prevHome = process.env.HOME;
    process.env.HOME = home;
  });
  afterEach(async () => {
    if (prevHome === undefined) delete process.env.HOME;
    else process.env.HOME = prevHome;
    await fse.remove(tmp);
  });

  const toolPaths = { opencode: { skills: '.opencode/skills' } } as Record<string, { settings?: string }>;
  const manifest = () => path.join(tmp, 'managed-hooks.json');
  const projectPlugin = () => path.join(projectRoot, '.opencode', 'plugin', OPENCODE_HOOK_FILE);
  const projectTeam = (id: string) => path.join(projectRoot, '.opencode', 'plugin', `${TEAM_HOOK_FILE_PREFIX}${id}.ts`);
  const userPlugin = () => path.join(home, '.config', 'opencode', 'plugin', OPENCODE_HOOK_FILE);
  const teamDef = { source: 'team', key: 'hook-demo', event: 'UserPromptSubmit', command: 'echo hi', description: 'demo' } as never;

  it('honors project scope: plugin + team hooks land in <project>/.opencode/plugin', async () => {
    await fse.ensureDir(path.join(projectRoot, '.opencode'));
    await reconcileHooksToAllTools(toolPaths, projectRoot, [teamDef], manifest(), {
      resourceScope: 'project',
      installedBaseDir: projectRoot,
      teamHookProjectRoot: projectRoot,
    });
    expect(await fse.pathExists(projectPlugin())).toBe(true);
    expect(await fse.pathExists(projectTeam('hook-demo'))).toBe(true);
    expect(await fse.pathExists(userPlugin())).toBe(false);
  });

  it('a built-in-only pass leaves the delivered team-hook plugins untouched', async () => {
    await fse.ensureDir(path.join(projectRoot, '.opencode'));
    await reconcileHooksToAllTools(toolPaths, projectRoot, [teamDef], manifest(), {
      resourceScope: 'project',
      installedBaseDir: projectRoot,
      teamHookProjectRoot: projectRoot,
    });
    expect(await fse.pathExists(projectTeam('hook-demo'))).toBe(true);

    await reconcileHooksToAllTools(toolPaths, projectRoot, [], manifest(), {
      resourceScope: 'project',
      installedBaseDir: projectRoot,
      builtinsOnly: 'with-overrides',
    });
    expect(await fse.pathExists(projectTeam('hook-demo'))).toBe(true);
  });
});
