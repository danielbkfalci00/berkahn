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
import { AnalyticsContent } from "./AnalyticsContent";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const { month: queryMonth } = await searchParams;

  const availableMonths = await getAvailableMonths();

  if (availableMonths.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Nenhum snapshot disponível ainda
        </h1>
        <p className="text-neutral-500 max-w-md">
          Os relatórios mensais aparecerão aqui após a primeira execução do cron{" "}
          <code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded">
            berkahn-performance-mensal
          </code>
          . Para popular agora, rode{" "}
          <code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded">
            node --env-file=.env.local scripts/analytics/generate-report.mjs --bootstrap --from-cache
          </code>
          .
        </p>
      </div>
    );
  }

  const currentMonth =
    queryMonth && availableMonths.includes(queryMonth)
      ? queryMonth
      : availableMonths[0];

  const snapshot = await getSnapshot(currentMonth);
  if (!snapshot) notFound();

  const prevMonth = previousMonthSlug(currentMonth);
  const prevSnapshot = prevMonth ? await getSnapshot(prevMonth) : null;

  const [trendPoints, postsMap, historicalBySlug] = await Promise.all([
    getAllTrendPoints(),
    getPublishedPosts(),
    getHistoricalPageviewsBySlug(),
  ]);

  const postPerformance = buildPostPerformance(
    snapshot,
    prevSnapshot,
    postsMap,
    historicalBySlug
  );

  const timelineEvents = buildTimelineEvents(postsMap, trendPoints);

  // Conta posts publicados dentro do mês atual (pra detector "no-posts")
  const monthStart = `${currentMonth}-01`;
  const [year, monthNum] = currentMonth.split("-").map(Number);
  const nextMonthYear = monthNum === 12 ? year + 1 : year;
  const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
  const monthEnd = `${nextMonthYear}-${String(nextMonthNum).padStart(2, "0")}-01`;
  let postsPublishedInMonth = 0;
  for (const [, meta] of postsMap) {
    if (meta.publishedAt && meta.publishedAt >= monthStart && meta.publishedAt < monthEnd) {
      postsPublishedInMonth++;
    }
  }

  return (
    <AnalyticsContent
      snapshot={snapshot}
      previousSnapshot={prevSnapshot}
      trendPoints={trendPoints}
      postPerformance={postPerformance}
      postsPublishedInMonth={postsPublishedInMonth}
      availableMonths={availableMonths}
      currentMonth={currentMonth}
      timelineEvents={timelineEvents}
    />
  );
}
