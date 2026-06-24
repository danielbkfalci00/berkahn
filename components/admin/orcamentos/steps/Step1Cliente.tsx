"use client"

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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Cliente</h2>
        <p className="text-sm text-neutral-500">
          Dados básicos da pessoa para quem o orçamento está sendo elaborado.
        </p>
      </div>

      <div className="space-y-4">
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
