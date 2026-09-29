import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { OrcamentoWizard } from "@/components/admin/orcamentos/OrcamentoWizard"
import type { Orcamento } from "@/types/orcamento-estimativa"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarOrcamentoPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orcamentos")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }
  if (data.status === "arquivado") redirect(`/admin/orcamentos/${id}`)

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
