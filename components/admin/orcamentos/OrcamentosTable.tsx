"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, FileSpreadsheet } from "lucide-react"
import type { OrcamentoListItem } from "@/types/orcamento-estimativa"

interface Props {
  orcamentos: OrcamentoListItem[]
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const STATUS_LABEL: Record<OrcamentoListItem["status"], string> = {
  rascunho: "Rascunho",
  finalizado: "Finalizado",
  arquivado: "Arquivado",
}

const STATUS_VARIANT: Record<OrcamentoListItem["status"], "default" | "secondary" | "outline"> = {
  rascunho: "secondary",
  finalizado: "default",
  arquivado: "outline",
}

export function OrcamentosTable({ orcamentos }: Props) {
  if (orcamentos.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-neutral-100 rounded-full mb-4">
            <FileSpreadsheet className="h-8 w-8 text-neutral-500" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">
            Nenhum orçamento ainda
          </h2>
          <p className="text-sm text-neutral-500 max-w-md">
            Crie o primeiro orçamento pelo formulário ou subindo a planilha-modelo.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50/50 text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Número</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Cidade</th>
              <th className="px-4 py-3 font-medium text-right">Área (m²)</th>
              <th className="px-4 py-3 font-medium text-right">Faixa</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orcamentos.map((o) => (
              <tr key={o.id} className="hover:bg-neutral-50/50">
                <td className="px-4 py-3 font-mono text-xs text-neutral-700">{o.numero}</td>
                <td className="px-4 py-3 text-neutral-900">{o.cliente_nome}</td>
                <td className="px-4 py-3 text-neutral-600">{o.obra_cidade}</td>
                <td className="px-4 py-3 text-right tabular-nums text-neutral-700">{o.projeto_area_m2}</td>
                <td className="px-4 py-3 text-right tabular-nums text-neutral-700">
                  {formatarMoeda(o.valor_min)} – {formatarMoeda(o.valor_max)}
                </td>
                <td className="px-4 py-3 text-neutral-600">{formatarData(o.data_elaboracao)}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[o.status]}>{STATUS_LABEL[o.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/orcamentos/${o.id}`}
                      className="inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-900"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Abrir
                    </Link>
                    {o.pdf_url && (
                      <a
                        href={o.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-900"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
