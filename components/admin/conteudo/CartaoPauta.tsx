"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  FileText,
  GripVertical,
  Linkedin,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLUNAS, COLUNA_LABEL, type ColunaPauta, type Pauta } from "@/types/conteudo";
import { COLUNA_PONTO } from "@/lib/conteudo/colunas";
import { cn } from "@/lib/utils";
import { BadgesPlataforma } from "./BadgesPlataforma";
import { SeloPostVinculado } from "./SeloPostVinculado";

interface Props {
  pauta: Pauta;
  arrastavel: boolean;
  aoMover: (id: string, coluna: ColunaPauta) => void;
  aoExcluir: (id: string) => void;
  confirmandoExclusao: boolean;
  aoPedirExclusao: (id: string | null) => void;
}

function dataCurta(iso: string) {
  // Meio-dia UTC evita o off-by-one de fuso ao formatar uma data sem hora.
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function CartaoPauta({
  pauta,
  arrastavel,
  aoMover,
  aoExcluir,
  confirmandoExclusao,
  aoPedirExclusao,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pauta.id });

  const Icone = pauta.tipo === "linkedin-acervo" ? Linkedin : FileText;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "group/card relative rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition-shadow",
        "hover:border-neutral-300 hover:shadow-md",
        isDragging && "opacity-40"
      )}
    >
      <div className="flex items-start gap-1.5">
        {arrastavel && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Arrastar ${pauta.titulo}`}
            className="mt-0.5 hidden shrink-0 cursor-grab touch-none rounded p-0.5 text-neutral-300 opacity-0 transition-opacity hover:text-neutral-500 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 group-hover/card:opacity-100 active:cursor-grabbing md:block"
          >
            <GripVertical className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        )}

        <Icone
          className="mt-[3px] h-3.5 w-3.5 shrink-0 text-neutral-400"
          strokeWidth={1.75}
          aria-hidden
        />

        {/* O card não pode ser um <Link> envolvendo tudo: tem dois destinos, e
            <a> dentro de <a> é inválido e quebra a navegação por teclado. */}
        <Link
          href={`/admin/conteudo/${pauta.id}`}
          className="min-w-0 flex-1 rounded text-sm font-medium leading-snug text-neutral-900 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          {pauta.titulo}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Ações de ${pauta.titulo}`}
              className="shrink-0 rounded p-0.5 text-neutral-400 opacity-0 transition-opacity hover:bg-neutral-100 hover:text-neutral-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 group-hover/card:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs font-normal text-neutral-500">
              Mover para
            </DropdownMenuLabel>
            {COLUNAS.filter((c) => c !== pauta.coluna).map((c) => (
              <DropdownMenuItem key={c} onSelect={() => aoMover(pauta.id, c)}>
                <span className={cn("mr-2 h-2 w-2 rounded-full", COLUNA_PONTO[c])} aria-hidden />
                {COLUNA_LABEL[c]}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* Confirmação em dois passos no próprio menu: confirm() bloqueia a
                thread e não dá para estilizar (o mau padrão está em
                components/admin/posts/PostsTable.tsx:99). */}
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
              onSelect={(e) => {
                if (!confirmandoExclusao) {
                  e.preventDefault();
                  aoPedirExclusao(pauta.id);
                  return;
                }
                aoExcluir(pauta.id);
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              {confirmandoExclusao ? "Confirmar exclusão?" : "Excluir pauta"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 space-y-1.5 pl-[22px]">
        {pauta.dataAlvo && (
          <p className="flex items-center gap-1 text-xs text-neutral-500">
            <Calendar className="h-3 w-3" strokeWidth={1.75} aria-hidden />
            <time dateTime={pauta.dataAlvo}>{dataCurta(pauta.dataAlvo)}</time>
            {pauta.semana && <span className="text-neutral-400">· S{pauta.semana}</span>}
            {pauta.trilha === "core" && (
              <span className="font-medium text-neutral-700">· Core</span>
            )}
          </p>
        )}

        <BadgesPlataforma plataformas={pauta.plataformas} />
        <SeloPostVinculado pauta={pauta} />
      </div>
    </li>
  );
}
