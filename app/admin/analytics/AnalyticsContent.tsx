"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { flushSync } from "react-dom";
import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader";
import { Act0Status } from "@/components/admin/analytics/acts/Act0Status";
const reportLoading = () => <p data-report-loading role="status" className="py-6 text-sm text-neutral-500">Carregando análise…</p>;
const loadAct2Origin = () => import("@/components/admin/analytics/acts/Act2Origin");
const Act2Origin = dynamic(() => loadAct2Origin().then((module) => module.Act2Origin), { loading: reportLoading });
const loadAct3Posts = () => import("@/components/admin/analytics/acts/Act3Posts");
const Act3Posts = dynamic(() => loadAct3Posts().then((module) => module.Act3Posts), { loading: reportLoading });
const loadAct4Action = () => import("@/components/admin/analytics/acts/Act4Action");
const Act4Action = dynamic(() => loadAct4Action().then((module) => module.Act4Action), { loading: reportLoading });
import { ConversionEvents } from "@/components/admin/analytics/ConversionEvents";
import { KpiCardGrid } from "@/components/admin/analytics/KpiCardGrid";
const loadGrowthChart = () => import("@/components/admin/analytics/GrowthChart");
const GrowthChart = dynamic(() => loadGrowthChart().then((module) => module.GrowthChart), { loading: reportLoading });
const loadMatrizArtigoMes = () => import("@/components/admin/analytics/MatrizArtigoMes");
const MatrizArtigoMes = dynamic(() => loadMatrizArtigoMes().then((module) => module.MatrizArtigoMes), { loading: reportLoading });
const loadComparisonView = () => import("@/components/admin/analytics/ComparisonView");
const ComparisonView = dynamic(() => loadComparisonView().then((module) => module.ComparisonView), { loading: reportLoading });
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
  snapshot: Pick<AnalyticsSnapshot, "context">;
  previousSnapshot: Pick<AnalyticsSnapshot, "context"> | null;
  trendPoints: TrendPoint[];
  postPerformance: PostPerformance[];
  postsPublishedInMonth?: number;
  canManageTasks: boolean;
  sectionErrors: { comparison: boolean; trend: boolean; posts: boolean; history: boolean; tasks: boolean };
  availableMonths: string[];
  currentMonth: string;
  timelineEvents: TimelineEvent[];
  tasks: AnalyticsTask[];
  matrizAcervo: MatrizArtigoMesData;
  mapaLeitura: MapaLeitura;
  oportunidade: MapaOportunidade;
  funilLeads: AdminDataResult<FunilLeads> | null;
}

class ReportPreparationError extends Error {}

function waitForReport(
  signal: AbortSignal,
  load: () => Promise<unknown>,
  mount: () => HTMLElement | null,
  openDetails: () => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let poll = 0;
    let readyChecks = 0;
    let settled = false;
    let root: HTMLElement | null = null;
    let timeoutMessage = "O carregamento do relatório demorou demais. Verifique sua conexão e tente novamente.";
    const finish = (error?: unknown) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.clearTimeout(poll);
      signal.removeEventListener("abort", abort);
      if (error) reject(error); else resolve();
    };
    const abort = () => finish(new Error("Exportação cancelada"));
    // Bound the entire preparation, including imports that never settle.
    const timeout = window.setTimeout(() => finish(new ReportPreparationError(timeoutMessage)), 30_000);
    const check = () => {
      if (settled) return;
      try {
        if (!root?.isConnected) return abort();
        openDetails();
        const sectionPending = !!root.querySelector("[data-report-loading]");
        const fontsPending = document.fonts?.status === "loading";
        const chartPending = Array.from(root.querySelectorAll(".recharts-responsive-container")).some((chart) => {
          // Legends have their own SVGs; only the chart surface proves readiness.
          const bounds = chart.querySelector(".recharts-wrapper > svg.recharts-surface")?.getBoundingClientRect();
          return !bounds || bounds.width <= 0 || bounds.height <= 0;
        });
        timeoutMessage = sectionPending
          ? "Algumas seções do relatório não terminaram de carregar. Tente exportar novamente."
          : fontsPending
            ? "A formatação do relatório não terminou de carregar. Tente exportar novamente."
            : "Os gráficos não ficaram prontos. Mantenha esta aba aberta e tente exportar novamente.";
        readyChecks = sectionPending || fontsPending || chartPending ? 0 : readyChecks + 1;
        // Animation frames may stop in hidden tabs. Poll sparingly and still
        // require two ready checks rather than printing after a fixed delay.
        if (readyChecks >= 2) finish(); else poll = window.setTimeout(check, 100);
      } catch (error) {
        finish(error);
      }
    };
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) { abort(); return; }
    void Promise.resolve().then(() => { if (!settled) return load(); }).then(() => {
      // Imports cannot be aborted; ignore their completion after cancellation
      // or timeout so an old attempt cannot mount over a newer one.
      if (settled) return;
      root = mount();
      check();
    }, () => finish(new ReportPreparationError("Não foi possível carregar o relatório. Verifique sua conexão e tente novamente."))).catch(finish);
  });
}

