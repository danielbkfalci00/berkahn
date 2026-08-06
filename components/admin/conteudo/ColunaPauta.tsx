"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { STATUS_LABEL, type StatusQuadro, type VisaoQuadro } from "@/types/conteudo";
import { COLUNA_PONTO } from "@/lib/conteudo/colunas";
import { PREFIXO_COLUNA } from "@/hooks/use-arrastar-entre-colunas";
import { cn } from "@/lib/utils";
import { CartaoPauta } from "./CartaoPauta";
import { NovaPautaInline } from "./NovaPautaInline";
import type { ItemQuadro } from "./QuadroConteudo";

interface Props {
  coluna: StatusQuadro;
  visao: VisaoQuadro;
  pautas: ItemQuadro[];
  arrastavel: boolean;
  aoCriar: (titulo: string, coluna: StatusQuadro) => void;
  aoMover: (id: string, coluna: StatusQuadro) => void;
  aoExcluir: (id: string) => void;
  idConfirmandoExclusao: string | null;
  aoPedirExclusao: (id: string | null) => void;
  pendente: boolean;
  selecionados: ReadonlySet<string>;
  aoSelecionar: (id: string, selecionado: boolean) => void;
}
export function ColunaPauta({
  coluna, visao, pautas, arrastavel, aoCriar, aoMover, aoExcluir,
  idConfirmandoExclusao, aoPedirExclusao, pendente,
  selecionados, aoSelecionar,
}: Props) {
  const bloqueada = coluna === "publicado" || coluna === "concluida";
  const podeArrastar = arrastavel && !bloqueada;
  const { setNodeRef, isOver } = useDroppable({
    id: `${PREFIXO_COLUNA}${coluna}`,
    disabled: !arrastavel || bloqueada,
  });
  const permiteCriar =
    (visao === "geral" && coluna === "planejada") ||
    (visao !== "geral" && coluna !== "publicado");

  return (
    <section aria-labelledby={`coluna-${coluna}`}
      className="flex w-full shrink-0 flex-col md:w-[300px]">
      <h2 id={`coluna-${coluna}`}
        className="sticky top-0 z-10 flex items-center gap-2 rounded-t-lg bg-[#FAF8F2] px-3 py-2">
        <span className={cn("h-2 w-2 rounded-full", COLUNA_PONTO[coluna])} aria-hidden />
        <span className="text-sm font-medium text-neutral-800">{STATUS_LABEL[coluna]}</span>
        <span className="text-xs tabular-nums text-neutral-500">{pautas.length}</span>
      </h2>

      <div ref={setNodeRef}
        className={cn(
          "flex max-h-[calc(100vh-22rem)] min-h-24 flex-col gap-2 overflow-y-auto rounded-b-lg bg-[#FAF8F2] p-2 transition-colors",
          isOver && pautas.length === 0 && "bg-neutral-100 ring-1 ring-dashed ring-neutral-300"
        )}>
        <SortableContext items={pautas.map((p) => p.id)}
          strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {pautas.map((pauta) => (
              <CartaoPauta key={pauta.id} pauta={pauta} visao={visao}
                colunas={!podeArrastar || visao === "geral" ? [] : visao === "blog"
                  ? ["planejada", "pesquisa", "draft", "produzido", "aprovado"]
                  : ["planejada", "producao", "produzido", "aprovado"]}
                arrastavel={podeArrastar} aoMover={aoMover} aoExcluir={aoExcluir}
                confirmandoExclusao={idConfirmandoExclusao === pauta.id}
                aoPedirExclusao={aoPedirExclusao}
                selecionado={selecionados.has(pauta.id)}
                aoSelecionar={aoSelecionar} />
            ))}
          </ul>
        </SortableContext>
        {permiteCriar && (
          <NovaPautaInline coluna={coluna} aoCriar={aoCriar} desabilitado={pendente} />
        )}
      </div>
    </section>
  );
}
