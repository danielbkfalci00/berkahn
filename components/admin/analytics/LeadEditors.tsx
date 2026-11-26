"use client";

import { useEffect, useRef, useState } from "react";
import { updateLeadContact, type LeadContactInput, type LeadPreviewDetails } from "@/app/admin/leads/actions";
import type { LeadPriority, LeadResponsible, LeadSegment } from "@/types/analytics";

// Editores inline compartilhados pelo card do Kanban e pela prévia do lead.
// Campos operacionais salvam ao sair do campo (blur/change); contato salva
// por botão, porque a validação cruza nome, telefone e email.

export const PRIORITY_OPTIONS: Array<{ value: LeadPriority; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
];

const PRIORITY_CLASS: Record<LeadPriority, string> = {
  urgente: "border-red-300 bg-red-50 text-red-800",
  alta: "border-amber-300 bg-amber-50 text-amber-800",
  normal: "border-neutral-200 bg-neutral-50 text-neutral-600",
};

const SUMMARY_MAX = 500;

export function InlineSummary({ value, label, rows = 3, onSave, className = "" }: {
  value: string | null;
  label: string;
  rows?: number;
  onSave: (value: string) => Promise<boolean>;
  className?: string;
}) {
  const [draft, setDraft] = useState(value || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!isEditing) setDraft(value || "");
  }, [value, isEditing]);

  async function commit(next: string) {
    setIsEditing(false);
    if (cancelRef.current) {
      cancelRef.current = false;
      setDraft(value || "");
      return;
    }
    const trimmed = next.trim();
    if (trimmed === (value || "").trim()) return;
    setIsSaving(true);
    const ok = await onSave(trimmed);
    setIsSaving(false);
    if (!ok) setDraft(value || "");
  }

  return <div className="relative z-20">
    <textarea
      value={draft}
      rows={rows}
      maxLength={SUMMARY_MAX}
      aria-label={label}
      placeholder="Adicionar descrição…"
      onFocus={() => setIsEditing(true)}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={(event) => void commit(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          cancelRef.current = true;
          event.currentTarget.blur();
        }
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) event.currentTarget.blur();
      }}
      className={`block w-full resize-none rounded-md border border-transparent bg-transparent px-2 py-1.5 text-xs leading-relaxed text-neutral-700 placeholder:text-neutral-400 hover:border-neutral-200 hover:bg-neutral-50 focus:border-neutral-900 focus:bg-white focus:outline-none ${className}`}
    />
    {isSaving && <span role="status" className="absolute bottom-1 right-2 text-[10px] text-neutral-400">Salvando…</span>}
  </div>;
}

