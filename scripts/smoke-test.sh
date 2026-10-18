#!/usr/bin/env bash
# Install the packed package into a throwaway project and use it the way a
# consumer would, from both ESM and CommonJS.
#
# Usage: scripts/smoke-test.sh [path/to/package.tgz]
# Without an argument the package is built with `npm pack` from the repo root
# (run `npm run build` first).
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ "$#" -ge 1 ]; then
  tarball="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
else
  tarball="$root/$(cd "$root" && npm pack --silent | tail -n 1)"
  remove_tarball=1
fi

workdir="$(mktemp -d)"
cleanup() {
  rm -rf "$workdir"
  if [ "${remove_tarball:-0}" = "1" ]; then rm -f "$tarball"; fi
}
trap cleanup EXIT

cd "$workdir"
npm init -y >/dev/null
npm install --no-audit --no-fund "$tarball" >/dev/null

cat > check.mjs <<'EOF'
import assert from 'node:assert/strict';
import defaultExport, { markdownToHtml } from 'generator-markdown-to-html';

assert.equal(typeof markdownToHtml, 'function');
assert.equal(defaultExport, markdownToHtml);

const html = await markdownToHtml('# Hello\n\n[a](https://example.com)', {
  linkAttributes: { target: '_blank' },
});
assert.ok(html.includes('<h1>Hello</h1>'), html);
assert.ok(html.includes('target="_blank"'), html);
console.log('ESM ok');
EOF

cat > check.cjs <<'EOF'
const assert = require('node:assert/strict');
const { markdownToHtml } = require('generator-markdown-to-html');

markdownToHtml('| a |\n| - |\n| 1 |').then((html) => {
  assert.ok(html.includes('<table>'), html);
  console.log('CJS ok');
});
EOF

node check.mjs
node check.cjs
echo "node $(node -v): smoke test passed"
