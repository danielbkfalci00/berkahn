"use client";

import { useMemo, useState } from "react";
import { MessageSquareOff } from "lucide-react";
import {
  documentoMudouDesde,
  tipoDaThread,
  type Ancora,
  type Thread,
  type TipoComentario,
} from "@/types/comentario";
import { Composer } from "./Composer";
import { ThreadCard } from "./ThreadCard";
import { APARENCIA_TIPO, ORDEM_TIPOS } from "./tipos-ui";

type Filtro = "abertos" | "resolvidos" | "todos";

type Props = {
  threads: Thread[];
  orfas: Set<string>;
  documentoAtualizadoEm: string;
  autorNome: string | null;
  autorCarregado: boolean;
  onSalvarAutor: (nome: string) => void;
  /** Trecho recém-selecionado no documento, aguardando o primeiro comentário. */
  pendente: Ancora | null;
  pendenteEnviando: boolean;
  pendenteErro: string | null;
  onCriar: (corpo: string, tipo: TipoComentario) => void;
  onCancelarPendente: () => void;
  threadAtiva: string | null;
  onSelecionar: (threadId: string) => void;
  onRealcar: (threadId: string | null) => void;
  onAtualizar: (thread: Thread) => void;
  onRemover: (threadId: string) => void;
};

export function ComentariosRail({
  threads,
  orfas,
  documentoAtualizadoEm,
  autorNome,
  autorCarregado,
  onSalvarAutor,
  pendente,
  pendenteEnviando,
  pendenteErro,
  onCriar,
  onCancelarPendente,
  threadAtiva,
  onSelecionar,
  onRealcar,
  onAtualizar,
  onRemover,
}: Props) {
  const [filtro, setFiltro] = useState<Filtro>("abertos");
  const [tipos, setTipos] = useState<Set<TipoComentario>>(new Set());
  const [nomeDigitado, setNomeDigitado] = useState("");

  const visiveis = useMemo(() => {
    return threads.filter((t) => {
      if (filtro === "abertos" && t.status !== "aberto") return false;
      if (filtro === "resolvidos" && t.status !== "resolvido") return false;
      if (tipos.size && !tipos.has(tipoDaThread(t))) return false;
      return true;
    });
  }, [threads, filtro, tipos]);

  // Órfãs num grupo à parte: sem destaque no documento, elas não têm posição, e
  // misturá-las na lista principal daria a impressão de que apontam para algum
  // lugar. Continuam legíveis e respondíveis.
  const ancoradas = visiveis.filter((t) => !orfas.has(t.id));
  const perdidas = visiveis.filter((t) => orfas.has(t.id));

  const abertas = threads.filter((t) => t.status === "aberto").length;

  function alternarTipo(t: TipoComentario) {
    setTipos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(t)) proximo.delete(t);
      else proximo.add(t);
      return proximo;
    });
  }

  const precisaNome = autorCarregado && !autorNome;

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-neutral-200 bg-neutral-50 print:hidden">
      <header className="shrink-0 border-b border-neutral-200 px-3 py-2.5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Comentários</h2>
          <span className="text-xs text-neutral-400">{abertas} em aberto</span>
        </div>

        <div className="mt-2 flex gap-1">
          {(["abertos", "resolvidos", "todos"] as Filtro[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize transition-colors ${
                filtro === f
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-1.5 flex flex-wrap gap-1">
          {ORDEM_TIPOS.map((t) => {
            const { rotulo, badge } = APARENCIA_TIPO[t];
            const ativo = tipos.has(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => alternarTipo(t)}
                aria-pressed={ativo}
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                  ativo
                    ? badge
                    : "text-neutral-400 ring-1 ring-inset ring-neutral-200 hover:text-neutral-600"
                }`}
              >
                {rotulo}
              </button>
            );
          })}
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {precisaNome && (
          <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
            <label
              htmlFor="autor-nome"
              className="text-xs font-medium text-neutral-700"
            >
              Como você assina?
            </label>
            <p className="mt-0.5 text-[11px] text-neutral-400">
              Fica salvo neste navegador. Todos entram no admin com a mesma
              conta, então é o nome que distingue quem comentou.
            </p>
            <div className="mt-1.5 flex gap-1.5">
              <input
                id="autor-nome"
                value={nomeDigitado}
                onChange={(e) => setNomeDigitado(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSalvarAutor(nomeDigitado)}
                maxLength={80}
                placeholder="Seu nome"
                className="min-w-0 flex-1 rounded-md border border-neutral-200 px-2 py-1 text-sm outline-none focus:border-neutral-400"
              />
              <button
                type="button"
                onClick={() => onSalvarAutor(nomeDigitado)}
                className="rounded-md bg-neutral-900 px-2.5 py-1 text-xs text-white"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {pendente && !precisaNome && (
          <Composer
            citacao={pendente.textoExato}
            rotuloAcao="Comentar"
            autofoco
            pendente={pendenteEnviando}
            erro={pendenteErro}
            onEnviar={onCriar}
            onCancelar={onCancelarPendente}
          />
        )}

        {ancoradas.map((t) => (
          <ThreadCard
            key={t.id}
            thread={t}
            autorNome={autorNome ?? ""}
            orfa={false}
            documentoMudou={documentoMudouDesde(t, documentoAtualizadoEm)}
            ativa={threadAtiva === t.id}
            onSelecionar={() => onSelecionar(t.id)}
            onRealcar={(ativo) => onRealcar(ativo ? t.id : null)}
            onAtualizar={onAtualizar}
            onRemover={onRemover}
          />
        ))}

        {perdidas.length > 0 && (
          <>
            <h3 className="pt-2 text-[11px] font-semibold uppercase tracking-wide text-red-600">
              Trecho não encontrado ({perdidas.length})
            </h3>
            {perdidas.map((t) => (
              <ThreadCard
                key={t.id}
                thread={t}
                autorNome={autorNome ?? ""}
                orfa
                documentoMudou={false}
                ativa={threadAtiva === t.id}
                onSelecionar={() => onSelecionar(t.id)}
                onRealcar={() => {}}
                onAtualizar={onAtualizar}
                onRemover={onRemover}
              />
            ))}
          </>
        )}

        {!pendente && visiveis.length === 0 && (
          <div className="flex flex-col items-center gap-2 pt-10 text-center">
            <MessageSquareOff className="h-6 w-6 text-neutral-300" />
            <p className="text-xs text-neutral-400">
              {threads.length === 0
                ? "Selecione um trecho do documento para comentar."
                : "Nenhum comentário com estes filtros."}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
