import type { ToolTarget } from './tools/shared/types.js';
import { claude } from './tools/targets/claude.js';
import { codex } from './tools/targets/codex.js';
import { opencode } from './tools/targets/opencode.js';
import { dsh } from './tools/targets/dsh.js';
import { codebuddy } from './tools/targets/codebuddy.js';
import { workbuddy } from './tools/targets/workbuddy.js';
import { openclaw } from './tools/targets/openclaw.js';
import { hermes } from './tools/targets/hermes.js';
import { qoder } from './tools/targets/qoder.js';
import { zcode } from './tools/targets/zcode.js';

export type { RenderContext, MergeFn, ToolTarget } from './tools/shared/types.js';
export { contextSuffix } from './renderer.js';

const define = (target: ToolTarget): [string, ToolTarget] => [target.name, target];

/** Supported tool registry (Phase 1). */
export const TOOL_TARGETS = new Map<string, ToolTarget>([
  define(claude),
  define(codex),
  define(opencode),
  define(dsh),
  define(codebuddy),
  define(workbuddy),
  define(openclaw),
  define(hermes),
  define(qoder),
  define(zcode),
]);

/** Tools that exist but cannot accept a custom provider/model config. */
const UNSUPPORTED_TOOLS: Record<string, string> = {
  cursor:
    'Cursor CLI does not support custom model providers (BYOK); it authenticates only through a Cursor account',
};

export function supportedToolNames(): string[] {
  return [...TOOL_TARGETS.keys()];
}

export function unsupportedTools(): Array<{ name: string; reason: string }> {
  return Object.entries(UNSUPPORTED_TOOLS).map(([name, reason]) => ({ name, reason }));
}

export function getToolTarget(name: string): ToolTarget {
  const target = TOOL_TARGETS.get(name);
  if (target) return target;
  if (UNSUPPORTED_TOOLS[name]) {
    throw new Error(`Tool "${name}" is not supported: ${UNSUPPORTED_TOOLS[name]}`);
  }
  throw new Error(`Unknown tool "${name}" (available: ${supportedToolNames().join(', ')})`);
}
