"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { MetricTooltip } from "@/components/admin/analytics/MetricTooltip";
import { SortableHeader } from "@/components/admin/analytics/SortableHeader";
import { SparklineMini } from "@/components/admin/analytics/SparklineMini";
import type { TopQueryWithTrend } from "@/types/analytics";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Global filter sobre o texto da query.
export const queriesGlobalFilterFn: FilterFn<TopQueryWithTrend> = (
  row,
  _columnId,
  filterValue
) => {
  const q = typeof filterValue === "string" ? normalize(filterValue.trim()) : "";
  if (!q) return true;
  return normalize(row.original.query).includes(q);
};

// Filtra `position` por faixa via URL value: "top3" | "top10" | "page2" | "rest" | "".
const positionFilterFn: FilterFn<TopQueryWithTrend> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const pos = row.getValue<number>(columnId);
  switch (filterValue) {
    case "top3":
      return pos >= 1 && pos <= 3;
    case "top10":
      return pos >= 4 && pos <= 10;
    case "page2":
      return pos >= 11 && pos <= 20;
    case "rest":
      return pos > 20;
    default:
      return true;
  }
};

// Filtro de oportunidade: impressions >= 200 AND ctr < 2. URL value "1" ou ausente.
// Coluna sintética "opportunity" — não tem accessor próprio, lê do row.
const opportunityFilterFn: FilterFn<TopQueryWithTrend> = (row, _columnId, filterValue) => {
  if (!filterValue || filterValue !== "1") return true;
  return row.original.impressions >= 200 && row.original.ctr < 2;
};

export const queryColumns: ColumnDef<TopQueryWithTrend, unknown>[] = [
  {
    id: "query",
    accessorKey: "query",
    header: ({ column }) => <SortableHeader column={column} label="Query" align="left" />,
    cell: ({ row }) => (
      <span className="font-medium text-neutral-900">{row.original.query}</span>
    ),
    sortingFn: (a, b) => a.original.query.localeCompare(b.original.query, "pt-BR"),
    meta: { align: "left", label: "Query" },
  },
  {
    id: "clicks",
    accessorKey: "clicks",
    header: ({ column }) => <SortableHeader column={column} label="Cliques" align="right" />,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.clicks.toLocaleString("pt-BR")}</span>
    ),
    meta: { align: "right", label: "Cliques" },
  },
  {
    id: "impressions",
    accessorKey: "impressions",
    header: ({ column }) => (
      <SortableHeader column={column} label="Impressões" align="right" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-neutral-600">
        {row.original.impressions.toLocaleString("pt-BR")}
      </span>
    ),
    meta: { align: "right", label: "Impressões" },
  },
  {
    id: "ctr",
    accessorKey: "ctr",
    header: ({ column }) => (
      <span className="inline-flex items-center gap-1 justify-end w-full">
        <SortableHeader column={column} label="CTR" align="right" />
        <MetricTooltip
          iconSize={11}
          content={
            <p>
              Taxa de clique = cliques ÷ impressões. Mede o quanto o snippet no Google convence.
            </p>
          }
        />
      </span>
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-neutral-600">{row.original.ctr}%</span>
    ),
    meta: { align: "right", label: "CTR" },
  },
  {
    id: "position",
    accessorKey: "position",
    header: ({ column }) => (
      <span className="inline-flex items-center gap-1 justify-end w-full">
        <SortableHeader column={column} label="Posição" align="right" />
        <MetricTooltip
          iconSize={11}
          content={
            <p>
              Posição média ponderada por impressões no Google Search. Menor é melhor. 1 a 3 são o primeiro bloco da busca.
            </p>
          }
        />
      </span>
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-neutral-600">{row.original.position}</span>
    ),
    filterFn: positionFilterFn,
    meta: { align: "right", label: "Posição" },
  },
  {
    id: "trend",
    accessorKey: "trend",
    enableSorting: false,
    header: () => (
      <span className="text-neutral-500 font-medium uppercase text-xs tracking-wider w-full inline-flex justify-center">
        Tendência
      </span>
    ),
    cell: ({ row }) =>
      row.original.trend && row.original.trend.length > 1 ? (
        <SparklineMini data={row.original.trend} height={24} color="#0A0A0A" />
      ) : (
        <span className="text-neutral-300 text-xs flex justify-center">—</span>
      ),
    meta: { align: "center", label: "Tendência" },
    size: 96,
  },
  {
    // Coluna invisível, usada apenas pelo chip "Oportunidades".
    id: "opportunity",
    accessorFn: () => "",
    enableHiding: false,
    enableSorting: false,
    header: () => null,
    cell: () => null,
    filterFn: opportunityFilterFn,
    meta: { align: "left", label: "Oportunidade" },
  },
];

export const querySortFields = [
  { id: "query", label: "Query (A-Z)" },
  { id: "clicks", label: "Cliques" },
  { id: "impressions", label: "Impressões" },
  { id: "ctr", label: "CTR" },
  { id: "position", label: "Posição" },
] as const;

// Chips de filtro por faixa de posição GSC.
export const queryPositionChips = [
  { value: "", label: "Todas posições" },
  { value: "top3", label: "Top 1-3" },
  { value: "top10", label: "Top 4-10" },
  { value: "page2", label: "Página 2" },
  { value: "rest", label: "21+" },
] as const;
