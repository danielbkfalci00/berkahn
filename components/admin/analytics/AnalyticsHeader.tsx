"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer, SplitSquareHorizontal, X } from "lucide-react";
import { PeriodSelect } from "./PeriodSelect";
import { cn } from "@/lib/utils";

interface AnalyticsHeaderProps {
  monthLabel: string;
  periodStart: string;
  periodEnd: string;
  availableMonths: string[];
  currentMonth: string;
  /** Se true, o toggle Comparar fica desabilitado (sem mês anterior pra comparar). */
  comparisonDisabled?: boolean;
  /** Motivo do disable, mostrado como tooltip. */
  comparisonDisabledReason?: string;
  /** Estado atual do toggle (vem do URL ?compare=1). */
  comparisonMode: boolean;
  /** Mês ainda aberto: os números cobrem só parte do período. */
  isPartial?: boolean;
  daysCovered?: number;
  daysInMonth?: number;
}

export function AnalyticsHeader({
  monthLabel,
  periodStart,
  periodEnd,
  availableMonths,
  currentMonth,
  comparisonDisabled = false,
  comparisonDisabledReason,
  comparisonMode,
  isPartial = false,
  daysCovered,
  daysInMonth,
}: AnalyticsHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleCompare = () => {
    const params = new URLSearchParams(searchParams);
    if (comparisonMode) {
      params.delete("compare");
    } else {
      params.set("compare", "1");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-end justify-between gap-4 flex-wrap pb-6 border-b border-neutral-200 print:pb-3 print:mb-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500 mb-1">
          Performance Berkahn
        </p>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
          {monthLabel}
          {isPartial && (
            <span className="align-middle ml-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
              Parcial
            </span>
          )}
          {comparisonMode && (
            <span className="text-base font-medium text-neutral-500 ml-2">
              · modo comparativo
            </span>
          )}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Análise de {periodStart} a {periodEnd}
          {isPartial && daysCovered != null && daysInMonth != null && (
            <span className="text-amber-700">
              {" "}
              · {daysCovered} de {daysInMonth} dias — o mês ainda não fechou
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 print:hidden flex-wrap">
        <PeriodSelect availableMonths={availableMonths} currentMonth={currentMonth} />
        <Button
          variant={comparisonMode ? "default" : "outline"}
          size="default"
          onClick={toggleCompare}
          disabled={comparisonDisabled && !comparisonMode}
          className={cn(!comparisonMode && "bg-white")}
          title={comparisonDisabled ? (comparisonDisabledReason ?? "Sem mês anterior pra comparar") : undefined}
        >
          {comparisonMode ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Sair do comparativo
            </>
          ) : (
            <>
              <SplitSquareHorizontal className="h-4 w-4 mr-2" />
              Comparar
            </>
          )}
        </Button>
        <Button variant="outline" size="default" onClick={() => window.print()} className="bg-white">
          <Printer className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
