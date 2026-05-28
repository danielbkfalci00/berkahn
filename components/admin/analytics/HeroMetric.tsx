"use client";

import { Card } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MetricTooltip } from "./MetricTooltip";
import { SparklineMini } from "./SparklineMini";
import { cn } from "@/lib/utils";
import {
  computeHealthScore,
  statusColor,
  statusLabel,
  type HealthScoreBreakdown,
} from "@/lib/analytics/health-score";
import type { SnapshotContext, TrendPoint } from "@/types/analytics";

interface HeroMetricProps {
  context: SnapshotContext;
  trendPoints: TrendPoint[];
}

function trendIcon(current: number, prev: number | undefined) {
  if (prev === undefined) return { Icon: Minus, color: "#8A8A8A" };
  if (current > prev + 2) return { Icon: TrendingUp, color: "#1F6F3D" };
  if (current < prev - 2) return { Icon: TrendingDown, color: "#B83A3A" };
  return { Icon: Minus, color: "#8A8A8A" };
}

export function HeroMetric({ context, trendPoints }: HeroMetricProps) {
  const health: HealthScoreBreakdown = computeHealthScore(context);
  const color = statusColor(health.status);
  const label = statusLabel(health.status);

  // Sparkline: score histórico não temos ainda — usamos users como proxy
  const usersTrend = trendPoints.map((p) => p.users);
  const currentUsers = context.ga4.users;
  const prevUsers = trendPoints.length > 1 ? trendPoints[trendPoints.length - 2].users : undefined;
  const { Icon: TrendIcon, color: trendColor } = trendIcon(currentUsers, prevUsers);

  return (
    <Card
      className="p-6 sm:p-8 bg-[#F4F2EC] border-l-4 print:border-l-2"
      style={{ borderLeftColor: color }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500 mb-2">
            <Activity className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Health Score</span>
            <MetricTooltip
              content={
                <div className="space-y-2">
                  <p className="font-semibold text-neutral-900">Health Score 0-100</p>
                  <p>Resume a saúde do projeto no mês a partir de 4 componentes:</p>
                  <ul className="space-y-1 pl-3 list-disc">
                    <li>Indexação Google (30%)</li>
                    <li>Crescimento de users MoM (30%)</li>
                    <li>Crescimento de cliques GSC MoM (20%)</li>
                    <li>Engagement rate atual (20%)</li>
                  </ul>
                  <p className="text-neutral-600 pt-1">
                    80+ excelente · 60-80 bom · 40-60 atenção · &lt;40 crítico
                  </p>
                </div>
              }
            />
          </div>

          <div className="flex items-baseline gap-4 mt-1">
            <div className="text-6xl font-bold leading-none tabular-nums tracking-tight" style={{ color }}>
              {health.score}
            </div>
            <div>
              <div className="text-base font-semibold" style={{ color }}>
                {label}
              </div>
              <div className="text-sm text-neutral-500">{context.monthLabel}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-5 text-sm text-neutral-600">
            <span>
              Indexação{" "}
              <strong className="text-neutral-900">{health.components.indexation.raw}</strong>
            </span>
            <span>
              Users {context.ga4.usersMoMText && (
                <strong className="text-neutral-900">{context.ga4.usersMoMText}</strong>
              )}
            </span>
            <span>
              Cliques {context.gsc.clicksMoMText && (
                <strong className="text-neutral-900">{context.gsc.clicksMoMText}</strong>
              )}
            </span>
            <span>
              Engagement{" "}
              <strong className="text-neutral-900">{health.components.engagementRate.raw}</strong>
            </span>
          </div>
        </div>

        {usersTrend.length > 1 && (
          <div className="w-full lg:w-64 lg:flex-shrink-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 mb-2">
              <TrendIcon className="h-3.5 w-3.5" strokeWidth={2} style={{ color: trendColor }} />
              <span>Tendência de users</span>
            </div>
            <SparklineMini data={usersTrend} height={56} color={color} />
            <div className="text-xs text-neutral-500 mt-1">
              {trendPoints.map((p) => p.monthLabel).join(" · ")}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
