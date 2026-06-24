"use client"

import type {
  OrcamentoInsert,
  PadraoAcabamento,
} from "@/types/orcamento-estimativa"
import { PADROES_ACABAMENTO } from "@/lib/orcamento-estimativa-data"
import { TextField, IntegerField, RadioPills } from "../form-fields"

interface Props {
  dados: OrcamentoInsert
  erros: Record<string, string>
  onChange: <K extends keyof OrcamentoInsert>(
    field: K,
    valor: OrcamentoInsert[K]
  ) => void
}

const PADRAO_OPTIONS = PADROES_ACABAMENTO.map((p) => ({
  id: p.id as PadraoAcabamento,
  label: p.nome,
  descricao: p.descricao,
}))

export function Step2Obra({ dados, erros, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Obra & Projeto</h2>
        <p className="text-sm text-neutral-500">
          Localização e características gerais do empreendimento.
        </p>
      </div>

      <div className="space-y-4">
        <TextField
          id="obra_endereco"
          label="Endereço da obra"
          value={dados.obra_endereco ?? ""}
          onChange={(v) => onChange("obra_endereco", v)}
          required
          erro={erros.obra_endereco}
          placeholder="Ex: Rua das Flores, 123 — Jd. Europa"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="obra_cidade"
            label="Cidade"
            value={dados.obra_cidade ?? ""}
            onChange={(v) => onChange("obra_cidade", v)}
            required
            erro={erros.obra_cidade}
            placeholder="São Paulo"
          />

          <TextField
            id="obra_referencia"
            label="Referência do projeto"
            value={dados.obra_referencia ?? ""}
            onChange={(v) => onChange("obra_referencia", v || null)}
            placeholder="Ex: Projeto 001/2026"
            hint="N° ou nome do projeto arquitetônico"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <IntegerField
            id="projeto_area_m2"
            label="Área construída"
            value={dados.projeto_area_m2 ?? 0}
            onChange={(v) => onChange("projeto_area_m2", v)}
            required
            erro={erros.projeto_area_m2}
            suffix="m²"
            min={1}
          />

          <IntegerField
            id="projeto_pavimentos"
            label="Pavimentos"
            value={dados.projeto_pavimentos ?? 1}
            onChange={(v) => onChange("projeto_pavimentos", v)}
            required
            erro={erros.projeto_pavimentos}
            min={1}
          />

          <TextField
            id="projeto_piscina"
            label="Piscina"
            value={dados.projeto_piscina ?? ""}
            onChange={(v) => onChange("projeto_piscina", v || null)}
            placeholder="Não / dimensões"
            hint="Ex: 8x4m ou 'Não'"
          />
        </div>

        <RadioPills
          label="Padrão de acabamento"
          options={PADRAO_OPTIONS}
          value={dados.projeto_padrao}
          onChange={(v) => onChange("projeto_padrao", v)}
          required
          erro={erros.projeto_padrao}
        />
      </div>
    </div>
  )
}
