import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { fetchTopPages, fetchEvents, withTotalSessionShares } from './fetch-ga4.mjs';
import { computeDelta } from './fetch-gsc.mjs';
import { buildActions, buildInsights, isKnownInspection } from './lib/insights.mjs';
import { comparisonPolicyFor } from '../../lib/analytics/comparison-policy.mjs';
import { isIndexationEligibleSlug } from './lib/posts.mjs';
import { persistSnapshot, upsertSnapshot } from './lib/supabase-snapshot.mjs';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';

let failures = 0;
let total = 0;
function ok(name, condition, detail = '') {
  total++;
  if (!condition) {
    failures++;
    console.error(`  ✗ ${name}${detail ? `: ${detail}` : ''}`);
  }
}

console.log('comparabilidade e Health Score');
ok('agosto bloqueia MoM do GA4', comparisonPolicyFor('2026-08').ga4MoM === false);
ok('agosto preserva MoM do GSC', comparisonPolicyFor('2026-08').gscMoM === true);
ok('setembro bloqueia GA4 porque agosto e a base', comparisonPolicyFor('2026-09').ga4MoM === false);
ok('regra central corrige snapshot explicito antigo', comparisonPolicyFor('2026-09', { ga4MoM: true, gscMoM: true }).ga4MoM === false);
ok('regra central nao reativa baseline ausente', comparisonPolicyFor('2026-09', { ga4MoM: false, gscMoM: false, reason: 'baseline ausente' }).gscMoM === false);
ok('outubro volta a comparacao normal', comparisonPolicyFor('2026-10').ga4MoM === true);

const dir = mkdtempSync(join(tmpdir(), 'analytics-integrity-'));
cpSync('types/analytics.ts', join(dir, 'types.ts'));
cpSync('lib/analytics/comparison-breaks.json', join(dir, 'comparison-breaks.json'));
cpSync('lib/analytics/comparison-policy.mjs', join(dir, 'comparison-policy.mjs'));
cpSync('scripts/analytics/lib/insights.mjs', join(dir, 'insights.mjs'));
cpSync('lib/analytics/period.ts', join(dir, 'period.ts'));

writeFileSync(
  join(dir, 'comparability.ts'),
  readFileSync('lib/analytics/comparability.ts', 'utf8')
    .replace('@/types/analytics', './types.js')
    .replace('./comparison-policy.mjs', './comparison-policy.mjs')
    .replace('@/scripts/analytics/lib/insights.mjs', './insights.mjs')
    .replace(
      'import { isExcludedFromSitemap } from "@/lib/seo/thin-content";',
      'const isExcludedFromSitemap = (slug: string) => slug === "steel-frame-futuro-construcao";'
    )
);
writeFileSync(
  join(dir, 'health-score.ts'),
  readFileSync('lib/analytics/health-score.ts', 'utf8')
    .replace('@/types/analytics', './types.js')
    .replace('./comparability', './comparability.js')
);
writeFileSync(
  join(dir, 'post-performance.ts'),
  readFileSync('lib/analytics/post-performance.ts', 'utf8')
    .replace('@/types/analytics', './types.js')
    .replace('./comparability', './comparability.js')
);

execFileSync(process.execPath, [
  fileURLToPath(import.meta.resolve('typescript/lib/tsc.js')),
  join(dir, 'types.ts'), join(dir, 'comparability.ts'), join(dir, 'health-score.ts'), join(dir, 'post-performance.ts'), join(dir, 'period.ts'),
  '--module', 'esnext', '--target', 'es2022', '--moduleResolution', 'bundler',
  '--resolveJsonModule', '--esModuleInterop', '--skipLibCheck', '--outDir', dir,
], { stdio: 'pipe' });

const health = await import(pathToFileURL(join(dir, 'health-score.js')).href);
const posts = await import(pathToFileURL(join(dir, 'post-performance.js')).href);
const comparison = await import(pathToFileURL(join(dir, 'comparability.js')).href);
const period = await import(pathToFileURL(join(dir, 'period.js')).href);

