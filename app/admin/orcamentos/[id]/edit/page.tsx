import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createServiceClient } from "@/lib/supabase/admin"
import { OrcamentoWizard } from "@/components/admin/orcamentos/OrcamentoWizard"
import type { Orcamento } from "@/types/orcamento-estimativa"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarOrcamentoPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("orcamentos")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }

  return (
    <div className="space-y-2">
      <Link
        href={`/admin/orcamentos/${id}`}
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3 w-3" />
        Voltar para detalhe
      </Link>
      <OrcamentoWizard orcamentoInicial={data as unknown as Orcamento} />
    </div>
  )
}
