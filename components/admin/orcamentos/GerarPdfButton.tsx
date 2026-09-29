"use client"

import { useState } from "react"
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
  | { status: "error"; message: string; campos?: string[] }

export function GerarPdfButton({ orcamentoId, atualizadoEm }: Props) {
  const [state, setState] = useState<State>({ status: "idle" })
  const router = useRouter()

  const gerar = async () => {
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
          campos: json.campos,
        })
        return
      }
      setState({ status: "success", atualizadoEm: json.atualizado_em })
      router.refresh()
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Erro inesperado",
      })
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
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">{state.message}</div>
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