const baseContext = {
  monthSlug: '2026-08', indexedCount: 8, totalArticles: 10,
  ga4: { usersMoMPct: -65, usersMoMText: '↓ 65%', engagementRate: 50, topPages: [] },
  gsc: { clicksMoMPct: 10, clicksMoMText: '↑ 10%' }, summary: [],
  indexation: [], actionsP0: [], actionsP1: [], actionsP2: [], topAction: { text: 'Sem ações priorizadas' },
};
const lowUsers = health.computeHealthScore(baseContext);
const highUsers = health.computeHealthScore({ ...baseContext, ga4: { ...baseContext.ga4, usersMoMPct: 100 } });
ok('peso de users e removido em agosto', lowUsers.weights.usersGrowth === 0);
ok('pesos disponiveis somam 1', Math.abs(Object.values(lowUsers.weights).reduce((a, b) => a + b, 0) - 1) < 0.0001);
ok('queda GA4 nao altera score de agosto', lowUsers.score === highUsers.score);

const legacy = comparison.applySnapshotComparisonPolicy({
  context: {
    ...baseContext,
    ga4: { ...baseContext.ga4, pageviewsMoMPct: -50, pageviewsMoMText: '↓ 50%', topPages: [{ slug: 'x', momText: '↓ 50%' }] },
    summary: [{ text: '586 usuários (-65% MoM).' }, { text: '1 de 2 artigos indexados no Google.' }],
    indexation: [
      { slug: 'artigo-valido', coverageState: 'Submitted and indexed' },
      { slug: 'steel-frame-futuro-construcao', coverageState: 'Crawled - currently not indexed' },
    ],
    actionsP0: [{ text: 'Solicitar indexação manual no GSC para "/atualidades/steel-frame-futuro-construcao".' }],
  },
});
ok('snapshot legado perde delta GA4', legacy.context.ga4.usersMoMPct === undefined && legacy.context.ga4.pageviewsMoMPct === undefined);
ok('resumo legado perde claim MoM', !legacy.context.summary[0].text.includes('MoM'));
ok('snapshot legado normaliza universo de indexacao', legacy.context.totalArticles === 1 && legacy.context.indexedCount === 1);
ok('snapshot legado remove acao de redirect', legacy.context.actionsP0.length === 0);
const noGscBaseline = comparison.applySnapshotComparisonPolicy({ context: {
  ...baseContext, comparability: { ga4MoM: false, gscMoM: false, reason: 'baseline ausente' },
  ga4: { ...baseContext.ga4, topSources: [] },
  gsc: {
    ...baseContext.gsc,
    risingQueries: [{ query: 'steel frame', clicksCurrent: 12, clicksPrevious: 2, clicksDelta: 10 }],
    fallingQueries: [{ query: 'construção', clicksCurrent: 1, clicksPrevious: 9, clicksDelta: -8 }],
    topQueries: [],
  },
} });
ok('baseline GSC ausente remove tendencias antigas de query', noGscBaseline.context.gsc.risingQueries.length === 0 && noGscBaseline.context.gsc.fallingQueries.length === 0);

