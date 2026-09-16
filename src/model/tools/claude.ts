import path from 'node:path';
import type { ToolTarget } from './types.js';
import { configDirExists, resolveDir } from './paths.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.CLAUDE_CONFIG_DIR, path.join(home, '.claude'), home),
    'settings.json',
  );
}

export const claude: ToolTarget = {
  name: 'claude',
  format: 'json',
  template: 'claude',
  preferredEndpoint: 'anthropic',
  forceEndpoint: 'anthropic',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
};
