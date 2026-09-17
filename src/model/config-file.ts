import crypto from 'node:crypto';
import path from 'node:path';
import fse from 'fs-extra';
import { getFormatCodec } from './config-format.js';
import type { ConfigFormat, ConfigFormatCodec } from './config-format.js';

export type { ConfigFormat } from './config-format.js';

/** Parse a config document in the given format. */
export function parseConfig(format: ConfigFormat, text: string): unknown {
  return getFormatCodec(format).parse(text);
}

/** Serialize a config document in the given format (trailing newline included). */
export function stringifyConfig(format: ConfigFormat, value: unknown): string {
  return getFormatCodec(format).stringify(value);
}

/**
 * A serialized config file on disk.
 *
 * Reads tolerate a missing or empty file (returns `{}`). Writes are atomic
 * (temp file + rename) and keep a `.bak` copy of the previous contents. A
 * symlinked target is written through to its real path so the link survives;
 * new files are created `0600` (configs may carry a resolved API key).
 */
export class ConfigFile {
  readonly #codec: ConfigFormatCodec;

  constructor(
    readonly filePath: string,
    readonly format: ConfigFormat,
  ) {
    this.#codec = getFormatCodec(format);
  }

  read(): unknown {
    if (!fse.existsSync(this.filePath)) return {};
    const raw = fse.readFileSync(this.filePath, 'utf-8');
    // Strip a UTF-8 BOM: Windows editors/PowerShell commonly add one, and every
    // parser here (JSON.parse, smol-toml) rejects it as invalid input.
    const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    if (!text.trim()) return {};
    try {
      return this.#codec.parse(text);
    } catch (error) {
      throw new Error(`Cannot parse ${this.filePath}: ${(error as Error).message}`);
    }
  }

  async write(value: unknown): Promise<string> {
    const text = this.#codec.stringify(value);
    await fse.ensureDir(path.dirname(this.filePath));

    // Resolve first so the backup and the rename act on the real file, never
    // on the link itself.
    const target = await this.#resolveTarget();

    if (await fse.pathExists(target)) {
      // Dereference: `.bak` must be a regular file holding the previous
      // contents, not another link to the file we are about to overwrite.
      await fse.copy(target, `${target}.bak`, { dereference: true });
    }

    const tmp = `${target}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`;
    try {
      await fse.writeFile(tmp, text, { encoding: 'utf-8', mode: 0o600 });
      await fse.rename(tmp, target);
      // Tighten a pre-existing looser file (e.g. 0644) now that it may hold a
      // resolved API key. chmod is a no-op on Windows.
      if (process.platform !== 'win32') {
        await fse.chmod(target, 0o600);
      }
    } catch (error) {
      await fse.remove(tmp).catch(() => undefined);
      throw error;
    }
    return text;
  }

  /** Follow a symlinked config file to its real path; return the path unchanged otherwise. */
  async #resolveTarget(): Promise<string> {
    let stats;
    try {
      stats = await fse.lstat(this.filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      return this.filePath;
    }
    if (!stats.isSymbolicLink()) return this.filePath;

    try {
      return await fse.realpath(this.filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      // Dangling link: realpath cannot resolve it. Follow the link ourselves
      // so the new file lands at its destination and the link stays a link.
      const link = await fse.readlink(this.filePath);
      const dest = path.isAbsolute(link) ? link : path.resolve(path.dirname(this.filePath), link);
      await fse.ensureDir(path.dirname(dest));
      return dest;
    }
  }
}