// Context enriched preserva a escala original: CTR em %, tempo em segundos.
// Os textos antigos são descartados; números, deltas válidos e datas não mudam.
const oldSnapshot = {
  month: '2026-09-01', generated_at: '2026-09-23T16:14:41Z',
  context: {
    ...baseContext, monthSlug: '2026-09', generatedAt: '2026-09-23 16:14:41',
    periodStart: '2026-09-01', periodEnd: '2026-09-20', partial: true,
    ga4: { ...baseContext.ga4, topPages: [{ slug: 'artigo', title: 'Título da coleta', users: 40, avgEngagementTime: 18 }] },
    gsc: {
      ...baseContext.gsc,
      topQueries: [{ query: 'steel frame', clicks: 2, impressions: 500, ctr: 0.4, position: 8 }],
      topPages: [{ slug: 'artigo', title: 'Título da coleta', clicks: 9, impressions: 300, ctr: 3, position: 14 }],
    },
    indexation: [{ slug: 'inspecao-com-falha', verdict: 'ERROR', coverageState: 'unknown', error: 'timeout' }],
    insights: [{ position: 1, text: 'Subir 5 posições pode triplicar cliques.', impact: 100 }],
    actionsP0: [{ text: 'Solicitar indexação de inspecao-com-falha.' }],
    actionsP1: [{ text: 'Reescrever artigo para triplicar cliques.' }],
  },
};
const oldBefore = JSON.stringify(oldSnapshot);
const refreshed = comparison.applySnapshotComparisonPolicy(oldSnapshot);
assert.deepEqual(refreshed.context.insights, buildInsights({ ga4: oldSnapshot.context.ga4, gsc: oldSnapshot.context.gsc }));
ok('leitura equivale ao gerador sobre os mesmos dados', refreshed.context.insights.length === 3);
ok('leitura nao muta snapshot legado', JSON.stringify(oldSnapshot) === oldBefore);
ok('datas da coleta permanecem originais', refreshed.generated_at === oldSnapshot.generated_at && refreshed.context.generatedAt === oldSnapshot.context.generatedAt && refreshed.context.periodEnd === oldSnapshot.context.periodEnd);
ok('delta GSC valido permanece apos nova interpretacao', refreshed.context.gsc.clicksMoMPct === 10 && refreshed.context.gsc.clicksMoMText === '↑ 10%');
ok('insight conserva escala CTR e evidencia do periodo', refreshed.context.insights.some((item) => item.evidence.includes('CTR 0.4%')));
ok('claims antigos nao chegam ao painel', !JSON.stringify(refreshed.context.insights).includes('triplicar'));
ok('acao legada de inspecao invalida desaparece', refreshed.context.actionsP0.length === 0);
ok('P2 nao infere bounce de tempo baixo', refreshed.context.actionsP2[0].text.includes('40 usuários') && !refreshed.context.actionsP2[0].text.includes('bounce'));
assert.deepEqual(refreshed.context.actionsP1, buildActions({ ga4: oldSnapshot.context.ga4, gsc: oldSnapshot.context.gsc, indexation: [] }).actionsP1);

console.log('frescor da coleta e confirmacao de publicacao');
const freshness = (input, date) => period.snapshotFreshnessNotice(input, new Date(`${date}T15:00:00Z`));
const currentPartial = { monthSlug: '2026-09', periodEnd: '2026-09-20', partial: true };
ok('cadencia semanal mais lag nao gera alarme precoce', freshness(currentPartial, '2026-09-29') === null);
ok('coleta atrasada informa ultima cobertura', freshness({ ...currentPartial, periodEnd: '2026-09-18' }, '2026-09-29')?.includes('Atualização pendente'));
ok('historico fechado nao fica vencido', freshness({ monthSlug: '2025-01', periodEnd: '2025-01-31', partial: false }, '2026-09-29') === null);
ok('aguarda dia 4 para cobrar fechamento', freshness(currentPartial, '2026-10-03') === null);
ok('parcial passado exige fechamento apos dia 4', freshness(currentPartial, '2026-10-04')?.includes('Fechamento pendente'));

const uploadInput = { monthSlug: '2026-09', ga4: {}, gsc: {}, ga4Prev: null, gscPrev: null, context: oldSnapshot.context };
let requestCount = 0;
const confirmedUpload = (input) => upsertSnapshot(input, { request: async (method, url, body, headers) => {
  requestCount++;
  assert.equal(method, 'POST');
  assert.ok(url.endsWith('?select=month,generated_at'));
  assert.equal(headers.Prefer, 'resolution=merge-duplicates,return=representation');
  assert.equal(body[0].context.periodEnd, '2026-09-20');
  return [{ month: body[0].month, generated_at: body[0].generated_at }];
} });
ok('sucesso hospedado exige gravacao confirmada', await persistSnapshot(uploadInput, { required: true, serviceKey: 'mock', upload: confirmedUpload }) === true && requestCount === 1);
await assert.rejects(() => persistSnapshot(uploadInput, { required: true, serviceKey: '', upload: confirmedUpload }), /ausente/);
ok('chave ausente falha antes do upload', requestCount === 1);
await assert.rejects(() => persistSnapshot(uploadInput, { required: true, serviceKey: 'mock', upload: async () => { throw new Error('gravação recusada'); } }), /gravação recusada/);
await assert.rejects(() => upsertSnapshot(uploadInput, { request: async () => [] }), /não foi confirmada/);
await assert.rejects(() => upsertSnapshot(uploadInput, { request: async () => [{ month: '2026-09-01', generated_at: '2020-01-01T00:00:00Z' }] }), /não foi confirmada/);
const localWarnings = [];
ok('modo local preserva artefato e sinaliza falha', await persistSnapshot(uploadInput, { serviceKey: '', warn: (message) => localWarnings.push(message) }) === false && localWarnings.length === 1);
ok('workflow exige persistencia', readFileSync('.github/workflows/analytics-monthly.yml', 'utf8').includes('ANALYTICS_REQUIRE_PERSISTENCE: "true"'));

