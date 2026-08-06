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

export const PREFIXO_COLUNA = "col-";

export interface ItemOrdenavel<S extends string = string> {
  id: string;
  coluna: S;
  ordem: number;
}
export interface MudancaOrdem<S extends string = string> {
  id: string;
  coluna: S;
  ordem: number;
}
interface Opcoes<T extends ItemOrdenavel<S>, S extends string> {
  pautas: T[];
  setPautas: (p: T[]) => void;
  colunas: readonly S[];
  aoSoltar: (proximo: T[], mudancas: MudancaOrdem<S>[]) => void;
  habilitado: boolean;
}

const SEM_SENSORES: ReturnType<typeof useSensors> = [];

export function renumerar<T extends ItemOrdenavel<S>, S extends string>(lista: T[]): T[] {
  const contador = new Map<S, number>();
  return lista.map((p) => {
    const proxima = (contador.get(p.coluna) ?? 0) + 1;
    contador.set(p.coluna, proxima);
    return p.ordem === proxima ? p : { ...p, ordem: proxima };
  });
}

export function diffOrdem<T extends ItemOrdenavel<S>, S extends string>(
  antes: Map<string, { coluna: S; ordem: number }>,
  depois: T[]
): MudancaOrdem<S>[] {
  const mudancas: MudancaOrdem<S>[] = [];
  for (const p of depois) {
    const anterior = antes.get(p.id);
    if (!anterior || anterior.coluna !== p.coluna || anterior.ordem !== p.ordem) {
      mudancas.push({ id: p.id, coluna: p.coluna, ordem: p.ordem });
    }
  }
  return mudancas;
}

export function instantaneo<T extends ItemOrdenavel<S>, S extends string>(lista: T[]) {
  return new Map(lista.map((p) => [p.id, { coluna: p.coluna, ordem: p.ordem }]));
}

export function useArrastarEntreColunas<T extends ItemOrdenavel<S>, S extends string>({
  pautas,
  setPautas,
  colunas,
  aoSoltar,
  habilitado,
}: Opcoes<T, S>) {
  const [idAtivo, setIdAtivo] = useState<string | null>(null);
  const antes = useRef<Map<string, { coluna: S; ordem: number }>>(new Map());

  const todos = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const sensores = habilitado ? todos : SEM_SENSORES;

  function ehColuna(valor: string): valor is S {
    return (colunas as readonly string[]).includes(valor);
  }

  function colunaDe(id: string): S | null {
    if (id.startsWith(PREFIXO_COLUNA)) {
      const slug = id.slice(PREFIXO_COLUNA.length);
      return ehColuna(slug) ? slug : null;
    }
    return pautas.find((p) => p.id === id)?.coluna ?? null;
  }

  function aoIniciar(evento: DragStartEvent) {
    setIdAtivo(String(evento.active.id));
    antes.current = instantaneo(pautas);
  }

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
