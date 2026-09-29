"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { searchBudgetLeads } from "@/app/admin/orcamentos/actions"

import type { OrcamentoInsert } from "@/types/orcamento-estimativa"
import { TextField } from "../form-fields"

interface Props {
  dados: OrcamentoInsert
  erros: Record<string, string>
  onChange: <K extends keyof OrcamentoInsert>(
    field: K,
    valor: OrcamentoInsert[K]
  ) => void
}

export function Step1Cliente({ dados, erros, onChange }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchBudgetLeads>>>([])
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Cliente</h2>
        <p className="text-sm text-neutral-500">
          Dados básicos da pessoa para quem o orçamento está sendo elaborado.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 rounded-md border border-neutral-200 p-3">
          <p className="text-sm font-medium">Lead vinculado</p>
          {dados.lead_id ? <div className="flex gap-3 text-sm"><Link href={`/admin/leads/${dados.lead_id}`} className="underline">Abrir lead</Link><button type="button" onClick={() => onChange("lead_id", null)} className="underline">Remover vínculo</button></div> : <p className="text-xs text-neutral-500">Vincule ao CRM para acompanhar envio e retorno.</p>}
          <div className="flex gap-2"><input aria-label="Buscar lead por nome, email ou telefone" value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded border px-3 text-sm" placeholder="Nome, email ou telefone" /><button type="button" disabled={pending || query.trim().length < 2} className="min-h-11 rounded border px-3 text-sm disabled:opacity-50" onClick={() => startTransition(async () => { try { const found = await searchBudgetLeads(query); setResults(found); setMessage(found.length ? "" : "Nenhum lead encontrado."); } catch (error) { setMessage(error instanceof Error ? error.message : "Falha na busca."); } })}>{pending ? "Buscando…" : "Buscar"}</button></div>
          {message && <p role="status" className="text-xs text-neutral-600">{message}</p>}
          {results.map((lead) => <button key={lead.id} type="button" className="block min-h-11 w-full rounded border px-3 text-left text-sm hover:bg-neutral-50" onClick={() => { onChange("lead_id", lead.id); onChange("cliente_nome", lead.nome); onChange("cliente_email", lead.email); onChange("cliente_telefone", lead.telefone); setResults([]); setQuery(""); }}>{lead.nome} · {lead.email || lead.telefone}</button>)}
        </div>
        <TextField
          id="cliente_nome"
          label="Nome do cliente"
          value={dados.cliente_nome ?? ""}
          onChange={(v) => onChange("cliente_nome", v)}
          required
          erro={erros.cliente_nome}
          placeholder="Ex: Família Silva"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="cliente_email"
            label="E-mail"
            type="email"
            value={dados.cliente_email ?? ""}
            onChange={(v) => onChange("cliente_email", v || null)}
            erro={erros.cliente_email}
            placeholder="cliente@email.com"
          />

          <TextField
            id="cliente_telefone"
            label="Telefone"
            type="tel"
            value={dados.cliente_telefone ?? ""}
            onChange={(v) => onChange("cliente_telefone", v || null)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>
    </div>
  )
}
