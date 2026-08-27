"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Check, Pencil, Trash2, Undo2 } from "lucide-react";
import {
  alternarResolucao,
  editarComentario,
  excluirComentario,
  responder,
} from "@/app/admin/documentacoes/actions";
import {
  tipoDaThread,
  type Comentario,
  type Thread,
  type TipoComentario,
} from "@/types/comentario";
import { Composer } from "./Composer";
import { APARENCIA_TIPO, tempoRelativo } from "./tipos-ui";

type Props = {
  thread: Thread;
  autorNome: string;
  canComment: boolean;
  orfa: boolean;
  documentoMudou: boolean;
  ativa: boolean;
  onSelecionar: () => void;
  onRealcar: (ativo: boolean) => void;
  onAtualizar: (thread: Thread) => void;
  onRemover: (threadId: string) => void;
};

export function ThreadCard({
  thread,
  autorNome,
  canComment,
  orfa,
  documentoMudou,
  ativa,
  onSelecionar,
  onRealcar,
  onAtualizar,
  onRemover,
}: Props) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [respondendo, setRespondendo] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);

  const resolvida = thread.status === "resolvido";
  const aparencia = APARENCIA_TIPO[tipoDaThread(thread)];

  function enviarResposta(corpo: string, tipo: TipoComentario) {
    setErro(null);
    iniciar(async () => {
      const res = await responder({ threadId: thread.id, corpo, tipo, autorNome });
      if (res.error || !res.data) {
        setErro(res.error);
        return;
      }
      onAtualizar({ ...thread, comentarios: [...thread.comentarios, res.data] });
      setRespondendo(false);
    });
  }

  function salvarEdicao(c: Comentario, corpo: string, tipo: TipoComentario) {
    setErro(null);
    iniciar(async () => {
      const res = await editarComentario({ id: c.id, corpo, tipo });
      if (res.error || !res.data) {
        setErro(res.error);
        return;
      }
      onAtualizar({
        ...thread,
        comentarios: thread.comentarios.map((x) => (x.id === c.id ? res.data! : x)),
      });
      setEditando(null);
    });
  }

  function excluir(c: Comentario) {
    if (!window.confirm("Excluir este comentário?")) return;
    setErro(null);
    iniciar(async () => {
      const res = await excluirComentario({ id: c.id, threadId: thread.id });
      if (res.error) {
        setErro(res.error);
        return;
      }
      if (res.data.threadRemovida) {
        onRemover(thread.id);
        return;
      }
      onAtualizar({
        ...thread,
        comentarios: thread.comentarios.filter((x) => x.id !== c.id),
      });
    });
  }

  function alternar() {
    setErro(null);
    iniciar(async () => {
      const res = await alternarResolucao({
        threadId: thread.id,
        resolver: !resolvida,
        autorNome,
      });
      if (res.error || !res.data) {
        setErro(res.error);
        return;
      }
      onAtualizar(res.data);
    });
  }

  return (
    <article
      id={`thread-${thread.id}`}
      onMouseEnter={() => onRealcar(true)}
      onMouseLeave={() => onRealcar(false)}
      className={`rounded-lg border bg-white transition-colors ${
        ativa ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200"
      } ${resolvida ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        onClick={onSelecionar}
        className="w-full px-3 pt-2.5 text-left"
      >
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${aparencia.ponto}`} />
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${aparencia.badge}`}
          >
            {aparencia.rotulo}
          </span>
          {resolvida && (
            <span className="text-[10px] text-neutral-400">
              resolvido por {thread.resolvidoPor}
            </span>
          )}
        </div>

        <p
          // break-words: os relatórios têm URLs de artigo nas tabelas, e um
          // token sem espaço vazaria do card com o wrap padrão.
          className={`mt-1.5 break-words border-l-2 pl-2 text-xs italic ${
            orfa ? "border-red-300 text-red-600" : "border-amber-400 text-neutral-500"
          }`}
        >
          “{thread.ancora.textoExato.length > 110
            ? `${thread.ancora.textoExato.slice(0, 110)}…`
            : thread.ancora.textoExato}”
        </p>

        {orfa && (
          <p className="mt-1 flex items-start gap-1 text-[11px] text-red-600">
            <AlertTriangle className="mt-px h-3 w-3 shrink-0" />
            Trecho não encontrado no documento atual.
          </p>
        )}
        {!orfa && documentoMudou && (
          <p className="mt-1 flex items-start gap-1 text-[11px] text-amber-700">
            <AlertTriangle className="mt-px h-3 w-3 shrink-0" />
            O documento mudou depois deste comentário.
          </p>
        )}
      </button>

      <ul className="mt-2 space-y-2 px-3">
        {thread.comentarios.map((c) => {
          const ap = APARENCIA_TIPO[c.tipo];
          if (editando === c.id) {
            return (
              <li key={c.id}>
                <Composer
                  corpoInicial={c.corpo}
                  tipoInicial={c.tipo}
                  rotuloAcao="Salvar"
                  autofoco
                  pendente={pendente}
                  onEnviar={(corpo, tipo) => salvarEdicao(c, corpo, tipo)}
                  onCancelar={() => setEditando(null)}
                />
              </li>
            );
          }
          return (
            <li key={c.id} className="group">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-neutral-900">
                  {c.autorNome}
                </span>
                <span className="shrink-0 text-[10px] text-neutral-400">
                  {tempoRelativo(c.criadoEm)}
                  {c.editadoEm && " · editado"}
                </span>
              </div>
              <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-snug text-neutral-700">
                {c.corpo}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                {c.tipo !== "comentario" && (
                  <span className={`rounded px-1 py-px text-[10px] ${ap.badge}`}>
                    {ap.rotulo}
                  </span>
                )}
                {canComment && <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => setEditando(c.id)}
                    className="text-neutral-400 hover:text-neutral-900"
                    aria-label="Editar comentário"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(c)}
                    className="text-neutral-400 hover:text-red-600"
                    aria-label="Excluir comentário"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>}
              </div>
            </li>
          );
        })}
      </ul>

      {erro && <p className="px-3 pt-1 text-xs text-red-600">{erro}</p>}

      {canComment && <div className="mt-2 flex items-center justify-between border-t border-neutral-100 px-3 py-1.5">
        {respondendo ? null : (
          <button
            type="button"
            onClick={() => setRespondendo(true)}
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            Responder
          </button>
        )}
        <button
          type="button"
          onClick={alternar}
          disabled={pendente}
          className="ml-auto inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 disabled:opacity-50"
        >
          {resolvida ? (
            <>
              <Undo2 className="h-3 w-3" /> Reabrir
            </>
          ) : (
            <>
              <Check className="h-3 w-3" /> Resolver
            </>
          )}
        </button>
      </div>}

      {canComment && respondendo && (
        <div className="px-3 pb-2.5">
          <Composer
            rotuloAcao="Responder"
            autofoco
            pendente={pendente}
            onEnviar={enviarResposta}
            onCancelar={() => setRespondendo(false)}
          />
        </div>
      )}
    </article>
  );
}
