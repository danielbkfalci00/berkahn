"use client";

import { AreaDistributionChart } from "../AreaDistributionChart";
import { TrafficSourcesChart } from "../TrafficSourcesChart";
import { TopQueriesTable } from "../TopQueriesTable";
import { narrativeAct2Origin } from "@/lib/analytics/narrative";
import type { SnapshotContext, TopQueryWithTrend } from "@/types/analytics";

interface Act2OriginProps {
  context: SnapshotContext;
  topQueries: TopQueryWithTrend[];
}

/**
 * ATO 2 — Origem do tráfego.
 * Distribuição por área + top fontes (com IAs consolidadas) + top queries.
 */
export function Act2Origin({ context, topQueries }: Act2OriginProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          De onde vem o tráfego
        </h2>
        <p className="text-base text-neutral-600 mt-1">{narrativeAct2Origin(context)}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaDistributionChart data={context.ga4.byArea} />
        <TrafficSourcesChart data={context.ga4.topSources} />
      </div>
      <TopQueriesTable queries={topQueries} />
    </section>
  );
}
