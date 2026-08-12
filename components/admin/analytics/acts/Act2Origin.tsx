"use client";

import { AreaDistributionChart } from "../AreaDistributionChart";
import { TrafficSourcesChart } from "../TrafficSourcesChart";
import { DevicesMiniChart } from "../DevicesMiniChart";
import { TopQueriesTable } from "../TopQueriesTable";
import { QuadranteOportunidade } from "../QuadranteOportunidade";
import { narrativeAct2Origin } from "@/lib/analytics/narrative";
import type { MapaOportunidade } from "@/lib/analytics/query-opportunity";
import type { SnapshotContext, TopQueryWithTrend } from "@/types/analytics";

interface Act2OriginProps {
  context: SnapshotContext;
  topQueries: TopQueryWithTrend[];
  oportunidade: MapaOportunidade;
}

export function Act2Origin({ context, topQueries, oportunidade }: Act2OriginProps) {
  return (
    <section className="space-y-6" aria-labelledby="act-2-title">
      <div>
        <h2 id="act-2-title" className="text-2xl font-bold text-neutral-900 tracking-tight">
          De onde vem o tráfego
        </h2>
        <p className="text-base text-neutral-600 mt-1">{narrativeAct2Origin(context)}</p>
      </div>
      <TrafficSourcesChart data={context.ga4.topSources} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaDistributionChart data={context.ga4.byArea} />
        <DevicesMiniChart data={context.ga4.byDevice} />
      </div>
      <TopQueriesTable queries={topQueries} />
      <QuadranteOportunidade mapa={oportunidade} />
    </section>
  );
}
