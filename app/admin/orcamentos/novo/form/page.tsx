import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrcamentoWizard } from "@/components/admin/orcamentos/OrcamentoWizard"
import { createClient } from "@/lib/supabase/server"

export default async function NovoOrcamentoFormPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead: leadId } = await searchParams
  const supabase = await createClient()
  const { data: lead } = leadId
    ? await supabase.from("leads").select("id,nome,email,telefone").eq("id", leadId).maybeSingle()
    : { data: null }
  return (
    <div className="space-y-2">
      <Link
        href="/admin/orcamentos/novo"
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3 w-3" />
        Voltar
      </Link>
      <OrcamentoWizard dadosIniciais={lead ? {
        lead_id: lead.id,
        cliente_nome: lead.nome,
        cliente_email: lead.email,
        cliente_telefone: lead.telefone,
      } : undefined} />
    </div>
  )
}
