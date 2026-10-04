import path from 'node:path';
import fse from 'fs-extra';
import type { ToolSelection, ToolTarget } from '../shared/types.js';
import { configDirExists, resolveDir } from '../shared/paths.js';
import { asRecord, isKnownProvider, keysOf, readToolConfig, splitModelRef, uniqueModels } from '../shared/read.js';

/**
 * OpenCode merges config.json → opencode.json → opencode.jsonc, i.e. a .jsonc
 * wins on conflicting keys, so edit the .jsonc whenever the user has one and
 * fall back to the .json. With neither on disk, create the .jsonc OpenCode
 * would seed itself.
 */
function configPath(home: string): string {
  const dir = path.join(
    resolveDir(process.env.XDG_CONFIG_HOME, path.join(home, '.config'), home),
    'opencode',
  );
  const jsonc = path.join(dir, 'opencode.jsonc');
  if (fse.existsSync(jsonc)) return jsonc;
  const json = path.join(dir, 'opencode.json');
  if (fse.existsSync(json)) return json;
  return jsonc;
}

export const opencode: ToolTarget = {
  name: 'opencode',
  // OpenCode parses both extensions with a comment-tolerant parser, so read as
  // json5 (which also accepts strict JSON) and write back strict JSON.
  format: 'json5',
  template: 'opencode',
  preferredEndpoint: 'openai',
  // OpenCode's template uses the OpenAI-compatible SDK; keep it on openai.
  forceEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  readSelections(home) {
    const doc = asRecord(readToolConfig('json5', configPath(home)));
    const providers = asRecord(doc.provider);
    const active = splitModelRef(doc.model);
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
