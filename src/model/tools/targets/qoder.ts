import path from 'node:path';
import type { ToolTarget } from '../shared/types.js';
import { configDirExists, resolveDir } from '../shared/paths.js';
import { mergeQoderModels } from '../merges/qoder.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.QODER_CONFIG_DIR, path.join(home, '.qoder'), home),
    'settings.json',
  );
}

export const qoder: ToolTarget = {
  name: 'qoder',
  format: 'json5',
  template: 'qoder',
  preferredEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  merge: mergeQoderModels,
};
