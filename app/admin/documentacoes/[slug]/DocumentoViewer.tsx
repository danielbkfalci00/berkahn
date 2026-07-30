"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIA_LABEL, type DocumentoMeta } from "@/types/documentacao";

type Props = {
  meta: DocumentoMeta;
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

export function DocumentoViewer({ meta }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [emTelaCheia, setEmTelaCheia] = useState(false);
  const rawUrl = `/admin/documentacoes/${meta.slug}/raw`;

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
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
        origem opaca, sem acesso a cookies nem ao DOM do admin.
      */}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
      >
        <iframe
          src={rawUrl}
          title={meta.titulo}
          sandbox="allow-scripts"
          className="h-[calc(100vh-11rem)] w-full border-0"
        />
      </div>
    </div>
  );
}
