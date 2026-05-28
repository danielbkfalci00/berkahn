"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { PeriodSelect } from "./PeriodSelect";

interface AnalyticsHeaderProps {
  monthLabel: string;
  periodStart: string;
  periodEnd: string;
  availableMonths: string[];
  currentMonth: string;
}

export function AnalyticsHeader({
  monthLabel,
  periodStart,
  periodEnd,
  availableMonths,
  currentMonth,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap pb-6 border-b border-neutral-200 print:pb-3 print:mb-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500 mb-1">
          Performance Berkahn
        </p>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
          {monthLabel}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Análise de {periodStart} a {periodEnd}
        </p>
      </div>

      <div className="flex items-center gap-3 print:hidden">
        <PeriodSelect availableMonths={availableMonths} currentMonth={currentMonth} />
        <Button
          variant="outline"
          size="default"
          onClick={() => window.print()}
          className="bg-white"
        >
          <Printer className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
