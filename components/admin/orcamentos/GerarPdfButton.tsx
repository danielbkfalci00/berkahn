"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, FileDown, AlertCircle, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  orcamentoId: string
}

async function baixarPdf(url: string, nome: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Falha ao baixar PDF (HTTP ${res.status})`)
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = objectUrl
  a.download = nome
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; pdfUrl: string; numero?: string }
  | { status: "error"; message: string; campos?: string[] }

export function GerarPdfButton({ orcamentoId }: Props) {
  const [state, setState] = useState<State>({ status: "idle" })
  const [downloading, setDownloading] = useState(false)
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
      setState({ status: "success", pdfUrl: json.pdf_url, numero: json.numero })
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

      {state.status === "success" && (
        <div className="space-y-2">
          <p className="text-sm text-emerald-700">PDF gerado com sucesso.</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={downloading}
              onClick={async () => {
                setDownloading(true)
                try {
                  await baixarPdf(
                    state.pdfUrl,
                    `Orcamento-${state.numero ?? orcamentoId}.pdf`
                  )
                } catch (err) {
                  alert(
                    err instanceof Error
                      ? err.message
                      : "Falha ao baixar PDF"
                  )
                } finally {
                  setDownloading(false)
                }
              }}
            >
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 mr-1.5" />
              )}
              Baixar PDF
            </Button>
            <a
              href={state.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Abrir em nova aba
            </a>
          </div>
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
