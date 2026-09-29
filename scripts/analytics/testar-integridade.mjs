import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { fetchTopPages, fetchEvents } from './fetch-ga4.mjs';
import { computeDelta } from './fetch-gsc.mjs';
import { buildActions, buildInsights, isKnownInspection } from './lib/insights.mjs';
import { comparisonPolicyFor } from '../../lib/analytics/comparison-policy.mjs';
import { isIndexationEligibleSlug } from './lib/posts.mjs';

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

writeFileSync(
  join(dir, 'comparability.ts'),
  readFileSync('lib/analytics/comparability.ts', 'utf8')
    .replace('@/types/analytics', './types.js')
    .replace('./comparison-policy.mjs', './comparison-policy.mjs')
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
  join(dir, 'types.ts'), join(dir, 'comparability.ts'), join(dir, 'health-score.ts'), join(dir, 'post-performance.ts'),
  '--module', 'esnext', '--target', 'es2022', '--moduleResolution', 'bundler',
  '--resolveJsonModule', '--esModuleInterop', '--skipLibCheck', '--outDir', dir,
], { stdio: 'pipe' });

const health = await import(pathToFileURL(join(dir, 'health-score.js')).href);
const posts = await import(pathToFileURL(join(dir, 'post-performance.js')).href);
const comparison = await import(pathToFileURL(join(dir, 'comparability.js')).href);

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
const leadsQuery = readFileSync('lib/analytics/leads-queries.ts', 'utf8');
ok('funil exclui leads arquivados', leadsQuery.includes('.is("arquivado_em", null)'));
ok('funil retorna estado indisponivel', leadsQuery.includes('status: "unavailable"'));
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
