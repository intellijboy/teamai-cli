import path from 'node:path';
import type { ToolTarget } from './types.js';
import { configDirExists, resolveDir } from './paths.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.HERMES_HOME, path.join(home, '.hermes'), home),
    'config.yaml',
  );
}

export const hermes: ToolTarget = {
  name: 'hermes',
  format: 'yaml',
  template: 'hermes',
  preferredEndpoint: 'openai',
  // Hermes custom endpoints are OpenAI-compatible; keep it on the openai endpoint.
  forceEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
};
