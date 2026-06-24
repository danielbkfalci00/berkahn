import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrcamentoWizard } from "@/components/admin/orcamentos/OrcamentoWizard"

export default function NovoOrcamentoFormPage() {
  return (
    <div className="space-y-2">
      <Link
        href="/admin/orcamentos/novo"
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3 w-3" />
        Voltar
      </Link>
      <OrcamentoWizard />
    </div>
  )
}
