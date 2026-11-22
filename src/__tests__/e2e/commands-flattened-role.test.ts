import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── commands by role, through the real CLI ─────────────────────────────────
//
// The team repo keeps each role's commands in commands/<role>/. Pull delivers
// only the active role's commands, and it delivers them flat: the tool's
// commands directory holds <name>.md, never a role directory. A role change
// removes the previous role's command from the tool.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');
const CLI = path.join(ROOT, 'dist', 'index.js');

const GIT_ENV = {
  GIT_AUTHOR_NAME: 'TeamAI CI',
  GIT_AUTHOR_EMAIL: 'ci@teamai.test',
  GIT_COMMITTER_NAME: 'TeamAI CI',
  GIT_COMMITTER_EMAIL: 'ci@teamai.test',
};

function git(args: string[], cwd: string): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, ...GIT_ENV } }).trim();
}

function runCLI(args: string[], cwd: string, home: string): Promise<{ code: number | null; output: string }> {
  return new Promise((resolve) => {
    const child = spawn('node', [CLI, ...args], {
      cwd,
      env: { ...process.env, ...GIT_ENV, HOME: home, SHELL: '/bin/bash', FORCE_COLOR: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';

    child.stdout.on('data', (data: Buffer) => { output += data.toString(); });
    child.stderr.on('data', (data: Buffer) => { output += data.toString(); });
    child.on('close', (code) => resolve({ code, output }));
  });
}

function write(root: string, relativePath: string, content: string): void {
  const file = path.join(root, relativePath);

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

describe('commands of a role namespace, delivered flat by the real CLI', () => {
  let sandbox: string;
  let home: string;
  let projectRoot: string;
  let seed: string;

  const commandFile = (name: string): string => path.join(projectRoot, '.claude', 'commands', `${name}.md`);

  beforeAll(() => {
    if (!fs.existsSync(CLI)) {
      throw new Error(`CLI binary not found at ${CLI}. Run "npm run build" first.`);
    }

    sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'teamai-commands-flat-e2e-'));
    home = path.join(sandbox, 'home');
    projectRoot = path.join(sandbox, 'project');
    seed = path.join(sandbox, 'seed');
    const remote = path.join(sandbox, 'team.git');
    const teamRepo = path.join(projectRoot, '.teamai', 'team-repo');

    fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
    fs.mkdirSync(path.join(projectRoot, '.claude', 'commands'), { recursive: true });

    write(seed, 'teamai.yaml', [
      'team: commands-flat-e2e',
      `repo: ${remote}`,
      'provider: git',
      'reviewers: []',
      'toolPaths:',
      '  claude:',
      '    commands: .claude/commands',
      '',
    ].join('\n'));
    write(seed, 'manifest/roles.yaml', [
      'version: 1',
      'roles:',
      '  - id: common',
      '    description: Base',
      '    resources: { knowledge: [common], skills: [common] }',
      '  - id: dev',
      '    description: Dev',
      '    resources: { knowledge: [dev], skills: [dev] }',
      '',
    ].join('\n'));
    write(seed, 'commands/common/gitCommit.md', '---\ndescription: Commit\n---\ncommon commit\n');
    write(seed, 'commands/dev/codegraph.md', '---\ndescription: Graph\n---\ndev graph\n');

    git(['init', '-q', '-b', 'main'], seed);
    git(['add', '-A'], seed);
    git(['commit', '-q', '-m', 'seed'], seed);
    git(['clone', '-q', '--bare', seed, remote], sandbox);
    git(['remote', 'add', 'origin', remote], seed);
    git(['clone', '-q', remote, teamRepo], projectRoot);

    write(projectRoot, '.teamai/config.yaml', [
      'repo:',
      `  localPath: ${teamRepo}`,
      `  remote: ${remote}`,
      'username: cmd-user',
      'updatePolicy: auto',
      'scope: project',
      `projectRoot: ${projectRoot}`,
      'primaryRole: common',
      'enabledAgents: [claude]',
      '',
    ].join('\n'));
  });

  afterAll(() => {
    fs.rmSync(sandbox, { recursive: true, force: true });
  });

  it('delivers the active role\'s command flat, and drops it when the role changes', async () => {
    const first = await runCLI(['pull'], projectRoot, home);
    expect(first.code, first.output).toBe(0);
    expect(fs.readFileSync(commandFile('gitCommit'), 'utf8')).toContain('common commit');
    expect(fs.existsSync(path.join(projectRoot, '.claude', 'commands', 'common'))).toBe(false);
    expect(fs.existsSync(path.join(projectRoot, '.claude', 'commands', 'dev'))).toBe(false);
    expect(fs.existsSync(commandFile('codegraph'))).toBe(false);

    const configPath = path.join(projectRoot, '.teamai/config.yaml');
    fs.writeFileSync(configPath, fs.readFileSync(configPath, 'utf8').replace('primaryRole: common', 'primaryRole: dev'));

    const second = await runCLI(['pull', '--force'], projectRoot, home);
    expect(second.code, second.output).toBe(0);
    expect(fs.readFileSync(commandFile('codegraph'), 'utf8')).toContain('dev graph');
    expect(fs.existsSync(commandFile('gitCommit'))).toBe(false);
    expect(fs.existsSync(path.join(projectRoot, '.claude', 'commands', 'common'))).toBe(false);
  });
});
