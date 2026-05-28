import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import type { Insight } from "@/types/analytics";

interface InsightsListProps {
  insights: Insight[];
}

export function InsightsList({ insights }: InsightsListProps) {
  if (insights.length === 0) {
    return (
      <Card className="p-6 bg-white border-neutral-200">
        <p className="text-neutral-500 text-sm">Sem insights identificados neste período.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-neutral-200">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-neutral-500" strokeWidth={1.75} />
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Insights do período
        </h3>
      </div>
      <ol className="space-y-3">
        {insights.map((insight, i) => (
          <li
            key={i}
            className="flex gap-4 p-4 bg-[#FAF8F2] rounded-md border-l-2 border-neutral-900"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-neutral-900 text-white text-sm font-semibold flex items-center justify-center">
              {insight.position}
            </span>
            <p className="text-neutral-800 leading-relaxed">{insight.text}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
