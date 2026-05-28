"use client";

import { KpiCardGrid } from "../KpiCardGrid";
import { GrowthChart } from "../GrowthChart";
import { narrativeAct1Growth } from "@/lib/analytics/narrative";
import type { TimelineEvent } from "@/lib/analytics/timeline-events";
import type { SnapshotContext, KpiCardData, TrendPoint } from "@/types/analytics";

interface Act1GrowthProps {
  context: SnapshotContext;
  kpis: KpiCardData[];
  trendPoints: TrendPoint[];
  timelineEvents: TimelineEvent[];
}

export function Act1Growth({ context, kpis, trendPoints, timelineEvents }: Act1GrowthProps) {
  return (
    <section className="space-y-6" aria-labelledby="act-1-title">
      <div>
        <h2 id="act-1-title" className="text-2xl font-bold text-neutral-900 tracking-tight">
          Como estamos crescendo
        </h2>
        <p className="text-base text-neutral-600 mt-1">{narrativeAct1Growth(context)}</p>
      </div>
      <KpiCardGrid kpis={kpis} />
      <GrowthChart data={trendPoints} events={timelineEvents} />
    </section>
  );
}
