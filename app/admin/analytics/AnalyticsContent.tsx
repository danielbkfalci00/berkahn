"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { Act0Status } from "@/components/admin/analytics/acts/Act0Status";
import { Act1Growth } from "@/components/admin/analytics/acts/Act1Growth";
import { Act2Origin } from "@/components/admin/analytics/acts/Act2Origin";
import { Act3Posts } from "@/components/admin/analytics/acts/Act3Posts";
import { Act4Action } from "@/components/admin/analytics/acts/Act4Action";
import { ComparisonView } from "@/components/admin/analytics/ComparisonView";
import { LeadsQueue } from "@/components/admin/analytics/LeadsQueue";
import { computeMonthlyGoals, computeGoalProgress, formatGoalLabel, formulaLabel, goalStatusColor } from "@/lib/analytics/goals";
import { detectRedFlags } from "@/lib/analytics/red-flags";
import type { TimelineEvent } from "@/lib/analytics/timeline-events";
import type {
  AnalyticsLead,
  AnalyticsSnapshot,
  AnalyticsTask,
  KpiCardData,
  PostPerformance,
  TrendPoint,
  TopQueryWithTrend,
} from "@/types/analytics";

interface AnalyticsContentProps {
  snapshot: AnalyticsSnapshot;
  previousSnapshot: AnalyticsSnapshot | null;
  trendPoints: TrendPoint[];
  postPerformance: PostPerformance[];
  postsPublishedInMonth: number;
  availableMonths: string[];
  currentMonth: string;
  timelineEvents: TimelineEvent[];
  tasks: AnalyticsTask[];
  leads: AnalyticsLead[];
}

function deltaDirection(deltaPct?: number): "up" | "down" | "flat" {
  if (deltaPct === undefined || deltaPct === null) return "flat";
  if (Math.abs(deltaPct) < 0.5) return "flat";
  return deltaPct > 0 ? "up" : "down";
}

function buildKpis(
  snapshot: AnalyticsSnapshot,
  trend: TrendPoint[],
  currentMonth: string
): KpiCardData[] {
  const ctx = snapshot.context;
  const ga4 = ctx.ga4;
  const gsc = ctx.gsc;
  const goals = computeMonthlyGoals(trend, currentMonth);
  const formula = formulaLabel(goals.basedOnMonths);

  const usersHistory = trend.map((t) => t.users);
  const sessionsHistory = trend.map((t) => t.sessions);
  const pageviewsHistory = trend.map((t) => t.pageviews);
  const clicksHistory = trend.map((t) => t.clicks);
  const impressionsHistory = trend.map((t) => t.impressions);

  function goalProps(value: number, target: number) {
    const { pct, status } = computeGoalProgress(value, target);
    return {
      label: formatGoalLabel(value, target),
      pct,
      color: goalStatusColor(status),
      formula,
      basedOnMonths: goals.basedOnMonths,
    };
  }

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
      goal: goalProps(ga4.users, goals.users),
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
      goal: goalProps(ga4.sessions, goals.sessions),
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
      goal: goalProps(ga4.pageviews, goals.pageviews),
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
      goal: goalProps(gsc.clicks, goals.clicks),
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
      goal: goalProps(gsc.impressions, goals.impressions),
    },
  ];
}

export function AnalyticsContent({
  snapshot,
  previousSnapshot,
  trendPoints,
  postPerformance,
  postsPublishedInMonth,
  availableMonths,
  currentMonth,
  timelineEvents,
  tasks,
  leads,
}: AnalyticsContentProps) {
  const [section, setSection] = useState<"performance" | "leads">("performance");
  const searchParams = useSearchParams();
  const comparisonMode = searchParams.get("compare") === "1";

  const ctx = snapshot.context;
  const kpis = buildKpis(snapshot, trendPoints, currentMonth);
  const topQueries: TopQueryWithTrend[] = ctx.gsc.topQueries.map((q) => ({ ...q }));

  const redFlags = detectRedFlags(ctx, previousSnapshot, postsPublishedInMonth);

  // O modo comparativo lê ga4_data/gsc_data das duas linhas, e a linha do mês
  // anterior guarda o mês INTEIRO. Contra um mês parcial isso compara janelas
  // de tamanhos diferentes — os deltas inline do context não têm esse problema
  // porque são calculados contra a janela equivalente na geração do snapshot.
  const isPartial = ctx.partial === true;
  const comparisonDisabled = previousSnapshot === null || isPartial;

  return (
    <div className="space-y-12 max-w-[1400px]">
      <div className="inline-flex rounded-lg bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => setSection("performance")}
          className={`rounded-md px-4 py-2 text-sm transition ${section === "performance" ? "bg-white font-medium shadow-sm" : "text-neutral-500"}`}
        >
          Desempenho
        </button>
        <button
          type="button"
          onClick={() => setSection("leads")}
          className={`rounded-md px-4 py-2 text-sm transition ${section === "leads" ? "bg-white font-medium shadow-sm" : "text-neutral-500"}`}
        >
          Leads
        </button>
      </div>

      {section === "leads" ? (
        <LeadsQueue initialLeads={leads} />
      ) : (
        <>
      <AnalyticsHeader
        monthLabel={ctx.monthLabel}
        periodStart={ctx.periodStart}
        periodEnd={ctx.periodEnd}
        availableMonths={availableMonths}
        currentMonth={currentMonth}
        comparisonDisabled={comparisonDisabled}
        comparisonDisabledReason={
          isPartial
            ? "Indisponível em mês parcial: o snapshot anterior guarda o mês inteiro, então a comparação mediria janelas de tamanhos diferentes"
            : "Sem mês anterior pra comparar"
        }
        comparisonMode={comparisonMode}
        isPartial={isPartial}
        daysCovered={ctx.daysCovered}
        daysInMonth={ctx.daysInMonth}
      />

      {comparisonMode && previousSnapshot && !isPartial ? (
        <ComparisonView current={snapshot} previous={previousSnapshot} />
      ) : (
        <>
          <Act0Status context={ctx} trendPoints={trendPoints} redFlags={redFlags} />
          <Act1Growth
            context={ctx}
            kpis={kpis}
            trendPoints={trendPoints}
            timelineEvents={timelineEvents}
          />
          <Act2Origin context={ctx} topQueries={topQueries} />
          <Act3Posts context={ctx} posts={postPerformance} />
          <Act4Action context={ctx} posts={postPerformance} tasks={tasks} />
        </>
      )}

        </>
      )}

      <footer className="text-xs text-neutral-400 pt-8 border-t border-neutral-100 print:pt-3">
        Atualizado em {ctx.generatedAt}
        <span className="hidden print:inline">
          {" "}· GA4 property {ctx.ga4PropertyId} · GSC {ctx.gscSiteUrl}
        </span>
      </footer>
    </div>
  );
}
