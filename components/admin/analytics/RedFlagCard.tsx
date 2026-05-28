"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface RedFlagCardProps {
  redFlag: string | null;
}

export function RedFlagCard({ redFlag }: RedFlagCardProps) {
  if (!redFlag) {
    return (
      <Card className="p-5 bg-white border-l-4 border-neutral-200 border-l-neutral-200">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
          <span>Maior risco</span>
        </div>
        <p className="text-sm text-neutral-500">
          Nenhuma queda relevante detectada. Tudo dentro da faixa esperada.
        </p>
      </Card>
    );
  }

  return (
    <Card
      className="p-5 bg-[#F8E8E8] border-l-4 border-l-[#B83A3A]"
      style={{ borderColor: "rgba(184, 58, 58, 0.2)" }}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#B83A3A] mb-2">
        <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span>Maior risco do mês</span>
      </div>
      <p className="text-base font-semibold text-neutral-900 leading-snug">{redFlag}</p>
    </Card>
  );
}
