"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Archive, AlertTriangle, ChevronLeft, ChevronRight, Clock3, ExternalLink,
  FileText, FolderOpen, GripVertical, LayoutList, Link2, Mail, MessageCircle,
  Phone, Plus, RefreshCw, SlidersHorizontal, Trash2, Upload, UserRound,
} from "lucide-react";
import {
  DndContext, KeyboardSensor, PointerSensor, closestCenter, useDraggable,
  useDroppable, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  cancelLeadUpload,
  createLeadExternalArtifact,
  createManualLead,
  deleteLeadArtifact,
  finalizeLeadUpload,
  findLeadDuplicates,
  getLeadArtifactUrl,
  markLeadViewed,
  prepareLeadUpload,
  registerLeadActivity,
  setLeadArchived,
  setLeadNextAction,
  updateLeadOperations,
  updateLeadStatus,
  type ManualLeadInput,
} from "@/app/admin/leads/actions";
import { createClient } from "@/lib/supabase/client";
import type {
  AnalyticsLead, LeadArtifact, LeadPriority, LeadResponsible, LeadStatus,
} from "@/types/analytics";

const STATUS: Array<{ value: LeadStatus; label: string }> = [
  { value: "novo", label: "Novo" },
  { value: "em_contato", label: "Em contato" },
  { value: "qualificado", label: "Qualificado" },
  { value: "proposta_enviada", label: "Proposta enviada" },
  { value: "convertido", label: "Convertido" },
  { value: "desqualificado", label: "Desqualificado" },
];

const INPUT_CLASS = "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200";