const missingGscBaseline = comparison.applySnapshotComparisonPolicy({
  context: {
    ...baseContext,
    monthSlug: '2026-10',
    comparability: { ga4MoM: true, gscMoM: false, reason: 'Baseline GSC ausente.' },
    gsc: { clicks: 20, clicksMoMText: '—', clicksMoMPct: 0 },
  },
});
ok('baseline GSC ausente nao vira delta zero', missingGscBaseline.context.gsc.clicksMoMPct === undefined && missingGscBaseline.context.gsc.clicksMoMText === undefined);

const current = {
  context: baseContext,
  ga4_data: { topPages: [{ slug: 'post', pageviews: 200, users: 100, avgEngagementTime: 30 }] },
};
const previous = { ga4_data: { topPages: [{ slug: 'post', pageviews: 10 }] } };
const performance = posts.buildPostPerformance(
  current, previous,
  new Map([['post', { slug: 'post', title: 'Post', category: 'SEO', readTimeMin: 5, publishedAt: null }]]),
  new Map()
)[0];
ok('post de agosto nao recebe delta', performance.pageviewsMoMPct === null);
ok('post de agosto nao vira rising/cold', !['rising', 'cold'].includes(performance.status));

console.log('janelas, falhas parciais e coletores');
const postMap = new Map([['post', { slug: 'post', title: 'Post', category: 'SEO', readTimeMin: 5, publishedAt: null }]]);
const partialCurrent = { ...current, context: { ...baseContext, monthSlug: '2026-10', partial: true, prevPeriodStart: '2026-09-01', prevPeriodEnd: '2026-09-20' }, ga4_prev: { period: { startDate: '2026-09-01', endDate: '2026-09-20' }, topPages: [{ slug: 'post', pageviews: 100 }] } };
const partialPerformance = posts.buildPostPerformance(partialCurrent, previous, postMap,
  new Map([['2026-10', new Map([['post', 200]])], ['2026-11', new Map([['post', 9000]])]]))[0];
ok('artigo parcial usa baseline equivalente salvo no snapshot', partialPerformance.pageviewsMoMPct === 100);
ok('artigo nao inclui meses futuros no sparkline', partialPerformance.pageviewsSparkline.length === 1 && partialPerformance.pageviewsSparkline[0] === 200);
const withoutPartialBaseline = posts.buildPostPerformance({ ...partialCurrent, ga4_prev: null }, previous, postMap, new Map())[0];
ok('parcial sem baseline nao compara contra mes inteiro', withoutPartialBaseline.pageviewsMoMPct === null);
const wrongWindow = posts.buildPostPerformance({ ...partialCurrent, ga4_prev: { ...partialCurrent.ga4_prev, period: { startDate: '2026-09-01', endDate: '2026-09-30' } } }, previous, postMap, new Map())[0];
ok('baseline salvo com janela incorreta nao produz comparacao parcial', wrongWindow.pageviewsMoMPct === null);
const metricValues = (values) => values.map((value) => ({ value: String(value) }));
const fakeGa4 = { properties: { runReport: async ({ requestBody }) => {
  if (requestBody.metrics.length === 8) throw Object.assign(new Error('invalid combination'), { code: 400 });
  return { data: { rows: [{ dimensionValues: [{ value: '/atualidades/post' }],
    metricValues: metricValues(requestBody.metrics.length === 3 ? [100, 20, 600] : [0.3, 0.7, 30, 12, 21]) }] } };
} } };
const fallbackPages = await fetchTopPages(fakeGa4, 'test', '2026-10-01', '2026-10-20', 200);
ok('GA4 fallback le a resposta data desembrulhada', fallbackPages.length === 1 && fallbackPages[0].pageviews === 100 && fallbackPages[0].bounceRate === 30);
const failedEvents = await fetchEvents({ properties: { runReport: async () => { throw new Error('timeout'); } } }, 'test', '2026-10-01', '2026-10-20');
ok('falha de eventos nao vira zero valido', failedEvents.available === false && failedEvents.reason.length > 0);
const missing = computeDelta([], [{ query: 'sumiu', clicks: 15 }], 'falling', 5, { possiblyTruncated: false });
ok('query desaparecida permanece na comparacao com ressalva', missing.length === 1 && missing[0].currentMissing === true && missing[0].clicksPrevious === 15);
ok('query ausente com teto de coleta nao vira queda', computeDelta([], [{ query: 'sumiu', clicks: 15 }], 'falling', 5, { possiblyTruncated: true }).length === 0);
const inspectionError = { slug: 'post', verdict: 'ERROR', error: 'timeout' };
ok('erro de inspecao nao vira nao indexada', !isKnownInspection(inspectionError));
const evidenceInput = { ga4: { topPages: [], topSources: [], byDevice: [] }, gsc: { topQueries: [], topPages: [] }, indexation: [inspectionError] };
ok('erro de inspecao nao recomenda reindexacao', buildActions(evidenceInput).actionsP0.length === 0);
ok('sem sinal nao inventa insight', buildInsights(evidenceInput).length === 0);
const incompleteHealth = health.computeHealthScore({ ...baseContext, totalArticles: 1, indexedCount: 1, indexation: [{ slug: 'ok' }, inspectionError] });
ok('score exclui indexacao com cobertura incompleta', incompleteHealth.weights.indexation === 0 && !incompleteHealth.components.indexation.available);

