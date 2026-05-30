"use client";

import * as React from "react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { ChevronDown, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUrlFilters } from "@/lib/analytics/use-url-filters";
import {
  queryColumns,
  queryPositionChips,
  querySortFields,
  queriesGlobalFilterFn,
} from "@/lib/analytics/query-columns";
import { SparklineMini } from "./SparklineMini";
import { DataTable } from "./DataTable";
import { cn } from "@/lib/utils";
import type { TopQueryWithTrend } from "@/types/analytics";

const URL_KEYS = ["queries_q", "queries_pos", "queries_opp"] as const;

interface TopQueriesTableProps {
  queries: TopQueryWithTrend[];
  maxRows?: number;
}

export function TopQueriesTable({ queries, maxRows = 15 }: TopQueriesTableProps) {
  const filters = useUrlFilters(URL_KEYS);

  return (
    <Card className="bg-white border-neutral-200">
      <DataTable
        columns={queryColumns}
        data={queries}
        initialLimit={maxRows}
        storageKey="queries"
        initialSorting={[{ id: "clicks", desc: true }]}
        emptyDataText="Sem dados de Search Console neste período."
        emptyFilteredText="Sem resultados. Ajuste os filtros."
        toolbar={(table) => <QueriesToolbar table={table} filters={filters} />}
        mobileCard={(q) => <QueryMobileCard query={q} />}
      />
    </Card>
  );
}

interface QueriesToolbarProps {
  table: TanstackTable<TopQueryWithTrend>;
  filters: ReturnType<typeof useUrlFilters<(typeof URL_KEYS)[number]>>;
}

function QueriesToolbar({ table, filters }: QueriesToolbarProps) {
  const { values, setValue, clearAll, hasActive } = filters;

  React.useEffect(() => {
    table.setOptions((prev) => ({
      ...prev,
      globalFilterFn: queriesGlobalFilterFn,
    }));
  }, [table]);

  React.useEffect(() => {
    table.setGlobalFilter(values.queries_q || "");
  }, [table, values.queries_q]);

  React.useEffect(() => {
    table.getColumn("position")?.setFilterValue(values.queries_pos || undefined);
  }, [table, values.queries_pos]);

  React.useEffect(() => {
    table.getColumn("opportunity")?.setFilterValue(values.queries_opp || undefined);
  }, [table, values.queries_opp]);

  const filteredCount = table.getFilteredRowModel().rows.length;
  const totalCount = table.getCoreRowModel().rows.length;
  const showCounter = filteredCount !== totalCount;
  const localGlobalFilter = (table.getState().globalFilter as string) || "";
  const showClearLink = hasActive || localGlobalFilter.length > 0;

  const sortField = table.getState().sorting[0]?.id ?? "clicks";
  const sortDesc = table.getState().sorting[0]?.desc ?? true;

  return (
    <div className="space-y-3 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Top queries no Google Search
        </h3>
        <div className="flex items-center gap-2">
          <Select
            value={sortField}
            onValueChange={(id) =>
              table.setSorting([{ id, desc: sortDesc }])
            }
          >
            <SelectTrigger className="h-8 w-[180px] bg-white text-xs">
              <span className="text-neutral-500">Ordenar por:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {querySortFields.map((f) => (
                <SelectItem key={f.id} value={f.id} className="text-xs">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 bg-white text-xs">
                Colunas <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs">Mostrar colunas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => {
                  const meta = column.columnDef.meta as { label?: string } | undefined;
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="text-xs"
                      checked={column.getIsVisible()}
                      onCheckedChange={(v) => column.toggleVisibility(!!v)}
                    >
                      {meta?.label ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs"
                onClick={() => {
                  table.resetColumnSizing();
                  table.resetColumnOrder();
                  table.resetColumnVisibility();
                }}
              >
                Resetar colunas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={values.queries_q}
          onChange={(e) => setValue("queries_q", e.target.value)}
          placeholder="Buscar query"
          aria-label="Buscar queries"
          className="h-8 max-w-xs bg-white"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {queryPositionChips.map((chip) => {
            const active = (values.queries_pos || "") === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setValue("queries_pos", chip.value)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  active
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                )}
              >
                {chip.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setValue("queries_opp", values.queries_opp === "1" ? "" : "1")
            }
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
              values.queries_opp === "1"
                ? "bg-[#B8801F] text-white border-[#B8801F]"
                : "bg-white text-[#B8801F] border-[#B8801F]/40 hover:bg-[#FDF4D8]"
            )}
            aria-pressed={values.queries_opp === "1"}
            title="Queries com 200+ impressões e menos de 2% de CTR"
          >
            Oportunidades
          </button>
        </div>
        {showClearLink && (
          <button
            type="button"
            onClick={() => {
              clearAll();
              table.setGlobalFilter("");
            }}
            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label="Limpar todos os filtros"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
            Limpar filtros
          </button>
        )}
      </div>

      {showCounter && (
        <p className="text-xs text-neutral-500">
          Mostrando {filteredCount} de {totalCount}{" "}
          {totalCount === 1 ? "query" : "queries"}
        </p>
      )}
    </div>
  );
}

function QueryMobileCard({ query }: { query: TopQueryWithTrend }) {
  return (
    <>
      <h4 className="text-sm font-semibold text-neutral-900 mb-3 leading-snug">
        {query.query}
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <div className="text-neutral-500">Cliques</div>
          <div className="text-neutral-900 font-semibold tabular-nums">
            {query.clicks.toLocaleString("pt-BR")}
          </div>
        </div>
        <div>
          <div className="text-neutral-500">Impressões</div>
          <div className="text-neutral-900 font-semibold tabular-nums">
            {query.impressions.toLocaleString("pt-BR")}
          </div>
        </div>
        <div>
          <div className="text-neutral-500">CTR</div>
          <div className="text-neutral-900 font-semibold tabular-nums">{query.ctr}%</div>
        </div>
        <div>
          <div className="text-neutral-500">Posição</div>
          <div className="text-neutral-900 font-semibold tabular-nums">{query.position}</div>
        </div>
      </div>
      {query.trend && query.trend.length > 1 && (
        <div className="mt-3">
          <SparklineMini data={query.trend} height={20} color="#0A0A0A" />
        </div>
      )}
    </>
  );
}