function isoToLocalInput(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localInputToIso(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export interface LeadKpis {
  received: number;
  new: number;
  qualified: number;
  converted: number;
  eligible: number;
}

interface LeadsQueueProps {
  initialLeads: AnalyticsLead[];
  total: number;
  page: number;
  pageCount: number;
  kpis: LeadKpis;
  responsibles: LeadResponsible[];
  view: "inbox" | "kanban";
}

const EMPTY_MANUAL: ManualLeadInput = {
  nome: "",
  email: "",
  telefone: "",
  segmento: "nao_definido",
  canal: "whatsapp",
  mensagem: "",
};

export function LeadsQueue({ initialLeads, total, page, pageCount, kpis, responsibles, view }: LeadsQueueProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState(initialLeads);
  const [manual, setManual] = useState<ManualLeadInput>(EMPTY_MANUAL);
  const [duplicates, setDuplicates] = useState<NonNullable<Awaited<ReturnType<typeof findLeadDuplicates>>["duplicates"]>>([]);
  const [manualOpen, setManualOpen] = useState(false);
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const [disqualifying, setDisqualifying] = useState<{ id: string; reason: string } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  function changeStatus(id: string, status: LeadStatus) {
    if (status === "desqualificado") {
      setDisqualifying({ id, reason: "" });
      return;
    }
    commitStatus(id, status);
  }

  function commitStatus(id: string, status: LeadStatus, reason?: string) {
    const previous = leads;
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    setError(null);
    setSuccess(null);
    setPendingLeadId(id);
    startTransition(async () => {
      const result = await updateLeadStatus(id, status, reason);
      if (!result.ok) {
        setLeads(previous);
        setError(result.error || "Não foi possível alterar o status.");
      } else {
        setSuccess("Status atualizado.");
        router.refresh();
      }
      setPendingLeadId(null);
    });
  }

  function submitManual(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setPendingLeadId("manual");
    startTransition(async () => {
      if (!confirmDuplicate) {
        const check = await findLeadDuplicates(manual.email, manual.telefone);
        if (!check.ok) {
          setError(check.error || "Não foi possível verificar duplicados.");
          setPendingLeadId(null);
          return;
        }
        if (check.duplicates?.length) {
          setDuplicates(check.duplicates);
          setConfirmDuplicate(true);
          setPendingLeadId(null);
          return;
        }
      }
      const result = await createManualLead({
        ...manual,
        proximaAcaoEm: localInputToIso(manual.proximaAcaoEm),
      });
      if (!result.ok) {
        setError(result.error || "Não foi possível criar o lead.");
        setPendingLeadId(null);
        return;
      }
      setManual(EMPTY_MANUAL);
      setDuplicates([]);
      setConfirmDuplicate(false);
      setManualOpen(false);
      router.push(`/admin/leads/${result.id}`);
      setPendingLeadId(null);
    });
  }

  const qualificationRate = kpis.eligible ? Math.round((kpis.qualified / kpis.eligible) * 100) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Leads</h1>
          <p className="text-sm text-neutral-500">Operação comercial com PII centralizada no Supabase.</p>
        </div>
        <button
          type="button"
          onClick={() => setManualOpen((value) => !value)}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-700"
        >
          <Plus className="h-4 w-4" /> Cadastrar lead
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-neutral-300 py-3 text-sm">
        <Metric label="Recebidos · 28d" value={kpis.received} />
        <Metric label="Novos" value={kpis.new} />
        <Metric label="Qualificados" value={kpis.qualified} />
        <Metric label="Convertidos" value={kpis.converted} />
        <Metric label="Taxa" value={qualificationRate === null ? "—" : `${qualificationRate}%`} />
      </div>

      <div className="flex items-center gap-1 border-b border-neutral-200" aria-label="Visualização dos leads">
        <ViewTab href={withView(searchParams, "inbox")} active={view === "inbox"}><LayoutList className="h-4 w-4" /> Inbox</ViewTab>
        <ViewTab href={withView(searchParams, "kanban")} active={view === "kanban"}><GripVertical className="h-4 w-4" /> Kanban</ViewTab>
      </div>

      {manualOpen && (
        <form onSubmit={submitManual} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
          <div>
            <h2 className="font-medium text-neutral-900">Cadastro manual</h2>
            <p className="text-xs text-neutral-500">Use somente para uma conversa recebida. Nenhum evento é enviado ao GA4.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Nome *"><input required value={manual.nome} onChange={(e) => setManual({ ...manual, nome: e.target.value })} className={INPUT_CLASS} /></Field>
            <Field label="Telefone"><input value={manual.telefone} onChange={(e) => { setManual({ ...manual, telefone: e.target.value }); setConfirmDuplicate(false); }} className={INPUT_CLASS} /></Field>
            <Field label="Email"><input type="email" value={manual.email} onChange={(e) => { setManual({ ...manual, email: e.target.value }); setConfirmDuplicate(false); }} className={INPUT_CLASS} /></Field>
            <Field label="Canal">
              <select value={manual.canal} onChange={(e) => setManual({ ...manual, canal: e.target.value as ManualLeadInput["canal"] })} className={INPUT_CLASS}>
                <option value="whatsapp">WhatsApp</option><option value="telefone">Telefone</option><option value="email">Email</option><option value="indicacao">Indicação</option><option value="manual">Outro</option>
              </select>
            </Field>
            <Field label="Segmento">
              <select value={manual.segmento} onChange={(e) => setManual({ ...manual, segmento: e.target.value as ManualLeadInput["segmento"] })} className={INPUT_CLASS}>
                <option value="nao_definido">Não definido</option><option value="residencial">Residencial</option><option value="comercial">Comercial</option>
              </select>
            </Field>
            <Field label="Próxima ação"><input type="datetime-local" value={manual.proximaAcaoEm || ""} onChange={(e) => setManual({ ...manual, proximaAcaoEm: e.target.value })} className={INPUT_CLASS} /></Field>
          </div>
          <Field label="Nota inicial"><textarea value={manual.mensagem} onChange={(e) => setManual({ ...manual, mensagem: e.target.value })} className={`${INPUT_CLASS} min-h-20 py-2`} /></Field>
          {duplicates.length > 0 && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-medium">Possível duplicidade encontrada:</p>
              {duplicates.map((lead) => <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="mt-1 block underline">{lead.nome} · {lead.email || lead.telefone}</Link>)}
              <p className="mt-2 text-xs">Revise os registros. Clique novamente em “Salvar mesmo assim” para preservar este contato separado.</p>
            </div>
          )}
          <button disabled={pendingLeadId === "manual"} className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50">
            {pendingLeadId === "manual" ? "Salvando…" : confirmDuplicate ? "Salvar mesmo assim" : "Verificar e salvar"}
          </button>
        </form>
      )}

      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>}

      <button type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((value) => !value)} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-sm font-medium md:hidden"><SlidersHorizontal className="h-4 w-4" /> {filtersOpen ? "Ocultar filtros" : "Filtrar leads"}</button>

      <form className={`${filtersOpen ? "grid" : "hidden"} gap-3 rounded-lg border border-neutral-200 bg-white p-4 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5`}>
        <input type="hidden" name="view" value={view} />
        <input name="q" defaultValue={searchParams.get("q") || ""} placeholder="Nome, telefone ou email" className={`${INPUT_CLASS} md:col-span-2`} />
        <FilterSelect name="status" label="Todos os status" options={STATUS} current={searchParams.get("status")} />
        <FilterSelect name="canal" label="Todos os canais" options={[{value:"form",label:"Formulário"},{value:"whatsapp",label:"WhatsApp"},{value:"telefone",label:"Telefone"},{value:"email",label:"Email"},{value:"indicacao",label:"Indicação"},{value:"manual",label:"Manual"}]} current={searchParams.get("canal")} />
        <FilterSelect name="segmento" label="Todos os segmentos" options={[{value:"residencial",label:"Residencial"},{value:"comercial",label:"Comercial"},{value:"nao_definido",label:"Não definido"}]} current={searchParams.get("segmento")} />
        <FilterSelect name="prioridade" label="Toda prioridade" options={[{value:"urgente",label:"Urgente"},{value:"alta",label:"Alta"},{value:"normal",label:"Normal"}]} current={searchParams.get("prioridade")} />
        <FilterSelect name="responsavel" label="Toda a equipe" options={responsibles.map((item) => ({ value: item.id, label: item.nome }))} current={searchParams.get("responsavel")} />
        <FilterSelect name="periodo" label="Todo período" options={[{value:"7",label:"7 dias"},{value:"28",label:"28 dias"},{value:"90",label:"90 dias"}]} current={searchParams.get("periodo")} />
        <label className="flex items-center gap-2 text-xs text-neutral-600"><input type="checkbox" name="vencida" value="1" defaultChecked={searchParams.get("vencida") === "1"} /> Ação vencida</label>
        <label className="flex items-center gap-2 text-xs text-neutral-600"><input type="checkbox" name="semResponsavel" value="1" defaultChecked={searchParams.get("semResponsavel") === "1"} /> Sem responsável</label>
        <label className="flex items-center gap-2 text-xs text-neutral-600"><input type="checkbox" name="semAcao" value="1" defaultChecked={searchParams.get("semAcao") === "1"} /> Sem próxima ação</label>
        <label className="flex items-center gap-2 text-xs text-neutral-600"><input type="checkbox" name="arquivados" value="1" defaultChecked={searchParams.get("arquivados") === "1"} /> Arquivados</label>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-300 text-sm font-medium hover:bg-neutral-50"><RefreshCw className="h-4 w-4" /> Aplicar</button>
        <Link href={`?view=${view}`} className="inline-flex h-10 items-center justify-center text-sm text-neutral-600 underline-offset-4 hover:underline">Limpar filtros</Link>
      </form>

      {view === "kanban" ? (
        <>
          {total > leads.length && <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">O Kanban mostra os {leads.length} leads mais recentes deste filtro. Refine a busca para operar os demais.</p>}
          <LeadKanban leads={leads} pendingLeadId={pendingLeadId} onStatusChange={changeStatus} />
        </>
      ) : (
        <LeadInbox leads={leads} pendingLeadId={pendingLeadId} onStatusChange={changeStatus} />
      )}

      {view === "inbox" && <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>{total} registro{total === 1 ? "" : "s"}</span>
        <div className="flex items-center gap-3"><PageLink page={page - 1} disabled={page <= 1}><ChevronLeft className="h-4 w-4" /> Anterior</PageLink><span>{page} / {Math.max(pageCount, 1)}</span><PageLink page={page + 1} disabled={page >= pageCount}>Próxima <ChevronRight className="h-4 w-4" /></PageLink></div>
      </div>}

      {disqualifying && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDisqualifying(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="disqualify-title" className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h2 id="disqualify-title" className="font-semibold text-neutral-900">Desqualificar lead</h2>
            <p className="mt-1 text-sm text-neutral-500">Registre o motivo para manter o histórico comercial útil.</p>
            <textarea autoFocus value={disqualifying.reason} onChange={(event) => setDisqualifying({ ...disqualifying, reason: event.target.value })} className={`${INPUT_CLASS} mt-4 min-h-24 py-2`} placeholder="Ex.: região não atendida ou prazo incompatível" />
            <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setDisqualifying(null)} className="rounded-md border border-neutral-300 px-3 py-2 text-sm">Cancelar</button><button type="button" disabled={!disqualifying.reason.trim()} onClick={() => { commitStatus(disqualifying.id, "desqualificado", disqualifying.reason.trim()); setDisqualifying(null); }} className="rounded-md bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-40">Confirmar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="flex items-baseline gap-2"><span className="text-xs text-neutral-500">{label}</span><strong className="font-semibold text-neutral-900">{value}</strong></div>;
}

function ViewTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${active ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-900"}`}>{children}</Link>;
}

function withView(params: URLSearchParams, view: "inbox" | "kanban"): string {
  const next = new URLSearchParams(params.toString());
  next.set("view", view);
  next.delete("page");
  return `?${next.toString()}`;
}

function priorityMeta(priority: LeadPriority) {
  if (priority === "urgente") return { label: "Urgente", className: "border-red-300 bg-red-50 text-red-800" };
  if (priority === "alta") return { label: "Alta", className: "border-amber-300 bg-amber-50 text-amber-800" };
  return { label: "Normal", className: "border-neutral-200 bg-neutral-50 text-neutral-600" };
}

function LeadInbox({ leads, pendingLeadId, onStatusChange }: { leads: AnalyticsLead[]; pendingLeadId: string | null; onStatusChange: (id: string, status: LeadStatus) => void }) {
  return <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
    <div className="hidden grid-cols-[1fr_1.4fr_.75fr_.85fr_.8fr_.25fr] gap-4 border-b bg-neutral-50 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500 lg:grid">
      <span>Contato</span><span>Situação</span><span>Responsável</span><span>Próxima ação</span><span>Status</span><span />
    </div>
    {leads.length === 0 ? <p className="px-4 py-10 text-center text-sm text-neutral-500">Nenhum lead corresponde aos filtros.</p> : leads.map((lead) => {
      const priority = priorityMeta(lead.prioridade);
      const overdue = Boolean(lead.proxima_acao_em && new Date(lead.proxima_acao_em) < new Date());
      return <article key={lead.id} className="grid gap-4 border-b px-4 py-4 text-sm last:border-0 lg:grid-cols-[1fr_1.4fr_.75fr_.85fr_.8fr_.25fr] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2"><p className="truncate font-semibold text-neutral-900">{lead.nome}</p>{!lead.visualizado_em && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" title="Não visualizado" />}</div>
          <p className="truncate text-xs text-neutral-500">{lead.email || lead.telefone || "Sem contato"}</p>
          <div className="mt-2 flex gap-2 lg:hidden"><span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${priority.className}`}>{priority.label}</span>{lead.artifact_count > 0 && <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500"><FileText className="h-3 w-3" />{lead.artifact_count}</span>}</div>
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm text-neutral-800">{lead.resumo_status || "Sem atualização operacional"}</p>
          <div className="mt-1 hidden items-center gap-2 lg:flex"><span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${priority.className}`}>{priority.label}</span>{lead.artifact_count > 0 && <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500"><FileText className="h-3 w-3" />{lead.artifact_count}</span>}</div>
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs text-neutral-600"><UserRound className="h-3.5 w-3.5" />{lead.responsavel?.nome || "Sem responsável"}</p>
        <p className={`inline-flex items-center gap-1.5 text-xs ${overdue ? "font-semibold text-red-700" : "text-neutral-600"}`}><Clock3 className="h-3.5 w-3.5" />{lead.proxima_acao_em ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(lead.proxima_acao_em)) : "Não agendada"}</p>
        <select value={lead.status} onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)} disabled={pendingLeadId !== null} className={`${INPUT_CLASS} h-9 text-xs`} aria-label={`Status de ${lead.nome}`}>{STATUS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select>
        <Link href={`/admin/leads/${lead.id}`} className="text-sm font-medium underline underline-offset-4">Abrir</Link>
      </article>;
    })}
  </div>;
}

