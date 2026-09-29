import { notFound } from "next/navigation";
import {
  getAvailableMonths,
  getSnapshot,
  getAllTrendPoints,
  getPublishedPosts,
  getHistoricalPageviewsBySlug,
} from "@/lib/analytics/queries";
import { buildPostPerformance } from "@/lib/analytics/post-performance";
import { previousMonthSlug } from "@/lib/analytics/period";
import { buildTimelineEvents } from "@/lib/analytics/timeline-events";
import { construirMatrizArtigoMes, construirMapaLeitura } from "@/lib/analytics/heatmaps";
import { construirMapaOportunidade } from "@/lib/analytics/query-opportunity";
import { construirFunilLeads } from "@/lib/analytics/leads-funnel";
import { listarLeadsDoMes } from "@/lib/analytics/leads-queries";
import { getTasks } from "@/lib/analytics/tasks-queries";
import { AnalyticsContent } from "./AnalyticsContent";
import { getAdminSession } from "@/lib/supabase/sessao";
import { roleCanAccessPath } from "@/lib/admin/access";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const { month: queryMonth } = await searchParams;

  let availableMonths: string[];
  try {
    availableMonths = await getAvailableMonths();
  } catch {
    return <AnalyticsUnavailable />;
  }

  if (availableMonths.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Nenhum relatório disponível</h1>
        <p className="text-neutral-500 max-w-md">A análise aparecerá após a primeira coleta concluída.</p>
      </div>
    );
  }

  const currentMonth = queryMonth && availableMonths.includes(queryMonth) ? queryMonth : availableMonths[0];
  const prevMonth = previousMonthSlug(currentMonth);
  const results = await Promise.allSettled([
    getSnapshot(currentMonth),
    prevMonth ? getSnapshot(prevMonth) : Promise.resolve(null),
    getAllTrendPoints(currentMonth),
    getPublishedPosts(),
    getHistoricalPageviewsBySlug(currentMonth),
    getTasks(),
  ]);
  const [currentResult, previousResult, trendResult, postsResult, historyResult, tasksResult] = results;
  if (currentResult.status === "rejected") return <AnalyticsUnavailable />;
  const snapshot = currentResult.value;
  if (!snapshot) notFound();
  const prevSnapshot = previousResult.status === "fulfilled" ? previousResult.value : null;
  const trendPoints = trendResult.status === "fulfilled" ? trendResult.value : [];
  const postsMap = postsResult.status === "fulfilled" ? postsResult.value : new Map();
  const historicalBySlug = historyResult.status === "fulfilled" ? historyResult.value : new Map();
  const tasks = tasksResult.status === "fulfilled" ? tasksResult.value : [];
  const sectionErrors = {
    comparison: previousResult.status === "rejected",
    trend: trendResult.status === "rejected",
    posts: postsResult.status === "rejected",
    history: historyResult.status === "rejected",
    tasks: tasksResult.status === "rejected",
  };
  const session = await getAdminSession();
  const canReadLeads = session && roleCanAccessPath(session.membership.role, "/admin/leads");
  const leadsResult = canReadLeads
    ? await listarLeadsDoMes(currentMonth, snapshot.context.periodEnd)
    : null;
  const canManageTasks = session?.membership.role === "owner" || session?.membership.role === "conteudo";

  const postPerformance = buildPostPerformance(
    snapshot,
    prevSnapshot,
    postsMap,
    historicalBySlug
  );

  const timelineEvents = buildTimelineEvents(postsMap, trendPoints);

  // Derivações puras das duas matrizes de calor. Reusam dado já buscado acima:
  // historicalBySlug alimenta a matriz de acervo, e a profundidade de leitura
  // vem do próprio snapshot do mês.
  const matrizAcervo = construirMatrizArtigoMes(historicalBySlug, postsMap);
  const mapaLeitura = construirMapaLeitura(snapshot.ga4_data?.articleProgress, postsMap);
  const oportunidade = construirMapaOportunidade(snapshot.gsc_data?.topQueries, snapshot.gsc_data?.queryCoverage);
  const funilLeads = leadsResult?.status === "ok"
    ? { status: "ok" as const, data: construirFunilLeads(leadsResult.data) }
    : leadsResult;

  // Conta posts publicados dentro do mês atual (pra detector "no-posts")
  const monthStart = `${currentMonth}-01`;
  const [year, monthNum] = currentMonth.split("-").map(Number);
  const nextMonthYear = monthNum === 12 ? year + 1 : year;
  const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
  const monthEnd = `${nextMonthYear}-${String(nextMonthNum).padStart(2, "0")}-01`;
  let postsPublishedInMonth = 0;
  for (const [, meta] of postsMap) {
    if (meta.publishedAt && meta.publishedAt >= monthStart && meta.publishedAt < monthEnd && meta.publishedAt.slice(0, 10) <= snapshot.context.periodEnd) {
      postsPublishedInMonth++;
    }
  }

  return (
    <AnalyticsContent
      sectionErrors={sectionErrors}
      canManageTasks={canManageTasks}
      snapshot={{ context: snapshot.context }}
      previousSnapshot={prevSnapshot ? { context: prevSnapshot.context } : null}
      trendPoints={trendPoints}
      postPerformance={postPerformance}
      postsPublishedInMonth={sectionErrors.posts ? undefined : postsPublishedInMonth}
      availableMonths={availableMonths}
      currentMonth={currentMonth}
      timelineEvents={timelineEvents}
      tasks={tasks}
      matrizAcervo={matrizAcervo}
      mapaLeitura={mapaLeitura}
      oportunidade={oportunidade}
      funilLeads={funilLeads}
    />
  );
}

function AnalyticsUnavailable() {
  return (
    <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-6">
      <h1 className="text-xl font-semibold text-neutral-900">Analytics indisponível</h1>
      <p className="mt-2 text-sm text-amber-900">Não foi possível carregar os relatórios. Os dados não foram alterados.</p>
      <form action="/admin/analytics" method="get"><button type="submit" className="mt-4 inline-flex min-h-11 items-center underline">Tentar novamente</button></form>
    </div>
  );
}
