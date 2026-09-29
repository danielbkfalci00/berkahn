import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { OrcamentoWizard } from "@/components/admin/orcamentos/OrcamentoWizard"
import type { Orcamento } from "@/types/orcamento-estimativa"
import { commercialHref, commercialReturnTo } from "@/lib/admin/return-to"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ returnTo?: string | string[] }>
}

export default async function EditarOrcamentoPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const returnTo = commercialReturnTo((await searchParams).returnTo)
  const detailHref = commercialHref(`/admin/orcamentos/${id}`, returnTo)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orcamentos")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }
  if (data.status === "arquivado") redirect(detailHref)

  return (
    <div className="space-y-2">
      <Link
        href={detailHref}
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3 w-3" />
        Voltar para detalhe
      </Link>
      <OrcamentoWizard returnTo={returnTo} orcamentoInicial={data as unknown as Orcamento} />
    </div>
  )
}
