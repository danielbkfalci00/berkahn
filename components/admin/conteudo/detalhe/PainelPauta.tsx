"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Image as ImagemIcone, Lightbulb, Linkedin, Palette, Search,
} from "lucide-react";
import {
  STATUS_LABEL, type BlocoTextoPauta, type Pauta, type StatusQuadro,
} from "@/types/conteudo";
import { COLUNA_PONTO } from "@/lib/conteudo/colunas";
import { SeloPostVinculado } from "@/components/admin/conteudo/SeloPostVinculado";
import { BadgesPlataforma } from "@/components/admin/conteudo/BadgesPlataforma";
import { FaixaMetadados } from "./FaixaMetadados";
import { BlocoTexto } from "./BlocoTexto";
import { BlocoCapa } from "./BlocoCapa";
import { BlocoArtigo, type ArtigoLivre } from "./BlocoArtigo";
import { BotaoCopiar } from "./BotaoCopiar";
import { cn } from "@/lib/utils";

interface Props { pauta: Pauta; artigosLivres: ArtigoLivre[]; }

export function PainelPauta({ pauta, artigosLivres }: Props) {
  const [local, setLocal] = useState(pauta);
  const [pendentes, setPendentes] = useState<Set<BlocoTextoPauta>>(new Set());
  const temPendencia = pendentes.size > 0;
  useEffect(() => setLocal(pauta), [pauta]);

  const aoMudarPendencia = useCallback((bloco: BlocoTextoPauta, pendente: boolean) => {
    setPendentes((antes) => {
      if (pendente === antes.has(bloco)) return antes;
      const proximo = new Set(antes);
      if (pendente) proximo.add(bloco);
      else proximo.delete(bloco);
      return proximo;
    });
  }, []);

  const pendenciaRef = useRef(temPendencia);
  pendenciaRef.current = temPendencia;
  useEffect(() => {
    function aoSair(evento: BeforeUnloadEvent) {
      if (!pendenciaRef.current) return;
      evento.preventDefault();
      evento.returnValue = "";
    }
    window.addEventListener("beforeunload", aoSair);
    return () => window.removeEventListener("beforeunload", aoSair);
  }, []);

  const temBlog = local.plataformas.includes("blog");
  const temLinkedin = local.plataformas.includes("linkedin");

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <Link href="/admin/conteudo"
          className="inline-flex items-center gap-1.5 rounded text-sm text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
          Conteúdo
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="min-w-0 text-2xl font-semibold leading-tight text-neutral-900">
            {local.titulo}
          </h1>
          {temPendencia && (
            <p className="shrink-0 rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
              Alterações não salvas
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {local.statusBlog && <StatusCabecalho nome="Blog" status={local.statusBlog} />}
          {local.statusLinkedin && <StatusCabecalho nome="LinkedIn" status={local.statusLinkedin} />}
          <BadgesPlataforma plataformas={local.plataformas} />
          <SeloPostVinculado pauta={local} />
        </div>
      </header>

      <FaixaMetadados pauta={local} aoAtualizar={setLocal} />

      <div className="space-y-3">
        <BlocoTexto pautaId={local.id} bloco="insights" titulo="Insights & Referências"
          icone={<Lightbulb className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          valorInicial={local.insights}
          placeholder="Por que esta pauta existe, dados de apoio, links de referência…"
          aoMudarPendencia={aoMudarPendencia} />

        {temBlog && (
          <>
            <BlocoTexto pautaId={local.id} bloco="pesquisa" titulo="Pesquisa Conteúdo"
              icone={<Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              valorInicial={local.pesquisaConteudo}
              placeholder="Resultado do /pesquisa: gaps da SERP, ângulo e estrutura do artigo…"
              altura="min-h-[400px]" aoMudarPendencia={aoMudarPendencia} />
            <BlocoArtigo pauta={local} artigosLivres={artigosLivres} />
            <BlocoCapa pautaId={local.id} tipo="blog" titulo="Capa Blog"
              proporcao="aspect-[3/2]"
              dica="Staging 3:2. /artigo produzir converte para public/images/.../cover.webp."
              urlInicial={local.capaBlogUrl} />
            {local.draftPath && (
              <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                Draft no vault: <code>{local.draftPath}</code>
              </p>
            )}
          </>
        )}

        {temLinkedin && (
          <>
            <BlocoCapa pautaId={local.id} tipo="linkedin" titulo="Capa LinkedIn"
              proporcao="aspect-[4/5]"
              dica="Obrigatório 1080×1350, proporção 4:5."
              urlInicial={local.capaLinkedinUrl} />
            <BlocoTexto pautaId={local.id} bloco="linkedin" titulo="Texto LinkedIn"
              icone={<Linkedin className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              valorInicial={local.linkedinTexto}
              placeholder="Post pronto para colar no LinkedIn…"
              altura="min-h-[260px]" aoMudarPendencia={aoMudarPendencia}
              acoes={(atual) => <BotaoCopiar texto={atual} rotulo="Copiar post" />}
              antes={local.linkedinBriefing ? (
                <blockquote className="mb-3 border-l-2 border-neutral-300 bg-neutral-50 px-3 py-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    Ângulo do calendário
                  </p>
                  <p className="mt-1 text-sm leading-snug text-neutral-700">
                    {local.linkedinBriefing}
                  </p>
                </blockquote>
              ) : null} />
            <BlocoTexto pautaId={local.id} bloco="imagem-prompt"
              titulo="Prompt da imagem (IA)"
              icone={<ImagemIcone className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              valorInicial={local.linkedinImagemPrompt}
              placeholder="Prompt em inglês para colar no gerador de imagem…"
              altura="min-h-[140px]" aoMudarPendencia={aoMudarPendencia}
              acoes={(atual) => <BotaoCopiar texto={atual} rotulo="Copiar prompt" />} />
            <BlocoTexto pautaId={local.id} bloco="imagem-briefing"
              titulo="Direção visual da imagem"
              icone={<Palette className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              valorInicial={local.linkedinImagemBriefing}
              placeholder="Textos da imagem, referência visual e identidade da marca…"
              altura="min-h-[140px]" aoMudarPendencia={aoMudarPendencia} />
          </>
        )}
      </div>
    </div>
  );
}
function StatusCabecalho({ nome, status }: { nome: string; status: StatusQuadro }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-neutral-600">
      <span className={cn("h-2 w-2 rounded-full", COLUNA_PONTO[status])} aria-hidden />
      {nome}: {STATUS_LABEL[status]}
    </span>
  );
}
