import path from 'node:path';
import type { ToolTarget } from '../shared/types.js';
import { configDirExists } from '../shared/paths.js';
import { readBuddySelections } from '../shared/read.js';
import { mergeBuddyModels } from '../merges/buddy.js';

function configPath(home: string): string {
  return path.join(home, '.workbuddy', 'models.json');
}

export const workbuddy: ToolTarget = {
  name: 'workbuddy',
  format: 'json',
  template: 'buddy',
  preferredEndpoint: 'openai',
  forceEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  merge: mergeBuddyModels,
  supportsDefaultModel: false,
  readSelections: (home) => readBuddySelections(configPath(home)),
};
