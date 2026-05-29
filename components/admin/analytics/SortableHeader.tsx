"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  label: string;
  align?: "left" | "right" | "center";
  className?: string;
}

/**
 * Cabeçalho de coluna sortável estilo Berkahn.
 * Renderiza um <button> dentro do <TableHead> para semântica a11y.
 * Mostra Chevron up/down conforme estado, neutro quando não ativo.
 */
export function SortableHeader<TData, TValue>({
  column,
  label,
  align = "left",
  className,
}: SortableHeaderProps<TData, TValue>) {
  const sortDir = column.getIsSorted();
  const Icon = sortDir === "asc" ? ChevronUp : sortDir === "desc" ? ChevronDown : ArrowUpDown;
  const alignClass =
    align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn(
        "inline-flex items-center gap-1.5 w-full text-neutral-500 font-medium uppercase text-xs tracking-wider transition-colors hover:text-neutral-900 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
        alignClass,
        className
      )}
      aria-label={`Ordenar por ${label}`}
    >
      {label}
      <Icon
        className={cn(
          "h-3 w-3 shrink-0",
          sortDir ? "text-neutral-900" : "text-neutral-400"
        )}
        strokeWidth={2.5}
      />
    </button>
  );
}
