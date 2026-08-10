"use client"

import { useReducer, useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  AlertCircle,
  Circle,
  Loader2,
  Save,
  Send,
  AlertTriangle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Orcamento, OrcamentoInsert } from "@/types/orcamento-estimativa"
import {
  initialState,
  reducer,
  statusDoStep,
  validarStep1,
  validarStep2,
  validarStep3,
  validarStep4,
  validarTudo,
  type StepId,
} from "./wizard-state"
import { Step1Cliente } from "./steps/Step1Cliente"
import { Step2Obra } from "./steps/Step2Obra"
import { Step3ValoresRegime } from "./steps/Step3ValoresRegime"
import { Step4ListasEntrega } from "./steps/Step4ListasEntrega"
import { Step5Revisao } from "./steps/Step5Revisao"
import {
  criarOrcamento,
  atualizarOrcamento,
  finalizarOrcamento,
} from "@/app/admin/orcamentos/actions"

interface Props {
  orcamentoInicial?: Orcamento
  dadosIniciais?: Partial<OrcamentoInsert>
}

const STEPS: { id: StepId; titulo: string }[] = [
  { id: 1, titulo: "Cliente" },
  { id: 2, titulo: "Obra & Projeto" },
  { id: 3, titulo: "Valores & Regime" },
  { id: 4, titulo: "Listas" },
  { id: 5, titulo: "Revisão" },
]

interface SaveState {
  status: "idle" | "salvando" | "finalizando" | "ok" | "erro"
  mensagem: string | null
}

function StatusIcon({
  status,
  ativo,
}: {
  status: "vazio" | "valido" | "invalido"
  ativo: boolean
}) {
  if (status === "valido") {
    return (
      <CheckCircle2
        className={cn(
          "h-3.5 w-3.5",
          ativo ? "text-emerald-300" : "text-emerald-600"
        )}
      />
    )
  }
  if (status === "invalido") {
    return (
      <AlertCircle
        className={cn(
          "h-3.5 w-3.5",
          ativo ? "text-amber-300" : "text-amber-600"
        )}
      />
    )
  }
  return (
    <Circle
      className={cn(
        "h-3.5 w-3.5",
        ativo ? "text-white/40" : "text-neutral-300"
      )}
    />
  )
}

function errosDoStep(
  step: StepId,
  dados: OrcamentoInsert
): Record<string, string> {
  if (step === 1) return validarStep1(dados).erros
  if (step === 2) return validarStep2(dados).erros
  if (step === 3) return validarStep3(dados).erros
  if (step === 4) return validarStep4(dados).erros
  return {}
}

