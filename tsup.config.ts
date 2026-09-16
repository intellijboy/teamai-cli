import { cp } from 'node:fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
  // The model-config Renderer reads .hbs templates from disk at runtime
  // (dist/index.js → dist/templates), so ship them alongside the bundle.
  onSuccess: async () => {
    await cp('src/model/templates', 'dist/templates', { recursive: true });
  },
});
