"use client";

import { useEffect, type ReactNode } from "react";
import { useAutosave } from "@/hooks/use-autosave";
import { LIMITES, type BlocoTextoPauta } from "@/types/conteudo";
import { salvarBloco } from "@/app/admin/conteudo/actions";
import { BlocoColapsavel } from "./BlocoColapsavel";
import { cn } from "@/lib/utils";

interface Props {
  pautaId: string;
  bloco: BlocoTextoPauta;
  titulo: string;
  icone: ReactNode;
  valorInicial: string | null;
  placeholder: string;
  altura?: string;
  /** Renderizado acima do textarea (ex.: o ângulo do calendário, read-only). */
  antes?: ReactNode;
  /** Renderizado abaixo, ao lado do contador (ex.: botão de copiar). */
  acoes?: ReactNode;
  /** Avisa o pai quando há gravação pendente, para o guard de saída. */
  aoMudarPendencia?: (bloco: BlocoTextoPauta, pendente: boolean) => void;
}

export function BlocoTexto({
  pautaId,
  bloco,
  titulo,
  icone,
  valorInicial,
  placeholder,
  altura = "min-h-[180px]",
  antes,
  acoes,
  aoMudarPendencia,
}: Props) {
  const { valor, estado, aoDigitar, aoSair, aoTeclar, salvarAgora } = useAutosave(
    valorInicial ?? "",
    (texto) => salvarBloco(pautaId, bloco, texto)
  );

  const pendente = estado.fase === "sujo" || estado.fase === "salvando" || estado.fase === "erro";

  // Em efeito, nunca no corpo do render: avisar o pai durante o render dispara
  // "Cannot update a component while rendering a different component".
  useEffect(() => {
    aoMudarPendencia?.(bloco, pendente);
  }, [aoMudarPendencia, bloco, pendente]);

  const perto = valor.length > LIMITES.blocoMax * 0.95;

  return (
    <BlocoColapsavel
      titulo={titulo}
      icone={icone}
      estado={estado}
      aoTentarDeNovo={salvarAgora}
      abertoInicial={Boolean(valorInicial)}
      resumo={valor.length > 0 ? `${valor.length.toLocaleString("pt-BR")} caracteres` : undefined}
    >
      {antes}

      <textarea
        value={valor}
        onChange={aoDigitar}
        onBlur={aoSair}
        onKeyDown={aoTeclar}
        placeholder={placeholder}
        aria-label={titulo}
        className={cn(
          "w-full resize-y rounded-md border border-neutral-200 bg-white p-3 text-sm leading-relaxed text-neutral-900",
          "placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400",
          altura
        )}
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className={cn("text-xs tabular-nums", perto ? "font-medium text-red-600" : "text-neutral-400")}>
          {valor.length.toLocaleString("pt-BR")} / {LIMITES.blocoMax.toLocaleString("pt-BR")}
        </p>
        <div className="flex items-center gap-2">{acoes}</div>
      </div>
    </BlocoColapsavel>
  );
}
