"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { anonymizeLeadOnRequest, setLeadRetentionException } from "@/app/admin/leads/actions";
import type { AnalyticsLead } from "@/types/analytics";

// Arquivo próprio porque LeadsQueue.tsx já beira o limite de tamanho; a página
// só renderiza este painel para owner, e as actions/RPCs checam o papel de novo.
const INPUT_CLASS = "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200";

export function LeadPrivacyPanel({ lead }: { lead: AnalyticsLead }) {
  const router = useRouter();
  const retido = Boolean(lead.retencao_excecao);
  const [retencaoMotivo, setRetencaoMotivo] = useState(lead.retencao_excecao_motivo || "");
  const [pedidoMotivo, setPedidoMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error?: string }>, message: string) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error || "Não foi possível concluir a ação.");
        return;
      }
      setSuccess(message);
      router.refresh();
    });
  }

  if (lead.anonimizado_em) {
    return (
      <section className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
        <h2 className="font-medium text-neutral-900">Privacidade (LGPD)</h2>
        <p className="mt-2 text-sm text-neutral-500">Dados pessoais deste lead já foram eliminados.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
      <h2 className="font-medium text-neutral-900">Privacidade (LGPD)</h2>
      {error && <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>}

      <div className="mt-4 space-y-2">
        <p className="text-sm text-neutral-700">
          Retenção legal: <strong>{retido ? "ativa" : "inativa"}</strong>
          <span className="block text-xs text-neutral-500">Com a retenção ativa, o lead fica fora da anonimização por prazo e do pedido do titular.</span>
        </p>
        {!retido && (
          <label className="block text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">Motivo obrigatório</span>
            <textarea value={retencaoMotivo} onChange={(event) => setRetencaoMotivo(event.target.value)} maxLength={500} className={`${INPUT_CLASS} mt-1 min-h-20`} />
          </label>
        )}
        {retido && lead.retencao_excecao_motivo && <p className="text-sm text-neutral-600">Motivo: {lead.retencao_excecao_motivo}</p>}
        <button
          disabled={isPending || (!retido && !retencaoMotivo.trim())}
          onClick={() => run(
            () => setLeadRetentionException(lead.id, !retido, retido ? undefined : retencaoMotivo),
            retido ? "Retenção legal removida." : "Retenção legal ativada."
          )}
          className="min-h-11 rounded-md border border-neutral-300 px-4 text-sm disabled:opacity-50"
        >
          {retido ? "Remover retenção legal" : "Ativar retenção legal"}
        </button>
      </div>

      <div className="mt-5 space-y-2 border-t border-neutral-200 pt-4">
        <label className="block text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">Motivo do pedido do titular</span>
          <textarea value={pedidoMotivo} onChange={(event) => setPedidoMotivo(event.target.value)} maxLength={500} placeholder="Ex.: pedido por e-mail em 22/09" className={`${INPUT_CLASS} mt-1 min-h-20`} />
        </label>
        <button
          disabled={isPending || !pedidoMotivo.trim()}
          onClick={() => {
            // Irreversível: apaga PII e arquivos. Confirma como em ArquivarButton.
            if (!window.confirm(`Eliminar os dados pessoais de “${lead.nome}”? Esta ação não pode ser desfeita.`)) return;
            run(() => anonymizeLeadOnRequest(lead.id, pedidoMotivo), "Dados pessoais eliminados.");
          }}
          className="min-h-11 rounded-md bg-red-700 px-4 text-sm text-white disabled:opacity-50"
        >
          Eliminar dados a pedido do titular
        </button>
      </div>
    </section>
  );
}
