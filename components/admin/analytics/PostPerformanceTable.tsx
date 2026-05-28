"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Minus,
} from "lucide-react";
import { SparklineMini } from "./SparklineMini";
import { MetricTooltip } from "./MetricTooltip";
import { STATUS_META, formatTimeMinSec } from "@/lib/analytics/post-performance";
import { cn } from "@/lib/utils";
import type { PostPerformance, PostStatus } from "@/types/analytics";

interface PostPerformanceTableProps {
  posts: PostPerformance[];
  initialLimit?: number;
}

type FilterValue = "all" | PostStatus;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "engaged", label: "Engajados" },
  { value: "rising", label: "Em alta" },
  { value: "cold", label: "Em queda" },
  { value: "abandoned", label: "Abandonados" },
];

function StatusIcon({ status }: { status: PostStatus }) {
  const meta = STATUS_META[status];
  const Icon =
    status === "engaged"
      ? Trophy
      : status === "rising"
        ? TrendingUp
        : status === "cold"
          ? TrendingDown
          : status === "abandoned"
            ? AlertTriangle
            : Minus;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none"
      style={{ background: meta.bg, color: meta.color }}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

function BounceBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-neutral-300">—</span>;
  const color =
    value < 40 ? "#1F6F3D" : value < 70 ? "#B8801F" : "#B83A3A";
  return (
    <span className="tabular-nums font-medium" style={{ color }}>
      {value.toFixed(0)}%
    </span>
  );
}

function MoMBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-neutral-300">—</span>;
  const color = pct >= 0 ? "#1F6F3D" : "#B83A3A";
  const bg = pct >= 0 ? "#E8F3EC" : "#F8E8E8";
  const arrow = pct >= 0 ? "↑" : "↓";
  return (
    <span
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums leading-none"
      style={{ background: bg, color }}
    >
      {arrow} {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

export function PostPerformanceTable({
  posts,
  initialLimit = 15,
}: PostPerformanceTableProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((p) => p.status === filter);
  }, [posts, filter]);

  const visible = showAll ? filtered : filtered.slice(0, initialLimit);

  if (posts.length === 0) {
    return (
      <Card className="p-6 bg-white border-neutral-200">
        <p className="text-sm text-neutral-500">
          Nenhum post publicado encontrado para o período. Publique seu primeiro post para ver
          a performance aqui.
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-neutral-200">
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Performance dos posts
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors border",
                filter === f.value
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop tabela ≥768px */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-200 hover:bg-transparent">
              <TableHead className="pl-6 text-neutral-500 font-medium uppercase text-xs tracking-wider w-32">
                Status
              </TableHead>
              <TableHead className="text-neutral-500 font-medium uppercase text-xs tracking-wider">
                Post
              </TableHead>
              <TableHead className="text-right text-neutral-500 font-medium uppercase text-xs tracking-wider">
                Pageviews
              </TableHead>
              <TableHead className="text-right text-neutral-500 font-medium uppercase text-xs tracking-wider">
                <div className="inline-flex items-center gap-1 justify-end">
                  Retenção
                  <MetricTooltip
                    content={
                      <p>
                        Tempo médio engajado dividido pelo read_time configurado do post (vezes 100).
                        Acima de 60% = engajado.
                      </p>
                    }
                  />
                </div>
              </TableHead>
              <TableHead className="text-right text-neutral-500 font-medium uppercase text-xs tracking-wider">
                <div className="inline-flex items-center gap-1 justify-end">
                  Bounce
                  <MetricTooltip
                    content={
                      <p>
                        % de sessões que saíram sem interação. Verde &lt;40 · Amarelo 40-70 ·
                        Vermelho &gt;70.
                      </p>
                    }
                  />
                </div>
              </TableHead>
              <TableHead className="text-right text-neutral-500 font-medium uppercase text-xs tracking-wider">
                Tempo
              </TableHead>
              <TableHead className="text-center text-neutral-500 font-medium uppercase text-xs tracking-wider w-24">
                Trend
              </TableHead>
              <TableHead className="text-right pr-6 text-neutral-500 font-medium uppercase text-xs tracking-wider">
                MoM
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((p) => (
              <TableRow key={p.slug} className="border-neutral-100 hover:bg-[#FAF8F2]">
                <TableCell className="pl-6">
                  <StatusIcon status={p.status} />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-neutral-900 line-clamp-1">{p.title}</div>
                  <Badge variant="outline" className="mt-1 text-[10px] font-normal border-neutral-200 text-neutral-500">
                    {p.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums font-semibold">
                  {p.pageviews}
                </TableCell>
                <TableCell className="text-right tabular-nums text-neutral-700">
                  {p.retentionPct}%
                </TableCell>
                <TableCell className="text-right">
                  <BounceBadge value={p.bounceRate} />
                </TableCell>
                <TableCell className="text-right tabular-nums text-neutral-600">
                  {formatTimeMinSec(p.avgEngagementTime)}
                </TableCell>
                <TableCell>
                  {p.pageviewsSparkline.length > 1 ? (
                    <SparklineMini data={p.pageviewsSparkline} height={20} color="#0A0A0A" />
                  ) : (
                    <span className="text-neutral-300 text-xs flex justify-center">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <MoMBadge pct={p.pageviewsMoMPct} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards <768px */}
      <div className="md:hidden divide-y divide-neutral-100 px-4 pb-4">
        {visible.map((p) => (
          <div key={p.slug} className="py-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <StatusIcon status={p.status} />
              <MoMBadge pct={p.pageviewsMoMPct} />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-snug mb-1 line-clamp-2">
              {p.title}
            </h4>
            <p className="text-[11px] text-neutral-500 mb-3">{p.category}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <div className="text-neutral-500">Pageviews</div>
                <div className="text-neutral-900 font-semibold tabular-nums">{p.pageviews}</div>
              </div>
              <div>
                <div className="text-neutral-500">Retenção</div>
                <div className="text-neutral-900 font-semibold tabular-nums">{p.retentionPct}%</div>
              </div>
              <div>
                <div className="text-neutral-500">Tempo</div>
                <div className="text-neutral-900 font-semibold tabular-nums">
                  {formatTimeMinSec(p.avgEngagementTime)}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Bounce</div>
                <div className="font-semibold">
                  <BounceBadge value={p.bounceRate} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > initialLimit && (
        <div className="px-4 md:px-6 py-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
          >
            {showAll ? "Mostrar apenas top " + initialLimit : `Ver todos (${filtered.length})`}
          </button>
        </div>
      )}
    </Card>
  );
}
