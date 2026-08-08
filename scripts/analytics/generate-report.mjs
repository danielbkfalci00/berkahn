// Usage:
//   node --env-file=.env.local scripts/analytics/generate-report.mjs                   # mês passado (auto)
//   node --env-file=.env.local scripts/analytics/generate-report.mjs --month 2026-04   # mês específico
//   node --env-file=.env.local scripts/analytics/generate-report.mjs --partial         # mês corrente, parcial
//   node --env-file=.env.local scripts/analytics/generate-report.mjs --bootstrap       # últimos 3 meses
//   node --env-file=.env.local scripts/analytics/generate-report.mjs --fixture <name>  # lê fixture
//   node --env-file=.env.local scripts/analytics/generate-report.mjs --dry-run         # não grava hubs nem Supabase
//   node --env-file=.env.local scripts/analytics/generate-report.mjs --as-of 2026-06-20 # finge outra data (dev)
//
// Mês parcial: passar --month do mês CORRENTE ativa o modo parcial automaticamente
// (não existe outra leitura honesta — o mês não acabou). --partial é atalho para
// "mês corrente". O run sem flags continua sendo o último mês FECHADO, que é o que
// o cron berkahn-performance-mensal usa — esse comportamento não mudou.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Mustache from 'mustache';
// Mustache escape padrão é HTML escape. Aqui geramos markdown puro, então desligamos.
Mustache.escape = (text) => String(text);
import { fetchGa4 } from './fetch-ga4.mjs';
import { fetchGsc } from './fetch-gsc.mjs';
import { renderHtml } from './render-html.mjs';
import { updateHubKpis } from './update-hub-kpis.mjs';
import { upsertSnapshot } from './lib/supabase-snapshot.mjs';
import { enrichRowsWithTitle, getAllPostUrls } from './lib/posts.mjs';
import { buildInsights, buildActions, buildSummary, isIndexedState } from './lib/insights.mjs';
import { syncContentLearning } from './lib/content-learning.mjs';
import {
  monthBounds, previousMonth, lastClosedMonth, monthLabel, monthSlug, parseMonthArg,
  daysInMonth, todayLocal, isCurrentMonth, isFutureMonth, partialMonthBounds, equivalentPreviousWindow,
} from './lib/period.mjs';
import { getGa4PropertyId, getGscSiteUrl } from './lib/auth.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, 'templates');
const FIXTURE_DIR = path.join(__dirname, 'fixtures');
const VAULT_OUT_DIR = path.resolve(__dirname, '../..', 'Berkahn-Vault/40-content/auditorias-seo');
const SCHEDULER_ERROR_LOG = path.join(os.homedir(), '.claude', 'scheduled-tasks', 'berkahn-performance-mensal', 'last-error.log');

function writeSchedulerError(err) {
  try {
    fs.mkdirSync(path.dirname(SCHEDULER_ERROR_LOG), { recursive: true });
    const payload = {
      timestamp: new Date().toISOString(),
      message: err?.message ?? String(err),
      stack: err?.stack ?? null,
    };
    fs.writeFileSync(SCHEDULER_ERROR_LOG, JSON.stringify(payload, null, 2) + '\n');
  } catch { /* best-effort */ }
}

function clearSchedulerError() {
  try { fs.rmSync(SCHEDULER_ERROR_LOG, { force: true }); } catch { /* ok */ }
}

function fmtDelta(current, previous, kind = 'pct') {
  if (previous === undefined || previous === null || previous === 0) {
    return { text: '—', pct: null };
  }
  const delta = ((current - previous) / previous) * 100;
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
  return {
    text: `${arrow} ${Math.abs(delta).toFixed(1)}%`,
    pct: parseFloat(delta.toFixed(1)),
  };
}

