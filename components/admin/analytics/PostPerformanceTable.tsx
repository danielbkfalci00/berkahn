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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUrlFilters } from "@/lib/analytics/use-url-filters";
import {
  postColumns,
  postSortFields,
  postStatusChips,
  postsGlobalFilterFn,
  StatusIconCell,
  BounceBadge,
  MoMBadge,
} from "@/lib/analytics/post-columns";
import { formatTimeMinSec } from "@/lib/analytics/post-performance";
import { DataTable } from "./DataTable";
import { cn } from "@/lib/utils";
import type { PostPerformance } from "@/types/analytics";

const URL_KEYS = ["posts_q", "posts_status", "posts_cat"] as const;

interface PostPerformanceTableProps {
  posts: PostPerformance[];
  initialLimit?: number;
}

export function PostPerformanceTable({
  posts,
  initialLimit = 15,
}: PostPerformanceTableProps) {
  const filters = useUrlFilters(URL_KEYS);

  const categories = React.useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))).sort(),
    [posts]
  );

  return (
    <Card className="bg-white border-neutral-200">
      <DataTable
        columns={postColumns}
        data={posts}
        initialLimit={initialLimit}
        visibilityStorageKey="postsColumnsHidden"
        initialSorting={[{ id: "pageviews", desc: true }]}
        emptyDataText="Nenhum post publicado encontrado para o período. Publique seu primeiro post para ver a performance aqui."
        emptyFilteredText="Sem resultados. Ajuste os filtros."
        toolbar={(table) => (
          <PostsToolbar
            table={table}
            categories={categories}
            filters={filters}
          />
        )}
        mobileCard={(post) => <PostMobileCard post={post} />}
      />
    </Card>
  );
}

interface PostsToolbarProps {
  table: TanstackTable<PostPerformance>;
  categories: string[];
  filters: ReturnType<typeof useUrlFilters<(typeof URL_KEYS)[number]>>;
}

function PostsToolbar({ table, categories, filters }: PostsToolbarProps) {
  const { values, setValue, clearAll, hasActive } = filters;

  // Sincroniza URL -> tabela. Filtros e globalFilter ficam controlados pela URL,
  // mas a leitura/comparação acontece pelos modelos da tabela.
  React.useEffect(() => {
    // attach custom global filter fn uma vez
    table.setOptions((prev) => ({
      ...prev,
      globalFilterFn: postsGlobalFilterFn,
    }));
  }, [table]);

  React.useEffect(() => {
    table.setGlobalFilter(values.posts_q || "");
  }, [table, values.posts_q]);

  React.useEffect(() => {
    table.getColumn("status")?.setFilterValue(values.posts_status || undefined);
  }, [table, values.posts_status]);

  React.useEffect(() => {
    table.getColumn("category")?.setFilterValue(values.posts_cat || undefined);
  }, [table, values.posts_cat]);

  const filteredCount = table.getFilteredRowModel().rows.length;
  const totalCount = table.getCoreRowModel().rows.length;
  const showCounter = filteredCount !== totalCount;
  const localGlobalFilter = (table.getState().globalFilter as string) || "";
  const showClearLink = hasActive || localGlobalFilter.length > 0;

  const sortField = table.getState().sorting[0]?.id ?? "pageviews";
  const sortDesc = table.getState().sorting[0]?.desc ?? true;

  return (
    <div className="space-y-3 pb-4">
      {/* Header: título + Ordenar + Colunas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Performance dos posts
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
              {postSortFields.map((f) => (
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Linha de search + categoria */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={values.posts_q}
          onChange={(e) => setValue("posts_q", e.target.value)}
          placeholder="Buscar por título ou categoria"
          aria-label="Buscar posts"
          className="h-8 max-w-xs bg-white"
        />
        {categories.length > 1 && (
          <Select
            value={values.posts_cat || "all"}
            onValueChange={(v) => setValue("posts_cat", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-8 w-[200px] bg-white text-xs">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                Todas as categorias
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Linha de chips de status + Limpar + Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {postStatusChips.map((chip) => {
            const active =
              (values.posts_status || "") === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setValue("posts_status", chip.value)}
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
          {totalCount === 1 ? "post" : "posts"}
        </p>
      )}
    </div>
  );
}

function PostMobileCard({ post }: { post: PostPerformance }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-2">
        <StatusIconCell status={post.status} />
        <MoMBadge pct={post.pageviewsMoMPct} />
      </div>
      <h4 className="text-sm font-semibold text-neutral-900 leading-snug mb-1 line-clamp-2">
        {post.title}
      </h4>
      <p className="text-[11px] text-neutral-500 mb-3">{post.category}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <div className="text-neutral-500">Pageviews</div>
          <div className="text-neutral-900 font-semibold tabular-nums">{post.pageviews}</div>
        </div>
        <div>
          <div className="text-neutral-500">Retenção</div>
          <div className="text-neutral-900 font-semibold tabular-nums">{post.retentionPct}%</div>
        </div>
        <div>
          <div className="text-neutral-500">Tempo</div>
          <div className="text-neutral-900 font-semibold tabular-nums">
            {formatTimeMinSec(post.avgEngagementTime)}
          </div>
        </div>
        <div>
          <div className="text-neutral-500">Bounce</div>
          <div className="font-semibold">
            <BounceBadge value={post.bounceRate} />
          </div>
        </div>
      </div>
    </>
  );
}
