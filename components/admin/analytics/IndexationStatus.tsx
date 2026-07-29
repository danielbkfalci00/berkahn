"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { GscIndexation } from "@/types/analytics";

interface IndexationStatusProps {
  indexation: GscIndexation[];
}

/**
 * "Crawled - currently not indexed" e "Discovered - currently not indexed"
 * contêm a substring "indexed", então o teste ingênuo os contava como
 * indexadas. Precisa excluir "not indexed" explicitamente.
 */
function isIndexedState(coverageState: string | null | undefined): boolean {
  const state = (coverageState || "").toLowerCase();
  return state.includes("indexed") && !state.includes("not indexed");
}

export function IndexationStatus({ indexation }: IndexationStatusProps) {
  const total = indexation.length;
  const indexed = indexation.filter((i) => isIndexedState(i.coverageState)).length;
  const notIndexed = indexation.filter((i) => !isIndexedState(i.coverageState));
  const pct = total > 0 ? Math.round((indexed / total) * 100) : 0;

  return (
    <Card className="p-6 bg-white border-neutral-200">
      <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500 mb-4">
        Indexação no Google
      </h3>

      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-4xl font-bold text-neutral-900 tabular-nums">
          {indexed}/{total}
        </span>
        <span className="text-sm text-neutral-500">artigos indexados</span>
      </div>

      <Progress value={pct} className="h-2 mb-2" />
      <p className="text-xs text-neutral-500 mb-4">{pct}% do catálogo indexado</p>

      {notIndexed.length > 0 ? (
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="not-indexed" className="border-neutral-200">
            <AccordionTrigger className="text-sm font-medium hover:no-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
              {notIndexed.length} não indexado{notIndexed.length === 1 ? "" : "s"}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 mt-2">
                {notIndexed.map((i, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="text-[10px] font-normal whitespace-nowrap">
                      {i.coverageState || "Status desconhecido"}
                    </Badge>
                    <span className="text-neutral-700 break-all">
                      {i.title || i.slug || i.url}
                    </span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div className="mt-4 p-3 rounded-md bg-[#E8F3EC] text-[#1F6F3D] text-sm font-medium">
          ✓ Todos os artigos indexados no Google
        </div>
      )}
    </Card>
  );
}
