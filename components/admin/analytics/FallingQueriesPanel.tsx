"use client";

import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GscDelta } from "@/types/analytics";

interface FallingQueriesPanelProps {
  queries: GscDelta[];
}

const INITIAL_LIMIT = 10;

export function FallingQueriesPanel({ queries }: FallingQueriesPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const total = queries.length;
  const visible = showAll ? queries : queries.slice(0, INITIAL_LIMIT);

  return (
    <Card className="p-6 bg-white border-neutral-200">
      {total === 0 ? (
        <div className="flex items-center gap-3">
          <TrendingDown className="h-4 w-4 text-neutral-400" strokeWidth={1.75} />
          <p className="text-sm text-neutral-500">Nenhuma queda significativa neste período</p>
        </div>
      ) : (
        <Accordion type="single" collapsible>
          <AccordionItem value="falling" className="border-neutral-200 border-b-0">
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-0">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-4 w-4 text-[#B83A3A]" strokeWidth={2} />
                <span className="text-neutral-900">
                  {total} {total === 1 ? "query perdendo" : "queries perdendo"} cliques
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-3 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-200 hover:bg-transparent">
                      <TableHead className="text-neutral-500 font-medium uppercase text-[10px] tracking-wider">
                        Query
                      </TableHead>
                      <TableHead className="text-right text-neutral-500 font-medium uppercase text-[10px] tracking-wider">
                        Atual
                      </TableHead>
                      <TableHead className="text-right text-neutral-500 font-medium uppercase text-[10px] tracking-wider">
                        Anterior
                      </TableHead>
                      <TableHead className="text-right text-neutral-500 font-medium uppercase text-[10px] tracking-wider">
                        Δ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((q, i) => (
                      <TableRow key={i} className="border-neutral-100 hover:bg-[#F8E8E8]">
                        <TableCell className="text-xs text-neutral-900 font-medium truncate max-w-[140px] sm:max-w-none">
                          {q.query}
                        </TableCell>
                        <TableCell className="text-right text-xs tabular-nums text-neutral-700">
                          {q.clicksCurrent.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right text-xs tabular-nums text-neutral-600">
                          {q.clicksPrevious.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right text-xs tabular-nums font-semibold" style={{ color: "#B83A3A" }}>
                          {q.clicksDelta > 0 ? "+" : ""}
                          {q.clicksDelta.toLocaleString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {total > INITIAL_LIMIT && (
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="mt-3 text-xs text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
                >
                  {showAll ? `Mostrar apenas top ${INITIAL_LIMIT}` : `Ver todas (${total})`}
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
}
