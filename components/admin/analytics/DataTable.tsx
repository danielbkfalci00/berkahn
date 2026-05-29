"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** Slot acima da tabela (search, chips, Select de sort, Limpar, Colunas, counter). Recebe a tabela tanstack. */
  toolbar?: (table: TanstackTable<TData>) => React.ReactNode;
  /** Render por linha em mobile (substitui a tabela em < md). */
  mobileCard?: (row: TData) => React.ReactNode;
  /** Texto quando filtros zeram resultado mas data > 0. */
  emptyFilteredText?: string;
  /** Texto quando data === []. */
  emptyDataText?: string;
  /** Quantidade inicial antes do toggle "Ver todos". 0 = sem limite. */
  initialLimit?: number;
  /** Chave de localStorage para persistir column visibility. */
  visibilityStorageKey?: string;
  /** Sort inicial. */
  initialSorting?: SortingState;
  /** Classe extra no Card wrapper. */
  className?: string;
}

/**
 * Tabela genérica baseada em @tanstack/react-table + shadcn Table.
 * Berkahn-styled (neutral palette, hover #FAF8F2). Headless: toolbar custom via slot.
 *
 * Sort + filter + globalFilter + column visibility controlados internamente.
 * Consumer acessa table instance via slot `toolbar` para chips/Select externos.
 */
export function DataTable<TData>({
  columns,
  data,
  toolbar,
  mobileCard,
  emptyFilteredText = "Sem resultados. Ajuste os filtros.",
  emptyDataText = "Sem dados neste período.",
  initialLimit = 15,
  visibilityStorageKey,
  initialSorting = [],
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [showAll, setShowAll] = React.useState(false);

  // Hydrate column visibility from localStorage (client only).
  React.useEffect(() => {
    if (!visibilityStorageKey) return;
    try {
      const stored = window.localStorage.getItem(visibilityStorageKey);
      if (stored) setColumnVisibility(JSON.parse(stored));
    } catch {
      // ignore corrupted localStorage
    }
  }, [visibilityStorageKey]);

  React.useEffect(() => {
    if (!visibilityStorageKey) return;
    try {
      window.localStorage.setItem(visibilityStorageKey, JSON.stringify(columnVisibility));
    } catch {
      // ignore quota / private mode
    }
  }, [columnVisibility, visibilityStorageKey]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    sortDescFirst: false,
    enableSortingRemoval: false,
  });

  const rows = table.getRowModel().rows;
  const visibleRows = initialLimit > 0 && !showAll ? rows.slice(0, initialLimit) : rows;
  const isFiltered = columnFilters.length > 0 || globalFilter !== "";

  return (
    <div className={cn("w-full", className)}>
      {toolbar && <div className="px-4 md:px-6 pt-6">{toolbar(table)}</div>}

      {data.length === 0 ? (
        <div className="px-4 md:px-6 py-8">
          <p className="text-sm text-neutral-500">{emptyDataText}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="px-4 md:px-6 py-8">
          <p className="text-sm text-neutral-500">{emptyFilteredText}</p>
        </div>
      ) : (
        <>
          {/* Desktop ≥ md */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-neutral-200 hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      const sortDir = header.column.getIsSorted();
                      const ariaSort =
                        sortDir === "asc"
                          ? "ascending"
                          : sortDir === "desc"
                            ? "descending"
                            : header.column.getCanSort()
                              ? "none"
                              : undefined;
                      const align = (header.column.columnDef.meta as { align?: string } | undefined)?.align;
                      return (
                        <TableHead
                          key={header.id}
                          aria-sort={ariaSort}
                          className={cn(
                            "text-neutral-500 font-medium uppercase text-xs tracking-wider",
                            align === "right" && "text-right",
                            align === "center" && "text-center",
                            header.id === headerGroup.headers[0].id && "pl-6",
                            header.id === headerGroup.headers[headerGroup.headers.length - 1].id && "pr-6"
                          )}
                          style={{ width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : undefined }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-neutral-100 hover:bg-[#FAF8F2]"
                  >
                    {row.getVisibleCells().map((cell, idx, all) => {
                      const align = (cell.column.columnDef.meta as { align?: string } | undefined)?.align;
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            align === "right" && "text-right",
                            align === "center" && "text-center",
                            idx === 0 && "pl-6",
                            idx === all.length - 1 && "pr-6"
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile < md */}
          {mobileCard && (
            <div className="md:hidden divide-y divide-neutral-100 px-4 pb-4">
              {visibleRows.map((row) => (
                <div key={row.id} className="py-4">
                  {mobileCard(row.original)}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {initialLimit > 0 && rows.length > initialLimit && (
        <div className="px-4 md:px-6 py-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            {showAll
              ? `Mostrar apenas top ${initialLimit}`
              : `Ver todos (${rows.length}${isFiltered ? " filtrados" : ""})`}
          </button>
        </div>
      )}
    </div>
  );
}
