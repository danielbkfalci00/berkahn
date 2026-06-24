import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { OrcamentosTable } from "@/components/admin/orcamentos/OrcamentosTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { OrcamentoListItem } from "@/types/orcamento-estimativa"

export const dynamic = "force-dynamic"

export default async function OrcamentosPage() {
  const supabase = await createClient()

  let orcamentos: OrcamentoListItem[] = []
  try {
    const { data, error } = await supabase
      .from("orcamentos")
      .select(
        "id, numero, status, cliente_nome, obra_cidade, projeto_area_m2, valor_min, valor_max, data_elaboracao, pdf_url, criado_em"
      )
      .order("criado_em", { ascending: false })

    if (!error && data) {
      orcamentos = data as OrcamentoListItem[]
    }
  } catch {
    console.log("Orcamentos: tabela ainda não existe (rodar migration 006)")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500">
            Estimativas preliminares geradas via admin (formulário ou planilha).
          </p>
        </div>
        <Link href="/admin/orcamentos/novo">
          <Button className="bg-neutral-900 hover:bg-neutral-800">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </Link>
      </div>

      <OrcamentosTable orcamentos={orcamentos} />
    </div>
  )
}
