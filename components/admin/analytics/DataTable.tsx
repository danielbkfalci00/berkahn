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
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnSizingState,
  type Header,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ColumnMetaShape {
  align?: "left" | "right" | "center";
  label?: string;
  /** Coluna existe só para filtro (não renderiza th/td nem participa de resize/reorder). */
  filterOnly?: boolean;
}

function colMeta<TData>(col: Column<TData, unknown>): ColumnMetaShape {
  return (col.columnDef.meta as ColumnMetaShape | undefined) ?? {};
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** Slot acima da tabela. Recebe a tabela tanstack. */
  toolbar?: (table: TanstackTable<TData>) => React.ReactNode;
  /** Render por linha em mobile (substitui a tabela em < md). */
  mobileCard?: (row: TData) => React.ReactNode;
  emptyFilteredText?: string;
  emptyDataText?: string;
  initialLimit?: number;
  /** Base de localStorage. Deriva `{key}-visibility`, `{key}-sizing`, `{key}-order`. */
  storageKey?: string;
  initialSorting?: SortingState;
  className?: string;
}

/**
 * Tabela genérica baseada em @tanstack/react-table + shadcn Table.
 * Berkahn-styled. Sort + filter + globalFilter + column visibility + resize + reorder.
 * Resize/reorder são desktop-only; mobile usa o slot mobileCard.
 */
export function DataTable<TData>({
  columns,
  data,
  toolbar,
  mobileCard,
  emptyFilteredText = "Sem resultados. Ajuste os filtros.",
  emptyDataText = "Sem dados neste período.",
  initialLimit = 15,
  storageKey,
  initialSorting = [],
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [showAll, setShowAll] = React.useState(false);

  const lsKeys = React.useMemo(
    () =>
      storageKey
        ? {
            visibility: `${storageKey}-visibility`,
            sizing: `${storageKey}-sizing`,
            order: `${storageKey}-order`,
          }
        : null,
    [storageKey]
  );

  // Hydrate de localStorage (client only). columnOrder é reconciliado com as colunas atuais.
  React.useEffect(() => {
    if (!lsKeys) return;
    try {
      const v = window.localStorage.getItem(lsKeys.visibility);
      if (v) setColumnVisibility(JSON.parse(v));
      const s = window.localStorage.getItem(lsKeys.sizing);
      if (s) setColumnSizing(JSON.parse(s));
      const o = window.localStorage.getItem(lsKeys.order);
      if (o) {
        const saved = JSON.parse(o) as string[];
        const allIds = columns
          .map((c) => c.id)
          .filter((id): id is string => Boolean(id));
        const reconciled = [
          ...saved.filter((id) => allIds.includes(id)),
          ...allIds.filter((id) => !saved.includes(id)),
        ];
        setColumnOrder(reconciled);
      }
    } catch {
      // ignore corrupted localStorage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lsKeys]);

  React.useEffect(() => {
    if (!lsKeys) return;
    try {
      window.localStorage.setItem(lsKeys.visibility, JSON.stringify(columnVisibility));
    } catch {}
  }, [columnVisibility, lsKeys]);

  React.useEffect(() => {
    if (!lsKeys) return;
    try {
      window.localStorage.setItem(lsKeys.sizing, JSON.stringify(columnSizing));
    } catch {}
  }, [columnSizing, lsKeys]);

  React.useEffect(() => {
    if (!lsKeys) return;
    try {
      window.localStorage.setItem(lsKeys.order, JSON.stringify(columnOrder));
    } catch {}
  }, [columnOrder, lsKeys]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnSizing,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    defaultColumn: { minSize: 60 },
    sortDescFirst: false,
    enableSortingRemoval: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColumnOrder((prev) => {
      const base =
        prev.length > 0
          ? prev
          : table.getAllLeafColumns().map((c) => c.id);
      const oldIndex = base.indexOf(active.id as string);
      const newIndex = base.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(base, oldIndex, newIndex);
    });
  }

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
            <Table style={{ tableLayout: "fixed", width: table.getTotalSize() }}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => {
                  const headers = headerGroup.headers.filter(
                    (h) => !colMeta(h.column).filterOnly
                  );
                  const ids = headers.map((h) => h.column.id);
                  return (
                    <DndContext
                      key={headerGroup.id}
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <TableRow className="border-neutral-200 hover:bg-transparent">
                        <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
                          {headers.map((header, idx) => (
                            <DraggableHead
                              key={header.id}
                              header={header}
                              isFirst={idx === 0}
                              isLast={idx === headers.length - 1}
                            />
                          ))}
                        </SortableContext>
                      </TableRow>
                    </DndContext>
                  );
                })}
              </TableHeader>
              <TableBody>
                {visibleRows.map((row) => {
                  const cells = row
                    .getVisibleCells()
                    .filter((c) => !colMeta(c.column).filterOnly);
                  return (
                    <TableRow key={row.id} className="border-neutral-100 hover:bg-[#FAF8F2]">
                      {cells.map((cell, idx) => {
                        const align = colMeta(cell.column).align;
                        return (
                          <TableCell
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                            className={cn(
                              "overflow-hidden",
                              align === "right" && "text-right",
                              align === "center" && "text-center",
                              idx === 0 && "pl-6",
                              idx === cells.length - 1 && "pr-6"
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
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

/** Header arrastável (reorder via dnd-kit) + redimensionável (resize handle). */
function DraggableHead<TData>({
  header,
  isFirst,
  isLast,
}: {
  header: Header<TData, unknown>;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: header.column.id });
  const align = colMeta(header.column).align;
  const sortDir = header.column.getIsSorted();
  const ariaSort =
    sortDir === "asc"
      ? "ascending"
      : sortDir === "desc"
        ? "descending"
        : header.column.getCanSort()
          ? "none"
          : undefined;

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    width: header.getSize(),
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      aria-sort={ariaSort}
      className={cn(
        "relative text-neutral-500 font-medium uppercase text-xs tracking-wider",
        align === "right" && "text-right",
        align === "center" && "text-center",
        isFirst && "pl-6",
        isLast && "pr-6"
      )}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {header.column.getCanResize() && (
        <span
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "absolute right-0 top-1 bottom-1 w-1.5 cursor-col-resize select-none touch-none rounded bg-transparent hover:bg-neutral-300",
            header.column.getIsResizing() && "bg-neutral-400"
          )}
          aria-hidden="true"
        />
      )}
    </TableHead>
  );
}
