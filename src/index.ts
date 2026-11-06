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

  /**
   * Additional remark plugins to apply after the built-in ones.
   * Each entry is a plugin function or a [plugin, options] tuple.
   */
  remarkPlugins?: Array<any | [any, any]>;

  /**
   * Additional rehype plugins to apply after remarkRehype and before stringify.
   * Each entry is a plugin function or a [plugin, options] tuple.
   */
  rehypePlugins?: Array<any | [any, any]>;

  /**
   * When true, strip YAML frontmatter (lines between leading `---` pairs)
   * before conversion. Defaults to `false`.
   */
  stripFrontmatter?: boolean;
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
 * Apply a list of plugins (or [plugin, options] tuples) to a processor.
 */
function usePlugins(processor: any, plugins: Array<any | [any, any]> | undefined) {
  if (!plugins) return processor;
  for (const entry of plugins) {
    if (Array.isArray(entry)) {
      processor.use(entry[0], entry[1]);
    } else {
      processor.use(entry);
    }
  }
  return processor;
}

function stripYamlFrontmatter(markdown: string): string {
  const match = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  return match ? markdown.slice(match[0].length) : markdown;
}

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
  const { gfm = true, linkAttributes, remarkPlugins, rehypePlugins, stripFrontmatter = false } = options;

  const input = stripFrontmatter ? stripYamlFrontmatter(markdown) : markdown;

  // Typed loosely: plugins are added conditionally, which unified's chained
  // generics cannot express.
  let processor: any = unified().use(remarkParse);

  if (gfm) {
    processor = processor.use(remarkGfm);
  }

  if (linkAttributes && Object.keys(linkAttributes).length > 0) {
    processor = processor.use(remarkLinkAttributes, linkAttributes);
  }

  processor = usePlugins(processor, remarkPlugins);

  processor = processor.use(remarkRehype);

  processor = usePlugins(processor, rehypePlugins);

  const file = await processor.use(rehypeStringify).process(input);

  return String(file);
}

export default markdownToHtml;
