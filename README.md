# generator-markdown-to-html

Markdown to HTML generator using the unified ecosystem (remark + rehype).

Built with **TypeScript**, bundled with **tsup**, tested with **Vitest**.

## Development

```bash
npm install
npm run build      # tsup
npm test           # vitest
npm run typecheck
npm start          # run the built example
```

## Build outputs

- `dist/index.js` — ESM
- `dist/index.cjs` — CommonJS
- `dist/index.d.ts` — TypeScript declarations

Source example lives in `src/source.md`.
