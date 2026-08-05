"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { COLUNA_LABEL, type ColunaPauta as SlugColuna, type Pauta } from "@/types/conteudo";
import { COLUNA_PONTO } from "@/lib/conteudo/colunas";
import { PREFIXO_COLUNA } from "@/hooks/use-arrastar-entre-colunas";
import { cn } from "@/lib/utils";
import { CartaoPauta } from "./CartaoPauta";
import { NovaPautaInline } from "./NovaPautaInline";

interface Props {
  coluna: SlugColuna;
  pautas: Pauta[];
  arrastavel: boolean;
  aoCriar: (titulo: string, coluna: SlugColuna) => void;
  aoMover: (id: string, coluna: SlugColuna) => void;
  aoExcluir: (id: string) => void;
  idConfirmandoExclusao: string | null;
  aoPedirExclusao: (id: string | null) => void;
  pendente: boolean;
}

export function ColunaPauta({
  coluna,
  pautas,
  arrastavel,
  aoCriar,
  aoMover,
  aoExcluir,
  idConfirmandoExclusao,
  aoPedirExclusao,
  pendente,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: `${PREFIXO_COLUNA}${coluna}` });

  return (
    <section
      aria-labelledby={`coluna-${coluna}`}
      className="flex w-full shrink-0 flex-col md:w-[300px]"
    >
      <h2
        id={`coluna-${coluna}`}
        className="sticky top-0 z-10 flex items-center gap-2 rounded-t-lg bg-[#FAF8F2] px-3 py-2"
      >
        <span className={cn("h-2 w-2 rounded-full", COLUNA_PONTO[coluna])} aria-hidden />
        <span className="text-sm font-medium text-neutral-800">
          {COLUNA_LABEL[coluna]}
        </span>
        <span className="text-xs tabular-nums text-neutral-500">{pautas.length}</span>
      </h2>

      {/* Scroll próprio na lista: no primeiro dia as 66 pautas caem todas em
          "Decisão LK/Blog", e sem teto a coluna passaria de 6000px — arrastar o
          card do fim viraria expedição. O cabeçalho fica fora da área rolável. */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex max-h-[calc(100vh-15rem)] flex-col gap-2 overflow-y-auto rounded-b-lg bg-[#FAF8F2] p-2 transition-colors",
          isOver && pautas.length === 0 && "bg-neutral-100 ring-1 ring-dashed ring-neutral-300"
        )}
      >
        <SortableContext
          items={pautas.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2">
            {pautas.map((p) => (
              <CartaoPauta
                key={p.id}
                pauta={p}
                arrastavel={arrastavel}
                aoMover={aoMover}
                aoExcluir={aoExcluir}
                confirmandoExclusao={idConfirmandoExclusao === p.id}
                aoPedirExclusao={aoPedirExclusao}
              />
            ))}
          </ul>
        </SortableContext>

        <NovaPautaInline coluna={coluna} aoCriar={aoCriar} desabilitado={pendente} />
      </div>
    </section>
  );
}
