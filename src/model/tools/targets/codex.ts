import path from 'node:path';
import type { ToolTarget } from '../shared/types.js';
import { configDirExists, resolveDir } from '../shared/paths.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.CODEX_HOME, path.join(home, '.codex'), home),
    'config.toml',
  );
}

export const codex: ToolTarget = {
  name: 'codex',
  format: 'toml',
  template: 'codex',
  preferredEndpoint: 'openai',
  // Codex's config.toml hardwires the OpenAI wire protocol; keep it on openai.
  forceEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
};
