"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FileText, Link2Off, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vincularPost } from "@/app/admin/conteudo/actions";
import { SeloPostVinculado } from "@/components/admin/conteudo/SeloPostVinculado";
import type { Pauta } from "@/types/conteudo";
import { BlocoColapsavel } from "./BlocoColapsavel";

export interface ArtigoLivre {
  id: string;
  slug: string;
  titulo: string;
  status: string;
}

interface Props {
  pauta: Pauta;
  /** Artigos que ainda não pertencem a nenhuma pauta. */
  artigosLivres: ArtigoLivre[];
}

/**
 * "Artigo Finalizado" — vínculo, nunca cópia. O artigo vive em `posts` e no
 * markdown do vault; aqui só se aponta para ele.
 *
 * ⚠️ `listarArtigosVinculaveis` exclui todo post que já pertence a alguma
 * pauta — **inclusive o desta**. Por isso o artigo atual é lido de
 * `pauta.artigo`, e o seletor lista só os livres: alimentar o Select apenas
 * com a lista faria um card que tem artigo mostrar "nenhum selecionado", e os
 * 22 cards de acervo são exatamente esse caso.
 */
export function BlocoArtigo({ pauta, artigosLivres }: Props) {
  const [artigo, setArtigo] = useState(pauta.artigo);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();

  function aplicar(postId: string | null) {
    setErro(null);
    iniciar(async () => {
      const res = await vincularPost(pauta.id, postId);
      if (res.error) {
        setErro(res.error);
        return;
      }
      setArtigo(res.data?.artigo ?? null);
    });
  }

  return (
    <BlocoColapsavel
      titulo="Artigo Finalizado"
      icone={<FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
      abertoInicial={Boolean(pauta.artigo)}
      resumo={artigo ? "vinculado" : undefined}
    >
      {artigo ? (
        <div className="space-y-3">
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
            <Link
              href={`/admin/posts/${artigo.id}`}
              className="rounded text-sm font-medium text-neutral-900 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              {artigo.titulo}
            </Link>
            <p className="mt-0.5 text-xs text-neutral-500">/{artigo.slug}</p>
            <div className="mt-2">
              <SeloPostVinculado pauta={{ ...pauta, artigo }} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => aplicar(null)}
            disabled={pendente}
            className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50"
          >
            {pendente ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} aria-hidden />
            ) : (
              <Link2Off className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            )}
            Desvincular
          </button>
        </div>
      ) : artigosLivres.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Nenhum artigo disponível para vincular — todos já pertencem a alguma
          pauta. Escreva o artigo com <code className="text-neutral-700">/artigo</code>{" "}
          e volte aqui.
        </p>
      ) : (
        <div className="space-y-2">
          <Select
            value=""
            disabled={pendente}
            onValueChange={(v) => aplicar(v)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Escolher um artigo sem pauta…" />
            </SelectTrigger>
            <SelectContent>
              {artigosLivres.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-400">
            {artigosLivres.length}{" "}
            {artigosLivres.length === 1 ? "artigo ainda sem" : "artigos ainda sem"} pauta.
            Criar artigo continua sendo o <code className="text-neutral-600">/artigo</code>.
          </p>
        </div>
      )}

      {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}
    </BlocoColapsavel>
  );
}
