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
 * Card de KPI com:
 * - Label uppercase pequeno
 * - Valor grande (text-4xl)
 * - Delta com seta colorida (opcional)
 * - Sparkline embaixo (opcional)
 * - Descrição secundária (opcional)
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
    <Card className={cn("p-6 flex flex-col gap-3 bg-white border-neutral-200", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs uppercase tracking-wider font-medium text-neutral-500">
          {kpi.label}
        </span>
        {kpi.delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
              deltaStyles
            )}
          >
            <Icon className="h-3 w-3" strokeWidth={2.5} />
            {kpi.delta.text}
          </span>
        )}
      </div>

      <div className="text-4xl font-bold text-neutral-900 leading-none tracking-tight tabular-nums">
        {kpi.value}
      </div>

      {kpi.description && (
        <p className="text-xs text-neutral-500">{kpi.description}</p>
      )}

      {kpi.sparkline && kpi.sparkline.length > 1 && (
        <div className="mt-1 -mx-1">
          <SparklineMini
            data={kpi.sparkline}
            height={36}
            color={direction === "up" ? "#1F6F3D" : direction === "down" ? "#B83A3A" : "#0A0A0A"}
          />
        </div>
      )}
    </Card>
  );
}
