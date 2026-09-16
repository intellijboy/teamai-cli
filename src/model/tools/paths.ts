import path from 'node:path';
import fse from 'fs-extra';

/** Expand a leading `~` in a path/env value; other values pass through. */
export function expandTilde(value: string, home: string): string {
  if (value === '~') return home;
  if (value.startsWith('~/') || value.startsWith('~\\')) {
    return path.join(home, value.slice(2));
  }
  return value;
}

/** Resolve a config-dir env override, expanding a leading `~`; falls back when unset. */
export function resolveDir(envValue: string | undefined, fallback: string, home: string): string {
  if (!envValue) return fallback;
  return expandTilde(envValue, home);
}

/** Whether the directory holding a tool's config file exists, i.e. the tool is installed. */
export function configDirExists(configPath: string): boolean {
  return fse.pathExistsSync(path.dirname(configPath));
}
