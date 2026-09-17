import path from 'node:path';
import type { ToolTarget } from './types.js';
import { configDirExists } from './paths.js';

function configPath(home: string): string {
  return path.join(home, '.zcode', 'cli', 'config.json');
}

export const zcode: ToolTarget = {
  name: 'zcode',
  format: 'json',
  template: 'zcode',
  preferredEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
};