function deltaDirection(deltaPct?: number): "up" | "down" | "flat" {
  if (deltaPct === undefined || deltaPct === null) return "flat";
  if (Math.abs(deltaPct) < 0.5) return "flat";
  return deltaPct > 0 ? "up" : "down";
}

function buildKpis(
  snapshot: Pick<AnalyticsSnapshot, "context">,
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
  canManageTasks,
  sectionErrors,
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
  const pathname = usePathname();
  const reportRef = useRef<HTMLDivElement>(null);
  const printJob = useRef<AbortController | null>(null);
  const openedByPrint = useRef<HTMLDetailsElement[]>([]);
  const [printAll, setPrintAll] = useState(false);
  const [printPhase, setPrintPhase] = useState<"idle" | "preparing" | "printing">("idle");
  const preparingPrint = printPhase !== "idle";
  const [printError, setPrintError] = useState<string | null>(null);
  const requestedComparisonMode = searchParams.get("compare") === "1";
  const requestedTab = searchParams.get("tab");
  const activeTab = ["resumo", "aquisicao", "conteudo", "diagnostico"].includes(requestedTab ?? "")
    ? requestedTab!
    : "resumo";

  const ctx = snapshot.context;
  const kpis = buildKpis(snapshot, trendPoints, currentMonth).map((kpi) => sectionErrors.trend || ctx.partial ? { ...kpi, goal: undefined } : kpi);
  const topQueries: TopQueryWithTrend[] = ctx.gsc.topQueries.map((q) => ({ ...q }));

  const redFlags = detectRedFlags(ctx, previousSnapshot, postsPublishedInMonth);

  // O modo comparativo lê os contextos das duas linhas, e a linha do mês
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
  const comparisonDisabled = previousSnapshot === null || isPartial || previousSnapshot.context.partial === true || !comparability.ga4MoM || !comparability.gscMoM;
  const comparisonMode = requestedComparisonMode && !comparisonDisabled;

  const openDetails = useCallback(() => {
    reportRef.current?.querySelectorAll<HTMLDetailsElement>("details:not([open])").forEach((details) => {
      details.open = true;
      openedByPrint.current.push(details);
    });
  }, []);
  const cancelPrint = useCallback(() => {
    printJob.current?.abort();
    printJob.current = null;
    openedByPrint.current.splice(0).forEach((details) => { details.open = false; });
  }, []);
  const finishPrint = useCallback(() => {
    cancelPrint();
    setPrintAll(false);
    setPrintPhase("idle");
  }, [cancelPrint]);

  const exportReport = useCallback(async () => {
    if (printJob.current) return;
    const job = new AbortController();
    printJob.current = job;
    setPrintPhase("preparing");
    setPrintError(null);
    try {
      await waitForReport(job.signal,
        () => Promise.all([loadAct2Origin(), loadAct3Posts(), loadAct4Action(), loadGrowthChart(), loadMatrizArtigoMes(), loadComparisonView()]),
        () => { flushSync(() => setPrintAll(true)); return reportRef.current; },
        openDetails,
      );
      if (job.signal.aborted) return;
      setPrintPhase("printing");
      window.print();
    } catch (error) {
      if (!job.signal.aborted) {
        finishPrint();
        setPrintError(error instanceof ReportPreparationError ? error.message : "Não foi possível preparar o relatório completo. Tente exportar novamente.");
      }
    }
    // Some browsers return from print() before the preview closes. Keep the
    // complete report mounted until afterprint or explicit cancellation.
  }, [finishPrint, openDetails]);

  useEffect(() => {
    finishPrint();
    return cancelPrint;
  }, [currentMonth, snapshot, finishPrint, cancelPrint]);

  useEffect(() => {
    const printShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
        event.preventDefault();
        void exportReport();
      }
    };
    window.addEventListener("keydown", printShortcut);
    return () => window.removeEventListener("keydown", printShortcut);
  }, [exportReport]);

  function setTab(tab: string) {
    if (tab === activeTab) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    // Next synchronizes useSearchParams with the native history API without
    // requesting a new Server Component payload for this client-only view.
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    window.addEventListener("beforeprint", openDetails);
    window.addEventListener("afterprint", finishPrint);
    return () => {
      window.removeEventListener("beforeprint", openDetails);
      window.removeEventListener("afterprint", finishPrint);
      cancelPrint();
    };
  }, [openDetails, finishPrint, cancelPrint]);

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
  const leadsKpi: KpiCardData | null = !funilLeads ? null : funilLeads.status === "ok"
    ? { label: "Leads", rawValue: funilLeads.data.total, value: funilLeads.data.total.toLocaleString("pt-BR"), description: "Recebidos no período" }
    : { label: "Leads", rawValue: 0, value: "—", description: "CRM indisponível" };
  const summaryKpis = [kpis[0], kpis[1], kpis[3], ...(leadsKpi ? [leadsKpi] : [])];

  return (
    <div ref={reportRef} data-analytics-report className="mx-auto max-w-[1400px] space-y-7">
      <AnalyticsHeader
        onPrint={exportReport}
        preparingPrint={preparingPrint}
        awaitingPrint={printPhase === "printing"}
        monthLabel={ctx.monthLabel}
        periodStart={ctx.periodStart}
        periodEnd={ctx.periodEnd}
        availableMonths={availableMonths}
        currentMonth={currentMonth}
        comparisonDisabled={comparisonDisabled}
        comparisonDisabledReason={
          isPartial || previousSnapshot?.context.partial
            ? "Indisponível: um dos relatórios cobre um mês parcial e as janelas não são equivalentes"
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

      {printError && <p role="alert" className="text-sm text-amber-800">{printError}</p>}
      {preparingPrint && <div role="status" className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 print:hidden">{printPhase === "printing" ? "Relatório pronto. Conclua a impressão no navegador ou cancele para voltar." : "Preparando relatório completo."} <button type="button" onClick={finishPrint} className="min-h-11 underline">Cancelar exportação</button></div>}
      {Object.values(sectionErrors).some(Boolean) && <p role="status" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Parte dos dados está indisponível. As seções afetadas estão identificadas abaixo. <button type="button" onClick={() => window.location.reload()} className="underline">Tentar novamente</button></p>}
      {comparisonMode && previousSnapshot && !comparisonDisabled && (
        <ComparisonView current={snapshot} previous={previousSnapshot} />
      )}
      {(!comparisonMode || printAll) && (
        <>
          <div role="tablist" aria-label="Seções de analytics" className="-mx-4 flex gap-1 overflow-x-auto border-b border-neutral-200 px-4 sm:mx-0 sm:px-0 print:hidden">
            {tabs.map((tab, index) => (
              <button key={tab.id} id={`analytics-tab-${tab.id}`} role="tab" aria-controls={`analytics-panel-${tab.id}`} aria-selected={activeTab === tab.id} tabIndex={activeTab === tab.id ? 0 : -1} onKeyDown={(event) => handleTabKey(event, index)} onClick={() => setTab(tab.id)} className={`min-h-11 shrink-0 border-b-2 px-3 text-sm font-medium ${activeTab === tab.id ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-500"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <section id="analytics-panel-resumo" aria-labelledby="analytics-tab-resumo" role="tabpanel" className={activeTab === "resumo" || printAll ? "space-y-6" : "hidden print:block print:space-y-6"}>
            <Act0Status context={ctx} trendPoints={trendPoints} redFlags={redFlags} />
            {sectionErrors.trend && <p role="status" className="text-sm text-amber-800">Série histórica indisponível; metas e tendências omitidas.</p>}
            <KpiCardGrid kpis={summaryKpis} />
            <ConversionEvents ga4={ctx.ga4} funil={funilLeads} monthSlug={ctx.monthSlug} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm font-semibold text-neutral-950">Destaque do período</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{[...ctx.insights].sort((a, b) => (b.impact ?? 0) - (a.impact ?? 0))[0]?.text ?? "Nenhuma mudança relevante detectada neste período."}</p>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm font-semibold text-neutral-950">Próximas ações</h3>
                {actions.length > 0 ? <ol className="mt-2 space-y-2 text-sm text-neutral-700">{actions.map((action, index) => <li key={`${action.text}-${index}`} className="flex gap-2"><span className="text-neutral-400">{index + 1}.</span><span>{action.text}</span></li>)}</ol> : <p className="mt-2 text-sm text-neutral-500">Nenhuma ação prioritária.</p>}
              </div>
            </div>
          </section>

          <section id="analytics-panel-aquisicao" aria-labelledby="analytics-tab-aquisicao" role="tabpanel" className={activeTab === "aquisicao" || printAll ? "space-y-8" : "hidden print:block print:space-y-8"}>
            {(activeTab === "aquisicao" || printAll) && <>
            {sectionErrors.trend ? <p role="status" className="text-sm text-amber-800">Histórico de aquisição indisponível.</p> : <GrowthChart data={trendPoints} events={timelineEvents} />}
            <Act2Origin context={ctx} topQueries={topQueries} oportunidade={oportunidade} printMode={printAll} />
            </>}
          </section>

          <section id="analytics-panel-conteudo" aria-labelledby="analytics-tab-conteudo" role="tabpanel" className={activeTab === "conteudo" || printAll ? "space-y-8" : "hidden print:block print:space-y-8"}>
            {(activeTab === "conteudo" || printAll) && <>
            {sectionErrors.posts ? <p role="status" className="text-sm text-amber-800">Metadados dos artigos indisponíveis.</p> : <Act3Posts context={ctx} posts={postPerformance} mapaLeitura={mapaLeitura} printMode={printAll} />}
            {sectionErrors.history || sectionErrors.posts ? <p role="status" className="text-sm text-amber-800">Matriz histórica indisponível.</p> : <MatrizArtigoMes matriz={matrizAcervo} />}
            </>}
          </section>

          <section id="analytics-panel-diagnostico" aria-labelledby="analytics-tab-diagnostico" role="tabpanel" className={activeTab === "diagnostico" || printAll ? "space-y-8" : "hidden print:block print:space-y-8"}>
            {(activeTab === "diagnostico" || printAll) && <>
            <details className="rounded-lg border border-neutral-200 bg-white p-4">
              <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium text-neutral-800">Todos os indicadores</summary>
              <div className="mt-4"><KpiCardGrid kpis={kpis} /></div>
            </details>
            <Act4Action context={ctx} posts={postPerformance} tasks={tasks} funilLeads={funilLeads} canManageTasks={canManageTasks} tasksUnavailable={sectionErrors.tasks} />
            </>}
          </section>
        </>
      )}
      <footer className="text-xs text-neutral-400 pt-8 border-t border-neutral-100 print:pt-3">
        Atualizado em {ctx.generatedAt}
        {printAll && <p>Tabelas com todos os registros disponíveis na coleta deste período, sem os filtros da tela. Os limites e as indisponibilidades de cada seção permanecem indicados.</p>}
        {!printAll && <p className="hidden print:block">Impressão das seções abertas. Use Exportar PDF para incluir todas as seções do relatório.</p>}
        <span className="hidden print:inline">
          {" "}· GA4 property {ctx.ga4PropertyId} · GSC {ctx.gscSiteUrl}
        </span>
      </footer>
    </div>
  );
}
