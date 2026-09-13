#!/usr/bin/env node
/**
 * Pack the current working tree and install it globally, so a local build can
 * be exercised exactly as a published tarball would be (respecting the `files`
 * whitelist). The generated .tgz is removed afterwards.
 *
 * Usage:
 *   npm run install:local
 */
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const tarball = execSync('npm pack', { encoding: 'utf8' })
  .trim()
  .split(/\r?\n/)
  .pop();

console.log(`Installing ${tarball} globally...`);
try {
  execSync(`npm install -g "${tarball}"`, { stdio: 'inherit' });
} finally {
  rmSync(tarball, { force: true });
}
