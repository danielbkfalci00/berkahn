"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Maximize2,
  MessageSquare,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComentariosRail } from "@/components/admin/documentacoes/ComentariosRail";
import { criarThread } from "@/app/admin/documentacoes/actions";
import { useDocumentoBridge } from "@/hooks/use-documento-bridge";
import type { RectSelecao } from "@/lib/documentacoes/protocolo";
import { CATEGORIA_LABEL, type DocumentoMeta } from "@/types/documentacao";
import type { Ancora, Thread, TipoComentario } from "@/types/comentario";

type Props = {
  meta: DocumentoMeta;
  threadsIniciais: Thread[];
  authorName: string;
  canComment: boolean;
};

function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DocumentoViewer({ meta, threadsIniciais, authorName, canComment }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const molduraRef = useRef<HTMLDivElement>(null);
  const [emTelaCheia, setEmTelaCheia] = useState(false);

  // null = ninguém mexeu, o CSS decide (visível a partir de lg, oculto abaixo).
  // true/false = escolha explícita do usuário.
  //
  // Um booleano só não resolve: com `true` como padrão, uma janela estreita
  // abria o painel POR CIMA do documento já no carregamento. E decidir o padrão
  // por matchMedia no render causaria piscada na hidratação. Deixar o padrão
  // com o CSS e usar estado apenas para a escolha explícita evita os dois.
  const [aberturaManual, setAberturaManual] = useState<boolean | null>(null);
  // Só para o aria-expanded — não afeta pintura, então não pisca.
  const [ehTelaLarga, setEhTelaLarga] = useState<boolean | null>(null);

  const [threads, setThreads] = useState<Thread[]>(threadsIniciais);
  const [orfas, setOrfas] = useState<Set<string>>(new Set());
  const [ativa, setAtiva] = useState<string | null>(null);

  const [pendente, setPendente] = useState<Ancora | null>(null);
  const [rect, setRect] = useState<RectSelecao | null>(null);
  const [criando, iniciarCriacao] = useTransition();
  const [erroCriacao, setErroCriacao] = useState<string | null>(null);

  const rawUrl = `/admin/documentacoes/${meta.slug}/raw`;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sincronizar = () => setEhTelaLarga(mq.matches);
    sincronizar();
    mq.addEventListener("change", sincronizar);
    return () => mq.removeEventListener("change", sincronizar);
  }, []);

  // Renderizado (ainda que oculto pelo CSS) sempre que não foi fechado de
  // propósito: manter o painel montado preserva o estado dos filtros e mantém
  // os destaques pintados no documento.
  const painelMontado = aberturaManual !== false;

  function alternarPainel() {
    // A largura é lida no clique, não no render — é o que mantém a pintura
    // livre de piscada e ainda assim faz o botão alternar na direção certa.
    const telaLarga = window.matchMedia("(min-width: 1024px)").matches;
    setAberturaManual((atual) => (atual === null ? !telaLarga : !atual));
  }

  const painelVisivel =
    aberturaManual ?? (ehTelaLarga === null ? true : ehTelaLarga);

  const aoSelecionar = useCallback((ancora: Ancora, r: RectSelecao) => {
    setPendente(ancora);
    setRect(r);
    setErroCriacao(null);
    // Selecionar texto não deve abrir o painel sozinho numa tela estreita —
    // taparia o documento no meio da leitura. Quem abre é o clique na pílula.
  }, []);

  const aoCancelarSelecao = useCallback(() => setRect(null), []);

  const aoClicarDestaque = useCallback((threadId: string) => {
    setAtiva(threadId);
    document
      .getElementById(`thread-${threadId}`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  const aoResolver = useCallback(
    (r: { resolvidos: string[]; orfaos: string[] }) => setOrfas(new Set(r.orfaos)),
    []
  );

  // Só threads abertas são pintadas: destaque de discussão encerrada polui o
  // documento sem informar nada. Elas continuam na lista, sob o filtro.
  const ancoras = threads
    .filter((t) => t.status === "aberto")
    .map((t) => ({ threadId: t.id, ancora: t.ancora }));

  const { iframeRef, pronto, falhou, irPara, realcar } = useDocumentoBridge({
    ancoras,
    aoSelecionar,
    aoCancelarSelecao,
    aoClicarDestaque,
    aoResolver,
  });

  function alternarTelaCheia() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      setEmTelaCheia(false);
    } else {
      void el.requestFullscreen();
      setEmTelaCheia(true);
    }
  }

  function criar(corpo: string, tipo: TipoComentario) {
    if (!pendente || !canComment) return;
    setErroCriacao(null);
    iniciarCriacao(async () => {
      const res = await criarThread({
        documentoSlug: meta.slug,
        ancora: pendente,
        corpo,
        tipo,
        autorNome: authorName,
        docVersao: meta.atualizadoEm,
      });
      if (res.error || !res.data) {
        setErroCriacao(res.error);
        return;
      }
      setThreads((atual) => [res.data!, ...atual]);
      setPendente(null);
      setRect(null);
    });
  }

  function selecionarThread(threadId: string) {
    setAtiva(threadId);
    irPara(threadId);
  }

  // A pílula é posicionada em coordenadas de viewport do IFRAME; somar o rect
  // da moldura traduz para o viewport da página. E ela vai por portal porque a
  // moldura tem overflow-hidden.
  const molduraRect = molduraRef.current?.getBoundingClientRect();
  const pilula =
    canComment && rect && molduraRect && typeof document !== "undefined"
      ? createPortal(
          <button
            type="button"
            onClick={() => setAberturaManual(true)}
            style={{
              top: molduraRect.top + rect.bottom + 8,
              left: molduraRect.left + rect.left,
            }}
            className="fixed z-50 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
          >
            <MessageSquare className="h-3 w-3" />
            Comentar
          </button>,
          document.body
        )
      : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/admin/documentacoes"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Documentações
          </Link>
          <h2 className="mt-1 truncate text-lg font-semibold text-neutral-900">
            {meta.titulo}
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            {CATEGORIA_LABEL[meta.categoria]}
            {meta.periodoLabel ? ` · ${meta.periodoLabel}` : ""} · atualizado em{" "}
            {formatarDataHora(meta.atualizadoEm)}
            {falhou && (
              <span className="ml-2 text-amber-600">
                · comentários indisponíveis (o documento não respondeu)
              </span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={alternarPainel}
            aria-expanded={painelVisivel}
            aria-controls="painel-comentarios"
          >
            {painelVisivel ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
            <span className="ml-1.5 hidden sm:inline">Comentários</span>
          </Button>
          <Button variant="outline" size="sm" onClick={alternarTelaCheia}>
            {emTelaCheia ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
            <span className="ml-1.5 hidden sm:inline">Tela cheia</span>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={rawUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="ml-1.5 hidden sm:inline">Nova aba</span>
            </a>
          </Button>
        </div>
      </div>

      {/*
        iframe e não dangerouslySetInnerHTML por dois motivos independentes:
        innerHTML não executa <script>, então o Chart.js do documento nunca
        rodaria; e o <style> do documento é global (traz `* { margin: 0 }`) e
        sobrescreveria o layout do admin.
        sandbox sem allow-same-origin: os scripts do documento rodam, mas em
        origem opaca, sem acesso a cookies nem ao DOM do admin. É por isso que
        os comentários falam com o documento por postMessage (a ponte injetada
        em lib/documentacoes/bridge.ts) em vez de manipular o DOM dele.
      */}
      <div
        ref={containerRef}
        className={`relative grid h-[calc(100vh-11rem)] overflow-hidden rounded-lg border border-neutral-200 bg-white ${
          painelMontado ? "grid-cols-1 lg:grid-cols-[1fr_340px]" : "grid-cols-1"
        }`}
      >
        <div ref={molduraRef} className="relative min-w-0 overflow-hidden">
          <iframe
            ref={iframeRef}
            src={rawUrl}
            title={meta.titulo}
            sandbox="allow-scripts"
            className="h-full w-full border-0"
          />
          {!pronto && !falhou && (
            <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-neutral-900/70 px-1.5 py-0.5 text-[10px] text-white">
              conectando…
            </span>
          )}
        </div>

        {painelMontado && (
          // Padrão (aberturaManual === null): `hidden lg:block` — coluna à
          // direita a partir de lg, oculto abaixo, decidido só pelo CSS.
          // Aberto de propósito numa tela estreita: cobre o documento, porque
          // 340px não cabem ao lado. O botão do cabeçalho fica fora do overlay,
          // então continua alcançável para fechar.
          <div
            id="painel-comentarios"
            className={
              aberturaManual === true
                ? "absolute inset-0 z-20 min-h-0 lg:static lg:z-auto"
                : "hidden min-h-0 lg:block"
            }
          >
            <ComentariosRail
              threads={threads}
              orfas={orfas}
              documentoAtualizadoEm={meta.atualizadoEm}
              autorNome={authorName}
              canComment={canComment}
              pendente={pendente}
              pendenteEnviando={criando}
              pendenteErro={erroCriacao}
              onCriar={criar}
              onCancelarPendente={() => {
                setPendente(null);
                setRect(null);
              }}
              threadAtiva={ativa}
              onSelecionar={selecionarThread}
              onRealcar={realcar}
              onAtualizar={(t) =>
                setThreads((atual) => atual.map((x) => (x.id === t.id ? t : x)))
              }
              onRemover={(id) =>
                setThreads((atual) => atual.filter((x) => x.id !== id))
              }
            />
          </div>
        )}
      </div>

      {pilula}
    </div>
  );
}
