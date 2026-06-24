"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Send,
  RotateCcw,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PlanilhaOrcamentoRow } from "@/types/orcamento-estimativa"
import { criarRascunhoDePlanilha } from "@/app/admin/orcamentos/actions"

interface ErroPlanilha {
  campo?: string
  mensagem: string
}

interface RespostaParse {
  row: PlanilhaOrcamentoRow | null
  erros: ErroPlanilha[]
  warnings: string[]
}

type Estado = "idle" | "parsing" | "preview" | "criando" | "erro"

const LABELS: Record<keyof PlanilhaOrcamentoRow, string> = {
  cliente_nome: "Nome do cliente",
  cliente_email: "Email",
  cliente_telefone: "Telefone",
  obra_endereco: "Endereço da obra",
  obra_cidade: "Cidade",
  obra_referencia: "Referência",
  area_m2: "Área (m²)",
  pavimentos: "Pavimentos",
  piscina: "Piscina",
  padrao_acabamento: "Padrão de acabamento",
  valor_min: "Valor mínimo (R$)",
  valor_max: "Valor máximo (R$)",
  valor_m2_min: "R$/m² mínimo",
  valor_m2_max: "R$/m² máximo",
  regime_recomendado: "Regime recomendado",
  data_cotacao: "Data de cotação",
  validade_dias: "Validade (dias)",
  responsavel_tecnico: "Responsável técnico",
}

const ORDEM: (keyof PlanilhaOrcamentoRow)[] = [
  "cliente_nome",
  "cliente_email",
  "cliente_telefone",
  "obra_endereco",
  "obra_cidade",
  "obra_referencia",
  "area_m2",
  "pavimentos",
  "piscina",
  "padrao_acabamento",
  "valor_min",
  "valor_max",
  "valor_m2_min",
  "valor_m2_max",
  "regime_recomendado",
  "data_cotacao",
  "validade_dias",
  "responsavel_tecnico",
]

const CURRENCY_FIELDS = new Set<keyof PlanilhaOrcamentoRow>([
  "valor_min",
  "valor_max",
  "valor_m2_min",
  "valor_m2_max",
])

function formatBRL(v: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v)
}

function formatarCelula(
  campo: keyof PlanilhaOrcamentoRow,
  valor: unknown
): string {
  if (valor === undefined || valor === null || valor === "") return "—"
  if (CURRENCY_FIELDS.has(campo) && typeof valor === "number") {
    return `R$ ${formatBRL(valor)}`
  }
  return String(valor)
}

export function PlanilhaUpload() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [estado, setEstado] = useState<Estado>("idle")
  const [resp, setResp] = useState<RespostaParse | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [filename, setFilename] = useState<string | null>(null)

  const reset = useCallback(() => {
    setEstado("idle")
    setResp(null)
    setMensagem(null)
    setFilename(null)
    if (inputRef.current) inputRef.current.value = ""
  }, [])

  const enviarArquivo = useCallback(async (file: File) => {
    setEstado("parsing")
    setMensagem(null)
    setFilename(file.name)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const r = await fetch("/api/admin/orcamentos/parse-planilha", {
        method: "POST",
        body: fd,
      })
      if (!r.ok) {
        const json = (await r.json().catch(() => ({}))) as { error?: string }
        setEstado("erro")
        setMensagem(json.error ?? `HTTP ${r.status}`)
        return
      }
      const json = (await r.json()) as RespostaParse
      setResp(json)
      setEstado("preview")
    } catch (err) {
      setEstado("erro")
      setMensagem(err instanceof Error ? err.message : "Falha ao enviar arquivo")
    }
  }, [])

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) enviarArquivo(file)
    },
    [enviarArquivo]
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) enviarArquivo(file)
    },
    [enviarArquivo]
  )

  const abrirNoWizard = useCallback(async () => {
    if (!resp?.row) return
    setEstado("criando")
    setMensagem(null)
    const res = await criarRascunhoDePlanilha(resp.row)
    if (!res.ok) {
      setEstado("erro")
      setMensagem(res.erro)
      return
    }
    router.push(`/admin/orcamentos/${res.id}/edit`)
  }, [resp, router])

  const podeAbrir =
    estado === "preview" && resp?.row !== null && (resp?.erros.length ?? 0) === 0

  return (
    <div className="space-y-4">
      {(estado === "idle" || estado === "parsing" || estado === "erro") && (
        <Card
          className={cn(
            "p-8 text-center border-2 border-dashed transition-colors",
            dragOver
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-300 hover:border-neutral-400"
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={onPick}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-neutral-100 p-4">
              {estado === "parsing" ? (
                <Loader2 className="h-6 w-6 animate-spin text-neutral-600" />
              ) : (
                <Upload className="h-6 w-6 text-neutral-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {estado === "parsing"
                  ? `Processando ${filename}…`
                  : "Arraste a planilha ou clique para escolher"}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Aceita .csv ou .xlsx (até 5MB)
              </p>
            </div>
            {estado !== "parsing" && (
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                Escolher arquivo
              </Button>
            )}
          </div>
          {mensagem && estado === "erro" && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-left text-sm text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{mensagem}</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {estado === "preview" && resp && (
        <div className="space-y-3">
          {resp.erros.length > 0 && (
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-red-900">
                    {resp.erros.length} erro
                    {resp.erros.length > 1 ? "s" : ""} encontrado
                    {resp.erros.length > 1 ? "s" : ""}
                  </p>
                  <ul className="text-xs text-red-800 space-y-0.5 list-disc list-inside">
                    {resp.erros.map((e, i) => (
                      <li key={i}>
                        {e.campo ? <strong>{e.campo}:</strong> : null} {e.mensagem}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {resp.warnings.length > 0 && (
            <Card className="p-4 border-amber-200 bg-amber-50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-amber-900">
                    Avisos (não bloqueiam)
                  </p>
                  <ul className="text-xs text-amber-800 space-y-0.5 list-disc list-inside">
                    {resp.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {resp.row && (
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-medium text-neutral-900">
                    Linha parseada — {filename}
                  </p>
                </div>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {ORDEM.map((campo) => (
                    <tr
                      key={campo}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <td className="px-4 py-2 text-neutral-500 w-1/3">
                        {LABELS[campo]}
                      </td>
                      <td className="px-4 py-2 text-neutral-900 tabular-nums">
                        {formatarCelula(campo, resp.row?.[campo])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {mensagem && (
            <Card className="p-3 border-red-200 bg-red-50">
              <div className="flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{mensagem}</span>
              </div>
            </Card>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Subir outra
            </Button>
            <Button
              onClick={abrirNoWizard}
              disabled={!podeAbrir}
              className="bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-700 disabled:text-white/80 disabled:opacity-100"
            >
              <Send className="h-4 w-4 mr-2" />
              Abrir no wizard
            </Button>
          </div>
        </div>
      )}

      {estado === "criando" && (
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Criando rascunho e abrindo wizard…
          </div>
        </Card>
      )}
    </div>
  )
}
