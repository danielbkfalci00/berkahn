"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, FileDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  orcamentoId: string
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; pdfUrl: string }
  | { status: "error"; message: string; campos?: string[] }

export function GerarPdfButton({ orcamentoId }: Props) {
  const [state, setState] = useState<State>({ status: "idle" })
  const router = useRouter()

  const gerar = async () => {
    setState({ status: "loading" })
    try {
      const res = await fetch(`/api/admin/orcamentos/${orcamentoId}/pdf`, {
        method: "POST",
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
      setState({ status: "success", pdfUrl: json.pdf_url })
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
        className="bg-neutral-900 hover:bg-neutral-800"
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

      {state.status === "success" && (
        <div className="text-sm text-neutral-600">
          PDF gerado.{" "}
          <a
            href={state.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 underline"
          >
            Abrir em nova aba
          </a>
        </div>
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
