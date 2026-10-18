import { defineConfig } from 'tsup';

// Anything listed under `dependencies` in package.json is automatically kept
// external by tsup, so it is installed (not bundled) when consumers run
// `npm install`.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
});
