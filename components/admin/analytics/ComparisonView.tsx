"use client";

import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus, SplitSquareHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsSnapshot, KpiCardData } from "@/types/analytics";

interface ComparisonViewProps {
  current: AnalyticsSnapshot;
  previous: AnalyticsSnapshot;
}

interface KpiPair {
  label: string;
  current: number;
  previous: number;
  format?: (n: number) => string;
}

function intFmt(n: number): string {
  return n.toLocaleString("pt-BR");
}

function pctFmt(n: number): string {
  return `${n.toFixed(1)}%`;
}

function computeDelta(current: number, previous: number) {
  if (previous === 0) return { pct: null, direction: "flat" as const, text: "—" };
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 0.5) return { pct, direction: "flat" as const, text: "≈ 0%" };
  const direction = pct > 0 ? ("up" as const) : ("down" as const);
  const arrow = direction === "up" ? "↑" : "↓";
  return { pct, direction, text: `${arrow} ${Math.abs(pct).toFixed(0)}%` };
}

export function ComparisonView({ current, previous }: ComparisonViewProps) {
  const cur = current.context;
  const prev = previous.context;

  const pairs: KpiPair[] = [
    { label: "Usuários", current: cur.ga4.users, previous: prev.ga4.users },
    { label: "Sessões", current: cur.ga4.sessions, previous: prev.ga4.sessions },
    { label: "Pageviews", current: cur.ga4.pageviews, previous: prev.ga4.pageviews },
    { label: "Cliques GSC", current: cur.gsc.clicks, previous: prev.gsc.clicks },
    { label: "Impressões", current: cur.gsc.impressions, previous: prev.gsc.impressions },
    {
      label: "Engagement rate",
      current: cur.ga4.engagementRate,
      previous: prev.ga4.engagementRate,
      format: pctFmt,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 text-sm uppercase tracking-wider font-medium text-neutral-500">
        <SplitSquareHorizontal className="h-4 w-4" strokeWidth={2} />
        <span>Comparativo</span>
        <span className="text-neutral-300">·</span>
        <span className="text-neutral-700 font-semibold">{prev.monthLabel}</span>
        <span className="text-neutral-300">vs</span>
        <span className="text-neutral-700 font-semibold">{cur.monthLabel}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mês anterior */}
        <Card className="p-6 bg-neutral-50 border-neutral-200">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500">
              {prev.monthLabel}
            </h3>
            <span className="text-xs text-neutral-400">anterior</span>
          </div>
          <div className="space-y-3">
            {pairs.map((p) => (
              <div key={p.label} className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-neutral-600">{p.label}</span>
                <span className="text-lg font-semibold text-neutral-700 tabular-nums">
                  {p.format ? p.format(p.previous) : intFmt(p.previous)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Mês atual */}
        <Card className="p-6 bg-white border-neutral-900 border-l-4 border-l-neutral-900">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900">
              {cur.monthLabel}
            </h3>
            <span className="text-xs text-neutral-500">atual</span>
          </div>
          <div className="space-y-3">
            {pairs.map((p) => {
              const delta = computeDelta(p.current, p.previous);
              const deltaColor =
                delta.direction === "up"
                  ? "text-[#1F6F3D] bg-[#E8F3EC]"
                  : delta.direction === "down"
                    ? "text-[#B83A3A] bg-[#F8E8E8]"
                    : "text-neutral-500 bg-neutral-100";
              const Icon =
                delta.direction === "up" ? ArrowUp : delta.direction === "down" ? ArrowDown : Minus;
              return (
                <div key={p.label} className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-neutral-600">{p.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-neutral-900 tabular-nums">
                      {p.format ? p.format(p.current) : intFmt(p.current)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold leading-none",
                        deltaColor
                      )}
                    >
                      <Icon className="h-2.5 w-2.5" strokeWidth={3} />
                      {delta.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Top fontes side-by-side compacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SourcesPanel label="Top 5 fontes" sources={prev.ga4.topSources.slice(0, 5)} variant="prev" />
        <SourcesPanel label="Top 5 fontes" sources={cur.ga4.topSources.slice(0, 5)} variant="current" />
      </div>
    </section>
  );
}

interface SourcesPanelProps {
  label: string;
  sources: Array<{ label: string; sessions: number; pctOfTotal: number }>;
  variant: "prev" | "current";
}

function SourcesPanel({ label, sources, variant }: SourcesPanelProps) {
  const isCurrent = variant === "current";
  return (
    <Card
      className={cn(
        "p-6",
        isCurrent ? "bg-white border-l-4 border-l-neutral-900" : "bg-neutral-50 border-neutral-200"
      )}
    >
      <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3">
        {label}
      </h4>
      <ul className="space-y-2">
        {sources.map((s, i) => (
          <li key={i} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-neutral-700 truncate">{s.label}</span>
            <span className="tabular-nums font-medium text-neutral-900">
              {s.sessions} ({s.pctOfTotal}%)
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
