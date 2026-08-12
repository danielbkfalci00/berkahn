// Usage: node --env-file=.env.local scripts/analytics/fetch-ga4.mjs --start 2026-05-01 --end 2026-05-31
import { google } from 'googleapis';
import { getAuth, getGa4PropertyId } from './lib/auth.mjs';

const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

// Quanto da cauda o snapshot enxerga.
//
// topPages ficou em 50 de maio a agosto de 2026 e os três snapshots do período
// bateram exatamente em 50 — assinatura de teto, não de dado real (fev/mar/abr,
// com menos tráfego, deram 16/33/41).
//
// fetchByArea já agregava sobre 200 páginas, então a distribuição por área e a
// lista de topPages guardada olhavam populações diferentes. Usar a mesma
// constante nos dois lugares elimina essa divergência.
const LIMITE_PAGINAS = 200;
const LIMITE_FONTES = 50;

const PAGE_AREAS = [
  { pattern: /^\/atualidades\//, area: 'Blog (atualidades)' },
  { pattern: /^\/lsf/, area: 'Pillar LSF' },
  { pattern: /^\/servicos/, area: 'Serviços' },
  { pattern: /^\/contato/, area: 'Contato' },
  { pattern: /^\/$/, area: 'Home' },
];

function classifyArea(path) {
  for (const { pattern, area } of PAGE_AREAS) {
    if (pattern.test(path)) return area;
  }
  return 'Outras';
}

async function runReport(data, propertyId, requestBody) {
  const res = await data.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody,
  });
  return res.data;
}

async function fetchOverall(data, propertyId, startDate, endDate) {
  const res = await runReport(data, propertyId, {
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'totalUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'engagementRate' },
      { name: 'averageSessionDuration' },
    ],
  });
  const row = res.rows?.[0]?.metricValues || [];
  return {
    users: parseInt(row[0]?.value || '0'),
    sessions: parseInt(row[1]?.value || '0'),
    pageviews: parseInt(row[2]?.value || '0'),
    // engagementRate vem como ratio (0.61 = 61%). Multiplicamos por 100 pra ficar em %
    engagementRate: parseFloat((parseFloat(row[3]?.value || '0') * 100).toFixed(1)),
    avgSessionDuration: parseFloat(parseFloat(row[4]?.value || '0').toFixed(1)),
  };
}

// `limit` sem default de propósito: um default aqui truncou a cauda por três
// meses sem ninguém notar, porque os totais vinham de outra chamada e batiam.
async function fetchTopPages(data, propertyId, startDate, endDate, limit) {
  // Query unificada com 7 métricas. Se 400 (combinação inválida no v1beta), split em 2 queries.
  const primaryMetrics = [
    { name: 'screenPageViews' },
    { name: 'totalUsers' },
    { name: 'userEngagementDuration' },
    { name: 'bounceRate' },
    { name: 'engagementRate' },
    { name: 'sessions' },
    { name: 'newUsers' },
    { name: 'engagedSessions' },
  ];

  let rows = [];
  let usedSplit = false;
  try {
    const res = await runReport(data, propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: primaryMetrics,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit,
    });
    rows = res.rows || [];
  } catch (e) {
    // Fallback: tenta 2 queries menores e dá join no client
    if (!String(e?.message ?? '').includes('400')) throw e;
    usedSplit = true;
    const [resA, resB] = await Promise.all([
      runReport(data, propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'userEngagementDuration' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit,
      }),
      runReport(data, propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'bounceRate' },
          { name: 'engagementRate' },
          { name: 'sessions' },
          { name: 'newUsers' },
          { name: 'engagedSessions' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit,
      }),
    ]);
    const mapB = new Map();
    for (const r of resB.data?.rows ?? []) {
      mapB.set(r.dimensionValues[0].value, r.metricValues);
    }
    rows = (resA.data?.rows ?? []).map((r) => {
      const path = r.dimensionValues[0].value;
      const extra = mapB.get(path);
      const combined = [...r.metricValues, ...(extra ?? Array.from({ length: 5 }, () => ({ value: '0' })))];
      return { dimensionValues: r.dimensionValues, metricValues: combined };
    });
  }

  return rows.map((r) => {
    const path = r.dimensionValues[0].value;
    const usersRaw = parseInt(r.metricValues[1]?.value || '0');
    const usersSafe = usersRaw || 1; // evita div/0
    return {
      path,
      slug: path.replace(/^\/atualidades\//, '').replace(/\/$/, ''),
      pageviews: parseInt(r.metricValues[0]?.value || '0'),
      users: usersRaw,
      avgEngagementTime: parseFloat(
        (parseFloat(r.metricValues[2]?.value || '0') / usersSafe).toFixed(1)
      ),
      // Novas métricas: bounceRate e engagementRate vêm como ratio 0-1 → multiplicamos por 100
      bounceRate: parseFloat(
        (parseFloat(r.metricValues[3]?.value || '0') * 100).toFixed(1)
      ),
      engagementRate: parseFloat(
        (parseFloat(r.metricValues[4]?.value || '0') * 100).toFixed(1)
      ),
      sessions: parseInt(r.metricValues[5]?.value || '0'),
      newUsers: parseInt(r.metricValues[6]?.value || '0'),
      engagedSessions: parseInt(r.metricValues[7]?.value || '0'),
    };
  });
}

