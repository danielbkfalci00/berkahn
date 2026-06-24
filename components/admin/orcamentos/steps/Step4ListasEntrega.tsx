"use client"

import type {
  OrcamentoInsert,
  CardEntregaId,
} from "@/types/orcamento-estimativa"
import { CARDS_ENTREGA } from "@/lib/orcamento-estimativa-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChipsInput } from "../form-fields"
import {
  toggleCardEntrega,
  condicionantesToStrings,
  stringsToCondicionantes,
  exclusoesToStrings,
  stringsToExclusoes,
} from "../wizard-state"

interface Props {
  dados: OrcamentoInsert
  erros: Record<string, string>
  onChange: <K extends keyof OrcamentoInsert>(
    field: K,
    valor: OrcamentoInsert[K]
  ) => void
}

export function Step4ListasEntrega({ dados, erros, onChange }: Props) {
  const condicionantesTextos = condicionantesToStrings(
    dados.condicionantes_extras ?? []
  )
  const exclusoesTextos = exclusoesToStrings(dados.exclusoes_extras ?? [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Listas & Categorias
        </h2>
        <p className="text-sm text-neutral-500">
          Itens dinâmicos que aparecerão nas seções 3 e 7 do PDF.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Categorias de entrega — seção 3 do PDF</Label>
          <p className="text-xs text-neutral-500 mt-1">
            Por padrão, todas as 9 categorias aparecem. Desmarque o que não fizer
            parte do escopo deste orçamento.
          </p>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {CARDS_ENTREGA.map((c) => {
            const ativo = dados.entrega_categorias_ativas?.includes(c.id) ?? false
            return (
              <label
                key={c.id}
                className="flex items-start gap-2.5 p-3 rounded-md border border-neutral-200 hover:border-neutral-400 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={ativo}
                  onCheckedChange={() =>
                    onChange(
                      "entrega_categorias_ativas",
                      toggleCardEntrega(
                        dados.entrega_categorias_ativas ?? [],
                        c.id as CardEntregaId
                      )
                    )
                  }
                />
                <div className="text-xs leading-relaxed">
                  <div className="font-medium text-neutral-900">{c.titulo}</div>
                </div>
              </label>
            )
          })}
        </div>
        {erros.entrega_categorias_ativas && (
          <p className="text-xs text-red-600">
            {erros.entrega_categorias_ativas}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChipsInput
          label="Condicionantes extras"
          values={condicionantesTextos}
          onChange={(textos) =>
            onChange("condicionantes_extras", stringsToCondicionantes(textos))
          }
          placeholder="Ex: Estudo de impacto de vizinhança"
          hint="Itens que dependem de informação técnica ainda não disponível. Somam-se aos defaults (sondagem, terraplenagem, ligações, aprovações)."
        />

        <ChipsInput
          label="Exclusões extras"
          values={exclusoesTextos}
          onChange={(textos) =>
            onChange("exclusoes_extras", stringsToExclusoes(textos))
          }
          placeholder="Ex: Sistema de captação de chuva"
          hint="Itens que não fazem parte do escopo. Somam-se aos defaults (automação, paisagismo, marcenaria, irrigação, mobiliário)."
        />
      </div>
    </div>
  )
}
