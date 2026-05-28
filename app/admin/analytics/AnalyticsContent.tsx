"use client";

import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { KpiCardGrid } from "@/components/admin/analytics/KpiCardGrid";
import { GrowthChart } from "@/components/admin/analytics/GrowthChart";
import { AreaDistributionChart } from "@/components/admin/analytics/AreaDistributionChart";
import { TrafficSourcesChart } from "@/components/admin/analytics/TrafficSourcesChart";
import { TopQueriesTable } from "@/components/admin/analytics/TopQueriesTable";
import { InsightsList } from "@/components/admin/analytics/InsightsList";
import { ActionsPriority } from "@/components/admin/analytics/ActionsPriority";
import { IndexationStatus } from "@/components/admin/analytics/IndexationStatus";
import type { AnalyticsSnapshot, KpiCardData, TrendPoint, TopQueryWithTrend } from "@/types/analytics";

interface AnalyticsContentProps {
  snapshot: AnalyticsSnapshot;
  trendPoints: TrendPoint[];
  availableMonths: string[];
  currentMonth: string;
}

function deltaDirection(deltaPct?: number): "up" | "down" | "flat" {
  if (deltaPct === undefined || deltaPct === null) return "flat";
  if (Math.abs(deltaPct) < 0.5) return "flat";
  return deltaPct > 0 ? "up" : "down";
}

function buildKpis(snapshot: AnalyticsSnapshot, trend: TrendPoint[]): KpiCardData[] {
  const ctx = snapshot.context;
  const ga4 = ctx.ga4;
  const gsc = ctx.gsc;

  const usersHistory = trend.map((t) => t.users);
  const sessionsHistory = trend.map((t) => t.sessions);
  const pageviewsHistory = trend.map((t) => t.pageviews);
  const clicksHistory = trend.map((t) => t.clicks);
  const impressionsHistory = trend.map((t) => t.impressions);

  return [
    {
      label: "Usuários",
      rawValue: ga4.users,
      value: ga4.users.toLocaleString("pt-BR"),
      delta: ga4.usersMoMText
        ? {
            direction: deltaDirection(ga4.usersMoMPct),
            text: ga4.usersMoMText.replace(/[↑↓→]\s*/, ""),
            pct: ga4.usersMoMPct ?? 0,
          }
        : undefined,
      sparkline: usersHistory,
    },
    {
      label: "Sessões",
      rawValue: ga4.sessions,
      value: ga4.sessions.toLocaleString("pt-BR"),
      delta: ga4.sessionsMoMText
        ? {
            direction: deltaDirection(ga4.sessionsMoMPct),
            text: ga4.sessionsMoMText.replace(/[↑↓→]\s*/, ""),
            pct: ga4.sessionsMoMPct ?? 0,
          }
        : undefined,
      sparkline: sessionsHistory,
    },
    {
      label: "Pageviews",
      rawValue: ga4.pageviews,
      value: ga4.pageviews.toLocaleString("pt-BR"),
      delta: ga4.pageviewsMoMText
        ? {
            direction: deltaDirection(ga4.pageviewsMoMPct),
            text: ga4.pageviewsMoMText.replace(/[↑↓→]\s*/, ""),
            pct: ga4.pageviewsMoMPct ?? 0,
          }
        : undefined,
      sparkline: pageviewsHistory,
    },
    {
      label: "Cliques GSC",
      rawValue: gsc.clicks,
      value: gsc.clicks.toLocaleString("pt-BR"),
      delta: gsc.clicksMoMText
        ? {
            direction: deltaDirection(gsc.clicksMoMPct),
            text: gsc.clicksMoMText.replace(/[↑↓→]\s*/, ""),
            pct: gsc.clicksMoMPct ?? 0,
          }
        : undefined,
      sparkline: clicksHistory,
    },
    {
      label: "Impressões",
      rawValue: gsc.impressions,
      value: gsc.impressions.toLocaleString("pt-BR"),
      delta: gsc.impressionsMoMText
        ? {
            direction: deltaDirection(gsc.impressionsMoMPct),
            text: gsc.impressionsMoMText.replace(/[↑↓→]\s*/, ""),
            pct: gsc.impressionsMoMPct ?? 0,
          }
        : undefined,
      sparkline: impressionsHistory,
    },
    {
      label: "Indexados",
      rawValue: ctx.indexedCount,
      value: `${ctx.indexedCount}/${ctx.totalArticles}`,
      description: `${ctx.totalArticles > 0 ? Math.round((ctx.indexedCount / ctx.totalArticles) * 100) : 0}% do catálogo`,
    },
  ];
}

