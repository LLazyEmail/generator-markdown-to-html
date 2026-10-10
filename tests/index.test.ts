import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

describe('markdown-to-html', () => {
  it('converts basic markdown to HTML', async () => {
    const source = readFileSync('./src/source.md', 'utf-8');
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(source);

    const html = String(file);
    expect(html).toContain('<');
    expect(html.length).toBeGreaterThan(0);
  });
});