export function PrioritySelect({ value, label, disabled, onChange, size = "sm" }: {
  value: LeadPriority;
  label: string;
  disabled?: boolean;
  onChange: (value: LeadPriority) => void;
  size?: "sm" | "md";
}) {
  const sizing = size === "sm" ? "min-h-7 px-2 text-[10px]" : "min-h-11 px-3 text-sm";
  return <select
    value={value}
    disabled={disabled}
    aria-label={label}
    onChange={(event) => onChange(event.target.value as LeadPriority)}
    className={`relative z-20 rounded-full border font-medium focus-visible:outline-2 focus-visible:outline-neutral-900 disabled:opacity-50 ${sizing} ${PRIORITY_CLASS[value]}`}
  >
    {PRIORITY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
  </select>;
}

export function ResponsibleSelect({ value, responsibles, label, disabled, onChange, size = "sm" }: {
  value: string | null;
  responsibles: LeadResponsible[];
  label: string;
  disabled?: boolean;
  onChange: (responsible: { id: string; nome: string } | null) => void;
  size?: "sm" | "md";
}) {
  const sizing = size === "sm"
    ? "min-h-7 max-w-[9rem] border-transparent bg-transparent px-1 text-[10px] text-neutral-500 hover:border-neutral-200"
    : "min-h-11 w-full border-neutral-300 bg-white px-3 text-sm text-neutral-900";
  return <select
    value={value || ""}
    disabled={disabled}
    aria-label={label}
    onChange={(event) => {
      const found = responsibles.find((item) => item.id === event.target.value);
      onChange(found ? { id: found.id, nome: found.nome } : null);
    }}
    className={`relative z-20 truncate rounded-md border focus-visible:outline-2 focus-visible:outline-neutral-900 disabled:opacity-50 ${sizing}`}
  >
    <option value="">Sem responsável</option>
    {responsibles.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
  </select>;
}

const CONTACT_INPUT = "min-h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200";

export function LeadContactEditor({ lead, details, onSaved }: {
  lead: { id: string; nome: string; email: string | null; telefone: string | null };
  details: LeadPreviewDetails | null;
  onSaved: (patch: { nome: string; email: string | null; telefone: string | null }) => void;
}) {
  const original: LeadContactInput = {
    nome: lead.nome,
    email: lead.email || "",
    telefone: lead.telefone || "",
    segmento: (details?.segmento || "nao_definido") as LeadSegment,
    tipoProjeto: details?.tipo_projeto || "",
    empresa: details?.empresa || "",
    cargo: details?.cargo || "",
  };
  const [form, setForm] = useState(original);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; failed: boolean } | null>(null);
  const detailsLoaded = Boolean(details);

  // Os campos de segmento, projeto, empresa e cargo chegam depois, com a prévia.
  useEffect(() => {
    if (!details) return;
    setForm((current) => ({
      ...current,
      segmento: details.segmento as LeadSegment,
      tipoProjeto: details.tipo_projeto || "",
      empresa: details.empresa || "",
      cargo: details.cargo || "",
    }));
  }, [details]);

  const isDirty = detailsLoaded && JSON.stringify(form) !== JSON.stringify(original);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const result = await updateLeadContact(lead.id, form);
      if (!result.ok) throw new Error(result.error || "Não foi possível salvar o contato.");
      onSaved({ nome: form.nome.trim(), email: form.email.trim().toLowerCase() || null, telefone: form.telefone.trim() || null });
      setMessage({ text: "Contato salvo.", failed: false });
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Falha de conexão. Tente novamente.", failed: true });
    } finally {
      setIsSaving(false);
    }
  }

  const set = (key: keyof LeadContactInput) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  return <form onSubmit={save} className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <ContactField label="Nome" className="col-span-2"><input required value={form.nome} onChange={set("nome")} className={CONTACT_INPUT} /></ContactField>
      <ContactField label="Telefone"><input inputMode="tel" value={form.telefone} onChange={set("telefone")} className={CONTACT_INPUT} /></ContactField>
      <ContactField label="Email"><input type="email" value={form.email} onChange={set("email")} className={CONTACT_INPUT} /></ContactField>
      <ContactField label="Empresa"><input value={form.empresa} disabled={!detailsLoaded} onChange={set("empresa")} className={CONTACT_INPUT} /></ContactField>
      <ContactField label="Cargo"><input value={form.cargo} disabled={!detailsLoaded} onChange={set("cargo")} className={CONTACT_INPUT} /></ContactField>
      <ContactField label="Segmento">
        <select value={form.segmento} disabled={!detailsLoaded} onChange={set("segmento")} className={CONTACT_INPUT}>
          <option value="nao_definido">Não definido</option><option value="residencial">Residencial</option><option value="comercial">Comercial</option>
        </select>
      </ContactField>
      <ContactField label="Tipo de projeto"><input value={form.tipoProjeto} disabled={!detailsLoaded} onChange={set("tipoProjeto")} className={CONTACT_INPUT} /></ContactField>
    </div>
    <div className="flex items-center justify-between gap-3">
      {message ? <p role={message.failed ? "alert" : "status"} className={`text-xs ${message.failed ? "text-red-700" : "text-emerald-700"}`}>{message.text}</p> : <span />}
      <button disabled={!isDirty || isSaving} className="min-h-11 rounded-md bg-neutral-900 px-4 text-sm font-medium text-white disabled:opacity-40">{isSaving ? "Salvando…" : "Salvar contato"}</button>
    </div>
  </form>;
}

function ContactField({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={`space-y-1 text-xs font-medium text-neutral-600 ${className}`}><span>{label}</span>{children}</label>;
}
