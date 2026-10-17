import { describe, it, expect } from 'vitest';
import { markdownToHtml } from '../src/index';
import defaultExport from '../src/index';

describe('markdownToHtml', () => {
  it('converts headings and paragraphs', async () => {
    const html = await markdownToHtml('# Title\n\nSome *text*.');

    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<p>Some <em>text</em>.</p>');
  });

  it('is also available as the default export', () => {
    expect(defaultExport).toBe(markdownToHtml);
  });

  it('supports GitHub Flavored Markdown by default', async () => {
    const table = '| a | b |\n| - | - |\n| 1 | 2 |';
    const html = await markdownToHtml(`${table}\n\n~~gone~~`);

    expect(html).toContain('<table>');
    expect(html).toContain('<del>gone</del>');
  });

  it('can disable GitHub Flavored Markdown', async () => {
    const html = await markdownToHtml('| a | b |\n| - | - |\n| 1 | 2 |', {
      gfm: false,
    });

    expect(html).not.toContain('<table>');
  });

  it('leaves links untouched when no linkAttributes are given', async () => {
    const html = await markdownToHtml('[docs](https://example.com)');

    expect(html).toContain('<a href="https://example.com">docs</a>');
  });

  it('adds linkAttributes to every link', async () => {
    const html = await markdownToHtml(
      '[one](https://example.com) and [two](https://example.org)',
      { linkAttributes: { target: '_blank', rel: 'noopener' } },
    );

    expect(html.match(/target="_blank"/g)).toHaveLength(2);
    expect(html.match(/rel="noopener"/g)).toHaveLength(2);
    expect(html).toContain('href="https://example.com"');
  });

  it('returns an empty string for empty input', async () => {
    expect(await markdownToHtml('')).toBe('');
  });
});
