import path from 'node:path';
import type { ToolSelection, ToolTarget } from '../shared/types.js';
import { configDirExists, expandTilde } from '../shared/paths.js';
import { asRecord, isKnownProvider, keysOf, readToolConfig, splitModelRef, uniqueModels } from '../shared/read.js';

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
  readSelections(home) {
    const doc = asRecord(readToolConfig('json5', configPath(home)));
    const providers = asRecord(asRecord(doc.models).providers);
    const active = splitModelRef(asRecord(asRecord(asRecord(doc.agents).defaults).model).primary);
    const selections: ToolSelection[] = [];
    for (const provider of keysOf(providers)) {
      if (!isKnownProvider(provider)) continue;
      const list = asRecord(providers[provider]).models;
      const models = Array.isArray(list)
        ? list.map((item) => (typeof asRecord(item).id === 'string' ? (asRecord(item).id as string) : ''))
          .filter((id) => id.length > 0)
        : [];
      const selected = active?.provider === provider ? active.model : undefined;
      selections.push({
        provider,
        models: uniqueModels(selected ? [...models, selected] : models),
        ...(selected ? { defaultModel: selected } : {}),
      });
    }
    return selections;
  },
};
