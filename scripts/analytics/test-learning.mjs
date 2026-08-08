import assert from 'node:assert/strict';
import {
  countHeadings,
  countWords,
  progressBySlug,
  recommendationFor,
} from './lib/content-learning.mjs';

assert.equal(countWords('# Título\nTexto com cinco palavras úteis.'), 6);
assert.equal(countHeadings('# H1\n## H2\nTexto\n### H3'), 3);

const progress = progressBySlug({
  rows: [
    { slug: 'artigo', percent: 25, count: 10 },
    { slug: 'artigo', percent: 90, count: 2 },
    { slug: 'artigo', percent: 10, count: 99 },
  ],
});
assert.deepEqual(progress.get('artigo'), { 25: 10, 50: 0, 75: 0, 90: 2 });

assert.equal(recommendationFor({ amostra_suficiente: false }), null);
assert.equal(recommendationFor({
  amostra_suficiente: true,
  leads_por_100_engajadas: 2.1,
  slug: 'forte',
})?.kind, 'padrao-forte');
assert.equal(recommendationFor({
  amostra_suficiente: true,
  leads_por_100_engajadas: 0,
  leads_qualificados: 0,
  tempo_medio_engajamento: 61,
  slug: 'cta',
})?.kind, 'cta');
assert.equal(recommendationFor({
  amostra_suficiente: true,
  leads_por_100_engajadas: 0,
  leads_qualificados: 1,
  tempo_medio_engajamento: 20,
  retentionPct: 34,
  slug: 'retencao',
})?.kind, 'retencao');

console.log('✓ aprendizado de conteúdo: cenários determinísticos passaram');
