import path from 'node:path';
import type { ToolTarget } from './types.js';
import { configDirExists, resolveDir } from './paths.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.DSH_HOME, path.join(home, '.dsh'), home),
    'settings.yaml',
  );
}

export const dsh: ToolTarget = {
  name: 'dsh',
  format: 'yaml',
  template: 'dsh',
  preferredEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
};
