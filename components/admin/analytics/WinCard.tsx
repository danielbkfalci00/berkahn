"use client";

import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface WinCardProps {
  win: string | null;
}

export function WinCard({ win }: WinCardProps) {
  if (!win) {
    return (
      <Card className="p-5 bg-white border-neutral-200 border-l-4 border-l-neutral-200">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
          <Trophy className="h-3.5 w-3.5" strokeWidth={2} />
          <span>Maior ganho</span>
        </div>
        <p className="text-sm text-neutral-400">
          Sem ganhos significativos vs mês anterior.
        </p>
      </Card>
    );
  }

  return (
    <Card
      className="p-5 bg-[#E8F3EC] border-l-4 border-l-[#1F6F3D]"
      style={{ borderColor: "rgba(31, 111, 61, 0.2)" }}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#1F6F3D] mb-2">
        <Trophy className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span>Maior ganho do mês</span>
      </div>
      <p className="text-base font-semibold text-neutral-900 leading-snug">{win}</p>
    </Card>
  );
}
