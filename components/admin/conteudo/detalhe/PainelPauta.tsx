"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Image as ImagemIcone,
  Lightbulb,
  Linkedin,
  Search,
} from "lucide-react";
import {
  COLUNA_LABEL,
  type BlocoTextoPauta,
  type Pauta,
} from "@/types/conteudo";
import { COLUNA_PONTO } from "@/lib/conteudo/colunas";
import { SeloPostVinculado } from "@/components/admin/conteudo/SeloPostVinculado";
import { BadgesPlataforma } from "@/components/admin/conteudo/BadgesPlataforma";
import { FaixaMetadados } from "./FaixaMetadados";
import { BlocoTexto } from "./BlocoTexto";
import { cn } from "@/lib/utils";

interface Props {
  pauta: Pauta;
}

export function PainelPauta({ pauta }: Props) {
  // Quais blocos têm gravação pendente. É a base do guard de saída.
  const [pendentes, setPendentes] = useState<Set<BlocoTextoPauta>>(new Set());
  const temPendencia = pendentes.size > 0;

  const aoMudarPendencia = useCallback((bloco: BlocoTextoPauta, pendente: boolean) => {
    setPendentes((antes) => {
      if (pendente === antes.has(bloco)) return antes;
      const proximo = new Set(antes);
      if (pendente) proximo.add(bloco);
      else proximo.delete(bloco);
      return proximo;
    });
  }, []);

  // Guard de saída pendurado na pendência REAL.
  //
  // ⚠️ O PostEditor faz isso errado: components/admin/posts/PostEditor.tsx:114
  // seta `hasUnsavedChanges` num useEffect([formData]), que dispara já no
  // primeiro render — o aviso aparece sem ninguém ter digitado. Aqui só existe
  // pendência depois de uma tecla de verdade.
  const pendenciaRef = useRef(temPendencia);
  pendenciaRef.current = temPendencia;

  useEffect(() => {
    function aoSair(e: BeforeUnloadEvent) {
      if (!pendenciaRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", aoSair);
    return () => window.removeEventListener("beforeunload", aoSair);
  }, []);

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <Link
          href="/admin/conteudo"
          className="inline-flex items-center gap-1.5 rounded text-sm text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
          Conteúdo
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="min-w-0 text-2xl font-semibold leading-tight text-neutral-900">
            {pauta.titulo}
          </h1>
          {temPendencia && (
            <p className="shrink-0 rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
              Alterações não salvas
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="flex items-center gap-1.5 text-sm text-neutral-600">
            <span className={cn("h-2 w-2 rounded-full", COLUNA_PONTO[pauta.coluna])} aria-hidden />
            {COLUNA_LABEL[pauta.coluna]}
          </span>
          <BadgesPlataforma plataformas={pauta.plataformas} />
          <SeloPostVinculado pauta={pauta} />
        </div>
      </header>

      <FaixaMetadados pauta={pauta} />

      <div className="space-y-3">
        <BlocoTexto
          pautaId={pauta.id}
          bloco="insights"
          titulo="Insights & Referências"
          icone={<Lightbulb className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          valorInicial={pauta.insights}
          placeholder="Por que esta pauta existe, dados de apoio, links de referência…"
          aoMudarPendencia={aoMudarPendencia}
        />

        <BlocoTexto
          pautaId={pauta.id}
          bloco="pesquisa"
          titulo="Pesquisa Conteúdo"
          icone={<Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          valorInicial={pauta.pesquisaConteudo}
          placeholder="Cole aqui o resultado do /pesquisa: gaps da SERP, ângulo, estrutura do artigo…"
          altura="min-h-[400px]"
          aoMudarPendencia={aoMudarPendencia}
        />

        {/* Artigo Finalizado e as capas entram na próxima fase (A3). Por ora o
            selo do cabeçalho já mostra o estado real do artigo vinculado. */}

        <BlocoTexto
          pautaId={pauta.id}
          bloco="linkedin"
          titulo="Texto Linkedin"
          icone={<Linkedin className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          valorInicial={pauta.linkedinTexto}
          placeholder="Post pronto para colar no LinkedIn…"
          altura="min-h-[260px]"
          aoMudarPendencia={aoMudarPendencia}
          antes={
            pauta.linkedinBriefing ? (
              <blockquote className="mb-3 border-l-2 border-neutral-300 bg-neutral-50 px-3 py-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                  Ângulo do calendário
                </p>
                <p className="mt-1 text-sm leading-snug text-neutral-700">
                  {pauta.linkedinBriefing}
                </p>
              </blockquote>
            ) : null
          }
        />

        <BlocoTexto
          pautaId={pauta.id}
          bloco="imagem-prompt"
          titulo="Prompt da imagem (IA)"
          icone={<ImagemIcone className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          valorInicial={pauta.linkedinImagemPrompt}
          placeholder="Prompt em inglês para colar no gerador de imagem…"
          altura="min-h-[140px]"
          aoMudarPendencia={aoMudarPendencia}
        />

        {pauta.artigo && (
          <p className="flex items-center gap-1.5 px-1 text-xs text-neutral-500">
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            Artigo vinculado:{" "}
            <Link
              href={`/admin/posts/${pauta.artigo.id}`}
              className="rounded underline underline-offset-2 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              {pauta.artigo.titulo}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
