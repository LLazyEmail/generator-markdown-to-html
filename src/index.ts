import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

/**
 * Options for {@link markdownToHtml}.
 */
export interface MarkdownToHtmlOptions {
  /**
   * Enable GitHub Flavored Markdown (tables, strikethrough, task lists,
   * autolink literals). Defaults to `true`.
   */
  gfm?: boolean;

  /**
   * HTML attributes added to every rendered link (`<a>`), using hast property
   * names, e.g. `{ target: '_blank', rel: 'noopener', className: 'external' }`.
   */
  linkAttributes?: Record<string, unknown>;
}

/**
 * remark plugin that merges `attributes` into the properties of every link.
 */
const remarkLinkAttributes = (attributes: Record<string, unknown>) => {
  return (tree: any) => {
    visit(tree, 'link', (node: any) => {
      const data = node.data || (node.data = {});
      data.hProperties = { ...(data.hProperties || {}), ...attributes };
    });
  };
};

/**
 * Convert a Markdown string to an HTML string.
 *
 * The function is pure: it performs no I/O and does not log.
 *
 * @example
 * ```ts
 * const html = await markdownToHtml('# Hello');
 * // => '<h1>Hello</h1>'
 * ```
 */
export async function markdownToHtml(
  markdown: string,
  options: MarkdownToHtmlOptions = {},
): Promise<string> {
  const { gfm = true, linkAttributes } = options;

  // Typed loosely: plugins are added conditionally, which unified's chained
  // generics cannot express.
  const processor: any = unified().use(remarkParse);

  if (gfm) {
    processor.use(remarkGfm);
  }

  if (linkAttributes && Object.keys(linkAttributes).length > 0) {
    processor.use(remarkLinkAttributes, linkAttributes);
  }

  const file = await processor
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

export default markdownToHtml;
