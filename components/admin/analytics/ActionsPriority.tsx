import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Square } from "lucide-react";
import type { ActionItem } from "@/types/analytics";

interface ActionsPriorityProps {
  p0: ActionItem[];
  p1: ActionItem[];
  p2: ActionItem[];
}

interface PriorityBlockProps {
  label: string;
  description: string;
  badgeClass: string;
  borderClass: string;
  items: ActionItem[];
  emptyMessage: string;
}

function PriorityBlock({ label, description, badgeClass, borderClass, items, emptyMessage }: PriorityBlockProps) {
  return (
    <div className={cn("p-5 bg-white border rounded-md border-l-4", borderClass)}>
      <div className="flex items-baseline gap-2 mb-1">
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wider", badgeClass)}>
          {label}
        </span>
        <span className="text-xs text-neutral-500">{description}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-400 mt-3">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-800 leading-snug">
              <Square className="h-4 w-4 mt-0.5 text-neutral-400 flex-shrink-0" strokeWidth={1.5} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ActionsPriority({ p0, p1, p2 }: ActionsPriorityProps) {
  return (
    <Card className="p-6 bg-white border-neutral-200">
      <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500 mb-4">
        Ações priorizadas
      </h3>
      <div className="space-y-3">
        <PriorityBlock
          label="P0"
          description="Urgente · esta semana"
          badgeClass="bg-[#B83A3A] text-white"
          borderClass="border-neutral-200 border-l-[#B83A3A]"
          items={p0}
          emptyMessage="Nenhuma ação P0 identificada."
        />
        <PriorityBlock
          label="P1"
          description="Importante · 2-3 semanas"
          badgeClass="bg-neutral-900 text-white"
          borderClass="border-neutral-200 border-l-neutral-900"
          items={p1}
          emptyMessage="Nenhuma ação P1 identificada."
        />
        <PriorityBlock
          label="P2"
          description="Backlog · mês seguinte"
          badgeClass="bg-neutral-400 text-white"
          borderClass="border-neutral-200 border-l-neutral-400"
          items={p2}
          emptyMessage="Nenhuma ação P2 identificada."
        />
      </div>
    </Card>
  );
}
