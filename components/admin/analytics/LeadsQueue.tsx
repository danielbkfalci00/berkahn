"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { retryLeadSheetSync, updateLeadStatus } from "@/app/admin/analytics/actions";
import type { AnalyticsLead, LeadStatus } from "@/types/analytics";

const STATUS: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "qualificado", label: "Qualificado" },
  { value: "desqualificado", label: "Desqualificado" },
  { value: "convertido", label: "Convertido" },
];

export function LeadsQueue({ initialLeads }: { initialLeads: AnalyticsLead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function changeStatus(id: string, status: LeadStatus) {
    const previous = leads;
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    setError(null);
    startTransition(async () => {
      const result = await updateLeadStatus(id, status);
      if (result.error) {
        setLeads(previous);
        setError(result.error);
      }
    });
  }

  function retrySync(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await retryLeadSheetSync(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLeads((current) =>
        current.map((lead) =>
          lead.id === id ? { ...lead, sheet_sync_status: "sincronizado", sheet_sync_error: null } : lead
        )
      );
    });
  }

  const qualified = leads.filter((lead) => lead.status === "qualificado" || lead.status === "convertido").length;

  return (
    <section className="space-y-4" aria-label="Leads">
      <div className="grid grid-cols-3 gap-3">
        <Metric label="Leads recentes" value={leads.length} />
        <Metric label="Qualificados" value={qualified} />
        <Metric
          label="Taxa de qualificação"
          value={leads.length ? `${Math.round((qualified / leads.length) * 100)}%` : "—"}
        />
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="grid grid-cols-[1.2fr_.8fr_.8fr_.8fr] gap-4 border-b bg-neutral-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
          <span>Contato</span>
          <span>Origem</span>
          <span>Planilha</span>
          <span>Status</span>
        </div>
        {leads.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-neutral-500">Nenhum lead registrado.</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="grid grid-cols-[1.2fr_.8fr_.8fr_.8fr] gap-4 border-b px-4 py-3 text-sm last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-neutral-900">{lead.nome}</p>
                <p className="truncate text-xs text-neutral-500">{lead.email || lead.telefone}</p>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{lead.mensagem}</p>
              </div>
              <div className="text-xs text-neutral-600">
                <p className="capitalize">{lead.segmento}</p>
                <p className="truncate">{lead.slug_origem || lead.pagina_origem || lead.canal}</p>
              </div>
              <div className="text-xs">
                {lead.sheet_sync_status === "sincronizado" ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Sincronizado
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => retrySync(lead.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 text-amber-700 hover:underline disabled:opacity-50"
                    title={lead.sheet_sync_error || "Tentar sincronizar"}
                  >
                    {lead.sheet_sync_status === "falhou" ? (
                      <AlertCircle className="h-3.5 w-3.5" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Tentar novamente
                  </button>
                )}
              </div>
              <select
                value={lead.status}
                onChange={(event) => changeStatus(lead.id, event.target.value as LeadStatus)}
                disabled={isPending}
                className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-xs"
                aria-label={`Status de ${lead.nome}`}
              >
                {STATUS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
