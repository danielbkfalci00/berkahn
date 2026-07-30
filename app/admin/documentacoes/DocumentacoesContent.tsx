"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORIA_LABEL,
  type CategoriaDocumento,
  type DocumentoMeta,
} from "@/types/documentacao";

type Filtro = CategoriaDocumento | "todos";

type Props = {
  documentos: DocumentoMeta[];
};

const CATEGORIA_ESTILO: Record<CategoriaDocumento, string> = {
  "performance-mensal": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "estrategia-editorial": "bg-amber-50 text-amber-800 ring-amber-600/20",
};

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export function DocumentacoesContent({ documentos }: Props) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");

  const contagem = useMemo(() => {
    const mapa = new Map<CategoriaDocumento, number>();
    for (const doc of documentos) {
      mapa.set(doc.categoria, (mapa.get(doc.categoria) ?? 0) + 1);
    }
    return mapa;
  }, [documentos]);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return documentos.filter((doc) => {
      if (filtro !== "todos" && doc.categoria !== filtro) return false;
      if (!termo) return true;
      return (
        doc.titulo.toLowerCase().includes(termo) ||
        (doc.resumo ?? "").toLowerCase().includes(termo) ||
        (doc.periodoLabel ?? "").toLowerCase().includes(termo)
      );
    });
  }, [documentos, filtro, busca]);

  const abas: { valor: Filtro; label: string; total: number }[] = [
    { valor: "todos", label: "Todos", total: documentos.length },
    ...(Object.keys(CATEGORIA_LABEL) as CategoriaDocumento[])
      .filter((cat) => (contagem.get(cat) ?? 0) > 0)
      .map((cat) => ({
        valor: cat as Filtro,
        label: CATEGORIA_LABEL[cat],
        total: contagem.get(cat) ?? 0,
      })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1">
          {abas.map((aba) => (
            <button
              key={aba.valor}
              type="button"
              onClick={() => setFiltro(aba.valor)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filtro === aba.valor
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              {aba.label}
              <span className="ml-1.5 text-xs text-neutral-400">{aba.total}</span>
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar documento"
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      {visiveis.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-500">
          Nenhum documento corresponde ao filtro.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visiveis.map((doc) => (
            <li key={doc.slug}>
              <Link
                href={`/admin/documentacoes/${doc.slug}`}
                className="group flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                      CATEGORIA_ESTILO[doc.categoria]
                    )}
                  >
                    {CATEGORIA_LABEL[doc.categoria]}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-900" />
                </div>

                <h3 className="mt-3 text-base font-semibold leading-snug text-neutral-900">
                  {doc.titulo}
                </h3>

                {doc.resumo && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500">
                    {doc.resumo}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-neutral-400">
                  {doc.periodoLabel && (
                    <>
                      <span className="truncate">{doc.periodoLabel}</span>
                      <span aria-hidden>·</span>
                    </>
                  )}
                  <span className="shrink-0">
                    atualizado {formatarData(doc.atualizadoEm)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
