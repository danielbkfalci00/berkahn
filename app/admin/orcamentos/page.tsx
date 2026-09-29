import { commercialHref } from "@/lib/admin/return-to"
import Link from "next/link"
import { redirect } from "next/navigation"
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
  searchParams: Promise<{ status?: string | string[]; q?: string | string[]; page?: string | string[] }>
}

function normalizarStatus(s: unknown): StatusFiltro {
  if (typeof s === "string" && STATUS_VALIDOS.includes(s as StatusFiltro)) {
    return s as StatusFiltro
  }
  return "ativos"
}

const SELECT_LIST =
  "id, numero, status, cliente_nome, obra_cidade, projeto_area_m2, valor_min, valor_max, data_elaboracao, pdf_url, pdf_storage_path, pdf_generated_at, criado_em"

export default async function OrcamentosPage({ searchParams }: PageProps) {
  const { status: statusParam, q: qParam, page: pageParam } = await searchParams
  const page = Math.min(100_000, Math.max(1, Number.parseInt(typeof pageParam === "string" ? pageParam : "1", 10) || 1))
  const pageSize = 25
  const statusAtivo = normalizarStatus(statusParam)
  const qAtivo = (typeof qParam === "string" ? qParam : "").trim().slice(0, 120)

  const supabase = await createClient()

  let orcamentos: OrcamentoListItem[] = []
  let unavailable = false
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
      .order("criado_em", { ascending: false }).order("id")
      .range((page - 1) * pageSize, page * pageSize - 1)

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
      listResult,
      countRascunhoResult,
      countFinalizadoResult,
      countArquivadoResult,
    ] = await Promise.all([
      listQuery,
      contarPorStatus("rascunho"),
      contarPorStatus("finalizado"),
      contarPorStatus("arquivado"),
    ])

    const results = [countRascunhoResult, countFinalizadoResult, countArquivadoResult]
    const failed = results.find((result) => result.error)
    if (failed?.error) throw failed.error
    if (listResult.error && listResult.error.code !== "PGRST103") throw listResult.error

    orcamentos = (listResult.data ?? []) as OrcamentoListItem[]
    contagens.rascunho = countRascunhoResult.count ?? 0
    contagens.finalizado = countFinalizadoResult.count ?? 0
    contagens.arquivado = countArquivadoResult.count ?? 0
    contagens.todos = contagens.rascunho + contagens.finalizado + contagens.arquivado
    contagens.ativos = contagens.rascunho + contagens.finalizado
  } catch (error) {
    unavailable = true
    console.error("Orcamentos: failed to load", error)
  }

  const pageCount = Math.max(1, Math.ceil(contagens[statusAtivo] / pageSize))
  const pageHref = (next: number) => `/admin/orcamentos?${new URLSearchParams({ status: statusAtivo, q: qAtivo, page: String(next) })}`
  if (!unavailable && page > pageCount) redirect(pageHref(pageCount))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500">
            Estimativas preliminares geradas via admin (formulário ou planilha).
          </p>
        </div>
        <Link href={commercialHref("/admin/orcamentos/novo", pageHref(page))}>
          <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </Link>
      </div>

      {unavailable ? (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          Não foi possível carregar os orçamentos agora. Tente atualizar a página.
        </div>
      ) : (
        <>
          <OrcamentosFiltros statusAtivo={statusAtivo} qAtivo={qAtivo} contagens={contagens} />
          <OrcamentosTable orcamentos={orcamentos} returnTo={pageHref(page)} />
          <nav aria-label="Páginas de orçamentos" className="flex items-center justify-between text-sm"><span>{contagens[statusAtivo]} orçamentos · Página {page} de {pageCount}</span><div className="flex gap-4">{page > 1 && <Link className="inline-flex min-h-11 items-center underline" href={pageHref(page - 1)}>Anterior</Link>}{page < pageCount && <Link className="inline-flex min-h-11 items-center underline" href={pageHref(page + 1)}>Próxima</Link>}</div></nav>
        </>
      )}
    </div>
  )
}
