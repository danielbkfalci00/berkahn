"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { Act0Status } from "@/components/admin/analytics/acts/Act0Status";
import { Act2Origin } from "@/components/admin/analytics/acts/Act2Origin";
import { Act3Posts } from "@/components/admin/analytics/acts/Act3Posts";
import { Act4Action } from "@/components/admin/analytics/acts/Act4Action";
import { KpiCardGrid } from "@/components/admin/analytics/KpiCardGrid";
import { GrowthChart } from "@/components/admin/analytics/GrowthChart";
import { MatrizArtigoMes } from "@/components/admin/analytics/MatrizArtigoMes";
import { ComparisonView } from "@/components/admin/analytics/ComparisonView";
import { computeMonthlyGoals, computeGoalProgress, formatGoalLabel, formulaLabel, goalStatusColor } from "@/lib/analytics/goals";
import { detectRedFlags } from "@/lib/analytics/red-flags";
import { comparisonAvailability } from "@/lib/analytics/comparability";
import type { TimelineEvent } from "@/lib/analytics/timeline-events";
import type { MapaLeitura, MatrizArtigoMes as MatrizArtigoMesData } from "@/lib/analytics/heatmaps";
import type { MapaOportunidade } from "@/lib/analytics/query-opportunity";
import type { FunilLeads } from "@/lib/analytics/leads-funnel";
import type {
  AnalyticsSnapshot,
  AnalyticsTask,
  KpiCardData,
  PostPerformance,
  TrendPoint,
  TopQueryWithTrend,
  AdminDataResult,
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
  matrizAcervo: MatrizArtigoMesData;
  mapaLeitura: MapaLeitura;
  oportunidade: MapaOportunidade;
  funilLeads: AdminDataResult<FunilLeads>;
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
  const comparability = comparisonAvailability(ctx);
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
      sparkline: comparability.ga4MoM ? usersHistory : undefined,
      goal: comparability.ga4MoM ? goalProps(ga4.users, goals.users) : undefined,
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
      sparkline: comparability.ga4MoM ? sessionsHistory : undefined,
      goal: comparability.ga4MoM ? goalProps(ga4.sessions, goals.sessions) : undefined,
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
      sparkline: comparability.ga4MoM ? pageviewsHistory : undefined,
      goal: comparability.ga4MoM ? goalProps(ga4.pageviews, goals.pageviews) : undefined,
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
  matrizAcervo,
  mapaLeitura,
  oportunidade,
  funilLeads,
}: AnalyticsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requestedComparisonMode = searchParams.get("compare") === "1";
  const requestedTab = searchParams.get("tab");
  const activeTab = ["resumo", "aquisicao", "conteudo", "diagnostico"].includes(requestedTab ?? "")
    ? requestedTab!
    : "resumo";

  const ctx = snapshot.context;
  const kpis = buildKpis(snapshot, trendPoints, currentMonth);
  const topQueries: TopQueryWithTrend[] = ctx.gsc.topQueries.map((q) => ({ ...q }));

  const redFlags = detectRedFlags(ctx, previousSnapshot, postsPublishedInMonth);

  // O modo comparativo lê ga4_data/gsc_data das duas linhas, e a linha do mês
  // anterior guarda o mês INTEIRO. Contra um mês parcial isso compara janelas
  // de tamanhos diferentes — os deltas inline do context não têm esse problema
  // porque são calculados contra a janela equivalente na geração do snapshot.
  const isPartial = ctx.partial === true;
  const comparability = comparisonAvailability(ctx);
  const comparabilityNotice = !comparability.ga4MoM || !comparability.gscMoM
    ? `Comparação ${[
        !comparability.ga4MoM ? "GA4" : null,
        !comparability.gscMoM ? "Search Console" : null,
      ].filter(Boolean).join(" e ")} indisponível: ${comparability.reason ?? "baseline ausente."}${
        !comparability.ga4MoM && comparability.gscMoM
          ? " Métricas absolutas e comparações do Search Console permanecem válidas."
          : " Métricas absolutas permanecem válidas."
      }`
    : undefined;
  const comparisonDisabled = previousSnapshot === null || isPartial || !comparability.ga4MoM || !comparability.gscMoM;
  const comparisonMode = requestedComparisonMode && !comparisonDisabled;

  function setTab(tab: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleTabKey(event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[nextIndex].id);
    document.getElementById(`analytics-tab-${tabs[nextIndex].id}`)?.focus();
  }

  const tabs = [
    { id: "resumo", label: "Resumo" },
    { id: "aquisicao", label: "Aquisição" },
    { id: "conteudo", label: "Conteúdo" },
    { id: "diagnostico", label: "Diagnóstico" },
  ];
  const actions = [...ctx.actionsP0, ...ctx.actionsP1, ...ctx.actionsP2].slice(0, 3);
  const leadsKpi: KpiCardData = funilLeads.status === "ok"
    ? { label: "Leads", rawValue: funilLeads.data.total, value: funilLeads.data.total.toLocaleString("pt-BR"), description: "Recebidos no período" }
    : { label: "Leads", rawValue: 0, value: "—", description: "CRM indisponível" };
  const summaryKpis = [kpis[0], kpis[1], kpis[3], leadsKpi];

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
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
            : !comparability.ga4MoM
              ? comparability.reason
              : "Sem mês anterior pra comparar"
        }
        comparisonMode={comparisonMode}
        isPartial={isPartial}
        daysCovered={ctx.daysCovered}
        daysInMonth={ctx.daysInMonth}
        generatedAt={ctx.generatedAt}
        comparabilityReason={comparabilityNotice}
        sources={ctx.sources}
      />

      {comparisonMode && previousSnapshot && !comparisonDisabled ? (
        <ComparisonView current={snapshot} previous={previousSnapshot} />
      ) : (
        <>
          <div role="tablist" aria-label="Seções de analytics" className="-mx-4 flex gap-1 overflow-x-auto border-b border-neutral-200 px-4 sm:mx-0 sm:px-0 print:hidden">
            {tabs.map((tab, index) => (
              <button key={tab.id} id={`analytics-tab-${tab.id}`} role="tab" aria-controls={`analytics-panel-${tab.id}`} aria-selected={activeTab === tab.id} tabIndex={activeTab === tab.id ? 0 : -1} onKeyDown={(event) => handleTabKey(event, index)} onClick={() => setTab(tab.id)} className={`min-h-11 shrink-0 border-b-2 px-3 text-sm font-medium ${activeTab === tab.id ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-500"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <section id="analytics-panel-resumo" aria-labelledby="analytics-tab-resumo" role="tabpanel" className={activeTab === "resumo" ? "space-y-6" : "hidden print:block print:space-y-6"}>
            <Act0Status context={ctx} trendPoints={trendPoints} redFlags={redFlags} />
            <KpiCardGrid kpis={summaryKpis} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm font-semibold text-neutral-950">Principal insight</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{ctx.insights[0]?.text ?? "Nenhuma mudança relevante detectada neste período."}</p>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm font-semibold text-neutral-950">Próximas ações</h3>
                {actions.length > 0 ? <ol className="mt-2 space-y-2 text-sm text-neutral-700">{actions.map((action, index) => <li key={`${action.text}-${index}`} className="flex gap-2"><span className="text-neutral-400">{index + 1}.</span><span>{action.text}</span></li>)}</ol> : <p className="mt-2 text-sm text-neutral-500">Nenhuma ação prioritária.</p>}
              </div>
            </div>
          </section>

          <section id="analytics-panel-aquisicao" aria-labelledby="analytics-tab-aquisicao" role="tabpanel" className={activeTab === "aquisicao" ? "space-y-8" : "hidden print:block print:space-y-8"}>
            <GrowthChart data={trendPoints} events={timelineEvents} />
            <Act2Origin context={ctx} topQueries={topQueries} oportunidade={oportunidade} />
          </section>

          <section id="analytics-panel-conteudo" aria-labelledby="analytics-tab-conteudo" role="tabpanel" className={activeTab === "conteudo" ? "space-y-8" : "hidden print:block print:space-y-8"}>
            <Act3Posts context={ctx} posts={postPerformance} mapaLeitura={mapaLeitura} />
            <MatrizArtigoMes matriz={matrizAcervo} />
          </section>

          <section id="analytics-panel-diagnostico" aria-labelledby="analytics-tab-diagnostico" role="tabpanel" className={activeTab === "diagnostico" ? "space-y-8" : "hidden print:block print:space-y-8"}>
            <details className="rounded-lg border border-neutral-200 bg-white p-4">
              <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium text-neutral-800">Todos os indicadores</summary>
              <div className="mt-4"><KpiCardGrid kpis={kpis} /></div>
            </details>
            <Act4Action context={ctx} posts={postPerformance} tasks={tasks} funilLeads={funilLeads} />
          </section>
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
