"use client"

import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import type { OrcamentoInsert } from "@/types/orcamento-estimativa"
import {
  PADROES_ACABAMENTO,
  REGIMES_COMERCIAIS,
} from "@/lib/orcamento-estimativa-data"
import {
  validarStep1,
  validarStep2,
  validarStep3,
  validarStep4,
  validarTudo,
  type StepId,
} from "../wizard-state"

interface Props {
  dados: OrcamentoInsert
  onIrParaStep: (step: StepId) => void
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}

interface StepSummaryProps {
  step: StepId
  titulo: string
  ok: boolean
  onEditar: () => void
  children: React.ReactNode
}

function StepSummary({
  step,
  titulo,
  ok,
  onEditar,
  children,
}: StepSummaryProps) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          {ok ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-600" />
          )}
          <h3 className="text-sm font-semibold text-neutral-900">
            {step}. {titulo}
          </h3>
        </div>
        <button
          type="button"
          onClick={onEditar}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
        >
          Editar <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <dl className="grid gap-1.5 text-sm">{children}</dl>
    </div>
  )
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <dt className="text-xs text-neutral-500">{rotulo}</dt>
      <dd className="text-neutral-900">{valor}</dd>
    </div>
  )
}

export function Step5Revisao({ dados, onIrParaStep }: Props) {
  const padrao = PADROES_ACABAMENTO.find(
    (p) => p.id === dados.projeto_padrao
  )?.nome
  const regime =
    dados.regime_recomendado === "indefinido"
      ? "A definir"
      : REGIMES_COMERCIAIS.find((r) => r.id === dados.regime_recomendado)?.nome

  const v1 = validarStep1(dados)
  const v2 = validarStep2(dados)
  const v3 = validarStep3(dados)
  const v4 = validarStep4(dados)
  const tudo = validarTudo(dados)

  const condicionantesQt = dados.condicionantes_extras?.length ?? 0
  const exclusoesQt = dados.exclusoes_extras?.length ?? 0
  const cardsQt = dados.entrega_categorias_ativas?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Revisão</h2>
        <p className="text-sm text-neutral-500">
          Confira tudo antes de finalizar. Você pode editar cada bloco
          clicando no link.
        </p>
      </div>

      {!tudo.ok && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">
                Há campos pendentes antes de finalizar
              </div>
              <p className="text-xs mt-1">
                Os steps marcados em amarelo precisam de ajuste. Você ainda pode
                salvar como rascunho mesmo assim.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <StepSummary
          step={1}
          titulo="Cliente"
          ok={v1.ok}
          onEditar={() => onIrParaStep(1)}
        >
          <Linha rotulo="Nome" valor={dados.cliente_nome || "—"} />
          <Linha rotulo="E-mail" valor={dados.cliente_email ?? "—"} />
          <Linha rotulo="Telefone" valor={dados.cliente_telefone ?? "—"} />
        </StepSummary>

        <StepSummary
          step={2}
          titulo="Obra & Projeto"
          ok={v2.ok}
          onEditar={() => onIrParaStep(2)}
        >
          <Linha rotulo="Endereço" valor={dados.obra_endereco || "—"} />
          <Linha rotulo="Cidade" valor={dados.obra_cidade || "—"} />
          <Linha
            rotulo="Referência"
            valor={dados.obra_referencia ?? "—"}
          />
          <Linha
            rotulo="Área / Pavimentos"
            valor={`${dados.projeto_area_m2 ?? 0} m² · ${dados.projeto_pavimentos ?? 0} pav.`}
          />
          <Linha
            rotulo="Piscina"
            valor={dados.projeto_piscina ?? "Não"}
          />
          <Linha rotulo="Padrão" valor={padrao ?? "—"} />
        </StepSummary>

        <StepSummary
          step={3}
          titulo="Valores & Regime"
          ok={v3.ok}
          onEditar={() => onIrParaStep(3)}
        >
          <Linha
            rotulo="Faixa total"
            valor={`${formatarMoeda(dados.valor_min ?? 0)} – ${formatarMoeda(dados.valor_max ?? 0)}`}
          />
          <Linha
            rotulo="Faixa R$/m²"
            valor={`${formatarMoeda(dados.valor_m2_min ?? 0)} – ${formatarMoeda(dados.valor_m2_max ?? 0)}`}
          />
          <Linha rotulo="Regime" valor={regime ?? "—"} />
          <Linha rotulo="Data cotação" valor={dados.data_cotacao || "—"} />
          <Linha
            rotulo="Validade"
            valor={`${dados.validade_dias ?? 0} dias`}
          />
          <Linha
            rotulo="Responsável"
            valor={dados.responsavel_tecnico ?? "—"}
          />
        </StepSummary>

        <StepSummary
          step={4}
          titulo="Listas & Categorias"
          ok={v4.ok}
          onEditar={() => onIrParaStep(4)}
        >
          <Linha rotulo="Categorias ativas" valor={`${cardsQt} de 9`} />
          <Linha
            rotulo="Condicionantes extras"
            valor={condicionantesQt > 0 ? `${condicionantesQt} item(ns)` : "—"}
          />
          <Linha
            rotulo="Exclusões extras"
            valor={exclusoesQt > 0 ? `${exclusoesQt} item(ns)` : "—"}
          />
        </StepSummary>
      </div>

      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p>
          Após <strong>Finalizar</strong>, você será redirecionado para a página
          do orçamento, onde pode subir a foto da capa e gerar o PDF.
        </p>
      </div>
    </div>
  )
}
