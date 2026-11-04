import { defineConfig } from 'tsup';

// Bundle the unified/remark/rehype ecosystem. These packages are ESM-only;
// leaving them external breaks the CJS build with ERR_REQUIRE_ESM on Node.
// The resulting bundles are small and self-contained.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  noExternal: [
    'unified',
    'remark-parse',
    'remark-gfm',
    'remark-rehype',
    'rehype-stringify',
    'unist-util-visit',
    'remark-stringify',
    'unified-stream',
  ],
});
