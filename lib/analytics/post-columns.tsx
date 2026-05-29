"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { AlertTriangle, Minus, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MetricTooltip } from "@/components/admin/analytics/MetricTooltip";
import { SortableHeader } from "@/components/admin/analytics/SortableHeader";
import { SparklineMini } from "@/components/admin/analytics/SparklineMini";
import { STATUS_META, formatTimeMinSec } from "@/lib/analytics/post-performance";
import type { PostPerformance, PostStatus } from "@/types/analytics";

const STATUS_ORDER: Record<PostStatus, number> = {
  engaged: 0,
  rising: 1,
  neutral: 2,
  cold: 3,
  abandoned: 4,
};

// Filter custom para status (chips controlam columnFilters: o valor é PostStatus ou "").
const statusFilterFn: FilterFn<PostPerformance> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  return row.getValue(columnId) === filterValue;
};

// Filter de categoria (string single, vindo da URL).
const categoryFilterFn: FilterFn<PostPerformance> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  return row.getValue<string>(columnId) === filterValue;
};

// Global filter: busca em title + category, case-insensitive, ignora diacríticos.
function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
export const postsGlobalFilterFn: FilterFn<PostPerformance> = (row, _columnId, filterValue) => {
  const q = typeof filterValue === "string" ? normalize(filterValue.trim()) : "";
  if (!q) return true;
  const post = row.original;
  return normalize(post.title).includes(q) || normalize(post.category).includes(q);
};

export function StatusIconCell({ status }: { status: PostStatus }) {
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
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none whitespace-nowrap"
      style={{ background: meta.bg, color: meta.color }}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

export function BounceBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-neutral-300">—</span>;
  const color = value < 40 ? "#1F6F3D" : value < 70 ? "#B8801F" : "#B83A3A";
  return (
    <span className="tabular-nums font-medium" style={{ color }}>
      {value.toFixed(0)}%
    </span>
  );
}

export function MoMBadge({ pct }: { pct: number | null }) {
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

export const postColumns: ColumnDef<PostPerformance, unknown>[] = [
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} label="Status" align="left" />,
    cell: ({ row }) => <StatusIconCell status={row.original.status} />,
    sortingFn: (a, b) =>
      STATUS_ORDER[a.original.status] - STATUS_ORDER[b.original.status],
    filterFn: statusFilterFn,
    meta: { align: "left", label: "Status" },
    size: 130,
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} label="Post" align="left" />,
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-neutral-900 line-clamp-1">{row.original.title}</div>
        <Badge
          variant="outline"
          className="mt-1 text-[10px] font-normal border-neutral-200 text-neutral-500"
        >
          {row.original.category}
        </Badge>
      </div>
    ),
    sortingFn: (a, b) => a.original.title.localeCompare(b.original.title, "pt-BR"),
    meta: { align: "left", label: "Post" },
  },
  {
    id: "category",
    accessorKey: "category",
    enableHiding: false, // sempre escondida do desktop; existe só para filterFn de chips de categoria
    header: () => null,
    cell: () => null,
    filterFn: categoryFilterFn,
    meta: { align: "left", label: "Categoria" },
  },
  {
    id: "pageviews",
    accessorKey: "pageviews",
    header: ({ column }) => <SortableHeader column={column} label="Pageviews" align="right" />,
    cell: ({ row }) => (
      <span className="tabular-nums font-semibold">{row.original.pageviews}</span>
    ),
    meta: { align: "right", label: "Pageviews" },
  },
  {
    id: "retentionPct",
    accessorKey: "retentionPct",
    header: ({ column }) => (
      <span className="inline-flex items-center gap-1 justify-end w-full">
        <SortableHeader column={column} label="Retenção" align="right" />
        <MetricTooltip
          iconSize={11}
          content={
            <p>
              Tempo médio engajado dividido pelo read_time configurado do post (vezes 100). Acima de 60% é considerado engajado.
            </p>
          }
        />
      </span>
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-neutral-700">{row.original.retentionPct}%</span>
    ),
    meta: { align: "right", label: "Retenção" },
  },
  {
    id: "bounceRate",
    accessorKey: "bounceRate",
    header: ({ column }) => (
      <span className="inline-flex items-center gap-1 justify-end w-full">
        <SortableHeader column={column} label="Bounce" align="right" />
        <MetricTooltip
          iconSize={11}
          content={
            <p>
              Porcentagem de sessões que saíram sem interação. Verde abaixo de 40, amarelo entre 40 e 70, vermelho acima de 70.
            </p>
          }
        />
      </span>
    ),
    cell: ({ row }) => <BounceBadge value={row.original.bounceRate} />,
    sortingFn: (a, b) => {
      const av = a.original.bounceRate;
      const bv = b.original.bounceRate;
      if (av === null && bv === null) return 0;
      if (av === null) return 1; // nulls last
      if (bv === null) return -1;
      return av - bv;
    },
    sortUndefined: "last",
    meta: { align: "right", label: "Bounce" },
  },
  {
    id: "avgEngagementTime",
    accessorKey: "avgEngagementTime",
    header: ({ column }) => <SortableHeader column={column} label="Tempo" align="right" />,
    cell: ({ row }) => (
      <span className="tabular-nums text-neutral-600">
        {formatTimeMinSec(row.original.avgEngagementTime)}
      </span>
    ),
    meta: { align: "right", label: "Tempo médio" },
  },
  {
    id: "trend",
    accessorKey: "pageviewsSparkline",
    enableSorting: false,
    header: () => (
      <span className="text-neutral-500 font-medium uppercase text-xs tracking-wider w-full inline-flex justify-center">
        Trend
      </span>
    ),
    cell: ({ row }) =>
      row.original.pageviewsSparkline.length > 1 ? (
        <SparklineMini data={row.original.pageviewsSparkline} height={20} color="#0A0A0A" />
      ) : (
        <span className="text-neutral-300 text-xs flex justify-center">—</span>
      ),
    meta: { align: "center", label: "Trend" },
    size: 96,
  },
  {
    id: "pageviewsMoMPct",
    accessorKey: "pageviewsMoMPct",
    header: ({ column }) => <SortableHeader column={column} label="MoM" align="right" />,
    cell: ({ row }) => <MoMBadge pct={row.original.pageviewsMoMPct} />,
    sortingFn: (a, b) => {
      const av = a.original.pageviewsMoMPct;
      const bv = b.original.pageviewsMoMPct;
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return av - bv;
    },
    sortUndefined: "last",
    meta: { align: "right", label: "MoM" },
  },
];

// Lista de campos sortable expostos no Select "Ordenar por".
export const postSortFields = [
  { id: "status", label: "Status" },
  { id: "title", label: "Título (A-Z)" },
  { id: "pageviews", label: "Pageviews" },
  { id: "retentionPct", label: "Retenção" },
  { id: "bounceRate", label: "Bounce" },
  { id: "avgEngagementTime", label: "Tempo médio" },
  { id: "pageviewsMoMPct", label: "MoM" },
] as const;

// Lista de chips de status (URL value | label).
export const postStatusChips = [
  { value: "", label: "Todos" },
  { value: "engaged", label: "Engajados" },
  { value: "rising", label: "Em alta" },
  { value: "cold", label: "Em queda" },
  { value: "abandoned", label: "Abandonados" },
] as const;
