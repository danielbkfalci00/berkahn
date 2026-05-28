"use client";

import { HeroMetric } from "../HeroMetric";
import { WinCard } from "../WinCard";
import { RedFlagCard } from "../RedFlagCard";
import { computeHealthScore } from "@/lib/analytics/health-score";
import { detectWin, detectRedFlag, narrativeAct0Status } from "@/lib/analytics/narrative";
import type { SnapshotContext, TrendPoint } from "@/types/analytics";

interface Act0StatusProps {
  context: SnapshotContext;
  trendPoints: TrendPoint[];
}

/**
 * ATO 0 — Status do mês.
 * Hero metric (Health Score 0-100) + Win + Red Flag.
 * Em 5 segundos a pessoa sabe se o mês foi bom ou ruim.
 */
export function Act0Status({ context, trendPoints }: Act0StatusProps) {
  const health = computeHealthScore(context);
  const win = detectWin(context);
  const redFlag = detectRedFlag(context);
  const narrative = narrativeAct0Status(context, health, win, redFlag);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Status do mês
        </h2>
        <p className="text-base text-neutral-600 mt-1">{narrative}</p>
      </div>

      <HeroMetric context={context} trendPoints={trendPoints} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WinCard win={win} />
        <RedFlagCard redFlag={redFlag} />
      </div>
    </section>
  );
}
