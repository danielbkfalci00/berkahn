"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tempoRelativo } from "@/components/admin/documentacoes/tipos-ui";
import { abrirFeedbackRapido } from "./FeedbackRapido";
import {
  CATEGORIA_LABEL,
  STATUS_LABEL,
  parseFiltro,
  type CategoriaFeedback,
  type FiltroFeedback,
  type ItemFeedback,
  type StatusFeedback,
} from "@/types/feedback";

const COR_CATEGORIA: Record<CategoriaFeedback, string> = {
  melhoria: "bg-sky-50 text-sky-700 ring-sky-200",
  bug: "bg-red-50 text-red-700 ring-red-200",
  ideia: "bg-violet-50 text-violet-700 ring-violet-200",
  outro: "bg-neutral-100 text-neutral-600 ring-neutral-200",
};

export function SeloCategoria({ categoria }: { categoria: CategoriaFeedback }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", COR_CATEGORIA[categoria])}>
      {CATEGORIA_LABEL[categoria]}
    </span>
  );
}

export function SeloStatus({ status }: { status: StatusFeedback }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        status === "implementado" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      )}
    >
      {status === "implementado" && <CheckCircle2 className="h-3 w-3" />}
      {STATUS_LABEL[status]}
    </span>
  );
}

const FILTROS: { valor: FiltroFeedback; rotulo: string }[] = [
  { valor: "aberto", rotulo: "Abertos" },
  { valor: "implementado", rotulo: "Implementados" },
  { valor: "todos", rotulo: "Todos" },
];

export function FeedbackLista({ itens, filtro, filtroLocal }: { itens: ItemFeedback[]; filtro: FiltroFeedback; filtroLocal: boolean }) {
  const searchParams = useSearchParams();
  const filtroAtivo = filtroLocal ? parseFiltro(searchParams.get("status")) : filtro;
  const visiveis = filtroLocal && filtroAtivo !== "todos"
    ? itens.filter((item) => item.status === filtroAtivo)
    : itens;

  return (
    <div className="max-w-3xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Feedback</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sugestões do time sobre o admin. Todos veem e respondem; o proprietário marca o que foi implementado.
          </p>
        </div>
        <Button className="min-h-11" onClick={abrirFeedbackRapido}>
          <MessageSquarePlus className="mr-1.5 h-4 w-4" />
          Novo feedback
        </Button>
      </header>

      <nav aria-label="Filtrar por status" className="inline-flex rounded-lg border border-neutral-200 bg-white p-1">
        {FILTROS.map((f) => (
          <Link
            key={f.valor}
            href={f.valor === "aberto" ? "/admin/feedback" : `/admin/feedback?status=${f.valor}`}
            prefetch={filtroLocal ? false : undefined}
            onClick={filtroLocal ? (event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              if (filtroAtivo === f.valor) return;
              const href = f.valor === "aberto" ? "/admin/feedback" : `/admin/feedback?status=${f.valor}`;
              window.history.pushState(null, "", href);
            } : undefined}
            aria-current={filtroAtivo === f.valor ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors",
              filtroAtivo === f.valor ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {f.rotulo}
          </Link>
        ))}
      </nav>

      {visiveis.length === 0 ? (
        <EstadoVazio filtro={filtroAtivo} />
      ) : (
        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-white">
          {visiveis.map((item) => (
            <li key={item.id}>
              <Link
                href={`/admin/feedback/${item.id}`}
                className="block px-4 py-3.5 transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-neutral-900">{item.titulo}</p>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-neutral-500">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {item.totalMensagens}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                  <SeloCategoria categoria={item.categoria} />
                  {filtroAtivo === "todos" && <SeloStatus status={item.status} />}
                  <span>{item.autorNome}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={item.atualizadoEm}>{tempoRelativo(item.atualizadoEm)}</time>
                  {item.paginaOrigem && (
                    <span className="truncate font-mono text-[11px] text-neutral-400">{item.paginaOrigem}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EstadoVazio({ filtro }: { filtro: FiltroFeedback }) {
  if (filtro === "implementado") {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
        Nada marcado como implementado ainda.
      </p>
    );
  }
  if (filtro === "todos") {
    return <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">Nenhum feedback registrado ainda.</p>;
  }
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
      <MessageSquarePlus className="mx-auto h-9 w-9 text-neutral-300" />
      <h2 className="mt-3 text-base font-semibold text-neutral-900">Nenhum feedback aberto</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
        Viu algo que poderia ser melhor? Use o botão <strong>Feedback</strong> no canto da tela, em qualquer página
        do admin. A página onde você estava é registrada junto, e a conversa continua aqui.
      </p>
    </div>
  );
}