export function OrcamentoWizard({ orcamentoInicial, dadosIniciais }: Props) {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState(orcamentoInicial, dadosIniciais))
  const [stepAtivo, setStepAtivo] = useState<StepId>(1)
  const [salvar, setSalvar] = useState<SaveState>({
    status: "idle",
    mensagem: null,
  })
  const [orcamentoId, setOrcamentoId] = useState<string | undefined>(
    orcamentoInicial?.id
  )

  const ehNovo = !orcamentoInicial && !orcamentoId
  const titulo = orcamentoInicial
    ? `Editar ${orcamentoInicial.numero}`
    : "Novo orçamento"

  const validacaoFinal = useMemo(
    () => validarTudo(state.dados),
    [state.dados]
  )

  useEffect(() => {
    if (!state.hasUnsavedChanges) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [state.hasUnsavedChanges])

  const onChange = useCallback(
    <K extends keyof OrcamentoInsert>(
      field: K,
      valor: OrcamentoInsert[K]
    ) => {
      dispatch({ type: "UPDATE_FIELD", field, valor })
    },
    []
  )

  const irParaStep = useCallback((step: StepId) => {
    dispatch({ type: "VISITAR_STEP", step })
    setStepAtivo(step)
  }, [])

  const salvarRascunho = async () => {
    setSalvar({ status: "salvando", mensagem: null })
    try {
      if (ehNovo) {
        const res = await criarOrcamento(state.dados)
        if (!res.ok) {
          setSalvar({ status: "erro", mensagem: res.erro })
          return
        }
        setOrcamentoId(res.id)
        dispatch({ type: "MARK_SAVED" })
        setSalvar({
          status: "ok",
          mensagem: `Rascunho salvo (${res.numero})`,
        })
      } else {
        const id = orcamentoId ?? orcamentoInicial!.id
        const res = await atualizarOrcamento(id, state.dados)
        if (!res.ok) {
          setSalvar({ status: "erro", mensagem: res.erro })
          return
        }
        dispatch({ type: "MARK_SAVED" })
        setSalvar({ status: "ok", mensagem: "Rascunho atualizado" })
      }
    } catch (err) {
      setSalvar({
        status: "erro",
        mensagem:
          err instanceof Error
            ? `Falha inesperada: ${err.message}`
            : "Falha inesperada ao salvar",
      })
    }
  }

  const finalizar = async () => {
    if (!validacaoFinal.ok) {
      const ordem: StepId[] = [1, 2, 3, 4]
      const primeiroComErro = ordem.find(
        (s) => statusDoStep(state.dados, s, 4) === "invalido"
      )
      if (primeiroComErro) irParaStep(primeiroComErro)
      setSalvar({
        status: "erro",
        mensagem: "Há campos pendentes — preencha antes de finalizar",
      })
      return
    }

    setSalvar({ status: "finalizando", mensagem: null })

    try {
      let id = orcamentoId
      if (ehNovo) {
        const criacao = await criarOrcamento(state.dados)
        if (!criacao.ok) {
          setSalvar({ status: "erro", mensagem: criacao.erro })
          return
        }
        id = criacao.id
        setOrcamentoId(id)
      }
      const idFinal = id ?? orcamentoInicial!.id
      const finalizacao = await finalizarOrcamento(idFinal, state.dados)
      if (!finalizacao.ok) {
        setSalvar({ status: "erro", mensagem: finalizacao.erro })
        return
      }
      dispatch({ type: "MARK_SAVED" })
      setSalvar({ status: "ok", mensagem: "Orçamento finalizado" })
      router.push(`/admin/orcamentos/${idFinal}`)
    } catch (err) {
      setSalvar({
        status: "erro",
        mensagem:
          err instanceof Error
            ? `Falha inesperada: ${err.message}`
            : "Falha inesperada ao finalizar",
      })
    }
  }

  const erros = errosDoStep(stepAtivo, state.dados)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">{titulo}</h1>
        <p className="text-sm text-neutral-500">
          Preencha os 5 passos e clique em Finalizar para gerar o PDF.
        </p>
      </div>

      <Card className="p-2">
        <div className="grid grid-cols-5 gap-1">
          {STEPS.map((s) => {
            const status = statusDoStep(
              state.dados,
              s.id,
              state.ultimoStepVisitado
            )
            const ativo = stepAtivo === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => irParaStep(s.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-3 py-2.5 text-xs transition-all",
                  ativo
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "hover:bg-neutral-100 text-neutral-700"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <StatusIcon status={status} ativo={ativo} />
                  <span className="font-medium tabular-nums">{s.id}</span>
                </div>
                <span
                  className={cn(
                    "text-[11px]",
                    ativo ? "text-white/80" : "text-neutral-500"
                  )}
                >
                  {s.titulo}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="p-6">
        {stepAtivo === 1 && (
          <Step1Cliente
            dados={state.dados}
            erros={erros}
            onChange={onChange}
          />
        )}
        {stepAtivo === 2 && (
          <Step2Obra dados={state.dados} erros={erros} onChange={onChange} />
        )}
        {stepAtivo === 3 && (
          <Step3ValoresRegime
            dados={state.dados}
            erros={erros}
            onChange={onChange}
          />
        )}
        {stepAtivo === 4 && (
          <Step4ListasEntrega
            dados={state.dados}
            erros={erros}
            onChange={onChange}
          />
        )}
        {stepAtivo === 5 && (
          <Step5Revisao dados={state.dados} onIrParaStep={irParaStep} />
        )}
      </Card>

      {salvar.mensagem && (
        <div
          className={cn(
            "rounded-md border p-3 text-sm",
            salvar.status === "erro"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          )}
        >
          <div className="flex items-start gap-2">
            {salvar.status === "erro" ? (
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
            )}
            <span>{salvar.mensagem}</span>
          </div>
        </div>
      )}

      <Card className="p-4 flex items-center justify-between gap-4 sticky bottom-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {state.hasUnsavedChanges && (
            <>
              <AlertTriangle className="h-3.5 w-3.5" />
              Mudanças não salvas
            </>
          )}
          {!state.hasUnsavedChanges && orcamentoId && (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Tudo salvo
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={salvarRascunho}
            disabled={
              salvar.status === "salvando" || salvar.status === "finalizando"
            }
          >
            {salvar.status === "salvando" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar rascunho
              </>
            )}
          </Button>
          <Button
            onClick={finalizar}
            disabled={
              salvar.status === "salvando" || salvar.status === "finalizando"
            }
            className="bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-700 disabled:text-white/80 disabled:opacity-100"
          >
            {salvar.status === "finalizando" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {validacaoFinal.ok
                  ? "Finalizar"
                  : "Finalizar (com pendências)"}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
