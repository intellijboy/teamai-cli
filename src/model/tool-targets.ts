import type { ToolTarget } from './tools/types.js';
import { claude } from './tools/claude.js';
import { codex } from './tools/codex.js';
import { opencode } from './tools/opencode.js';
import { dsh } from './tools/dsh.js';
import { codebuddy } from './tools/codebuddy.js';
import { workbuddy } from './tools/workbuddy.js';
import { openclaw } from './tools/openclaw.js';
import { hermes } from './tools/hermes.js';
import { qoder } from './tools/qoder.js';
import { zcode } from './tools/zcode.js';

export type { RenderContext, MergeFn, ToolTarget } from './tools/types.js';
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
