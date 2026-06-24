"use client"

import type {
  OrcamentoInsert,
  RegimeRecomendado,
} from "@/types/orcamento-estimativa"
import { REGIMES_COMERCIAIS } from "@/lib/orcamento-estimativa-data"
import { TextField, IntegerField, CurrencyField, RadioPills } from "../form-fields"

interface Props {
  dados: OrcamentoInsert
  erros: Record<string, string>
  onChange: <K extends keyof OrcamentoInsert>(
    field: K,
    valor: OrcamentoInsert[K]
  ) => void
}

const REGIME_OPTIONS: {
  id: RegimeRecomendado
  label: string
  descricao: string
}[] = [
  ...REGIMES_COMERCIAIS.map((r) => ({
    id: r.id,
    label: r.nome,
    descricao: r.resumo,
  })),
  {
    id: "indefinido" as RegimeRecomendado,
    label: "A definir",
    descricao: "Regime ainda não decidido — cliente vai escolher após análise.",
  },
]

export function Step3ValoresRegime({ dados, erros, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Valores & Regime
        </h2>
        <p className="text-sm text-neutral-500">
          Faixa de investimento estimada e regime comercial recomendado.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-3">
            Faixa total da obra
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <CurrencyField
              id="valor_min"
              label="Valor mínimo"
              value={dados.valor_min ?? 0}
              onChange={(v) => onChange("valor_min", v)}
              required
              erro={erros.valor_min}
            />
            <CurrencyField
              id="valor_max"
              label="Valor máximo"
              value={dados.valor_max ?? 0}
              onChange={(v) => onChange("valor_max", v)}
              required
              erro={erros.valor_max}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-3">
            Faixa por m²
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <CurrencyField
              id="valor_m2_min"
              label="R$/m² mínimo"
              value={dados.valor_m2_min ?? 0}
              onChange={(v) => onChange("valor_m2_min", v)}
              required
              erro={erros.valor_m2_min}
            />
            <CurrencyField
              id="valor_m2_max"
              label="R$/m² máximo"
              value={dados.valor_m2_max ?? 0}
              onChange={(v) => onChange("valor_m2_max", v)}
              required
              erro={erros.valor_m2_max}
            />
          </div>
        </div>

        <RadioPills
          label="Regime recomendado"
          options={REGIME_OPTIONS}
          value={dados.regime_recomendado}
          onChange={(v) => onChange("regime_recomendado", v)}
          required
          erro={erros.regime_recomendado}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="data_cotacao"
            label="Data de cotação"
            type="date"
            value={dados.data_cotacao ?? ""}
            onChange={(v) => onChange("data_cotacao", v)}
            required
            erro={erros.data_cotacao}
          />
          <IntegerField
            id="validade_dias"
            label="Validade"
            value={dados.validade_dias ?? 30}
            onChange={(v) => onChange("validade_dias", v)}
            required
            erro={erros.validade_dias}
            suffix="dias"
            min={1}
          />
          <TextField
            id="responsavel_tecnico"
            label="Responsável técnico"
            value={dados.responsavel_tecnico ?? ""}
            onChange={(v) => onChange("responsavel_tecnico", v || null)}
            placeholder="Nome / cargo"
          />
        </div>
      </div>
    </div>
  )
}
