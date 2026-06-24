import Link from "next/link"
import { ArrowLeft, FileSpreadsheet, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PlanilhaUpload } from "@/components/admin/orcamentos/PlanilhaUpload"

export default function NovoOrcamentoUploadPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/orcamentos/novo"
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3 w-3" />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Upload de planilha
        </h1>
        <p className="text-sm text-neutral-500">
          Baixe o modelo, preencha 1 linha e suba. O wizard abre pré-preenchido
          pronto pra revisar e finalizar.
        </p>
      </div>

      <Card className="p-5 bg-neutral-50 border-neutral-200">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-neutral-900 p-3 text-white">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-neutral-900">
              1. Baixar modelo
            </h2>
            <p className="text-xs text-neutral-500 mt-1 mb-3">
              Schema com 18 colunas (12 obrigatórias). Não renomeie headers.
              Datas em <code className="text-[11px]">YYYY-MM-DD</code> ou{" "}
              <code className="text-[11px]">DD/MM/YYYY</code>.
            </p>
            <a
              href="/api/admin/orcamentos/template"
              download="modelo-orcamento.xlsx"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              Baixar modelo-orcamento.xlsx
            </a>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-base font-semibold text-neutral-900 mb-3">
          2. Preencher e subir
        </h2>
        <PlanilhaUpload />
      </div>
    </div>
  )
}
