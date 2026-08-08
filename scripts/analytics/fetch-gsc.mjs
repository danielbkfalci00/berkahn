// Usage: node --env-file=.env.local scripts/analytics/fetch-gsc.mjs --start 2026-05-01 --end 2026-05-31
import { google } from 'googleapis';
import { getAuth, getGscSiteUrl } from './lib/auth.mjs';

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SITE_BASE = 'https://www.berkahn.com.br';

async function searchAnalytics(sc, siteUrl, requestBody) {
  const res = await sc.searchanalytics.query({
    siteUrl,
    requestBody,
  });
  return res.data.rows || [];
}

async function fetchOverall(sc, siteUrl, startDate, endDate) {
  const rows = await searchAnalytics(sc, siteUrl, {
    startDate,
    endDate,
    aggregationType: 'auto',
  });
  if (rows.length === 0) {
    return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  }
  const r = rows[0];
  return {
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: parseFloat((r.ctr * 100).toFixed(2)),
    position: parseFloat(r.position.toFixed(1)),
  };
}

async function fetchTopQueries(sc, siteUrl, startDate, endDate, limit = 20) {
  const rows = await searchAnalytics(sc, siteUrl, {
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: limit,
  });
  return rows.map((r) => ({
    query: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: parseFloat((r.ctr * 100).toFixed(2)),
    position: parseFloat(r.position.toFixed(1)),
  }));
}

async function fetchTopPages(sc, siteUrl, startDate, endDate, limit = 15) {
  const rows = await searchAnalytics(sc, siteUrl, {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: limit,
  });
  return rows.map((r) => {
    const page = r.keys[0];
    const slugMatch = page.match(/\/atualidades\/([^/]+)\/?$/);
    return {
      page,
      slug: slugMatch ? slugMatch[1] : page.replace(SITE_BASE, '') || '/',
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: parseFloat((r.ctr * 100).toFixed(2)),
      position: parseFloat(r.position.toFixed(1)),
    };
  });
}

// Filtros de relevância: query precisa ter tido volume mínimo no período anterior
// e o delta absoluto precisa cruzar o threshold pra não pulsar com "1 query perdeu 1 clique".
const MIN_BASELINE_CLICKS = 5;
const MIN_ABS_DELTA = 3;

function computeDelta(current, previous, key, limit = 5) {
  const prevMap = new Map(previous.map((q) => [q.query, q.clicks]));
  const enriched = current.map((q) => ({
    query: q.query,
    clicksCurrent: q.clicks,
    clicksPrevious: prevMap.get(q.query) ?? 0,
    clicksDelta: q.clicks - (prevMap.get(q.query) ?? 0),
  }));
  const significant = enriched.filter(
    (q) => q.clicksPrevious >= MIN_BASELINE_CLICKS && Math.abs(q.clicksDelta) >= MIN_ABS_DELTA
  );
  if (key === 'rising') {
    return significant.filter((q) => q.clicksDelta > 0).sort((a, b) => b.clicksDelta - a.clicksDelta).slice(0, limit);
  }
  return significant.filter((q) => q.clicksDelta < 0).sort((a, b) => a.clicksDelta - b.clicksDelta).slice(0, limit);
}

async function inspectUrls(sc, siteUrl, urls) {
  // URL Inspection API: 1 URL por chamada, rate limit 2000/dia
  const inspectionService = google.searchconsole({ version: 'v1', auth: sc.context._options.auth });
  const results = [];
  for (const url of urls) {
    try {
      const res = await inspectionService.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl,
        },
      });
      const r = res.data.inspectionResult?.indexStatusResult;
      results.push({
        url,
        slug: url.match(/\/atualidades\/([^/]+)\/?$/)?.[1] || url,
        verdict: r?.verdict || 'UNKNOWN',
        coverageState: r?.coverageState || 'unknown',
        indexingState: r?.indexingState || 'unknown',
        lastCrawlTime: r?.lastCrawlTime || null,
        googleCanonical: r?.googleCanonical || null,
        userCanonical: r?.userCanonical || null,
      });
      // Throttle: GSC URL Inspection tem rate limit interno
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      results.push({
        url,
        slug: url.match(/\/atualidades\/([^/]+)\/?$/)?.[1] || url,
        verdict: 'ERROR',
        error: e.message,
      });
    }
  }
  return results;
}

export async function fetchGsc(startDate, endDate, options = {}) {
  const auth = getAuth([GSC_SCOPE]);
  const siteUrl = getGscSiteUrl();
  const sc = google.searchconsole({ version: 'v1', auth });

  const [overall, topQueries, topPages] = await Promise.all([
    fetchOverall(sc, siteUrl, startDate, endDate),
    fetchTopQueries(sc, siteUrl, startDate, endDate, 20),
    fetchTopPages(sc, siteUrl, startDate, endDate, 15),
  ]);

  // Comparação MoM com período anterior do mesmo tamanho
  let risingQueries = [];
  let fallingQueries = [];
  if (options.previousPeriod) {
    const prevQueries = await fetchTopQueries(
      sc,
      siteUrl,
      options.previousPeriod.startDate,
      options.previousPeriod.endDate,
      100
    );
    const currentQueriesExt = await fetchTopQueries(sc, siteUrl, startDate, endDate, 100);
    risingQueries = computeDelta(currentQueriesExt, prevQueries, 'rising', 5);
    fallingQueries = computeDelta(currentQueriesExt, prevQueries, 'falling', 5);
  }

  // URL Inspection para indexação de artigos
  let indexation = [];
  if (options.urlsToInspect && options.urlsToInspect.length > 0) {
    indexation = await inspectUrls(sc, siteUrl, options.urlsToInspect);
  }

  return {
    ...overall,
    topQueries,
    topPages,
    risingQueries,
    fallingQueries,
    indexation,
    period: { startDate, endDate },
  };
}

// CLI entry
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);
  const start = args[args.indexOf('--start') + 1];
  const end = args[args.indexOf('--end') + 1];
  if (!start || !end) {
    console.error('Usage: node fetch-gsc.mjs --start YYYY-MM-DD --end YYYY-MM-DD');
    process.exit(1);
  }
  fetchGsc(start, end)
    .then((r) => console.log(JSON.stringify(r, null, 2)))
    .catch((e) => {
      console.error('Erro:', e.message);
      process.exit(1);
    });
}