function applyDeltas(current, previous) {
  const result = { ...current };
  for (const key of ['users', 'sessions', 'pageviews', 'engagementRate', 'avgSessionDuration', 'clicks', 'impressions', 'ctr', 'position']) {
    if (current[key] !== undefined) {
      const d = fmtDelta(current[key], previous?.[key]);
      result[`${key}MoMText`] = d.text;
      result[`${key}MoMPct`] = d.pct ?? 0;
    }
  }
  return result;
}

// Defensive patch: normaliza engagementRate se vier como ratio (0-1) em vez de pct (0-100)
function normalizeGa4(data) {
  if (!data) return data;
  if (data.engagementRate !== undefined && data.engagementRate > 0 && data.engagementRate < 5) {
    data.engagementRate = parseFloat((data.engagementRate * 100).toFixed(1));
  }
  return data;
}

// Fixtures antigas (2026-02..2026-06) não têm _meta — ausente significa "mês
// fechado, janela desconhecida". Só recusa quando o _meta existe e contradiz o
// que está sendo pedido, para não reusar dado parcial como se fosse fechamento.
function assertFixtureMatches(fx, { fixtureName, isPartial, period }) {
  const meta = fx._meta;
  if (!meta) return;
  if (meta.partial && !isPartial) {
    throw new Error(
      `Fixture ${fixtureName}.json é de mês PARCIAL (${meta.periodStart}..${meta.periodEnd}), ` +
      `mas o run pedido é de mês fechado. Apague a fixture ou rode com --partial.`
    );
  }
  if (meta.periodStart !== period.startDate || meta.periodEnd !== period.endDate) {
    console.warn(
      `   ⚠️  Fixture ${fixtureName}.json cobre ${meta.periodStart}..${meta.periodEnd}, ` +
      `mas o período pedido é ${period.startDate}..${period.endDate}. Os números não batem com o rótulo.`
    );
  }
}

