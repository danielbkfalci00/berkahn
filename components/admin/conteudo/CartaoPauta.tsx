"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertTriangle, Calendar, Check, Clipboard, FileText, GripVertical, Linkedin,
  Loader2, MoreHorizontal, Pencil, Sparkles, Tags, Trash2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FUNIL_LABEL, INTENCAO_LABEL, STATUS_BLOG, STATUS_LABEL, STATUS_LINKEDIN,
  TRILHA_LABEL, gapsConteudo, proximaAcaoOperacional,
  type AcaoAutomacao, type Funil, type Intencao, type Plataforma,
  type StatusBlog, type StatusLinkedin, type StatusQuadro, type TagCatalogo,
  type TagConteudo, type Trilha, type VisaoQuadro,
} from "@/types/conteudo";
import {
  alterarStatusPauta, atualizarPauta, solicitarAutomacao,
} from "@/app/admin/conteudo/actions";
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
  tagsCatalogo: TagCatalogo[];
}


function acaoAutomacao(pauta: ItemQuadro): AcaoAutomacao {
  const temPesquisa = pauta.artefatosResumo?.pesquisa ?? Boolean(pauta.pesquisaConteudo?.trim());
  const temLinkedinTexto = pauta.artefatosResumo?.linkedinTexto
    ?? Boolean(pauta.linkedinTexto?.trim());
  if (pauta.statusBlog && !temPesquisa) return "pesquisar";
  if (pauta.statusBlog && !pauta.draftPath) return "criar-draft";
  if (pauta.statusBlog && (!pauta.artigo || !pauta.capaBlogUrl)) return "produzir-artigo";
  if (pauta.statusLinkedin && (!temLinkedinTexto || !pauta.capaLinkedinUrl))
    return "produzir-linkedin";
  return "revisar";
}

const JOB_LABEL = {
  "na-fila": "Na fila",
  executando: "Codex executando",
  "aguardando-aprovacao": "Aguardando aprovação",
  concluido: "Automação concluída",
  falhou: "Automação falhou",
  cancelado: "Automação cancelada",
} as const;