export function AnalyticsContent({
  snapshot,
  trendPoints,
  availableMonths,
  currentMonth,
}: AnalyticsContentProps) {
  const ctx = snapshot.context;
  const kpis = buildKpis(snapshot, trendPoints);

  // Top queries: sem tendência por enquanto (precisaria join multi-mês — fase 2)
  const topQueries: TopQueryWithTrend[] = ctx.gsc.topQueries.map((q) => ({ ...q }));

  // Subtítulos dinâmicos
  const usersMoM = ctx.ga4.usersMoMPct;
  const clicksMoM = ctx.gsc.clicksMoMPct;
  const growthSubtitle =
    usersMoM !== undefined && clicksMoM !== undefined
      ? `Tráfego ${usersMoM >= 0 ? "cresceu" : "caiu"} ${Math.abs(usersMoM).toFixed(0)}% e search ${clicksMoM >= 0 ? "subiu" : "caiu"} ${Math.abs(clicksMoM).toFixed(0)}% vs mês anterior.`
      : "Primeiro mês registrado.";

  const topSource = ctx.ga4.topSources[0];
  const risingQuery = ctx.gsc.risingQueries[0];
  const originSubtitle =
    topSource && risingQuery
      ? `${topSource.label} gera ${topSource.pctOfTotal}% das sessões; "${risingQuery.query}" ganhou ${risingQuery.clicksDelta} cliques vs mês anterior.`
      : topSource
        ? `${topSource.label} gera ${topSource.pctOfTotal}% das sessões.`
        : "Sem dados de origem suficientes.";

  const actionSubtitle = `${ctx.actionsP0.length} ações P0 priorizadas. Indexação ${ctx.indexedCount}/${ctx.totalArticles}.`;

  return (
    <div className="space-y-10 max-w-[1400px]">
      <AnalyticsHeader
        monthLabel={ctx.monthLabel}
        periodStart={ctx.periodStart}
        periodEnd={ctx.periodEnd}
        availableMonths={availableMonths}
        currentMonth={currentMonth}
      />

      {/* Seção 1: Crescimento */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Como estamos crescendo
          </h2>
          <p className="text-base text-neutral-600 mt-1">{growthSubtitle}</p>
        </div>
        <KpiCardGrid kpis={kpis} />
        <GrowthChart data={trendPoints} />
      </section>

      {/* Seção 2: Origem */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            De onde vem o crescimento
          </h2>
          <p className="text-base text-neutral-600 mt-1">{originSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AreaDistributionChart data={ctx.ga4.byArea} />
          <TrafficSourcesChart data={ctx.ga4.topSources} />
        </div>
        <TopQueriesTable queries={topQueries} />
      </section>

      {/* Seção 3: Ação */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Para onde direcionar esforço
          </h2>
          <p className="text-base text-neutral-600 mt-1">{actionSubtitle}</p>
        </div>
        <InsightsList insights={ctx.insights} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionsPriority
            p0={ctx.actionsP0}
            p1={ctx.actionsP1}
            p2={ctx.actionsP2}
          />
          <IndexationStatus indexation={ctx.indexation} />
        </div>
      </section>

      <footer className="text-xs text-neutral-400 pt-8 border-t border-neutral-100 print:pt-3">
        Gerado em {ctx.generatedAt} · GA4 property {ctx.ga4PropertyId} · GSC {ctx.gscSiteUrl}
      </footer>
    </div>
  );
}