async function fetchTopSources(data, propertyId, startDate, endDate, limit) {
  const res = await runReport(data, propertyId, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit,
  });
  const totalSessions = (res.rows || []).reduce((s, r) => s + parseInt(r.metricValues[0].value), 0);
  return (res.rows || []).map((r) => {
    const sessions = parseInt(r.metricValues[0].value);
    return {
      label: r.dimensionValues[0].value,
      sessions,
      users: parseInt(r.metricValues[1].value),
      pctOfTotal: totalSessions > 0 ? parseFloat(((sessions / totalSessions) * 100).toFixed(1)) : 0,
    };
  });
}

async function fetchByDevice(data, propertyId, startDate, endDate) {
  const res = await runReport(data, propertyId, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'totalUsers' }],
  });
  const total = (res.rows || []).reduce((s, r) => s + parseInt(r.metricValues[0].value), 0);
  return (res.rows || []).map((r) => {
    const users = parseInt(r.metricValues[0].value);
    return {
      device: r.dimensionValues[0].value,
      users,
      pctOfTotal: total > 0 ? parseFloat(((users / total) * 100).toFixed(1)) : 0,
    };
  });
}

async function fetchByArea(data, propertyId, startDate, endDate) {
  const pages = await fetchTopPages(data, propertyId, startDate, endDate, LIMITE_PAGINAS);
  const buckets = {};
  let total = 0;
  pages.forEach((p) => {
    const area = classifyArea(p.path);
    buckets[area] = (buckets[area] || 0) + p.pageviews;
    total += p.pageviews;
  });
  return Object.entries(buckets)
    .map(([area, pageviews]) => ({
      area,
      pageviews,
      pctOfTotal: total > 0 ? parseFloat(((pageviews / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.pageviews - a.pageviews);
}

// Allowlist de eventos. TEM que espelhar o type EventName de lib/analytics.ts —
// os dois lados vivem em arquivos que nunca se importam, então o desencontro é
// silencioso: até 2026-07-30 esta lista pedia 5 nomes que o site não disparava
// e ignorava os 3 que ele disparava, e `events` voltou `[]` em todos os meses.
//
// `contact` não existe e nunca existiu — mantido fora de propósito.
const EVENTOS_RASTREADOS = [
  // Conversão
  'generate_lead',
  'form_submit',
  'whatsapp_click',
  'cta_click',
  'article_progress',
  // Curadoria de arquitetos
  'select_architect',
  'architect_contact_click',
  'architect_berkahn_whatsapp',
];

async function fetchEvents(data, propertyId, startDate, endDate) {
  const relevantEvents = EVENTOS_RASTREADOS;
  try {
    const res = await runReport(data, propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: relevantEvents },
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: EVENTOS_RASTREADOS.length,
    });
    return (res.rows || []).map((r) => ({
      name: r.dimensionValues[0].value,
      count: parseInt(r.metricValues[0].value),
      topPages: '', // pode ser preenchido com query secundária se necessário
    }));
  } catch (e) {
    return [];
  }
}
async function fetchArticleProgress(data, propertyId, startDate, endDate) {
  try {
    const res = await runReport(data, propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'customEvent:article_slug' },
        { name: 'customEvent:percent_scrolled' },
      ],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: { matchType: 'EXACT', value: 'article_progress' },
        },
      },
      limit: 10000,
    });

    return {
      available: true,
      rows: (res.rows || []).map((row) => ({
        slug: row.dimensionValues[0]?.value || '',
        percent: parseInt(row.dimensionValues[1]?.value || '0'),
        count: parseInt(row.metricValues[0]?.value || '0'),
      })),
    };
  } catch (error) {
    return {
      available: false,
      reason: String(error?.message || error),
      rows: [],
    };
  }
}


export async function fetchGa4(startDate, endDate) {
  const auth = getAuth([GA4_SCOPE]);
  const propertyId = getGa4PropertyId();
  const data = google.analyticsdata({ version: 'v1beta', auth });

  const [overall, topPages, topSources, byDevice, byArea, events, articleProgress] = await Promise.all([
    fetchOverall(data, propertyId, startDate, endDate),
    fetchTopPages(data, propertyId, startDate, endDate, LIMITE_PAGINAS),
    fetchTopSources(data, propertyId, startDate, endDate, LIMITE_FONTES),
    fetchByDevice(data, propertyId, startDate, endDate),
    fetchByArea(data, propertyId, startDate, endDate),
    fetchEvents(data, propertyId, startDate, endDate),
    fetchArticleProgress(data, propertyId, startDate, endDate),
  ]);

  return {
    ...overall,
    topPages,
    topSources,
    byDevice,
    byArea,
    events,
    period: { startDate, endDate },
    articleProgress,
  };
}

// CLI entry
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);
  const start = args[args.indexOf('--start') + 1];
  const end = args[args.indexOf('--end') + 1];
  if (!start || !end) {
    console.error('Usage: node fetch-ga4.mjs --start YYYY-MM-DD --end YYYY-MM-DD');
    process.exit(1);
  }
  fetchGa4(start, end)
    .then((r) => console.log(JSON.stringify(r, null, 2)))
    .catch((e) => {
      console.error('Erro:', e.message);
      process.exit(1);
    });
}