export function CartaoPauta({
  pauta, visao, colunas, arrastavel, aoMover, aoExcluir,
  confirmandoExclusao, aoPedirExclusao, selecionado, aoSelecionar, tagsCatalogo,
}: Props) {
  const router = useRouter();
  const [local, setLocal] = useState(pauta);
  const localRef = useRef(pauta);
  const filaSalvamento = useRef<Promise<void>>(Promise.resolve());
  const versaoEdicao = useRef(0);
  const salvamentosAtivos = useRef(0);
  const [erro, setErro] = useState<string | null>(null);
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [pendente, iniciar] = useTransition();

  useEffect(() => {
    if (salvamentosAtivos.current === 0) {
      localRef.current = pauta;
      setLocal(pauta);
    }
  }, [pauta]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pauta.id, disabled: !arrastavel });
  const Icone = local.tipo === "linkedin-acervo" ? Linkedin : FileText;
  const gaps = gapsConteudo(local);
  const hoje = new Date().toISOString().slice(0, 10);
  const atrasada = Boolean(local.dataAlvo && local.dataAlvo < hoje && gaps.length);

  const tagVisivel = tagsCatalogo.find((tag) => tag.slug === local.tags[0])?.label;

  function salvar(patch: Parameters<typeof atualizarPauta>[1]) {
    const versao = ++versaoEdicao.current;
    const otimista = { ...localRef.current, ...patch };
    localRef.current = otimista;
    setLocal(otimista);
    setErro(null);
    salvamentosAtivos.current += 1;

    const tarefa = filaSalvamento.current.then(async () => {
      try {
        const resultado = await atualizarPauta(localRef.current.id, patch);
        if (resultado.error || !resultado.data) {
          setErro(resultado.error ?? "Não foi possível salvar.");
          return;
        }
        if (versao === versaoEdicao.current) {
          const confirmado = { ...localRef.current, ...resultado.data };
          localRef.current = confirmado;
          setLocal(confirmado);
        }
      } catch {
        setErro("Não foi possível salvar.");
      } finally {
        salvamentosAtivos.current -= 1;
        if (salvamentosAtivos.current === 0) router.refresh();
      }
    });
    filaSalvamento.current = tarefa.catch(() => undefined);
    iniciar(async () => tarefa);
  }

  function salvarStatus(canal: "blog" | "linkedin", status: StatusBlog | StatusLinkedin) {
    const versao = ++versaoEdicao.current;
    const otimista = canal === "blog"
      ? { ...localRef.current, statusBlog: status as StatusBlog }
      : { ...localRef.current, statusLinkedin: status as StatusLinkedin };
    localRef.current = otimista;
    setLocal(otimista);
    setErro(null);
    salvamentosAtivos.current += 1;

    const tarefa = filaSalvamento.current.then(async () => {
      try {
        const resultado = await alterarStatusPauta(localRef.current.id, canal, status);
        if (resultado.error || !resultado.data) {
          setErro(resultado.error ?? "Não foi possível mover.");
          return;
        }
        if (versao === versaoEdicao.current) {
          const confirmado = { ...localRef.current, ...resultado.data };
          localRef.current = confirmado;
          setLocal(confirmado);
        }
      } catch {
        setErro("Não foi possível mover.");
      } finally {
        salvamentosAtivos.current -= 1;
        if (salvamentosAtivos.current === 0) router.refresh();
      }
    });
    filaSalvamento.current = tarefa.catch(() => undefined);
    iniciar(async () => tarefa);
  }
  function alternarTag(tag: TagConteudo) {
    const tags = localRef.current.tags.includes(tag)
      ? localRef.current.tags.filter((atual) => atual !== tag)
      : [...localRef.current.tags, tag];
    salvar({ tags });
  }

  function alternarPlataforma(plataforma: Plataforma) {
    const plataformas = localRef.current.plataformas.includes(plataforma)
      ? localRef.current.plataformas.filter((atual) => atual !== plataforma)
      : [...localRef.current.plataformas, plataforma];
    if (plataformas.length) salvar({ plataformas });
  }

  function enviarAoCodex() {
    setErro(null);
    iniciar(async () => {
      const resultado = await solicitarAutomacao(local.id, acaoAutomacao(local));
      if (resultado.error) {
        setErro(resultado.error);
        return;
      }
      if (resultado.data) {
        setLocal((atual) => ({
          ...atual,
          automationJob: {
            id: resultado.data!.id,
            acao: acaoAutomacao(atual),
            status: "na-fila",
            tentativas: 0,
            erro: null,
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString(),
          },
        }));
        router.refresh();
      }
    });
  }

  async function copiarContexto() {
    const contexto = {
      pauta_id: local.id,
      titulo: local.titulo,
      status_blog: local.statusBlog,
      status_linkedin: local.statusLinkedin,
      proxima_acao: proximaAcaoOperacional(local),
      gaps,
      tags: local.tags,
      atualizado_em: local.atualizadoEm,
    };
    const prompt = [
      "Produza esta pauta até o pacote de aprovação, usando o orquestrador de conteúdo da Berkahn.",
      "Não publique nada antes da minha aprovação explícita. Recarregue a versão antes de cada escrita,",
      "use contexto progressivo, gere artigo, LinkedIn e capas, e exponha qualquer gap sem bloquear o status.",
      "",
      `Pauta: ${local.id}`,
      `Versão esperada: ${local.atualizadoEm}`,
      "Contexto inicial:",
      JSON.stringify(contexto, null, 2),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      setErro("O navegador bloqueou o clipboard. Use HTTPS e clique novamente.");
    }
  }

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
            onChange={(e) => aoSelecionar(local.id, e.target.checked)}
            aria-label={`Selecionar ${local.titulo}`}
            className="mt-1 h-3.5 w-3.5 shrink-0 rounded border-neutral-300 accent-neutral-900" />
        )}
        {arrastavel && (
          <button type="button" {...attributes} {...listeners}
            aria-label={`Arrastar ${local.titulo}`}
            className="mt-0.5 hidden shrink-0 cursor-grab touch-none rounded p-0.5 text-neutral-300 opacity-0 transition-opacity hover:text-neutral-500 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 group-hover/card:opacity-100 active:cursor-grabbing md:block">
            <GripVertical className="h-4 w-4" aria-hidden />
          </button>
        )}
        <Icone className="mt-[3px] h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden />

        {editandoTitulo ? (
          <input autoFocus defaultValue={local.titulo} maxLength={300}
            onPointerDown={(e) => e.stopPropagation()}
            onBlur={(e) => {
              const titulo = e.target.value.trim();
              setEditandoTitulo(false);
              if (titulo && titulo !== local.titulo) salvar({ titulo });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") setEditandoTitulo(false);
            }}
            className="min-w-0 flex-1 rounded border border-neutral-300 px-1.5 py-0.5 text-sm font-medium leading-snug outline-none focus:ring-2 focus:ring-neutral-900" />
        ) : (
          <Link href={`/admin/conteudo/${local.id}`}
            className="min-w-0 flex-1 rounded text-sm font-medium leading-snug text-neutral-900 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
            {local.titulo}
          </Link>
        )}
        <button type="button" onClick={() => setEditandoTitulo(true)}
          aria-label="Renomear pauta"
          className="rounded p-1 text-neutral-400 opacity-100 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 md:opacity-0 md:group-hover/card:opacity-100 md:focus-visible:opacity-100">
          <Pencil className="h-3.5 w-3.5" aria-hidden />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label={`Ações de ${local.titulo}`}
              className="shrink-0 rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
              <MoreHorizontal className="h-4 w-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {colunas.length > 0 && (
              <>
                <DropdownMenuLabel>Mover em {visao === "blog" ? "Blog" : "LinkedIn"}</DropdownMenuLabel>
                {colunas.filter((c) => c !== local.coluna).map((c) => (
                  <DropdownMenuItem key={c} onSelect={() => aoMover(local.id, c)}>
                    <span className={cn("mr-2 h-2 w-2 rounded-full", COLUNA_PONTO[c])} />
                    {STATUS_LABEL[c]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onSelect={enviarAoCodex}>
              <Sparkles className="mr-2 h-3.5 w-3.5" aria-hidden />
              Adicionar próxima ação à fila
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void copiarContexto()}>
              <Clipboard className="mr-2 h-3.5 w-3.5" aria-hidden />
              Copiar prompt completo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700"
              onSelect={(e) => {
                if (!confirmandoExclusao) {
                  e.preventDefault();
                  aoPedirExclusao(local.id);
                  return;
                }
                aoExcluir(local.id);
              }}>
              <Trash2 className="mr-2 h-3.5 w-3.5" aria-hidden />
              {confirmandoExclusao ? "Confirmar exclusão?" : "Excluir pauta"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {erro && <p role="alert" className="mt-2 rounded bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700">
        {erro}
      </p>}
      <div className="mt-2 space-y-2 pl-[22px]">
        <div className="rounded-md bg-[#F7F5EF] px-2 py-1.5 text-[11px]">
          <TrilhaMini nome="Blog" status={local.statusBlog} cor="bg-amber-500"
            opcoes={STATUS_BLOG} aoMudar={(status) => salvarStatus("blog", status as StatusBlog)} />
          <TrilhaMini nome="LinkedIn" status={local.statusLinkedin} cor="bg-sky-500"
            opcoes={STATUS_LINKEDIN}
            aoMudar={(status) => salvarStatus("linkedin", status as StatusLinkedin)} />
        </div>

        <p className="text-xs font-medium text-neutral-600">
          Próxima: {proximaAcaoOperacional(local)}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          <label className={cn(
            "inline-flex min-h-8 items-center gap-1 rounded border px-2 py-1 text-[11px]",
            atrasada ? "border-red-200 bg-red-50 text-red-700" : "border-neutral-200 text-neutral-600"
          )}>
            <Calendar className="h-3 w-3" aria-hidden />
            <span className="sr-only">Data planejada</span>
            <input type="date" value={local.dataAlvo ?? ""}
              onPointerDown={(e) => e.stopPropagation()}
              onChange={(e) => salvar({ dataAlvo: e.target.value || null })}
              className="w-[92px] bg-transparent text-[11px] outline-none" />
          </label>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button"
                className="inline-flex min-h-8 max-w-full items-center gap-1 truncate rounded border border-neutral-200 px-2 py-1 text-[11px] text-neutral-600 hover:bg-neutral-50">
                <Tags className="h-3 w-3" aria-hidden />
                <span className="truncate">
                  {local.prioridade ? `P${local.prioridade}` : "Propriedades"}
                  {tagVisivel ? ` / ${tagVisivel}${local.tags.length > 1 ? ` +${local.tags.length - 1}` : ""}` : ""}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Prioridade</DropdownMenuLabel>
              {[1, 2, 3, 4, 5].map((valor) => (
                <DropdownMenuCheckboxItem key={valor}
                  checked={local.prioridade === valor}
                  onCheckedChange={() => salvar({ prioridade: valor })}>
                  P{valor}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Trilha</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(Object.entries(TRILHA_LABEL) as [Trilha, string][]).map(([valor, label]) => (
                    <DropdownMenuCheckboxItem key={valor} checked={local.trilha === valor}
                      onCheckedChange={() => salvar({ trilha: valor })}>{label}</DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Intenção</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(Object.entries(INTENCAO_LABEL) as [Intencao, string][]).map(([valor, label]) => (
                    <DropdownMenuCheckboxItem key={valor} checked={local.intencao === valor}
                      onCheckedChange={() => salvar({ intencao: valor })}>{label}</DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Funil</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(Object.entries(FUNIL_LABEL) as [Funil, string][]).map(([valor, label]) => (
                    <DropdownMenuCheckboxItem key={valor} checked={local.funil === valor}
                      onCheckedChange={() => salvar({ funil: valor })}>{label}</DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>                <DropdownMenuSubTrigger>Plataformas</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(["blog", "linkedin"] as Plataforma[]).map((valor) => (
                    <DropdownMenuCheckboxItem key={valor}
                      checked={local.plataformas.includes(valor)}
                      onCheckedChange={() => alternarPlataforma(valor)}>
                      {valor === "blog" ? "Blog" : "LinkedIn"}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Keyword</DropdownMenuLabel>
              <div className="px-2 pb-2">
                <input defaultValue={local.keyword ?? ""} maxLength={200}
                  onKeyDown={(e) => e.stopPropagation()}
                  onBlur={(e) => salvar({ keyword: e.target.value || null })}
                  placeholder="Adicionar keyword"
                  className="h-8 w-full rounded border border-neutral-200 px-2 text-xs outline-none focus:ring-2 focus:ring-neutral-900" />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tags de domínio</DropdownMenuLabel>
              {tagsCatalogo.map((tag) => (
                <DropdownMenuCheckboxItem key={tag.slug}
                  checked={local.tags.includes(tag.slug)}
                  onCheckedChange={() => alternarTag(tag.slug)}>
                  {tag.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {local.automationJob && (
          <p className={cn(
            "flex items-center gap-1 text-[11px] font-medium",
            local.automationJob.status === "falhou" ? "text-red-600" : "text-violet-700"
          )}>
            {local.automationJob.status === "concluido"
              ? <Check className="h-3 w-3" aria-hidden />
              : <Sparkles className="h-3 w-3" aria-hidden />}
            {JOB_LABEL[local.automationJob.status]}
            {local.automationJob.erro && `: ${local.automationJob.erro}`}
          </p>
        )}

        {gaps.length > 0 && (
          <p className="flex items-start gap-1 text-[11px] font-medium leading-snug text-amber-700">
            <AlertTriangle className="mt-px h-3 w-3 shrink-0" aria-hidden />
            {gaps.slice(0, 2).join(" · ")}
            {gaps.length > 2 ? ` +${gaps.length - 2}` : ""}
          </p>
        )}
        {pendente && (
          <p className="flex items-center gap-1 text-[11px] text-neutral-400">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> Salvando…
          </p>
        )}
        <SeloPostVinculado pauta={local} />
      </div>
    </li>
  );
}

function TrilhaMini({
  nome, status, cor, opcoes, aoMudar,
}: {
  nome: string;
  status: string | null;
  cor: string;
  opcoes: readonly string[];
  aoMudar: (status: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", status ? cor : "bg-neutral-300")} aria-hidden />
      <span className="w-14 text-neutral-500">{nome}</span>
      {status ? (
        <select value={status} aria-label={`Status de ${nome}`}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => aoMudar(e.target.value)}
          className="min-h-8 min-w-0 flex-1 rounded bg-transparent px-1 font-medium text-neutral-800 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
          {opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>{STATUS_LABEL[opcao as StatusQuadro]}</option>
          ))}
        </select>
      ) : (
        <span className="font-medium text-neutral-400">não se aplica</span>
      )}
    </div>
  );
}