function LeadKanban({ leads, pendingLeadId, onStatusChange }: { leads: AnalyticsLead[]; pendingLeadId: string | null; onStatusChange: (id: string, status: LeadStatus) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor));
  const leadById = useMemo(() => new Map(leads.map((lead) => [lead.id, lead])), [leads]);
  function handleDragEnd(event: DragEndEvent) {
    const lead = leadById.get(String(event.active.id));
    const target = event.over?.id as LeadStatus | undefined;
    if (lead && target && STATUS.some((status) => status.value === target) && lead.status !== target) onStatusChange(lead.id, target);
  }
  return <div className="overflow-x-auto pb-2">
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid min-w-[1380px] grid-cols-6 gap-3">
        {STATUS.map((status) => <KanbanColumn key={status.value} status={status} leads={leads.filter((lead) => lead.status === status.value)} pendingLeadId={pendingLeadId} onStatusChange={onStatusChange} />)}
      </div>
    </DndContext>
  </div>;
}

function KanbanColumn({ status, leads, pendingLeadId, onStatusChange }: { status: { value: LeadStatus; label: string }; leads: AnalyticsLead[]; pendingLeadId: string | null; onStatusChange: (id: string, status: LeadStatus) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.value });
  return <section ref={setNodeRef} className={`min-h-[360px] rounded-lg border p-3 transition-colors ${isOver ? "border-neutral-900 bg-neutral-100" : "border-neutral-200 bg-neutral-50"}`}>
    <div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">{status.label}</h2><span className="rounded-full bg-white px-2 py-0.5 text-xs text-neutral-500">{leads.length}</span></div>
    <div className="space-y-2">{leads.map((lead) => <KanbanCard key={lead.id} lead={lead} disabled={pendingLeadId !== null} onStatusChange={onStatusChange} />)}</div>
  </section>;
}

