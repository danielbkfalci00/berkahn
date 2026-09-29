import { commercialHref, commercialReturnTo } from "@/lib/admin/return-to"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { FileText, FileSpreadsheet, ArrowRight } from "lucide-react"

export default async function NovoOrcamentoPage({ searchParams }: { searchParams: Promise<{ returnTo?: string | string[] }> }) {
  const returnTo = commercialReturnTo((await searchParams).returnTo)
  return (
    <div className="space-y-6">
      <div>
        <Link href={returnTo} className="inline-flex min-h-11 items-center text-sm text-neutral-500 hover:text-neutral-900">← Voltar</Link>
        <h1 className="text-2xl font-semibold text-neutral-900">Novo Orçamento</h1>
        <p className="text-neutral-500">Escolha como quer alimentar os dados desta estimativa.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={commercialHref("/admin/orcamentos/novo/form", returnTo)}
          className="group"
        >
          <Card className="p-6 transition-all hover:border-neutral-900 hover:shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-neutral-100 p-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">Formulário</h2>
                <p className="text-sm text-neutral-500 mb-3">
                  Wizard guiado em 5 passos: cliente, obra, valores, premissas, revisão.
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-neutral-700 group-hover:text-neutral-900">
                  Abrir formulário <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Card>
        </Link>

        <Link
          href={commercialHref("/admin/orcamentos/novo/upload", returnTo)}
          className="group"
        >
          <Card className="p-6 transition-all hover:border-neutral-900 hover:shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-neutral-100 p-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">Upload de planilha</h2>
                <p className="text-sm text-neutral-500 mb-3">
                  Baixe o modelo, preencha 1 linha e suba. Abre o wizard pré-preenchido.
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-neutral-700 group-hover:text-neutral-900">
                  Subir planilha <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
