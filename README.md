# generator-markdown-to-html

Convert Markdown to HTML using the [unified](https://unifiedjs.com) ecosystem
(remark + rehype). GitHub Flavored Markdown is enabled by default.

Built with **TypeScript**, bundled with **tsup**, tested with **Vitest**.
Ships ESM, CommonJS and TypeScript declarations.

## Requirements

Node.js 22 or newer (see `package.json`).

## Usage

```ts
import { markdownToHtml } from 'generator-markdown-to-html';

const html = await markdownToHtml('# Hello, *world*!');
// <h1>Hello, <em>world</em>!</h1>
```

CommonJS works too:

```js
const { markdownToHtml } = require('generator-markdown-to-html');
```

`markdownToHtml` is also the default export.

### Options

| Option           | Type                      | Default | Description                                                                 |
| ---------------- | ------------------------- | ------- | --------------------------------------------------------------------------- |
| `gfm`            | `boolean`                 | `true`  | Tables, strikethrough, task lists and autolink literals.                    |
| `linkAttributes` | `Record<string, unknown>` | none    | Attributes added to every `<a>`, using hast property names (see below).     |

```ts
const html = await markdownToHtml('[docs](https://example.com)', {
  linkAttributes: { target: '_blank', rel: 'noopener', className: 'external' },
});
// <p><a href="https://example.com" target="_blank" rel="noopener" class="external">docs</a></p>
```

Use `className` (not `class`) for CSS classes, as property names follow
[hast](https://github.com/syntax-tree/hast#properties).

### Notes

- The function is pure: no file or network access, no logging.
- Raw HTML inside Markdown is dropped (the default `remark-rehype` behaviour),
  but link and image URLs are **not** sanitized (for example `javascript:`
  URLs pass through). If you render untrusted Markdown, sanitize the resulting
  HTML (for example with `sanitize-html` or DOMPurify) before embedding it.

## Development

```bash
npm install
npm run typecheck  # tsc --noEmit
npm run build      # tsup -> dist/
npm test           # vitest
```

### Build outputs

- `dist/index.js` — ESM
- `dist/index.cjs` — CommonJS
- `dist/index.d.ts` — TypeScript declarations

### Examples

`examples/` contains standalone scripts showing how to write custom remark
plugins (prefixing headings, decorating links). They are not part of the
published package. Run them from the repository root, for example:

```bash
npx tsx examples/custom-link-plugin.ts
```

### CI

GitHub Actions runs type check, build and tests on Node 22 and 24 for
every push and pull request to `master`/`main`.
