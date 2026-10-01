"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, FileDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  orcamentoId: string
  atualizadoEm: string
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; atualizadoEm: string }
  | { status: "error"; message: string; detail?: string; campos?: string[]; refreshable?: boolean }

export function GerarPdfButton({ orcamentoId, atualizadoEm }: Props) {
  const [state, setState] = useState<State>({ status: "idle" })
  const router = useRouter()
  const pending = useRef(false)

  const gerar = async () => {
    if (pending.current) return
    pending.current = true
    setState({ status: "loading" })
    try {
      const res = await fetch(`/api/admin/orcamentos/${orcamentoId}/pdf`, {
        method: "POST",
        headers: { "If-Match": `"${atualizadoEm}"` },
      })
      const json = await res.json()
      if (!res.ok) {
        setState({
          status: "error",
          message: json.error ?? "Falha ao gerar PDF",
          detail: res.status === 500 && typeof json.details === "string" ? json.details : undefined,
          campos: json.campos,
          refreshable: res.status === 409 || res.status === 503,
        })
        return
      }
      setState({ status: "success", atualizadoEm: json.atualizado_em })
      router.refresh()
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Erro inesperado",
        refreshable: true,
      })
    } finally {
      pending.current = false
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={gerar}
        disabled={state.status === "loading"}
        className="bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-700 disabled:text-white/80 disabled:opacity-100"
      >
        {state.status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Gerando PDF...
          </>
        ) : (
          <>
            <FileDown className="h-4 w-4 mr-2" />
            Gerar PDF
          </>
        )}
      </Button>

      {state.status === "success" && state.atualizadoEm === atualizadoEm && (
        <p role="status" className="text-sm text-emerald-700">PDF gerado com sucesso.</p>
      )}

      {state.status === "error" && (
        <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">{state.message}</div>
              {state.detail && (
                <details className="mt-1">
                  <summary className="cursor-pointer underline">Ver diagnóstico</summary>
                  <p className="mt-1 break-words">{state.detail}</p>
                </details>
              )}
              {state.refreshable && <button type="button" onClick={() => router.refresh()} className="mt-1 inline-flex min-h-11 items-center underline">Atualizar orçamento</button>}
              {state.campos && state.campos.length > 0 && (
                <ul className="mt-1 text-xs list-disc pl-4">
                  {state.campos.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
