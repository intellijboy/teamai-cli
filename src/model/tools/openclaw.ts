import path from 'node:path';
import type { ToolTarget } from './types.js';
import { configDirExists, expandTilde } from './paths.js';

// OPENCLAW_CONFIG_PATH points straight at the file; OPENCLAW_STATE_DIR at the
// state directory that holds openclaw.json. Both fall back to ~/.openclaw.
function configPath(home: string): string {
  const direct = process.env.OPENCLAW_CONFIG_PATH;
  if (direct) return expandTilde(direct, home);
  const stateDir = process.env.OPENCLAW_STATE_DIR;
  if (stateDir) return path.join(expandTilde(stateDir, home), 'openclaw.json');
  return path.join(home, '.openclaw', 'openclaw.json');
}

export const openclaw: ToolTarget = {
  name: 'openclaw',
  format: 'json5',
  template: 'openclaw',
  preferredEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
};
