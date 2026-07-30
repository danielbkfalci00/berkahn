"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIMITES, type TipoComentario } from "@/types/comentario";
import { APARENCIA_TIPO, ORDEM_TIPOS } from "./tipos-ui";

type Props = {
  /** Trecho citado. Só na criação de thread. */
  citacao?: string;
  corpoInicial?: string;
  tipoInicial?: TipoComentario;
  rotuloAcao: string;
  autofoco?: boolean;
  pendente: boolean;
  erro?: string | null;
  onEnviar: (corpo: string, tipo: TipoComentario) => void;
  onCancelar?: () => void;
};

export function Composer({
  citacao,
  corpoInicial = "",
  tipoInicial = "comentario",
  rotuloAcao,
  autofoco,
  pendente,
  erro,
  onEnviar,
  onCancelar,
}: Props) {
  const [corpo, setCorpo] = useState(corpoInicial);
  const [tipo, setTipo] = useState<TipoComentario>(tipoInicial);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autofoco) ref.current?.focus();
  }, [autofoco]);

  function enviar() {
    const limpo = corpo.trim();
    if (!limpo || pendente) return;
    onEnviar(limpo, tipo);
    setCorpo("");
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
      {citacao && (
        <p className="mb-2 break-words border-l-2 border-amber-400 pl-2 text-xs italic text-neutral-500">
          “{citacao.length > 140 ? `${citacao.slice(0, 140)}…` : citacao}”
        </p>
      )}

      <div className="mb-2 flex flex-wrap gap-1">
        {ORDEM_TIPOS.map((t) => {
          const { rotulo, icone: Icone, badge } = APARENCIA_TIPO[t];
          const ativo = t === tipo;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              aria-pressed={ativo}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                ativo
                  ? badge
                  : "bg-white text-neutral-400 ring-1 ring-inset ring-neutral-200 hover:text-neutral-600"
              }`}
            >
              <Icone className="h-3 w-3" />
              {rotulo}
            </button>
          );
        })}
      </div>

      <textarea
        ref={ref}
        value={corpo}
        onChange={(e) => setCorpo(e.target.value)}
        onKeyDown={(e) => {
          // Enter quebra linha; Ctrl/Cmd+Enter envia. Comentário de revisão
          // costuma ter mais de uma frase.
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            enviar();
          }
          if (e.key === "Escape" && onCancelar) onCancelar();
        }}
        rows={3}
        maxLength={LIMITES.corpoMax}
        placeholder="Escreva…"
        className="w-full resize-y rounded-md border border-neutral-200 px-2 py-1.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
      />

      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}

      <div className="mt-2 flex items-center justify-end gap-2">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            Cancelar
          </button>
        )}
        <Button size="sm" onClick={enviar} disabled={pendente || !corpo.trim()}>
          {pendente && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
          {rotuloAcao}
        </Button>
      </div>
    </div>
  );
}
