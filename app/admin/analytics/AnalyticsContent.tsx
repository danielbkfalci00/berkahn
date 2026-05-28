"use client";

import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { Act0Status } from "@/components/admin/analytics/acts/Act0Status";
import { Act1Growth } from "@/components/admin/analytics/acts/Act1Growth";
import { Act2Origin } from "@/components/admin/analytics/acts/Act2Origin";
import { Act4Action } from "@/components/admin/analytics/acts/Act4Action";
import type {
  AnalyticsSnapshot,
  KpiCardData,
  TrendPoint,
  TopQueryWithTrend,
} from "@/types/analytics";

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
      description: `${
        ctx.totalArticles > 0 ? Math.round((ctx.indexedCount / ctx.totalArticles) * 100) : 0
      }% do catálogo`,
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

  // Top queries (sem trend por enquanto — vem no Sprint 2/3)
  const topQueries: TopQueryWithTrend[] = ctx.gsc.topQueries.map((q) => ({ ...q }));

  return (
    <div className="space-y-12 max-w-[1400px]">
      <AnalyticsHeader
        monthLabel={ctx.monthLabel}
        periodStart={ctx.periodStart}
        periodEnd={ctx.periodEnd}
        availableMonths={availableMonths}
        currentMonth={currentMonth}
      />

      <Act0Status context={ctx} trendPoints={trendPoints} />
      <Act1Growth context={ctx} kpis={kpis} trendPoints={trendPoints} />
      <Act2Origin context={ctx} topQueries={topQueries} />
      {/* Act3 (Performance de Posts) entra no Sprint 2 */}
      <Act4Action context={ctx} />

      <footer className="text-xs text-neutral-400 pt-8 border-t border-neutral-100 print:pt-3">
        Gerado em {ctx.generatedAt} · GA4 property {ctx.ga4PropertyId} · GSC {ctx.gscSiteUrl}
      </footer>
    </div>
  );
}
