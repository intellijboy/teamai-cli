import path from 'node:path';
import type { ToolTarget } from './types.js';
import { configDirExists } from './paths.js';
import { mergeBuddyModels } from './buddy.js';

function configPath(home: string): string {
  return path.join(home, '.codebuddy', 'models.json');
}

export const codebuddy: ToolTarget = {
  name: 'codebuddy',
  format: 'json',
  template: 'buddy',
  preferredEndpoint: 'openai',
  forceEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  merge: mergeBuddyModels,
};
