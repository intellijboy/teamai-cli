import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';
import { ConfigFile } from '../model/config-file.js';

let dir: string;

beforeEach(async () => {
  dir = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-config-file-'));
});

afterEach(async () => {
  await fse.remove(dir);
});

describe('ConfigFile symlink safety', () => {
  it('backs up the real target as a regular file and keeps the link', async () => {
    const target = path.join(dir, 'dotfiles', 'config.json');
    const link = path.join(dir, 'link.json');
    await fse.outputJson(target, { version: 1 });
    await fse.symlink(target, link);

    const file = new ConfigFile(link, 'json');
    await file.write({ version: 2 });
    await file.write({ version: 3 });

    const bak = `${target}.bak`;
    const bakStat = await fse.lstat(bak);
    expect(bakStat.isFile()).toBe(true);
    expect(bakStat.isSymbolicLink()).toBe(false);
    expect(await fse.readJson(bak)).toEqual({ version: 2 });

    expect((await fse.lstat(link)).isSymbolicLink()).toBe(true);
    expect(await fse.readJson(link)).toEqual({ version: 3 });
  });

  it('creates the destination of a dangling symlink without replacing the link', async () => {
    const target = path.join(dir, 'nested', 'config.json');
    const link = path.join(dir, 'link.json');
    const relative = path.join('nested', 'config.json');
    await fse.symlink(relative, link);

    const file = new ConfigFile(link, 'json');
    await file.write({ hello: 'world' });

    expect(await fse.readJson(target)).toEqual({ hello: 'world' });
    expect((await fse.lstat(link)).isSymbolicLink()).toBe(true);
    expect(await fse.readlink(link)).toBe(relative);
    expect(await fse.readJson(link)).toEqual({ hello: 'world' });
  });

  it('strips a UTF-8 BOM on read', async () => {
    const file = path.join(dir, 'config.json');
    await fse.writeFile(file, '\uFEFF' + JSON.stringify({ keep: true }));
    expect(new ConfigFile(file, 'json').read()).toEqual({ keep: true });
  });

  it.runIf(process.platform !== 'win32')(
    'creates new files 0600 and tightens an existing looser file',
    async () => {
      const fresh = path.join(dir, 'fresh.json');
      await new ConfigFile(fresh, 'json').write({ a: 1 });
      expect((await fse.stat(fresh)).mode & 0o777).toBe(0o600);

      const loose = path.join(dir, 'loose.json');
      await fse.outputJson(loose, { a: 1 });
      await fse.chmod(loose, 0o644);
      await new ConfigFile(loose, 'json').write({ a: 2 });
      expect((await fse.stat(loose)).mode & 0o777).toBe(0o600);
    },
  );
});
