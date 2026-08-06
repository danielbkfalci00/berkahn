"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { StatusQuadro } from "@/types/conteudo";

interface Props {
  coluna: StatusQuadro;
  aoCriar: (titulo: string, coluna: StatusQuadro) => void;
  desabilitado: boolean;
}

/** "+ Nova página" do Notion: abre um campo no próprio fim da coluna. */
export function NovaPautaInline({ coluna, aoCriar, desabilitado }: Props) {
  const [aberto, setAberto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const campo = useRef<HTMLTextAreaElement>(null);

  function confirmar() {
    const limpo = titulo.trim();
    if (!limpo) {
      setAberto(false);
      return;
    }
    aoCriar(limpo, coluna);
    setTitulo("");
    // Segue aberto: cadastrar pauta é atividade em lote.
    campo.current?.focus();
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        disabled={desabilitado}
        className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        Nova pauta
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-2 shadow-sm">
      <textarea
        ref={campo}
        autoFocus
        rows={2}
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        onBlur={confirmar}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            confirmar();
          }
          if (e.key === "Escape") {
            setTitulo("");
            setAberto(false);
          }
        }}
        placeholder="Título da pauta"
        aria-label="Título da nova pauta"
        className="w-full resize-none border-0 bg-transparent p-1 text-sm leading-snug text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
      />
      <p className="px-1 pb-0.5 text-[11px] text-neutral-400">
        Enter cria · Esc cancela
      </p>
    </div>
  );
}
