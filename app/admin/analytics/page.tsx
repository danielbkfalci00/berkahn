import { notFound } from "next/navigation";
import {
  getAvailableMonths,
  getSnapshot,
  getAllTrendPoints,
} from "@/lib/analytics/queries";
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

  const trendPoints = await getAllTrendPoints();

  return (
    <AnalyticsContent
      snapshot={snapshot}
      trendPoints={trendPoints}
      availableMonths={availableMonths}
      currentMonth={currentMonth}
    />
  );
}
