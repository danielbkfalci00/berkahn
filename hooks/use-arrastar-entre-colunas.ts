"use client";

import { useRef, useState } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ehColunaPauta, type ColunaPauta, type Pauta } from "@/types/conteudo";

/** Prefixo do id do droppable de coluna, para aceitar drop em coluna vazia. */
export const PREFIXO_COLUNA = "col-";

export interface MudancaOrdem {
  id: string;
  coluna: ColunaPauta;
  ordem: number;
}

/**
 * Lista plana ordenada por (coluna, ordem) — cada coluna renderiza um filtro
 * dela, então a ordem do array é a ordem visual. Mesma estrutura do TaskBoard.
 */
interface Opcoes {
  pautas: Pauta[];
  setPautas: (p: Pauta[]) => void;
  /** Recebe a lista nova e só as linhas cuja coluna ou ordem mudou. */
  aoSoltar: (proximo: Pauta[], mudancas: MudancaOrdem[]) => void;
  habilitado: boolean;
}

const SEM_SENSORES: ReturnType<typeof useSensors> = [];

/**
 * Numera cada coluna de 1..n na ordem em que os itens aparecem no array.
 * Devolve o mesmo objeto quando a ordem não muda, para não invalidar memo à toa.
 */
export function renumerar(lista: Pauta[]): Pauta[] {
  const contador = new Map<ColunaPauta, number>();
  return lista.map((p) => {
    const proxima = (contador.get(p.coluna) ?? 0) + 1;
    contador.set(p.coluna, proxima);
    return p.ordem === proxima ? p : { ...p, ordem: proxima };
  });
}

/**
 * Só as linhas cuja coluna ou ordem mudou.
 *
 * É o que mantém o custo do arrasto proporcional ao movimento: numa coluna de
 * 66 cards, mover um card cinco posições manda cinco UPDATEs, não sessenta e
 * seis. Sem isto, cada solta custaria uma ida ao banco por card da coluna.
 */
export function diffOrdem(
  antes: Map<string, { coluna: ColunaPauta; ordem: number }>,
  depois: Pauta[]
): MudancaOrdem[] {
  const mudancas: MudancaOrdem[] = [];
  for (const p of depois) {
    const anterior = antes.get(p.id);
    if (!anterior || anterior.coluna !== p.coluna || anterior.ordem !== p.ordem) {
      mudancas.push({ id: p.id, coluna: p.coluna, ordem: p.ordem });
    }
  }
  return mudancas;
}

/** Snapshot de (coluna, ordem) para diffar depois do arrasto. */
export function instantaneo(lista: Pauta[]) {
  return new Map(lista.map((p) => [p.id, { coluna: p.coluna, ordem: p.ordem }]));
}

export function useArrastarEntreColunas({
  pautas,
  setPautas,
  aoSoltar,
  habilitado,
}: Opcoes) {
  const [idAtivo, setIdAtivo] = useState<string | null>(null);
  // Snapshot de antes do arrasto, para diffar no fim e mandar só o que mudou.
  const antes = useRef<Map<string, { coluna: ColunaPauta; ordem: number }>>(new Map());

  // Os sensores são sempre criados (regras de hooks); o que muda é o que vai
  // para o DndContext. Abaixo de `md` o TouchSensor competiria com o scroll
  // lateral do quadro: quem pressiona e desliza pegaria um card sem querer.
  const todos = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const sensores = habilitado ? todos : SEM_SENSORES;

  /**
   * Coluna a que um id pertence. O id pode ser de um card ou do droppable da
   * coluna (`col-<slug>`).
   *
   * A validação com `ehColunaPauta` não é cerimônia: o TaskBoard faz
   * `id.slice(4) as TaskPriority`, um cast cego que aceitaria qualquer
   * droppable cujo id comece com "col-" e mandaria a string direto para o
   * banco.
   */
  function colunaDe(id: string): ColunaPauta | null {
    if (id.startsWith(PREFIXO_COLUNA)) {
      const slug = id.slice(PREFIXO_COLUNA.length);
      return ehColunaPauta(slug) ? slug : null;
    }
    return pautas.find((p) => p.id === id)?.coluna ?? null;
  }

  function aoIniciar(evento: DragStartEvent) {
    setIdAtivo(String(evento.active.id));
    antes.current = instantaneo(pautas);
  }

  /** Move entre colunas enquanto arrasta, para o card aparecer no destino. */
  function aoPassarPor(evento: DragOverEvent) {
    const { active, over } = evento;
    if (!over) return;

    const idAtivoAgora = String(active.id);
    const idAlvo = String(over.id);
    const origem = colunaDe(idAtivoAgora);
    const destino = colunaDe(idAlvo);
    if (!origem || !destino || origem === destino) return;

    const proximo = [...pautas];
    const iAtivo = proximo.findIndex((p) => p.id === idAtivoAgora);
    if (iAtivo === -1) return;

    const movido = { ...proximo[iAtivo], coluna: destino };
    proximo.splice(iAtivo, 1);

    let iAlvo = proximo.findIndex((p) => p.id === idAlvo);
    if (iAlvo === -1) {
      // Soltou no cabeçalho ou na área vazia: entra no fim da coluna destino.
      const ultimo = proximo.reduce(
        (acc, p, i) => (p.coluna === destino ? i : acc),
        -1
      );
      iAlvo = ultimo === -1 ? proximo.length : ultimo + 1;
    }
    proximo.splice(iAlvo, 0, movido);
    setPautas(proximo);
  }

  function aoTerminar(evento: DragEndEvent) {
    const { active, over } = evento;
    setIdAtivo(null);
    if (!over) return;

    const iAtivo = pautas.findIndex((p) => p.id === String(active.id));
    if (iAtivo === -1) return;
    let iAlvo = pautas.findIndex((p) => p.id === String(over.id));
    if (iAlvo === -1) iAlvo = iAtivo;

    // Calcula a lista nova ANTES de chamar a action.
    //
    // ⚠️ O TaskBoard dispara `startTransition` de dentro do updater de
    // `setState`. O updater deixa de ser puro, e o React 18 em StrictMode
    // invoca updaters duas vezes — a action de reordenar roda duas vezes por
    // solta em dev. Aqui o cálculo é fora e o efeito também.
    const proximo = renumerar(arrayMove(pautas, iAtivo, iAlvo));
    const mudancas = diffOrdem(antes.current, proximo);

    if (mudancas.length === 0) {
      setPautas(proximo);
      return;
    }
    aoSoltar(proximo, mudancas);
  }

  const pautaAtiva = idAtivo ? pautas.find((p) => p.id === idAtivo) ?? null : null;

  return { sensores, idAtivo, pautaAtiva, aoIniciar, aoPassarPor, aoTerminar };
}
