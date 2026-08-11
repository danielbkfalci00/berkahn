"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  createLeadResponsible,
  setLeadResponsibleActive,
} from "@/app/admin/leads/actions";
import type { LeadResponsible } from "@/types/analytics";

const INPUT_CLASS = "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200";

export function LeadResponsibleSettings({ initialResponsibles }: { initialResponsibles: LeadResponsible[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function addResponsible(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusyId("new");
    const result = await createLeadResponsible(name);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error || "Não foi possível cadastrar o responsável.");
      return;
    }
    setName("");
    router.refresh();
  }

  async function toggleResponsible(responsible: LeadResponsible) {
    setError(null);
    setBusyId(responsible.id);
    const result = await setLeadResponsibleActive(responsible.id, !responsible.ativo);
    setBusyId(null);
    if (!result.ok) {
      setError(result.error || "Não foi possível atualizar o responsável.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <form onSubmit={addResponsible} className="flex flex-col gap-2 sm:flex-row">
        <input required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className={INPUT_CLASS} placeholder="Nome do responsável" />
        <button disabled={busyId !== null} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"><Plus className="h-4 w-4" /> Adicionar</button>
      </form>
      <div className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
        {initialResponsibles.length === 0 ? <p className="p-4 text-sm text-neutral-500">Nenhum responsável cadastrado.</p> : initialResponsibles.map((responsible) => (
          <div key={responsible.id} className="flex items-center justify-between gap-3 p-3">
            <div><p className="text-sm font-medium text-neutral-900">{responsible.nome}</p><p className="text-xs text-neutral-500">{responsible.ativo ? "Disponível para novos leads" : "Inativo — mantido no histórico"}</p></div>
            <button type="button" disabled={busyId !== null} onClick={() => toggleResponsible(responsible)} className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium disabled:opacity-40">{responsible.ativo ? "Desativar" : "Reativar"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
