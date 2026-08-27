"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MailPlus, Save } from "lucide-react";
import { inviteAdminMember, updateAdminMember } from "@/app/admin/configuracoes/actions";
import { ADMIN_ROLE_LABELS, ADMIN_ROLES } from "@/lib/admin/access";
import type { AdminRole, LeadResponsible } from "@/types/analytics";

const INPUT_CLASS = "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200";

export function LeadResponsibleSettings({ initialResponsibles, canManage }: { initialResponsibles: LeadResponsible[]; canManage: boolean }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("comercial");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await inviteAdminMember({ nome, email, role });
      if (!result.ok) return setError(result.error || "Não foi possível enviar o convite.");
      setNome("");
      setEmail("");
      setRole("comercial");
      setMessage("Convite enviado. A pessoa definirá a senha pelo email.");
      router.refresh();
    });
  }

  function save(member: LeadResponsible, changes: { role: AdminRole; ativo: boolean; recebeLeads: boolean }) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await updateAdminMember({ id: member.id, ...changes });
      if (!result.ok) return setError(result.error || "Não foi possível atualizar o membro.");
      setMessage("Equipe atualizada.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      {canManage && <form onSubmit={invite} className="grid gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-2">
        <label className="space-y-1 text-xs font-medium text-neutral-700"><span>Nome</span><input required minLength={2} maxLength={80} value={nome} onChange={(event) => setNome(event.target.value)} className={INPUT_CLASS} /></label>
        <label className="space-y-1 text-xs font-medium text-neutral-700"><span>Email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={INPUT_CLASS} /></label>
        <label className="space-y-1 text-xs font-medium text-neutral-700"><span>Papel</span><select value={role} onChange={(event) => setRole(event.target.value as AdminRole)} className={INPUT_CLASS}>{ADMIN_ROLES.map((item) => <option key={item} value={item}>{ADMIN_ROLE_LABELS[item]}</option>)}</select></label>
        <button disabled={pending} className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 text-sm font-medium text-white disabled:opacity-40"><MailPlus className="h-4 w-4" />Convidar por email</button>
      </form>}
      <div className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
        {initialResponsibles.length === 0 ? <p className="p-4 text-sm text-neutral-500">Nenhum membro cadastrado.</p> : initialResponsibles.map((member) => <MemberRow key={member.id} member={member} canManage={canManage} pending={pending} onSave={save} />)}
      </div>
    </div>
  );
}

function MemberRow({ member, canManage, pending, onSave }: {
  member: LeadResponsible;
  canManage: boolean;
  pending: boolean;
  onSave: (member: LeadResponsible, changes: { role: AdminRole; ativo: boolean; recebeLeads: boolean }) => void;
}) {
  const [role, setRole] = useState<AdminRole>(member.role || "comercial");
  const [ativo, setAtivo] = useState(member.ativo);
  const [recebeLeads, setRecebeLeads] = useState(member.recebe_leads ?? true);
  const commercialRole = role === "owner" || role === "comercial";
  return <div className="grid gap-3 p-4 md:grid-cols-[1.4fr_.9fr_auto_auto] md:items-center">
    <div className="min-w-0"><p className="truncate text-sm font-medium text-neutral-900">{member.nome}</p><p className="truncate text-xs text-neutral-500">{member.email || "Responsável sem conta de acesso"}</p></div>
    <select disabled={!canManage || pending} value={role} onChange={(event) => setRole(event.target.value as AdminRole)} className={INPUT_CLASS} aria-label={`Papel de ${member.nome}`}>{ADMIN_ROLES.map((item) => <option key={item} value={item}>{ADMIN_ROLE_LABELS[item]}</option>)}</select>
    <label className="flex items-center gap-2 text-xs text-neutral-600"><input type="checkbox" checked={recebeLeads} disabled={!canManage || pending || !commercialRole} onChange={(event) => setRecebeLeads(event.target.checked)} />Recebe leads</label>
    {canManage ? <button type="button" disabled={pending} onClick={() => onSave(member, { role, ativo, recebeLeads })} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-300 px-3 text-xs font-medium disabled:opacity-40"><Save className="h-3.5 w-3.5" />Salvar</button> : <span className="text-xs text-neutral-500">{ADMIN_ROLE_LABELS[role]}</span>}
    {canManage && <label className="flex items-center gap-2 text-xs text-neutral-600 md:col-start-3"><input type="checkbox" checked={ativo} disabled={pending} onChange={(event) => setAtivo(event.target.checked)} />Acesso ativo</label>}
  </div>;
}
