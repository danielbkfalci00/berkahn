"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, ShieldCheck, Circle } from "lucide-react";
import type { RedFlag } from "@/lib/analytics/red-flags";
import { cn } from "@/lib/utils";

interface RedFlagCardProps {
  flags: RedFlag[];
  /** Fallback string usada quando flags está vazio mas há outros riscos não detectados (compat com Sprint 1). */
  fallback?: string | null;
  initialLimit?: number;
}

const SEVERITY_META = {
  critical: { color: "#B83A3A", bg: "#F8E8E8", label: "Crítico" },
  warning: { color: "#B8801F", bg: "#FDF4D8", label: "Atenção" },
} as const;

export function RedFlagCard({ flags, fallback, initialLimit = 3 }: RedFlagCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (flags.length === 0 && !fallback) {
    return (
      <Card className="p-5 bg-white border-l-4 border-neutral-200 border-l-[#1F6F3D]/30">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#1F6F3D] mb-2">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
          <span>Riscos do mês</span>
        </div>
        <p className="text-sm text-neutral-600">
          Nada anormal detectado. Tudo dentro da faixa esperada.
        </p>
      </Card>
    );
  }

  if (flags.length === 0 && fallback) {
    return (
      <Card className="p-5 bg-[#F8E8E8] border-l-4 border-l-[#B83A3A]">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#B83A3A] mb-2">
          <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.25} />
          <span>Maior risco do mês</span>
        </div>
        <p className="text-base font-semibold text-neutral-900 leading-snug">{fallback}</p>
      </Card>
    );
  }

  const primary = flags[0];
  const primaryMeta = SEVERITY_META[primary.severity];
  const visible = expanded ? flags : flags.slice(0, initialLimit);
  const hidden = Math.max(0, flags.length - initialLimit);

  return (
    <Card
      className={cn("p-5 border-l-4")}
      style={{ background: primaryMeta.bg, borderLeftColor: primaryMeta.color }}
    >
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold mb-3"
        style={{ color: primaryMeta.color }}
      >
        <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span>{flags.length === 1 ? "Risco do mês" : `${flags.length} riscos detectados`}</span>
      </div>

      <ul className="space-y-2">
        {visible.map((flag) => {
          const meta = SEVERITY_META[flag.severity];
          return (
            <li key={flag.id} className="flex gap-2 items-start">
              <Circle
                className="h-2 w-2 mt-1.5 flex-shrink-0"
                fill={meta.color}
                stroke="none"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900 leading-snug">{flag.text}</p>
                {flag.action && (
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">→ {flag.action}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {hidden > 0 && (
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value="more" className="border-0">
            <AccordionTrigger
              className="text-xs font-medium hover:no-underline py-1.5"
              style={{ color: primaryMeta.color }}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Mostrar menos" : `+${hidden} risco${hidden === 1 ? "" : "s"} adiciona${hidden === 1 ? "l" : "is"}`}
            </AccordionTrigger>
            <AccordionContent />
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
}
