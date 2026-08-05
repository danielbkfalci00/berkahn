"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { AlertCircle, X } from "lucide-react";
import { COLUNAS, type ColunaPauta as SlugColuna, type Pauta } from "@/types/conteudo";
import { useListaOtimista } from "@/hooks/use-lista-otimista";
import { useTelaLarga } from "@/hooks/use-tela-larga";
import {
  diffOrdem,
  instantaneo,
  renumerar,
  useArrastarEntreColunas,
} from "@/hooks/use-arrastar-entre-colunas";
import { criarPauta, excluirPauta, moverPautas } from "@/app/admin/conteudo/actions";
import { ColunaPauta } from "./ColunaPauta";
import { BadgesPlataforma } from "./BadgesPlataforma";

interface Props {
  pautas: Pauta[];
}

export function QuadroConteudo({ pautas: doServidor }: Props) {
  const router = useRouter();
  const { itens, setItens, erro, mostrarErro, limparErro, pendente, aplicar } =
    useListaOtimista(doServidor);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState<string | null>(null);

  // `null` até montar. Tratado como tela larga: o admin é usado no desktop, e
  // assumir o contrário faria o grip piscar em toda carga de página.
  const telaLarga = useTelaLarga(768);
  const arrastavel = telaLarga !== false;

  const { sensores, pautaAtiva, aoIniciar, aoPassarPor, aoTerminar } =
    useArrastarEntreColunas({
      pautas: itens,
      setPautas: setItens,
      habilitado: arrastavel,
      aoSoltar: (proximo, mudancas) => aplicar(proximo, () => moverPautas(mudancas)),
    });

  function handleCriar(titulo: string, coluna: SlugColuna) {
    // Sem otimismo aqui: o id vem do banco, e um id falso quebraria o
    // SortableContext no instante seguinte. A action revalida e a lista chega
    // reconciliada pelo useEffect do hook.
    void (async () => {
      const res = await criarPauta({ titulo, coluna });
      if (res.error) mostrarErro(res.error);
    })();
  }

  function handleMover(id: string, coluna: SlugColuna) {
    const alvo = itens.find((p) => p.id === id);
    if (!alvo || alvo.coluna === coluna) return;

    // Vai para o fim da coluna de destino.
    const semAlvo = itens.filter((p) => p.id !== id);
    const ultimo = semAlvo.reduce((acc, p, i) => (p.coluna === coluna ? i : acc), -1);
    const proximo = [...semAlvo];
    proximo.splice(ultimo === -1 ? proximo.length : ultimo + 1, 0, { ...alvo, coluna });

    const renumerado = renumerar(proximo);
    const mudancas = diffOrdem(instantaneo(itens), renumerado);

    aplicar(renumerado, () => moverPautas(mudancas));
  }

  function handleExcluir(id: string) {
    setConfirmandoExclusao(null);
    aplicar(
      itens.filter((p) => p.id !== id),
      async () => {
        const res = await excluirPauta(id);
        if (!res.error) router.refresh();
        return res;
      }
    );
  }

  return (
    <div className="space-y-4">
      {erro && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md bg-[#F8E8E8] p-3 text-sm text-[#B83A3A]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          <p className="flex-1">{erro}</p>
          <button
            type="button"
            onClick={limparErro}
            aria-label="Dispensar erro"
            className="rounded p-0.5 hover:bg-[#F0D8D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A3A]"
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
      )}

      <DndContext
        sensors={sensores}
        collisionDetection={closestCorners}
        onDragStart={aoIniciar}
        onDragOver={aoPassarPor}
        onDragEnd={aoTerminar}
      >
        {/* -mx-6 px-6 compensa o p-6 do <main> em AdminLayoutClient: sem isso a
            barra de scroll fica encravada 24px e a última coluna parece cortada. */}
        <div className="-mx-6 overflow-x-auto px-6 pb-4">
          <div className="flex min-w-full flex-col items-stretch gap-4 md:min-w-max md:flex-row md:items-start">
            {COLUNAS.map((coluna) => (
              <ColunaPauta
                key={coluna}
                coluna={coluna}
                pautas={itens.filter((p) => p.coluna === coluna)}
                arrastavel={arrastavel}
                aoCriar={handleCriar}
                aoMover={handleMover}
                aoExcluir={handleExcluir}
                idConfirmandoExclusao={confirmandoExclusao}
                aoPedirExclusao={setConfirmandoExclusao}
                pendente={pendente}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {pautaAtiva && (
            <div className="w-[280px] rotate-2 rounded-lg border border-neutral-300 bg-white p-3 shadow-lg">
              <p className="text-sm font-medium leading-snug text-neutral-900">
                {pautaAtiva.titulo}
              </p>
              <BadgesPlataforma plataformas={pautaAtiva.plataformas} className="mt-2" />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