async function buildContext({ year, month, useFixture, fromCache = false, partial = false, asOf = new Date() }) {
  const slug = monthSlug(year, month);
  // partialMonthBounds devolve partial:false quando o corte já alcançou o fim
  // do mês — ou seja, quando o mês fechou de fato e não há o que marcar.
  const period = partial ? partialMonthBounds(year, month, { asOf }) : { ...monthBounds(year, month), partial: false };
  const isPartial = period.partial === true;
  const dim = daysInMonth(year, month);
  const prev = previousMonth(year, month);
  // Em mês parcial o MoM compara a MESMA contagem de dias, senão 26 dias de
  // julho seriam medidos contra 30 de junho e todo delta viria negativo.
  const prevPeriod = isPartial
    ? equivalentPreviousWindow(year, month, period.daysCovered)
    : monthBounds(prev.year, prev.month);

  let ga4Data, gscData, ga4Prev, gscPrev;
  // useFixture (explicit) > fromCache (use fixture do mês se existir) > fetch fresh
  const cacheSlug = isPartial ? `${slug}-partial` : slug;
  const fixtureName = useFixture || cacheSlug;
  const fixturePath = path.join(FIXTURE_DIR, `${fixtureName}.json`);
  const shouldUseFixture = (useFixture || fromCache) && fs.existsSync(fixturePath);

  if (shouldUseFixture) {
    const fx = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
    assertFixtureMatches(fx, { fixtureName, isPartial, period });
    ga4Data = normalizeGa4(fx.ga4); gscData = fx.gsc;
    ga4Prev = normalizeGa4(fx.ga4Prev); gscPrev = fx.gscPrev;
  } else {
    const urls = await getAllPostUrls();
    const [ga4Raw, gscRaw, ga4PrevRaw, gscPrevRaw] = await Promise.all([
      fetchGa4(period.startDate, period.endDate),
      fetchGsc(period.startDate, period.endDate, { previousPeriod: prevPeriod, urlsToInspect: urls }),
      fetchGa4(prevPeriod.startDate, prevPeriod.endDate).catch(() => null),
      fetchGsc(prevPeriod.startDate, prevPeriod.endDate).catch(() => null),
    ]);
    ga4Data = normalizeGa4(ga4Raw); gscData = gscRaw;
    ga4Prev = normalizeGa4(ga4PrevRaw); gscPrev = gscPrevRaw;

    // Save fixture for future iteration. Sufixo -partial mantém a fixture do
    // mês fechado intocada, para --from-cache não reusar dado incompleto.
    if (!fs.existsSync(FIXTURE_DIR)) fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(FIXTURE_DIR, `${cacheSlug}.json`),
      JSON.stringify({
        ga4: ga4Data,
        gsc: gscData,
        ga4Prev,
        gscPrev,
        _meta: {
          partial: isPartial,
          periodStart: period.startDate,
          periodEnd: period.endDate,
          prevPeriodStart: prevPeriod.startDate,
          prevPeriodEnd: prevPeriod.endDate,
          generatedAt: new Date().toISOString(),
        },
      }, null, 2)
    );
  }

  // Enriquecer com títulos de posts
  ga4Data.topPages = await enrichRowsWithTitle(ga4Data.topPages, 'slug');
  gscData.topPages = await enrichRowsWithTitle(gscData.topPages, 'slug');
  const indexation = await enrichRowsWithTitle(gscData.indexation, 'slug');
  const indexationWithStatus = indexation.map((i) => {
    const isIndexed = isIndexedState(i.coverageState);
    return {
      ...i,
      statusLabel: isIndexed ? '✅ Indexada' : (i.verdict === 'PASS' ? '⚠️ Crawled' : '❌ Não indexada'),
      lastCrawlTime: i.lastCrawlTime ? new Date(i.lastCrawlTime).toLocaleDateString('pt-BR') : '—',
    };
  });

  const ga4WithDeltas = applyDeltas(ga4Data, ga4Prev);
  const gscWithDeltas = applyDeltas(gscData, gscPrev);

  // Aplica deltas em topPages do GA4 (vs mês anterior)
  if (ga4Prev?.topPages) {
    const prevMap = new Map(ga4Prev.topPages.map((p) => [p.slug, p.pageviews]));
    ga4WithDeltas.topPages = ga4WithDeltas.topPages.map((p) => {
      const d = fmtDelta(p.pageviews, prevMap.get(p.slug));
      return { ...p, momText: d.text };
    });
  } else {
    ga4WithDeltas.topPages = ga4WithDeltas.topPages.map((p) => ({ ...p, momText: '—' }));
  }

  const insights = buildInsights({ ga4: ga4Data, gsc: gscData, ga4Prev, gscPrev, indexation: indexationWithStatus });
  const { actionsP0, actionsP1, actionsP2 } = buildActions({ ga4: ga4Data, gsc: gscData, indexation: indexationWithStatus });
  const summary = buildSummary({ ga4: ga4Data, gsc: gscData, ga4Prev, gscPrev, indexation: indexationWithStatus });

  const indexedCount = indexationWithStatus.filter((i) => isIndexedState(i.coverageState)).length;

  // toISOString() é UTC: rodando 21h-23h59 local o carimbo sairia um dia à frente.
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  return {
    generatedDate: todayLocal(now),
    generatedAt: `${todayLocal(now)} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    monthLabel: monthLabel(year, month),
    monthSlug: slug,
    periodStart: period.startDate,
    periodEnd: period.endDate,
    partial: isPartial,
    daysCovered: period.daysCovered ?? dim,
    daysInMonth: dim,
    asOfDate: period.asOfDate ?? period.endDate,
    gscLagDays: period.lagDays ?? null,
    prevPeriodStart: prevPeriod.startDate,
    prevPeriodEnd: prevPeriod.endDate,
    prevDaysCovered: prevPeriod.daysCovered ?? null,
    periodoAnaliseLabel: isPartial
      ? `${period.startDate} a ${period.endDate} (parcial, ${period.daysCovered} de ${dim} dias)`
      : `${period.startDate} a ${period.endDate}`,
    ga4: ga4WithDeltas,
    gsc: gscWithDeltas,
    indexation: indexationWithStatus,
    indexedCount,
    totalArticles: indexationWithStatus.length,
    topArticle: ga4WithDeltas.topPages[0] || { title: '—', slug: '—' },
    summary,
    insights,
    actionsP0,
    actionsP1,
    actionsP2,
    topAction: actionsP0[0] || actionsP1[0] || { text: 'Sem ações priorizadas' },
    ga4PropertyId: getGa4PropertyId(),
    gscSiteUrl: getGscSiteUrl(),
    historicalMonths: 'em breve (após 3 meses de bootstrap)',
    // Raw data passthrough (para upsert Supabase)
    _raw: { ga4: ga4Data, gsc: gscData, ga4Prev, gscPrev },
  };
}

async function generateOne({ year, month, useFixture, fromCache = false, partial = false, asOf = new Date(), dryRun = false }) {
  console.log(`\n📊 Gerando relatório de ${monthLabel(year, month)}...`);

  const context = await buildContext({ year, month, useFixture, fromCache, partial, asOf });
  const slug = monthSlug(year, month);

  if (context.partial) {
    console.log(`   ⏳ PARCIAL: ${context.periodStart} a ${context.periodEnd} (${context.daysCovered} de ${context.daysInMonth} dias, lag GSC ${context.gscLagDays}d)`);
    console.log(`   ↔️  MoM compara com ${context.prevPeriodStart} a ${context.prevPeriodEnd} (${context.prevDaysCovered} dias)`);
  }

  const templateMd = fs.readFileSync(path.join(TEMPLATE_DIR, 'report.md.mustache'), 'utf-8');
  const md = Mustache.render(templateMd, context);

  if (!fs.existsSync(VAULT_OUT_DIR)) fs.mkdirSync(VAULT_OUT_DIR, { recursive: true });
  const mdPath = path.join(VAULT_OUT_DIR, `${slug}-performance-blog.md`);
  fs.writeFileSync(mdPath, md);
  console.log(`   ✅ MD: ${mdPath}`);

  const htmlPath = path.join(VAULT_OUT_DIR, `${slug}-performance-blog.html`);
  await renderHtml(md, context, htmlPath);
  console.log(`   ✅ HTML: ${htmlPath}`);

  if (dryRun) {
    console.log(`   ⊘  --dry-run: hubs e Supabase não foram tocados`);
    return { mdPath, htmlPath, context };
  }

  const hubs = await updateHubKpis(context);
  if (hubs?.skipped) {
    console.log(`   ⊘  Hubs não atualizados (relatório parcial). Valores parciais são menores que o fechamento e fariam /standup e /wrap-up narrarem queda que não existe.`);
  } else {
    console.log(`   ✅ Hubs atualizados (blog.md, seo-aeo.md)`);
  }

  // Upsert no Supabase (analytics_snapshots) — não bloqueia se falhar
  if (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY) {
    try {
      const { _raw, ...contextForDb } = context;
      await upsertSnapshot({
        monthSlug: slug,
        ga4: _raw.ga4,
        gsc: _raw.gsc,
        ga4Prev: _raw.ga4Prev,
        gscPrev: _raw.gscPrev,
        context: contextForDb,
      });
      console.log(`   ✅ Snapshot salvo no Supabase (analytics_snapshots)`);
    } catch (e) {
      console.warn(`   ⚠️  Falha ao salvar snapshot no Supabase: ${e.message}`);
      console.warn(`      (relatório local foi gerado normalmente)`);
    }
  } else {
    console.log(`   ℹ️  SUPABASE_SERVICE_ROLE_KEY ausente — snapshot não foi enviado ao Supabase`);
  }

  return { mdPath, htmlPath, context };
}
async function runLearningLoop({ asOf = new Date(), dryRun = false }) {
  const end = new Date(asOf);
  end.setDate(end.getDate() - 3);
  const start = new Date(end);
  start.setDate(start.getDate() - 27);
  const startDate = todayLocal(start);
  const endDate = todayLocal(end);

  console.log(`\nContent learning: ${startDate} a ${endDate}...`);
  const [ga4, gsc] = await Promise.all([
    fetchGa4(startDate, endDate),
    fetchGsc(startDate, endDate),
  ]);
  const result = await syncContentLearning({ ga4, gsc, startDate, endDate, dryRun });
  console.log(
    `   ${result.snapshots} snapshots; ${result.sufficientSamples} amostras suficientes; ` +
    `${result.recommendations} recomendacoes${dryRun ? ' (dry-run)' : ''}`
  );
  if (ga4.articleProgress?.available === false) {
    console.warn('   Profundidade indisponivel: registre article_slug e percent_scrolled como dimensoes personalizadas no GA4.');
  }
  return result;
}


async function main() {
  const args = process.argv.slice(2);
  const argVal = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
  const useFixture = argVal('--fixture');
  const monthArg = argVal('--month');
  const asOfArg = argVal('--as-of');
  const bootstrap = args.includes('--bootstrap');
  const fromCache = args.includes('--from-cache');
  const dryRun = args.includes('--dry-run');
  const partialFlag = args.includes('--partial');

  const learningFlag = args.includes('--learning');
  const shouldRunLearning = learningFlag || (
    !bootstrap && !monthArg && !partialFlag && !useFixture &&
    !fromCache && !asOfArg
  );
  const asOf = asOfArg ? new Date(`${asOfArg}T12:00:00`) : new Date();
  if (asOfArg && Number.isNaN(asOf.getTime())) {
    console.error('--as-of deve ser YYYY-MM-DD');
    process.exit(1);
  }

  try {
    if (bootstrap) {
      console.log(fromCache
        ? '🚀 Bootstrap (cache): re-render dos últimos 3 meses a partir de fixtures...'
        : '🚀 Bootstrap: gerando últimos 3 meses fechados via API...');
      const last = lastClosedMonth(asOf);
      for (let offset = 2; offset >= 0; offset--) {
        let y = last.year;
        let m = last.month - offset;
        while (m <= 0) { m += 12; y -= 1; }
        await generateOne({ year: y, month: m, fromCache, dryRun });
      }
    } else {
      let target;
      if (monthArg) {
        const parsed = parseMonthArg(monthArg);
        if (!parsed) {
          console.error('--month deve ser YYYY-MM, com mês entre 01 e 12');
          process.exit(1);
        }
        target = parsed;
      } else if (partialFlag) {
        target = { year: asOf.getFullYear(), month: asOf.getMonth() + 1 };
      } else {
        target = lastClosedMonth(asOf);
      }

      if (isFutureMonth(target.year, target.month, asOf)) {
        console.error(`${monthSlug(target.year, target.month)} está no futuro — não há dado para gerar.`);
        process.exit(1);
      }

      // O mês corrente só tem uma leitura honesta: parcial. Exigir a flag aqui
      // recriaria o footgun de esquecê-la e publicar dado incompleto como fechamento.
      const partial = partialFlag || isCurrentMonth(target.year, target.month, asOf);

      await generateOne({ year: target.year, month: target.month, useFixture, fromCache, partial, asOf, dryRun });
    }

    console.log('\n✅ Relatório(s) gerado(s). Abra o HTML no browser para apresentar.');
    if (shouldRunLearning) {
      try {
        await runLearningLoop({ asOf, dryRun });
      } catch (error) {
        console.warn(`   Falha no ciclo de aprendizado: ${error.message}`);
        console.warn('   O relatorio mensal foi preservado; nenhuma recomendacao automatica foi aplicada.');
      }
    }

    clearSchedulerError();
  } catch (e) {
    console.error('\n❌ Erro fatal:', e.message);
    console.error(e.stack);
    writeSchedulerError(e);
    console.error(`   (log persistido em ${SCHEDULER_ERROR_LOG})`);
    process.exit(1);
  }
}

main();
