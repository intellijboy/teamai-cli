import path from 'node:path';
import type { ToolSelection, ToolTarget } from '../shared/types.js';
import { configDirExists } from '../shared/paths.js';
import { asRecord, isKnownProvider, keysOf, readToolConfig, splitModelRef, uniqueModels } from '../shared/read.js';

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
  readSelections(home) {
    const doc = asRecord(readToolConfig('json', configPath(home)));
    const providers = asRecord(doc.provider);
    const active = splitModelRef(asRecord(doc.model).main);
    const selections: ToolSelection[] = [];
    for (const provider of keysOf(providers)) {
      if (!isKnownProvider(provider)) continue;
      const models = keysOf(asRecord(providers[provider]).models);
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
