// Exercise the real renderer's pure Markdown function without loading React,
// browser animation packages or starting a Next server.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../components/blog/RichPostRenderer.tsx', import.meta.url), 'utf8');
const start = source.indexOf('export function renderMarkdown(');
assert.notEqual(start, -1);
const end = source.indexOf('\n/**', start);
const { outputText } = ts.transpileModule(source.slice(start, end), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
});
const { renderMarkdown } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const plain = renderMarkdown('# Título\n\n**forte** e *ênfase*\n\n`**literal** <script>`');
assert.match(plain, /<h2[^>]*>Título<\/h2>/);
assert.match(plain, /<strong>forte<\/strong>/);
assert.match(plain, /<em>ênfase<\/em>/);
assert.match(plain, /<code[^>]*>\*\*literal\*\* &lt;script&gt;<\/code>/);

const links = renderMarkdown('[Interno](/contato) [Externo](https://example.com/?a=1&b=2)');
assert.match(links, /href="\/contato"/);
assert.match(links, /href="https:\/\/example.com\/\?a=1&amp;b=2"/);
assert.match(links, /rel="noopener noreferrer"/);
assert.match(renderMarkdown('![Capa](/images/capa.webp)'), /<img src="\/images\/capa.webp" alt="Capa"/);
assert.match(renderMarkdown('> Citação'), /<blockquote[^>]*>Citação<\/blockquote>/);

for (const attack of [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '[Clique](javascript:alert)',
  '[Clique](data:text/html,payload)',
  '[Clique](&#x6a;avascript:alert)',
  '[Clique](java\nscript:alert)',
  '![Imagem](javascript:alert)',
  '![Imagem](data:image/svg+xml,payload)',
]) {
  const rendered = renderMarkdown(attack);
  assert.doesNotMatch(rendered, /<(script|iframe|svg)\b/i, attack);
  assert.doesNotMatch(rendered, /(?:href|src)="(?:javascript|data|vbscript):/i, attack);
  assert.doesNotMatch(rendered, /<img[^>]*\sonerror=/i, attack);
}
const injected = renderMarkdown('[Link](https://example.com/"onclick="bad)');
assert.doesNotMatch(injected, /<a[^>]*\sonclick=/i);
assert.match(injected, /&quot;/);
console.log('PASSOU: Markdown, código literal, links, imagens e HTML/URLs ativos.');
