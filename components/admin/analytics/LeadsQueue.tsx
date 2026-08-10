"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Archive, ChevronLeft, ChevronRight, Mail, MessageCircle, Phone, Plus, RefreshCw } from "lucide-react";
import {
  createManualLead,
  findLeadDuplicates,
  markLeadViewed,
  registerLeadActivity,
  resendLeadNotification,
  setLeadArchived,
  setLeadNextAction,
  updateLeadStatus,
  type ManualLeadInput,
} from "@/app/admin/leads/actions";
import type { AnalyticsLead, LeadStatus } from "@/types/analytics";

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
}

const EMPTY_MANUAL: ManualLeadInput = {
  nome: "",
  email: "",
  telefone: "",
  segmento: "nao_definido",
  canal: "whatsapp",
  mensagem: "",
};

export function LeadsQueue({ initialLeads, total, page, pageCount, kpis }: LeadsQueueProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState(initialLeads);
  const [manual, setManual] = useState<ManualLeadInput>(EMPTY_MANUAL);
  const [duplicates, setDuplicates] = useState<NonNullable<Awaited<ReturnType<typeof findLeadDuplicates>>["duplicates"]>>([]);
  const [manualOpen, setManualOpen] = useState(false);
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  function changeStatus(id: string, status: LeadStatus) {
    const reason = status === "desqualificado"
      ? window.prompt("Motivo da desqualificação (obrigatório):")?.trim()
      : undefined;
    if (status === "desqualificado" && !reason) return;
    const previous = leads;
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    setError(null);
    startTransition(async () => {
      const result = await updateLeadStatus(id, status, reason);
      if (!result.ok) {
        setLeads(previous);
        setError(result.error || "Não foi possível alterar o status.");
      } else {
        router.refresh();
      }
    });
  }

  function submitManual(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      if (!confirmDuplicate) {
        const check = await findLeadDuplicates(manual.email, manual.telefone);
        if (!check.ok) {
          setError(check.error || "Não foi possível verificar duplicados.");
          return;
        }
        if (check.duplicates?.length) {
          setDuplicates(check.duplicates);
          setConfirmDuplicate(true);
          return;
        }
      }
      const result = await createManualLead({
        ...manual,
        proximaAcaoEm: localInputToIso(manual.proximaAcaoEm),
      });
      if (!result.ok) {
        setError(result.error || "Não foi possível criar o lead.");
        return;
      }
      setManual(EMPTY_MANUAL);
      setDuplicates([]);
      setConfirmDuplicate(false);
      setManualOpen(false);
      router.push(`/admin/leads/${result.id}`);
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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Recebidos · 28d" value={kpis.received} />
        <Metric label="Novos · 28d" value={kpis.new} />
        <Metric label="Qualificados · 28d" value={kpis.qualified} />
        <Metric label="Convertidos · 28d" value={kpis.converted} />
        <Metric label="Taxa qualificação" value={qualificationRate === null ? "—" : `${qualificationRate}%`} />
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
          <button disabled={isPending} className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50">
            {isPending ? "Salvando…" : confirmDuplicate ? "Salvar mesmo assim" : "Verificar e salvar"}
          </button>
        </form>
      )}

      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 md:grid-cols-4 xl:grid-cols-8">
        <input name="q" defaultValue={searchParams.get("q") || ""} placeholder="Nome, telefone ou email" className={`${INPUT_CLASS} md:col-span-2`} />
        <FilterSelect name="status" label="Todos os status" options={STATUS} current={searchParams.get("status")} />
        <FilterSelect name="canal" label="Todos os canais" options={[{value:"form",label:"Formulário"},{value:"whatsapp",label:"WhatsApp"},{value:"telefone",label:"Telefone"},{value:"email",label:"Email"},{value:"indicacao",label:"Indicação"},{value:"manual",label:"Manual"}]} current={searchParams.get("canal")} />
        <FilterSelect name="segmento" label="Todos os segmentos" options={[{value:"residencial",label:"Residencial"},{value:"comercial",label:"Comercial"},{value:"nao_definido",label:"Não definido"}]} current={searchParams.get("segmento")} />
        <FilterSelect name="periodo" label="Todo período" options={[{value:"7",label:"7 dias"},{value:"28",label:"28 dias"},{value:"90",label:"90 dias"}]} current={searchParams.get("periodo")} />
        <label className="flex items-center gap-2 text-xs text-neutral-600"><input type="checkbox" name="vencida" value="1" defaultChecked={searchParams.get("vencida") === "1"} /> Ação vencida</label>
        <label className="flex items-center gap-2 text-xs text-neutral-600"><input type="checkbox" name="arquivados" value="1" defaultChecked={searchParams.get("arquivados") === "1"} /> Arquivados</label>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-300 text-sm font-medium hover:bg-neutral-50"><RefreshCw className="h-4 w-4" /> Aplicar</button>
      </form>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="hidden grid-cols-[1.2fr_.8fr_.8fr_.8fr_.3fr] gap-4 border-b bg-neutral-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-neutral-500 md:grid">
          <span>Contato</span><span>Origem</span><span>Próxima ação</span><span>Status</span><span />
        </div>
        {leads.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">Nenhum lead corresponde aos filtros.</p>
        ) : leads.map((lead) => (
          <div key={lead.id} className="grid gap-3 border-b px-4 py-4 text-sm last:border-0 md:grid-cols-[1.2fr_.8fr_.8fr_.8fr_.3fr] md:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2"><p className="truncate font-medium text-neutral-900">{lead.nome}</p>{!lead.visualizado_em && <span className="h-2 w-2 rounded-full bg-blue-600" title="Não visualizado" />}</div>
              <p className="truncate text-xs text-neutral-500">{lead.email || lead.telefone || "Sem contato"}</p>
            </div>
            <div className="text-xs text-neutral-600"><p className="capitalize">{lead.segmento.replace("nao_definido", "não definido")}</p><p className="truncate">{lead.slug_origem || lead.pagina_origem || lead.canal}</p></div>
            <p className={`text-xs ${lead.proxima_acao_em && new Date(lead.proxima_acao_em) < new Date() ? "font-medium text-red-700" : "text-neutral-600"}`}>{lead.proxima_acao_em ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(lead.proxima_acao_em)) : "—"}</p>
            <select value={lead.status} onChange={(event) => changeStatus(lead.id, event.target.value as LeadStatus)} disabled={isPending} className={`${INPUT_CLASS} h-9 text-xs`} aria-label={`Status de ${lead.nome}`}>{STATUS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select>
            <Link href={`/admin/leads/${lead.id}`} className="text-sm font-medium underline underline-offset-4">Abrir</Link>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>{total} registro{total === 1 ? "" : "s"}</span>
        <div className="flex items-center gap-3"><PageLink page={page - 1} disabled={page <= 1}><ChevronLeft className="h-4 w-4" /> Anterior</PageLink><span>{page} / {Math.max(pageCount, 1)}</span><PageLink page={page + 1} disabled={page >= pageCount}>Próxima <ChevronRight className="h-4 w-4" /></PageLink></div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border border-neutral-200 bg-white p-4"><p className="text-xs text-neutral-500">{label}</p><p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p></div>;
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

export function LeadDetail({
  lead,
  activities,
  budgets,
  proposals,
}: {
  lead: AnalyticsLead;
  activities: LeadActivity[];
  budgets: LinkedCommercialRecord[];
  proposals: LinkedCommercialRecord[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [reason, setReason] = useState(lead.motivo_desqualificacao || "");
  const [note, setNote] = useState("");
  const [activityType, setActivityType] = useState<"nota" | "contato">("contato");
  const [nextAction, setNextAction] = useState(isoToLocalInput(lead.proxima_acao_em));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!lead.visualizado_em) void markLeadViewed(lead.id);
  }, [lead.id, lead.visualizado_em]);

  function run(action: () => Promise<{ ok: boolean; error?: string }>, onSuccess?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error || "Não foi possível concluir a ação.");
        return;
      }
      onSuccess?.();
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Contato e contexto</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <Info label="Telefone" value={lead.telefone} /><Info label="Email" value={lead.email} />
              <Info label="Segmento" value={lead.segmento.replace("nao_definido", "não definido")} /><Info label="Canal" value={lead.canal} />
              <Info label="Tipo de projeto" value={lead.tipo_projeto} /><Info label="Empresa / cargo" value={[lead.empresa, lead.cargo].filter(Boolean).join(" · ") || null} />
              <Info label="Página de conversão" value={lead.pagina_origem} /><Info label="Landing page" value={lead.landing_page} />
              <Info label="CTA" value={lead.cta_location} /><Info label="Post / pauta" value={[lead.post_id, lead.pauta_id].filter(Boolean).join(" · ") || null} />
              <Info label="Referrer" value={lead.referrer} /><Info label="UTMs" value={utmEntries.map(([key, value]) => `${key}: ${value}`).join(" · ") || null} />
            </dl>
            {lead.mensagem && <p className="mt-5 whitespace-pre-wrap rounded-md bg-neutral-50 p-4 text-sm text-neutral-700">{lead.mensagem}</p>}
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Linha do tempo</h2>
            <form className="mt-4 grid gap-3" onSubmit={(event) => { event.preventDefault(); run(() => registerLeadActivity(lead.id, activityType, note, localInputToIso(nextAction)), () => setNote("")); }}>
              <div className="flex gap-3"><select value={activityType} onChange={(event) => setActivityType(event.target.value as "nota" | "contato")} className={INPUT_CLASS}><option value="contato">Contato realizado</option><option value="nota">Nota</option></select><input type="datetime-local" value={nextAction} onChange={(event) => setNextAction(event.target.value)} className={INPUT_CLASS} aria-label="Próxima ação" /></div>
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
            <h2 className="font-medium text-neutral-900">Funil</h2>
            <div className="mt-4 space-y-3">
              <Field label="Status"><select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)} className={INPUT_CLASS}>{STATUS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
              {status === "desqualificado" && <Field label="Motivo obrigatório"><textarea required value={reason} onChange={(event) => setReason(event.target.value)} className={`${INPUT_CLASS} min-h-20 py-2`} /></Field>}
              <button disabled={isPending || (status === "desqualificado" && !reason.trim())} onClick={() => run(() => updateLeadStatus(lead.id, status, reason))} className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50">Salvar status</button>
              <Field label="Próxima ação"><div className="flex gap-2"><input type="datetime-local" value={nextAction} onChange={(event) => setNextAction(event.target.value)} className={INPUT_CLASS} /><button onClick={() => run(() => setLeadNextAction(lead.id, localInputToIso(nextAction)))} className="rounded-md border border-neutral-300 px-3 text-sm">Salvar</button></div></Field>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="font-medium text-neutral-900">Notificação</h2>
            <p className="mt-2 text-sm text-neutral-600">{lead.sheet_sync_status === "sincronizado" ? "Email genérico enviado." : lead.sheet_sync_status === "falhou" ? `Falhou: ${lead.sheet_sync_error || "erro não informado"}` : "Pendente de envio."}</p>
            {lead.sheet_sync_status !== "sincronizado" && <button disabled={isPending} onClick={() => run(() => resendLeadNotification(lead.id))} className="mt-3 inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"><RefreshCw className="h-4 w-4" /> Reenviar notificação</button>}
          </section>

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
