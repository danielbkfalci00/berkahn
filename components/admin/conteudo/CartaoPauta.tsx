"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertTriangle, Calendar, FileText, GripVertical, Linkedin,
  MoreHorizontal, Trash2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  STATUS_LABEL, estadoGeral, proximaAcao, type StatusQuadro, type VisaoQuadro,
} from "@/types/conteudo";
import { COLUNA_PONTO } from "@/lib/conteudo/colunas";
import { cn } from "@/lib/utils";
import { SeloPostVinculado } from "./SeloPostVinculado";
import type { ItemQuadro } from "./QuadroConteudo";

interface Props {
  pauta: ItemQuadro;
  visao: VisaoQuadro;
  colunas: readonly StatusQuadro[];
  arrastavel: boolean;
  aoMover: (id: string, coluna: StatusQuadro) => void;
  aoExcluir: (id: string) => void;
  confirmandoExclusao: boolean;
  aoPedirExclusao: (id: string | null) => void;
  selecionado: boolean;
  aoSelecionar: (id: string, selecionado: boolean) => void;
}

function dataCurta(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short",
  });
}
function alertaProntidao(pauta: ItemQuadro): string | null {
  if (
    ["produzido", "aprovado"].includes(pauta.statusBlog ?? "") &&
    (!pauta.artigo || !pauta.draftPath || !pauta.capaBlogUrl)
  ) return "Blog sem vínculo, draft ou capa";
  if (
    ["produzido", "aprovado"].includes(pauta.statusLinkedin ?? "") &&
    (!pauta.linkedinTexto || !pauta.capaLinkedinUrl)
  ) return "LinkedIn sem texto ou capa";
  return null;
}

export function CartaoPauta({
  pauta, visao, colunas, arrastavel, aoMover, aoExcluir,
  confirmandoExclusao, aoPedirExclusao, selecionado, aoSelecionar,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pauta.id, disabled: !arrastavel });
  const Icone = pauta.tipo === "linkedin-acervo" ? Linkedin : FileText;
  const alerta = alertaProntidao(pauta);
  const hoje = new Date().toISOString().slice(0, 10);
  const atrasada =
    Boolean(pauta.dataAlvo && pauta.dataAlvo < hoje) &&
    estadoGeral(pauta) !== "concluida";

  return (
    <li ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "group/card relative rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition-shadow",
        "hover:border-neutral-300 hover:shadow-md",
        isDragging && "opacity-40"
      )}>
      <div className="flex items-start gap-1.5">
        {visao !== "geral" && arrastavel && (
          <input type="checkbox" checked={selecionado}
            onChange={(e) => aoSelecionar(pauta.id, e.target.checked)}
            aria-label={`Selecionar ${pauta.titulo}`}
            className="mt-1 h-3.5 w-3.5 shrink-0 rounded border-neutral-300 accent-neutral-900" />
        )}
        {arrastavel && (
          <button type="button" {...attributes} {...listeners}
            aria-label={`Arrastar ${pauta.titulo}`}
            className="mt-0.5 hidden shrink-0 cursor-grab touch-none rounded p-0.5 text-neutral-300 opacity-0 transition-opacity hover:text-neutral-500 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 group-hover/card:opacity-100 active:cursor-grabbing md:block">
            <GripVertical className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        )}
        <Icone className="mt-[3px] h-3.5 w-3.5 shrink-0 text-neutral-400"
          strokeWidth={1.75} aria-hidden />
        <Link href={`/admin/conteudo/${pauta.id}`}
          className="min-w-0 flex-1 rounded text-sm font-medium leading-snug text-neutral-900 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
          {pauta.titulo}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label={`Ações de ${pauta.titulo}`}
              className="shrink-0 rounded p-0.5 text-neutral-400 opacity-0 transition-opacity hover:bg-neutral-100 hover:text-neutral-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 group-hover/card:opacity-100 data-[state=open]:opacity-100">
              <MoreHorizontal className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {colunas.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs font-normal text-neutral-500">
                  Mover em {visao === "blog" ? "Blog" : "LinkedIn"}
                </DropdownMenuLabel>
                {colunas.filter((c) => c !== pauta.coluna).map((c) => (
                  <DropdownMenuItem key={c} onSelect={() => aoMover(pauta.id, c)}>
                    <span className={cn("mr-2 h-2 w-2 rounded-full", COLUNA_PONTO[c])} aria-hidden />
                    {STATUS_LABEL[c]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
              onSelect={(e) => {
                if (!confirmandoExclusao) {
                  e.preventDefault();
                  aoPedirExclusao(pauta.id);
                  return;
                }
                aoExcluir(pauta.id);
              }}>
              <Trash2 className="mr-2 h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              {confirmandoExclusao ? "Confirmar exclusão?" : "Excluir pauta"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 space-y-2 pl-[22px]">
        <div className="rounded-md bg-[#F7F5EF] px-2 py-1.5 text-[11px]">
          <TrilhaMini nome="Blog" status={pauta.statusBlog} cor="bg-amber-500" />
          <TrilhaMini nome="LinkedIn" status={pauta.statusLinkedin} cor="bg-sky-500" />
        </div>

        <p className="text-xs font-medium text-neutral-600">
          Próxima: {proximaAcao(pauta)}
        </p>

        {pauta.dataAlvo && (
          <p className={cn(
            "flex items-center gap-1 text-xs",
            atrasada ? "font-medium text-red-600" : "text-neutral-500"
          )}>
            <Calendar className="h-3 w-3" strokeWidth={1.75} aria-hidden />
            <time dateTime={pauta.dataAlvo}>{dataCurta(pauta.dataAlvo)}</time>
            {pauta.semana && <span className="text-neutral-400">· S{pauta.semana}</span>}
            {pauta.trilha === "core" && <span className="font-medium">· Core</span>}
          </p>
        )}

        {alerta && (
          <p className="flex items-start gap-1 text-[11px] font-medium leading-snug text-amber-700">
            <AlertTriangle className="mt-px h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
            {alerta}
          </p>
        )}
        <SeloPostVinculado pauta={pauta} />
      </div>
    </li>
  );
}

function TrilhaMini({
  nome, status, cor,
}: {
  nome: string;
  status: string | null;
  cor: string;
}) {
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", status ? cor : "bg-neutral-300")} aria-hidden />
      <span className="w-14 text-neutral-500">{nome}</span>
      <span className={cn("font-medium", status ? "text-neutral-800" : "text-neutral-400")}>
        {status ? STATUS_LABEL[status as StatusQuadro] : "não se aplica"}
      </span>
    </div>
  );
}