function KanbanCard({ lead, disabled, onStatusChange }: { lead: AnalyticsLead; disabled: boolean; onStatusChange: (id: string, status: LeadStatus) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id, data: { status: lead.status }, disabled });
  const priority = priorityMeta(lead.prioridade);
  return <article ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }} className={`rounded-md border border-neutral-200 bg-white p-3 shadow-sm ${isDragging ? "z-20 opacity-70 shadow-lg" : ""}`}>
    <div className="flex items-start justify-between gap-2"><Link href={`/admin/leads/${lead.id}`} className="line-clamp-2 text-sm font-semibold text-neutral-900 hover:underline">{lead.nome}</Link><button type="button" aria-label={`Mover ${lead.nome}`} className="cursor-grab touch-none rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700" {...listeners} {...attributes}><GripVertical className="h-4 w-4" /></button></div>
    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-neutral-600">{lead.resumo_status || "Sem atualização operacional"}</p>
    <div className="mt-3 flex items-center justify-between gap-2"><span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${priority.className}`}>{priority.label}</span><span className="truncate text-[10px] text-neutral-500">{lead.responsavel?.nome || "Sem responsável"}</span></div>
    <select value={lead.status} onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)} disabled={disabled} className={`${INPUT_CLASS} mt-3 h-8 text-[11px]`} aria-label={`Mover ${lead.nome} para outra etapa`}>{STATUS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
  </article>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-1 text-xs font-medium text-neutral-700"><span>{label}</span>{children}</label>;
}

function FilterSelect({ name, label, options, current }: { name: string; label: string; options: Array<{value:string;label:string}>; current: string | null }) {
  return <select name={name} defaultValue={current || ""} className={INPUT_CLASS}><option value="">{label}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>;
}

function PageLink({ page, disabled, children }: { page: number; disabled: boolean; children: React.ReactNode }) {
  const params = useSearchParams();
  const next = new URLSearchParams(params.toString());
  next.set("page", String(page));
  if (disabled) return <span className="inline-flex items-center gap-1 opacity-40">{children}</span>;
  return <Link href={`?${next.toString()}`} className="inline-flex items-center gap-1 hover:text-neutral-900">{children}</Link>;
}

export interface LeadActivity {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
  user_name: string | null;
}

export interface LinkedCommercialRecord {
  id: string;
  label: string;
  status: string;
  href: string | null;
}

export interface LeadContextLinks {
  post: { label: string; href: string } | null;
  pauta: { label: string; href: string } | null;
}

export function LeadDetail({
  lead,
  activities,
  budgets,
  proposals,
  artifacts,
  responsibles,
  contextLinks,
}: {
  lead: AnalyticsLead;
  activities: LeadActivity[];
  budgets: LinkedCommercialRecord[];
  proposals: LinkedCommercialRecord[];
  artifacts: LeadArtifact[];
  responsibles: LeadResponsible[];
  contextLinks: LeadContextLinks;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [reason, setReason] = useState(lead.motivo_desqualificacao || "");
  const [note, setNote] = useState("");
  const [activityType, setActivityType] = useState<"nota" | "contato">("contato");
  const [nextAction, setNextAction] = useState(isoToLocalInput(lead.proxima_acao_em));
  const [priority, setPriority] = useState<LeadPriority>(lead.prioridade);
  const [responsibleId, setResponsibleId] = useState(lead.responsavel_id || "");
  const [summary, setSummary] = useState(lead.resumo_status || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!lead.visualizado_em) void markLeadViewed(lead.id);
  }, [lead.id, lead.visualizado_em]);

  function run(action: () => Promise<{ ok: boolean; error?: string }>, onSuccess?: () => void) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error || "Não foi possível concluir a ação.");
        return;
      }
      onSuccess?.();
      setSuccess("Alterações salvas.");
      router.refresh();
    });
  }

  const phoneDigits = lead.telefone?.replace(/\D/g, "") || "";
  const utmEntries = Object.entries(lead.utm || {}).filter(([, value]) => value);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/leads" className="text-sm text-neutral-500 hover:text-neutral-900">← Voltar para leads</Link>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-900">{lead.nome}</h1>
          <p className="text-sm text-neutral-500">Recebido em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.criado_em))}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lead.telefone && <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"><Phone className="h-4 w-4" /> Ligar</a>}
          {lead.telefone && <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
          {lead.email && <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium"><Mail className="h-4 w-4" /> Email</a>}
        </div>
      </div>

      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Contato e contexto</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <Info label="Telefone" value={lead.telefone} /><Info label="Email" value={lead.email} />
              <Info label="Segmento" value={lead.segmento.replace("nao_definido", "não definido")} /><Info label="Canal" value={lead.canal} />
              <Info label="Tipo de projeto" value={lead.tipo_projeto} /><Info label="Empresa / cargo" value={[lead.empresa, lead.cargo].filter(Boolean).join(" · ") || null} />
              <Info label="Página de conversão" value={lead.pagina_origem} /><Info label="Landing page" value={lead.landing_page} />
              <Info label="CTA" value={lead.cta_location} />
              <div className="min-w-0"><dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">Post / pauta</dt><dd className="mt-1 space-y-1 text-sm">{contextLinks.post && <Link href={contextLinks.post.href} className="block break-words text-neutral-800 underline">{contextLinks.post.label}</Link>}{contextLinks.pauta && <Link href={contextLinks.pauta.href} className="block break-words text-neutral-800 underline">{contextLinks.pauta.label}</Link>}{!contextLinks.post && !contextLinks.pauta && "—"}</dd></div>
              <Info label="Referrer" value={lead.referrer} /><Info label="UTMs" value={utmEntries.map(([key, value]) => `${key}: ${value}`).join(" · ") || null} />
            </dl>
            {lead.mensagem && <p className="mt-5 whitespace-pre-wrap rounded-md bg-neutral-50 p-4 text-sm text-neutral-700">{lead.mensagem}</p>}
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Linha do tempo</h2>
            <form className="mt-4 grid gap-3" onSubmit={(event) => { event.preventDefault(); run(() => registerLeadActivity(lead.id, activityType, note), () => setNote("")); }}>
              <select value={activityType} onChange={(event) => setActivityType(event.target.value as "nota" | "contato")} className={INPUT_CLASS}><option value="contato">Contato realizado</option><option value="nota">Nota</option></select>
              <textarea required value={note} onChange={(event) => setNote(event.target.value)} placeholder="Registre o resultado do contato ou uma nota operacional" className={`${INPUT_CLASS} min-h-24 py-2`} />
              <button disabled={isPending} className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50">Registrar atividade</button>
            </form>
            <ol className="mt-6 space-y-4 border-l border-neutral-200 pl-5">
              {activities.length === 0 ? <li className="text-sm text-neutral-500">Nenhuma atividade registrada.</li> : activities.map((activity) => (
                <li key={activity.id} className="relative text-sm"><span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full bg-neutral-900" /><p className="font-medium text-neutral-900">{activity.action}</p><p className="text-xs text-neutral-500">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(activity.created_at))} · {activity.user_name || "Admin"}</p>{typeof activity.details?.nota === "string" && <p className="mt-1 whitespace-pre-wrap text-neutral-700">{activity.details.nota}</p>}</li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Situação atual</h2>
            <div className="mt-4 space-y-3">
              <Field label="Último status"><textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={500} placeholder="Resumo curto que aparece na inbox e no Kanban" className={`${INPUT_CLASS} min-h-24 py-2`} /></Field>
              <div className="grid grid-cols-2 gap-3"><Field label="Responsável"><select value={responsibleId} onChange={(event) => setResponsibleId(event.target.value)} className={INPUT_CLASS}><option value="">Sem responsável</option>{responsibles.map((item) => <option key={item.id} value={item.id} disabled={!item.ativo}>{item.nome}{item.ativo ? "" : " (inativo)"}</option>)}</select></Field><Field label="Prioridade"><select value={priority} onChange={(event) => setPriority(event.target.value as LeadPriority)} className={INPUT_CLASS}><option value="normal">Normal</option><option value="alta">Alta</option><option value="urgente">Urgente</option></select></Field></div>
              <button disabled={isPending} onClick={() => run(() => updateLeadOperations(lead.id, { responsavelId: responsibleId || undefined, prioridade: priority, resumoStatus: summary }))} className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50">Salvar situação</button>
              <div className="border-t border-neutral-200 pt-3" />
              <Field label="Status"><select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)} className={INPUT_CLASS}>{STATUS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
              {status === "desqualificado" && <Field label="Motivo obrigatório"><textarea required value={reason} onChange={(event) => setReason(event.target.value)} className={`${INPUT_CLASS} min-h-20 py-2`} /></Field>}
              <button disabled={isPending || (status === "desqualificado" && !reason.trim())} onClick={() => run(() => updateLeadStatus(lead.id, status, reason))} className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50">Salvar status</button>
              <Field label="Próxima ação"><div className="flex gap-2"><input type="datetime-local" value={nextAction} onChange={(event) => setNextAction(event.target.value)} className={INPUT_CLASS} /><button onClick={() => run(() => setLeadNextAction(lead.id, localInputToIso(nextAction)))} className="rounded-md border border-neutral-300 px-3 text-sm">Salvar</button></div></Field>
            </div>
          </section>

          <LeadArtifacts leadId={lead.id} artifacts={artifacts} onError={setError} onSuccess={(message) => { setSuccess(message); router.refresh(); }} />

          <CommercialLinks title="Orçamentos" records={budgets} empty="Nenhum orçamento vinculado." />
          <CommercialLinks title="Propostas" records={proposals} empty="Nenhuma proposta vinculada." />
          <Link href={`/admin/orcamentos/novo/form?lead=${lead.id}`} className="block rounded-md bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white">Criar orçamento</Link>
          <button disabled={isPending} onClick={() => run(() => setLeadArchived(lead.id, !lead.arquivado_em), () => router.push("/admin/leads"))} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"><Archive className="h-4 w-4" /> {lead.arquivado_em ? "Reabrir lead" : "Arquivar lead"}</button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return <div className="min-w-0"><dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</dt><dd className="mt-1 break-words capitalize text-neutral-800">{value || "—"}</dd></div>;
}

function CommercialLinks({ title, records, empty }: { title: string; records: LinkedCommercialRecord[]; empty: string }) {
  return <section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="font-medium text-neutral-900">{title}</h2><div className="mt-3 space-y-2">{records.length === 0 ? <p className="text-sm text-neutral-500">{empty}</p> : records.map((record) => record.href ? <Link key={record.id} href={record.href} className="flex justify-between text-sm underline"><span>{record.label}</span><span>{record.status}</span></Link> : <div key={record.id} className="flex justify-between text-sm"><span>{record.label}</span><span>{record.status}</span></div>)}</div></section>;
}

function LeadArtifacts({
  leadId,
  artifacts,
  onError,
  onSuccess,
}: {
  leadId: string;
  artifacts: LeadArtifact[];
  onError: (message: string | null) => void;
  onSuccess: (message: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [linkType, setLinkType] = useState<"drive_folder" | "external_link">("drive_folder");
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function uploadFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    const form = event.currentTarget;
    onError(null);
    setBusyId("upload");
    let artifactId: string | undefined;
    try {
      const prepared = await prepareLeadUpload(leadId, {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      artifactId = prepared.id;
      if (!prepared.ok || !artifactId || !prepared.upload) {
        throw new Error(prepared.error || "Não foi possível preparar o upload.");
      }
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("lead-files")
        .uploadToSignedUrl(prepared.upload.path, prepared.upload.token, file, {
          contentType: file.type,
        });
      if (uploadError) throw uploadError;
      const finalized = await finalizeLeadUpload(artifactId);
      if (!finalized.ok) throw new Error(finalized.error || "Não foi possível confirmar o upload.");
      setFile(null);
      form.reset();
      onSuccess("Arquivo enviado com segurança.");
    } catch (uploadError) {
      if (artifactId) await cancelLeadUpload(artifactId);
      onError(uploadError instanceof Error ? uploadError.message : "Falha ao enviar o arquivo.");
    } finally {
      setBusyId(null);
    }
  }

  async function addExternalLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onError(null);
    setBusyId("link");
    const result = await createLeadExternalArtifact(leadId, linkType, linkName, linkUrl);
    setBusyId(null);
    if (!result.ok) {
      onError(result.error || "Não foi possível vincular o arquivo.");
      return;
    }
    setLinkName("");
    setLinkUrl("");
    onSuccess("Vínculo adicionado ao lead.");
  }

  async function openArtifact(artifact: LeadArtifact) {
    setBusyId(artifact.id);
    onError(null);
    const result = await getLeadArtifactUrl(artifact.id);
    setBusyId(null);
    if (!result.ok || !result.url) {
      onError(result.error || "Não foi possível abrir o arquivo.");
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  async function removeArtifact(artifact: LeadArtifact) {
    if (!window.confirm(`Remover “${artifact.nome}” deste lead?`)) return;
    setBusyId(artifact.id);
    onError(null);
    const result = await deleteLeadArtifact(artifact.id);
    setBusyId(null);
    if (!result.ok) {
      onError(result.error || "Não foi possível remover o arquivo.");
      return;
    }
    onSuccess("Arquivo removido do lead.");
  }

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-medium text-neutral-900">Arquivos e links</h2>
          <p className="mt-1 text-xs text-neutral-500">Anexos pequenos ficam no Supabase. Pastas e arquivos maiores permanecem no Drive.</p>
        </div>
        <span className="text-xs tabular-nums text-neutral-400">{artifacts.length}</span>
      </div>

      <div className="mt-4 space-y-2">
        {artifacts.length === 0 ? <p className="rounded-md bg-neutral-50 px-3 py-4 text-sm text-neutral-500">Nenhum arquivo vinculado.</p> : artifacts.map((artifact) => (
          <div key={artifact.id} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3">
            {artifact.tipo === "drive_folder" ? <FolderOpen className="h-4 w-4 shrink-0 text-neutral-500" /> : artifact.tipo === "upload" ? <FileText className="h-4 w-4 shrink-0 text-neutral-500" /> : <Link2 className="h-4 w-4 shrink-0 text-neutral-500" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-800">{artifact.nome}</p>
              <p className="text-[11px] text-neutral-500">{artifact.estado === "pending" ? "Upload pendente" : artifact.tipo === "upload" && artifact.size_bytes ? `${(artifact.size_bytes / 1024 / 1024).toFixed(1)} MB` : artifact.tipo === "drive_folder" ? "Pasta do Drive" : "Link externo"}</p>
            </div>
            <button type="button" disabled={busyId === artifact.id || artifact.estado === "pending"} onClick={() => openArtifact(artifact)} className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-40" aria-label={`Abrir ${artifact.nome}`}><ExternalLink className="h-4 w-4" /></button>
            <button type="button" disabled={busyId === artifact.id} onClick={() => removeArtifact(artifact)} className="rounded p-2 text-neutral-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40" aria-label={`Remover ${artifact.nome}`}><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      <details className="mt-4 border-t border-neutral-200 pt-4">
        <summary className="cursor-pointer text-sm font-medium text-neutral-800">Adicionar arquivo ou link</summary>
        <div className="mt-4 grid gap-5">
          <form onSubmit={uploadFile} className="space-y-3">
            <Field label="Upload direto (até 6 MB)"><input type="file" accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png,.webp" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:font-medium" /></Field>
            <button disabled={!file || busyId !== null} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40"><Upload className="h-4 w-4" /> {busyId === "upload" ? "Enviando…" : "Enviar arquivo"}</button>
          </form>
          <form onSubmit={addExternalLink} className="grid gap-3 border-t border-neutral-200 pt-4">
            <div className="grid gap-3 sm:grid-cols-[.8fr_1.2fr]"><Field label="Tipo"><select value={linkType} onChange={(event) => setLinkType(event.target.value as "drive_folder" | "external_link")} className={INPUT_CLASS}><option value="drive_folder">Pasta do Drive</option><option value="external_link">Outro link</option></select></Field><Field label="Nome"><input required value={linkName} onChange={(event) => setLinkName(event.target.value)} maxLength={180} className={INPUT_CLASS} placeholder="Ex.: documentos da obra" /></Field></div>
            <Field label="URL HTTPS"><input required type="url" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} className={INPUT_CLASS} placeholder="https://drive.google.com/…" /></Field>
            <button disabled={busyId !== null} className="inline-flex w-fit items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40"><Link2 className="h-4 w-4" /> {busyId === "link" ? "Vinculando…" : "Vincular"}</button>
          </form>
        </div>
      </details>
    </section>
  );
}