console.log('exclusoes, leads e PWA');
ok('redirect nao entra na inspecao', !isIndexationEligibleSlug('steel-frame-futuro-construcao'));
ok('artigo elegivel entra na inspecao', isIndexationEligibleSlug('artigo-valido'));

// Mesmo padrão de scripts/test-lead-flow: executa o módulo real, simulando
// apenas os limites de I/O. Nenhuma conexão ou infraestrutura é iniciada.
function loadCommonModule(source, imports) {
  const output = ts.transpileModule(source, { fileName: 'analytics-test.tsx', compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const testModule = { exports: {} };
  new Function('require', 'module', 'exports', output)((name) => {
    assert.ok(Object.hasOwn(imports, name), `Import inesperado: ${name}`);
    return imports[name];
  }, testModule, testModule.exports);
  return testModule.exports;
}
const aiSources = loadCommonModule(readFileSync('lib/analytics/ai-sources.ts', 'utf8'), {});
const narrative = loadCommonModule(readFileSync('lib/analytics/narrative.ts', 'utf8'), {
  './ai-sources': aiSources,
  './comparability': { comparisonAvailability: comparison.comparisonAvailability },
});
const summaryWithRisk = narrative.narrativeAct0Status(
  { monthLabel: 'Setembro/2026', partial: true }, { status: 'good' }, null,
  '1 artigo antes indexado agora sem indexação confirmada: Reforma tributária.',
);
ok('resumo com risco pontuado tem frase legivel', summaryWithRisk.includes('. Maior risco: ') && summaryWithRisk.endsWith('Reforma tributária.') && !summaryWithRisk.endsWith('Reforma tributária..'));
ok('resumo qualifica a faixa como indice dos componentes disponiveis', summaryWithRisk.includes('Health Score de Setembro/2026 (parcial)') && summaryWithRisk.includes('componentes disponíveis') && !summaryWithRisk.includes('está bom'));
ok('narrativa nao inventa ganho de query sem baseline', !narrative.narrativeAct2Origin(noGscBaseline.context).includes('ganhou'));
const lowCoverage = {
  ...baseContext, indexedCount: 4,
  ga4: { ...baseContext.ga4, usersMoMPct: undefined },
  gsc: { ...baseContext.gsc, clicksMoMPct: undefined },
};
const coverageRisk = narrative.detectRedFlag(lowCoverage);
ok('cobertura baixa nao inventa queda sem baseline', coverageRisk?.includes('4 de 10 artigos') && !coverageRisk.includes('caiu'));
ok('queda medida continua explicita e concorda com o sujeito', narrative.detectRedFlag({
  ...baseContext, indexedCount: 8, ga4: { ...baseContext.ga4, usersMoMPct: -25, users: 40 },
})?.includes('usuários caíram 25%'));
ok('ganho medido concorda com cliques', narrative.detectWin({
  ...baseContext, ga4: { ...baseContext.ga4, usersMoMPct: undefined },
  gsc: { ...baseContext.gsc, clicksMoMPct: 25, clicks: 25 },
}) === 'cliques no Google cresceram 25% (25 cliques)');
const capturedSources = withTotalSessionShares([
  { label: 'chatgpt.com / referral', sessions: 30, users: 20 },
  { label: 'google / organic', sessions: 20, users: 18 },
], 100);
ok('coletor usa todas as sessoes GA4 como denominador, sem inflar top fontes', capturedSources[0].pctOfTotal === 30 && capturedSources[1].pctOfTotal === 20);
const sourceNarrative = narrative.narrativeAct2Origin({
  ...baseContext,
  ga4: { ...baseContext.ga4, sessions: 100, topSources: capturedSources },
  gsc: { ...baseContext.gsc, risingQueries: [] },
});
ok('narrativa distingue sessoes de usuarios e evita atribuicao causal a IA', sourceNarrative.includes('representa 30% das sessões no GA4') && sourceNarrative.includes('fontes capturadas') && sourceNarrative.includes('30 sessões (30% de todas as sessões no GA4)') && !sourceNarrative.includes('IAs trouxeram'));

const { detectRedFlags } = loadCommonModule(readFileSync('lib/analytics/red-flags.ts', 'utf8'), {
  './comparability': { isKnownIndexation: () => true, isIndexedCoverage: () => true, comparisonAvailability: comparison.comparisonAvailability },
});
const opportunityFlags = detectRedFlags({
  ...baseContext, indexedCount: 8,
  ga4: { engagementRate: 50 },
  gsc: { topQueries: [{ query: 'construção', impressions: 600, ctr: 1, clicks: 6 }] },
}, null);
ok('acao SEO pede identificar a pagina antes de editar', opportunityFlags.find((flag) => flag.id === 'opportunity-queries')?.action?.includes('qual página'));

const Card = ({ children }) => jsxRuntime.jsx('div', { children });
const Icon = () => null;
const { HeroMetric } = loadCommonModule(readFileSync('components/admin/analytics/HeroMetric.tsx', 'utf8'), {
  'react/jsx-runtime': jsxRuntime,
  '@/components/ui/card': { Card },
  'lucide-react': { Activity: Icon, TrendingUp: Icon, TrendingDown: Icon, Minus: Icon },
  './MetricTooltip': { MetricTooltip: () => null },
  './SparklineMini': { SparklineMini: () => null },
  '@/lib/utils': { cn: (...classes) => classes.filter(Boolean).join(' ') },
  '@/lib/analytics/health-score': health,
  '@/lib/analytics/comparability': comparison,
  '@/lib/analytics/period': period,
});
const noGscMarkup = renderToStaticMarkup(jsxRuntime.jsx(HeroMetric, { context: { ...noGscBaseline.context, monthLabel: 'Agosto/2026' }, trendPoints: [] }));
ok('hero explica cliques sem baseline em vez de deixar valor vazio', /Cliques\s*<strong[^>]*>comparação indisponível<\/strong>/.test(noGscMarkup));
const { WinCard } = loadCommonModule(readFileSync('components/admin/analytics/WinCard.tsx', 'utf8'), {
  'react/jsx-runtime': jsxRuntime,
  '@/components/ui/card': { Card },
  'lucide-react': { Trophy: Icon },
});
const { RedFlagCard } = loadCommonModule(readFileSync('components/admin/analytics/RedFlagCard.tsx', 'utf8'), {
  'react/jsx-runtime': jsxRuntime,
  'react': { useState: () => [false, () => {}] },
  '@/components/ui/card': { Card },
  '@/components/ui/accordion': {},
  'lucide-react': { AlertTriangle: Icon, ShieldCheck: Icon, Circle: Icon },
  '@/lib/utils': { cn: (...classes) => classes.filter(Boolean).join(' ') },
});
const noComparison = renderToStaticMarkup(jsxRuntime.jsx(WinCard, { win: null, hasComparableDeltas: false }));
const noWin = renderToStaticMarkup(jsxRuntime.jsx(WinCard, { win: null, hasComparableDeltas: true }));
ok('sem baseline nao afirma ausencia de ganhos', noComparison.includes('Comparação mensal indisponível') && !noComparison.includes('Sem ganhos'));
ok('sem ganho com baseline mostra criterio', noWin.includes('10%'));
const noFlags = renderToStaticMarkup(jsxRuntime.jsx(RedFlagCard, { flags: [] }));
ok('sem flags nao afirma que tudo esta normal', noFlags.includes('riscos monitorados') && !noFlags.includes('Tudo dentro'));
const { Act0Status } = loadCommonModule(readFileSync('components/admin/analytics/acts/Act0Status.tsx', 'utf8'), {
  'react/jsx-runtime': jsxRuntime,
  '../HeroMetric': { HeroMetric: () => null },
  '../WinCard': { WinCard },
  '../RedFlagCard': { RedFlagCard },
  '@/lib/analytics/health-score': { computeHealthScore: () => ({ status: 'good' }) },
  '@/lib/analytics/narrative': narrative,
  '@/lib/analytics/comparability': { comparisonAvailability: comparison.comparisonAvailability },
});
const statusMarkup = (context) => renderToStaticMarkup(jsxRuntime.jsx(Act0Status, { context, trendPoints: [], redFlags: [] }));
ok('ato 0 usa indisponibilidade real do periodo', statusMarkup(noGscBaseline.context).includes('Comparação mensal indisponível'));
ok('ato 0 mantem ausencia de ganho quando GSC e comparavel', statusMarkup({ ...baseContext, monthLabel: 'Agosto/2026', ga4: { ...baseContext.ga4, users: 100 } }).includes('Nenhum ganho acima de 10%'));

const access = loadCommonModule(readFileSync('lib/admin/access.ts', 'utf8'), {});
const funnel = loadCommonModule(readFileSync('lib/analytics/leads-funnel.ts', 'utf8'), {});
const cohortRows = [
  { id: 'convertido', status: 'convertido', criado_em: '2026-09-01', convertido_em: '2026-09-10', arquivado_em: null, anonimizado_em: null, canal: 'form' },
  { id: 'desqualificado', status: 'desqualificado', criado_em: '2026-09-03', convertido_em: null, arquivado_em: null, anonimizado_em: null, canal: 'form' },
  { id: 'anonimizado', status: 'convertido', criado_em: '2026-09-03', convertido_em: '2026-09-10', arquivado_em: null, anonimizado_em: '2026-09-11' },
  { id: 'depois-do-corte', status: 'novo', criado_em: '2026-09-21', arquivado_em: null, anonimizado_em: null },
];
let role = 'owner';
let cohortQueries = 0;
let queryFails = false;
const cohortClient = { from(table) {
  assert.equal(table, 'leads');
  cohortQueries++;
  const filters = [];
  const query = {
    select(columns) {
      assert.ok(!columns.split(/\s*,\s*/).some((field) => ['*', 'nome', 'email', 'telefone', 'mensagem'].includes(field)));
      return query;
    },
    gte(key, value) { filters.push((row) => row[key] >= value); return query; },
    lt(key, value) { filters.push((row) => row[key] < value); return query; },
    is(key, value) { filters.push((row) => row[key] === value); return query; },
    order() { return query; },
    async range(from, to) {
      return queryFails ? { data: null, error: { message: 'CRM indisponível' } } : { data: cohortRows.filter((row) => filters.every((predicate) => predicate(row))).slice(from, to + 1), error: null };
    },
  };
  return query;
} };
const leadQueries = loadCommonModule(readFileSync('lib/analytics/leads-queries.ts', 'utf8'), {
  'server-only': {},
  '@/lib/supabase/server': { createClient: async () => cohortClient },
  '@/lib/supabase/sessao': { getAdminSession: async () => role ? { membership: { role }, supabase: cohortClient } : null },
  '@/lib/admin/access': access,
});
const beforeArchive = await leadQueries.listarLeadsDoMes('2026-09', '2026-09-20');
assert.equal(beforeArchive.status, 'ok');
const beforeFunnel = funnel.construirFunilLeads(beforeArchive.data);
ok('coorte exclui anonimizados e entradas apos o corte', beforeFunnel.total === 2 && beforeFunnel.convertidos === 1);
cohortRows[1].arquivado_em = '2026-09-29';
const afterArchive = await leadQueries.listarLeadsDoMes('2026-09', '2026-09-20');
assert.equal(afterArchive.status, 'ok');
const afterFunnel = funnel.construirFunilLeads(afterArchive.data);
ok('arquivar nao muda recebidos nem conversao', afterFunnel.total === beforeFunnel.total && afterFunnel.taxaConversao === beforeFunnel.taxaConversao && afterFunnel.desqualificados === 1);
for (const restrictedRole of ['conteudo', 'viewer', null]) {
  role = restrictedRole;
  const callsBefore = cohortQueries;
  const result = await leadQueries.listarLeadsDoMes('2026-09', '2026-09-20');
  ok(`perfil ${restrictedRole ?? 'sem sessao'} nao consulta CRM nem recebe zero`, result.status === 'unavailable' && !('data' in result) && cohortQueries === callsBefore);
}
role = 'comercial';
ok('comercial continua consultando a coorte', (await leadQueries.listarLeadsDoMes('2026-09', '2026-09-20')).status === 'ok');
queryFails = true;
ok('falha do CRM nao vira coorte vazia', (await leadQueries.listarLeadsDoMes('2026-09', '2026-09-20')).status === 'unavailable');

const { ConversionEvents } = loadCommonModule(readFileSync('components/admin/analytics/ConversionEvents.tsx', 'utf8'), { 'react/jsx-runtime': jsxRuntime });
const contactGa4 = { events: [{ name: 'whatsapp_click', count: 12 }], eventsAvailable: true, whatsappBreakdown: { available: true, rows: [] } };
const contactsMarkup = (funil) => renderToStaticMarkup(jsxRuntime.jsx(ConversionEvents, { ga4: contactGa4, funil, monthSlug: '2026-09' }));
const restrictedMarkup = contactsMarkup(null);
ok('perfil sem CRM mantem GA4 e omite cards de leads', restrictedMarkup.includes('Cliques no WhatsApp') && restrictedMarkup.includes('>12<') && !restrictedMarkup.includes('CRM') && !restrictedMarkup.includes('Leads via WhatsApp') && !restrictedMarkup.includes('Formulários'));
const allowedMarkup = contactsMarkup({ status: 'ok', data: afterFunnel });
ok('perfil autorizado ve contatos recebidos incluindo arquivados', allowedMarkup.includes('Formulários') && allowedMarkup.includes('>2<'));
ok('indisponibilidade real continua visivel', contactsMarkup({ status: 'unavailable', reason: 'falha de consulta' }).includes('CRM indisponível'));
const manifest = JSON.parse(readFileSync('public/admin/manifest.webmanifest', 'utf8'));
ok('PWA admin abre dashboard no proprio escopo',
  manifest.id === '/admin/' &&
  manifest.start_url === '/admin' &&
  manifest.scope === '/admin' &&
  manifest.start_url.startsWith(manifest.scope));
const nextConfig = readFileSync('next.config.ts', 'utf8');
ok('manifest tem MIME explicito', nextConfig.includes('application/manifest+json; charset=utf-8'));
const analyticsContent = readFileSync('app/admin/analytics/AnalyticsContent.tsx', 'utf8');
ok('comparativo exige baseline das duas fontes', analyticsContent.includes('!comparability.ga4MoM || !comparability.gscMoM'));
const gscFetcher = readFileSync('scripts/analytics/fetch-gsc.mjs', 'utf8');
ok('falha no baseline de queries nao vira lista vazia valida', gscFetcher.includes('comparisonUnavailableReason = [comparisonUnavailableReason, queriesReason]'));
const act4 = readFileSync('components/admin/analytics/acts/Act4Action.tsx', 'utf8');
ok('painel de queries recebe indisponibilidade', act4.includes('unavailableReason='));
const proxy = readFileSync('proxy.ts', 'utf8');
const manifestBypass = proxy.indexOf('pathname === "/admin/manifest.webmanifest"');
const adminAuth = proxy.indexOf('pathname.startsWith("/admin") || pathname.startsWith("/api/admin")');
ok('manifest passa antes da autenticacao', manifestBypass >= 0 && manifestBypass < adminAuth);
ok('URL direto nao forca comparativo invalido', analyticsContent.includes('comparisonMode && previousSnapshot && !comparisonDisabled'));

rmSync(dir, { recursive: true, force: true });

if (failures === 0) {
  console.log(`\n✓ integridade analytics: ${total} assercoes passaram`);
} else {
  console.error(`\n✗ ${failures} de ${total} assercoes falharam`);
  process.exit(1);
}
