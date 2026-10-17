import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import remarkStringify from 'remark-stringify';
import { stream } from 'unified-stream';

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const readSourceFile = (fileName: string) => {
  return readFileSync(fileName, { encoding: 'utf-8' });
};

const sourceFile = readSourceFile('./examples/source.md');

// attacher or
const attacher = (options: any) => {
  console.log('options', options);
  const transformer = (tree: any) => {
    console.log('tree', tree);
    visit(tree, (node: any) => console.log(node.type));
  };

  return transformer;
};

const prefixHeading = (options: any) => {
  console.log('options', options);
  const transformer = (tree: any) => {
    visit(tree, 'heading', (node: any) => {
      console.log('tree', tree);
      if (node.depth !== 1) {
        return;
      }

      visit(tree, 'text', (textNode: any) => {
        textNode.value = 'Breaking ' + textNode.value;
      });
    });
  };
  return transformer;
};

const processor = unified()
  .use(remarkParse)
  // .use(attacher)
  .use(prefixHeading, { prefix: 'hi' })
  .use(() => (tree: any) => {
    visit(tree, 'link', (node: any) => {
      console.log('node', node);
      node.data = { hProperties: { class: 'styles22' } };
    });
    // console.log(tree);
  })
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(sourceFile)
  .then((data) => {
    console.log('data', data);
  });

// process.stdin
//   .pipe(
//     stream(processor), // We give the input to the processor
//   )
//   .pipe(process.stdout);
