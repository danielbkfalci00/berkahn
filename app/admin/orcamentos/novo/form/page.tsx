import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrcamentoWizard } from "@/components/admin/orcamentos/OrcamentoWizard"
import { createClient } from "@/lib/supabase/server"
import { commercialHref, commercialReturnTo, leadHref } from "@/lib/admin/return-to"

export default async function NovoOrcamentoFormPage({ searchParams }: { searchParams: Promise<{ lead?: string | string[]; returnTo?: string | string[] }> }) {
  const { lead: rawLeadId, returnTo: rawReturnTo } = await searchParams
  const leadId = typeof rawLeadId === "string" && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(rawLeadId) ? rawLeadId : undefined
  const supabase = await createClient()
  const { data: lead } = leadId
    ? await supabase.from("leads").select("id,nome,email,telefone").eq("id", leadId).maybeSingle()
    : { data: null }
  const returnTo = commercialReturnTo(rawReturnTo, lead ? leadHref(lead.id, "/admin/leads") : "/admin/orcamentos")
  const backHref = lead ? leadHref(lead.id, returnTo) : commercialHref("/admin/orcamentos/novo", returnTo)
  return (
    <div className="space-y-2">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-3 w-3" />
        {lead ? "Voltar para lead" : "Voltar"}
      </Link>
      <OrcamentoWizard returnTo={returnTo} dadosIniciais={lead ? {
        lead_id: lead.id,
        cliente_nome: lead.nome,
        cliente_email: lead.email,
        cliente_telefone: lead.telefone,
      } : undefined} />
    </div>
  )
}
