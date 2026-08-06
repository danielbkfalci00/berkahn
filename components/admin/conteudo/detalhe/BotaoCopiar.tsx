"use client";

import { Check, Copy } from "lucide-react";
import { useCopiar } from "@/hooks/use-copiar";
import { cn } from "@/lib/utils";

interface Props {
  texto: string;
  rotulo?: string;
}

export function BotaoCopiar({ texto, rotulo = "Copiar" }: Props) {
  const { copiado, erro, copiar } = useCopiar();

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => copiar(texto)}
        disabled={!texto}
        className={cn(
          "inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-40",
          copiado
            ? "border-[#1F6F3D]/30 bg-[#E8F3EC] text-[#1F6F3D]"
            : "border-neutral-200 text-neutral-700 hover:bg-neutral-100"
        )}
      >
        {copiado ? (
          <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        ) : (
          <Copy className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        )}
        {copiado ? "Copiado" : rotulo}
      </button>

      {/* Trocar só o ícone não anuncia nada para leitor de tela. */}
      <span className="sr-only" aria-live="polite">
        {copiado ? "Copiado para a área de transferência" : ""}
      </span>

      {erro && <span className="text-xs text-red-600">{erro}</span>}
    </span>
  );
}
