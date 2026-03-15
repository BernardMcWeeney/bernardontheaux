import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['worker.ts'],
  outfile: 'dist-worker/worker.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  external: ['better-sqlite3', 'libsql', 'fsevents'],
  banner: {
    js: "import { createRequire as __esbuildCR } from 'node:module'; var require = globalThis.require || __esbuildCR(import.meta.url);",
  },
});
