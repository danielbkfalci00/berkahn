import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { OrcamentosTable } from "@/components/admin/orcamentos/OrcamentosTable"
import {
  OrcamentosFiltros,
  type StatusFiltro,
} from "@/components/admin/orcamentos/OrcamentosFiltros"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { OrcamentoListItem } from "@/types/orcamento-estimativa"

export const dynamic = "force-dynamic"

const STATUS_VALIDOS: StatusFiltro[] = [
  "ativos",
  "rascunho",
  "finalizado",
  "arquivado",
  "todos",
]

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>
}

function normalizarStatus(s: string | undefined): StatusFiltro {
  if (s && STATUS_VALIDOS.includes(s as StatusFiltro)) {
    return s as StatusFiltro
  }
  return "ativos"
}

const SELECT_LIST =
  "id, numero, status, cliente_nome, obra_cidade, projeto_area_m2, valor_min, valor_max, data_elaboracao, pdf_url, criado_em"

export default async function OrcamentosPage({ searchParams }: PageProps) {
  const { status: statusParam, q: qParam } = await searchParams
  const statusAtivo = normalizarStatus(statusParam)
  const qAtivo = (qParam ?? "").trim()

  const supabase = await createClient()

  let orcamentos: OrcamentoListItem[] = []
  const contagens: Record<StatusFiltro, number> = {
    ativos: 0,
    rascunho: 0,
    finalizado: 0,
    arquivado: 0,
    todos: 0,
  }

  try {
    let listQuery = supabase
      .from("orcamentos")
      .select(SELECT_LIST)
      .order("criado_em", { ascending: false })

    if (statusAtivo === "ativos") {
      listQuery = listQuery.in("status", ["rascunho", "finalizado"])
    } else if (statusAtivo !== "todos") {
      listQuery = listQuery.eq("status", statusAtivo)
    }

    if (qAtivo) {
      listQuery = listQuery.ilike("cliente_nome", `%${qAtivo}%`)
    }

    const contarPorStatus = (s?: "rascunho" | "finalizado" | "arquivado") => {
      let q = supabase
        .from("orcamentos")
        .select("status", { count: "exact", head: true })
      if (s) q = q.eq("status", s)
      if (qAtivo) q = q.ilike("cliente_nome", `%${qAtivo}%`)
      return q
    }

    const [
      { data: listData },
      { count: countRascunho },
      { count: countFinalizado },
      { count: countArquivado },
      { count: countTodos },
    ] = await Promise.all([
      listQuery,
      contarPorStatus("rascunho"),
      contarPorStatus("finalizado"),
      contarPorStatus("arquivado"),
      contarPorStatus(),
    ])

    orcamentos = (listData ?? []) as OrcamentoListItem[]
    contagens.rascunho = countRascunho ?? 0
    contagens.finalizado = countFinalizado ?? 0
    contagens.arquivado = countArquivado ?? 0
    contagens.todos = countTodos ?? 0
    contagens.ativos = contagens.rascunho + contagens.finalizado
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
          <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </Link>
      </div>

      <OrcamentosFiltros
        statusAtivo={statusAtivo}
        qAtivo={qAtivo}
        contagens={contagens}
      />

      <OrcamentosTable orcamentos={orcamentos} />
    </div>
  )
}
