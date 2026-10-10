import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  external: [
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