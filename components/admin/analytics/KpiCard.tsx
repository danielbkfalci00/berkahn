import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { SparklineMini } from "./SparklineMini";
import type { KpiCardData } from "@/types/analytics";

interface KpiCardProps {
  kpi: KpiCardData;
  className?: string;
}

/**
 * Card de KPI compacto.
 * Layout vertical: label + delta inline, valor grande, sparkline embaixo.
 * Padding reduzido (p-4) e tipo do valor (text-3xl) pra caber mais info no grid.
 */
export function KpiCard({ kpi, className }: KpiCardProps) {
  const direction = kpi.delta?.direction ?? "flat";

  const deltaStyles = {
    up: "bg-[#E8F3EC] text-[#1F6F3D]",
    down: "bg-[#F8E8E8] text-[#B83A3A]",
    flat: "bg-neutral-100 text-neutral-600",
  }[direction];

  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;

  return (
    <Card className={cn("p-4 flex flex-col gap-2 bg-white border-neutral-200", className)}>
      <div className="flex items-center justify-between gap-2 min-h-[18px]">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 leading-tight">
          {kpi.label}
        </span>
        {kpi.delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold leading-none",
              deltaStyles
            )}
          >
            <Icon className="h-2.5 w-2.5" strokeWidth={3} />
            {kpi.delta.text}
          </span>
        )}
      </div>

      <div className="text-3xl font-bold text-neutral-900 leading-none tracking-tight tabular-nums">
        {kpi.value}
      </div>

      {kpi.description && (
        <p className="text-[11px] text-neutral-500 leading-tight">{kpi.description}</p>
      )}

      {kpi.sparkline && kpi.sparkline.length > 1 && (
        <div className="-mx-1 mt-1">
          <SparklineMini
            data={kpi.sparkline}
            height={28}
            color={direction === "up" ? "#1F6F3D" : direction === "down" ? "#B83A3A" : "#0A0A0A"}
          />
        </div>
      )}
    </Card>
  );
}
