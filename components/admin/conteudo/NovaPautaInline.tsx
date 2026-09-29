"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { StatusQuadro } from "@/types/conteudo";

interface Props {
  coluna: StatusQuadro;
  aoCriar: (titulo: string, coluna: StatusQuadro) => Promise<{ error: string | null }>;
  desabilitado: boolean;
  abertoInicial?: boolean;
}

/** "+ Nova página" do Notion: abre um campo no próprio fim da coluna. */
export function NovaPautaInline({ coluna, aoCriar, desabilitado, abertoInicial = false }: Props) {
  const [aberto, setAberto] = useState(abertoInicial);
  const [titulo, setTitulo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const emVoo = useRef(false);
  const campo = useRef<HTMLTextAreaElement>(null);

  async function confirmar() {
    if (emVoo.current || desabilitado) return;
    const limpo = titulo.trim();
    if (!limpo) {
      setAberto(false);
      return;
    }
    emVoo.current = true;
    setSalvando(true);
    setErro(null);
    try {
      const resultado = await aoCriar(limpo, coluna);
      if (resultado.error) setErro(resultado.error);
      else setTitulo("");
    } catch {
      setErro("Não foi possível criar a pauta. Seu título foi preservado.");
    } finally {
      emVoo.current = false;
      setSalvando(false);
    }
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
        disabled={salvando}
        onChange={(e) => setTitulo(e.target.value)}
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
      {erro && <p role="alert" className="px-1 py-1 text-xs text-red-700">{erro}</p>}
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-[11px] text-neutral-500">Enter cria · Esc cancela</p>
        <button type="button" onClick={confirmar} disabled={salvando || !titulo.trim()}
          className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
          {salvando ? "Criando…" : "Criar pauta"}
        </button>
      </div>
    </div>
  );
}
