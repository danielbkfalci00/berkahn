import { KpiCard } from "./KpiCard";
import type { KpiCardData } from "@/types/analytics";

interface KpiCardGridProps {
  kpis: KpiCardData[];
}

/**
 * Grid responsivo de KpiCards.
 * - Mobile: 2 cols
 * - Tablet: 3 cols
 * - Desktop: 5 cols
 */
export function KpiCardGrid({ kpis }: KpiCardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {kpis.map((kpi, i) => (
        <KpiCard key={i} kpi={kpi} />
      ))}
    </div>
  );
}
