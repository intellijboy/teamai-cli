import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fse from 'fs-extra';

vi.mock('../config.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../config.js')>()),
  loadStateForScope: vi.fn(async () => ({})),
}));
vi.mock('../utils/logger.js', () => ({
  log: { info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), dim: vi.fn() },
}));

import { CommandsHandler } from '../resources/commands.js';
import type { TeamaiConfig, LocalConfig } from '../types.js';

describe('CommandsHandler', () => {
  let tmpDir: string;
  let homeDir: string;
  let repoPath: string;
  let handler: CommandsHandler;
  let teamConfig: TeamaiConfig;
  let localConfig: LocalConfig;

  beforeEach(async () => {
    tmpDir = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-commands-'));
    homeDir = path.join(tmpDir, 'home');
    repoPath = path.join(tmpDir, 'team-repo');
    await fse.ensureDir(path.join(repoPath, 'commands'));
    await fse.ensureDir(path.join(homeDir, '.claude', 'commands'));
    await fse.ensureDir(path.join(homeDir, '.cursor', 'commands'));
    vi.stubEnv('HOME', homeDir);
    handler = new CommandsHandler();
    teamConfig = {
      team: 'test',
      description: '',
      repo: 'https://git.example.com/test/repo.git',
      provider: 'git' as const,
      reviewers: [],
      sharing: { skills: {}, rules: { enforced: [] }, docs: { localDir: '' }, env: { injectShellProfile: true } },
      toolPaths: { claude: { commands: '.claude/commands' }, cursor: { commands: '.cursor/commands' } },
    };
    localConfig = {
      repo: { localPath: repoPath, remote: 'https://git.example.com/test/repo.git' },
      username: 'testuser',
      updatePolicy: 'auto',
      additionalRoles: [],
      scope: 'user',
    };
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await fse.remove(tmpDir);
  });

  it('scanTeamForPull reads root and one-level namespaced commands', async () => {
    await fse.writeFile(path.join(repoPath, 'commands', 'gitCommit.md'), 'x');
    await fse.ensureDir(path.join(repoPath, 'commands', 'fe'));
    await fse.writeFile(path.join(repoPath, 'commands', 'fe', 'deploy.md'), 'y');
    const items = await handler.scanTeamForPull(teamConfig, localConfig);
    const root = items.find((i) => i.name === 'gitCommit');
    const ns = items.find((i) => i.name === 'fe/deploy');
    expect(root!.relativePath).toBe('commands/gitCommit.md');
    expect(root!.namespace).toBeUndefined();
    expect(ns!.namespace).toBe('fe');
    expect(ns!.relativePath).toBe('commands/fe/deploy.md');
  });

  it('scanLocalForPush reports a new command and skips an unchanged one', async () => {
    await fse.writeFile(path.join(repoPath, 'commands', 'same.md'), 'same');
    await fse.writeFile(path.join(homeDir, '.claude', 'commands', 'same.md'), 'same');
    await fse.writeFile(path.join(homeDir, '.claude', 'commands', 'brand-new.md'), 'hello');
    const items = await handler.scanLocalForPush(teamConfig, localConfig);
    const names = items.map((i) => i.name);
    expect(names).toContain('brand-new');
    expect(names).not.toContain('same');
    expect(items.find((i) => i.name === 'brand-new')!.status).toBe('new');
  });

  it('scanLocalForPush reports a modified command', async () => {
    await fse.writeFile(path.join(repoPath, 'commands', 'shared.md'), 'v1');
    await fse.writeFile(path.join(homeDir, '.claude', 'commands', 'shared.md'), 'v2');
    const items = await handler.scanLocalForPush(teamConfig, localConfig);
    expect(items.find((i) => i.name === 'shared')!.status).toBe('modified');
  });

  it('deliveryTargets lands in each installed tool with a commands path', async () => {
    await fse.writeFile(path.join(repoPath, 'commands', 'gitCommit.md'), 'x');
    const [item] = await handler.scanTeamForPull(teamConfig, localConfig);
    const targets = await handler.deliveryTargets(teamConfig, localConfig, item);
    expect(targets.map((t) => t.tool).sort()).toEqual(['claude', 'cursor']);
    expect(targets.find((t) => t.tool === 'claude')!.dest)
      .toBe(path.join(homeDir, '.claude', 'commands', 'gitCommit.md'));
  });

  it('pullItem copies the command, preserving a namespace subdirectory', async () => {
    await fse.ensureDir(path.join(repoPath, 'commands', 'fe'));
    await fse.writeFile(path.join(repoPath, 'commands', 'fe', 'deploy.md'), 'body');
    const item = (await handler.scanTeamForPull(teamConfig, localConfig)).find((i) => i.name === 'fe/deploy')!;
    await handler.pullItem(item, teamConfig, localConfig);
    expect(await fse.readFile(path.join(homeDir, '.claude', 'commands', 'fe', 'deploy.md'), 'utf-8')).toBe('body');
  });

  it('pushItem copies the command into the team repo', async () => {
    const src = path.join(homeDir, '.claude', 'commands', 'new.md');
    await fse.writeFile(src, 'content');
    await handler.pushItem({ name: 'new', type: 'commands', sourcePath: src, relativePath: 'commands/new.md' }, teamConfig, localConfig);
    expect(await fse.readFile(path.join(repoPath, 'commands', 'new.md'), 'utf-8')).toBe('content');
  });

  it('removeItem deletes the team file and tool copies, and records a tombstone', async () => {
    await fse.writeFile(path.join(repoPath, 'commands', 'gone.md'), 'x');
    await fse.writeFile(path.join(homeDir, '.claude', 'commands', 'gone.md'), 'x');
    await handler.removeItem('gone', teamConfig, localConfig);
    expect(await fse.pathExists(path.join(repoPath, 'commands', 'gone.md'))).toBe(false);
    expect(await fse.pathExists(path.join(homeDir, '.claude', 'commands', 'gone.md'))).toBe(false);
    expect(await fse.readFile(path.join(repoPath, 'commands', '.removed'), 'utf-8')).toContain('gone');
  });
});
