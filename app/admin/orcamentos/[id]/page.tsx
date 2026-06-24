import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeroUpload } from "@/components/admin/orcamentos/HeroUpload"
import { GerarPdfButton } from "@/components/admin/orcamentos/GerarPdfButton"
import { PADROES_ACABAMENTO, REGIMES_COMERCIAIS } from "@/lib/orcamento-estimativa-data"
import type { Orcamento } from "@/types/orcamento-estimativa"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}

function formatarData(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString("pt-BR")
}

export default async function OrcamentoDetalhePage({ params }: PageProps) {
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
  const o = data as Orcamento

  const padrao = PADROES_ACABAMENTO.find((p) => p.id === o.projeto_padrao)?.nome
  const regime =
    o.regime_recomendado === "indefinido"
      ? "A definir"
      : REGIMES_COMERCIAIS.find((r) => r.id === o.regime_recomendado)?.nome

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/orcamentos"
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 mb-2"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar para lista
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {o.cliente_nome}
            </h1>
            <p className="text-sm text-neutral-500 font-mono">{o.numero}</p>
          </div>
          <Badge variant={o.status === "finalizado" ? "default" : "secondary"}>
            {o.status === "rascunho" ? "Rascunho" : o.status === "finalizado" ? "Finalizado" : "Arquivado"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Cliente</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-neutral-500">Nome</dt>
                <dd className="text-neutral-900">{o.cliente_nome}</dd>
              </div>
              {o.cliente_email && (
                <div>
                  <dt className="text-xs text-neutral-500">E-mail</dt>
                  <dd className="text-neutral-900">{o.cliente_email}</dd>
                </div>
              )}
              {o.cliente_telefone && (
                <div>
                  <dt className="text-xs text-neutral-500">Telefone</dt>
                  <dd className="text-neutral-900">{o.cliente_telefone}</dd>
                </div>
              )}
              {o.responsavel_tecnico && (
                <div>
                  <dt className="text-xs text-neutral-500">Responsável técnico</dt>
                  <dd className="text-neutral-900">{o.responsavel_tecnico}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Obra & Projeto</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="col-span-2">
                <dt className="text-xs text-neutral-500">Endereço</dt>
                <dd className="text-neutral-900">
                  {o.obra_endereco}, {o.obra_cidade}
                </dd>
              </div>
              {o.obra_referencia && (
                <div className="col-span-2">
                  <dt className="text-xs text-neutral-500">Referência</dt>
                  <dd className="text-neutral-900">{o.obra_referencia}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-neutral-500">Área</dt>
                <dd className="text-neutral-900">{o.projeto_area_m2} m²</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Pavimentos</dt>
                <dd className="text-neutral-900">{o.projeto_pavimentos}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Piscina</dt>
                <dd className="text-neutral-900">{o.projeto_piscina ?? "Não"}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Padrão</dt>
                <dd className="text-neutral-900">{padrao}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Valores & Regime</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-neutral-500">Faixa total</dt>
                <dd className="text-neutral-900 font-mono tabular-nums">
                  {formatarMoeda(o.valor_min)} – {formatarMoeda(o.valor_max)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Faixa por m²</dt>
                <dd className="text-neutral-900 font-mono tabular-nums">
                  {formatarMoeda(o.valor_m2_min)} – {formatarMoeda(o.valor_m2_max)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Regime recomendado</dt>
                <dd className="text-neutral-900">{regime}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Data de cotação</dt>
                <dd className="text-neutral-900">{formatarData(o.data_cotacao)}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Data de elaboração</dt>
                <dd className="text-neutral-900">{formatarData(o.data_elaboracao)}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Validade</dt>
                <dd className="text-neutral-900">{o.validade_dias} dias</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-neutral-400">
              Edição plena chega no Sprint 3 (wizard).
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <HeroUpload orcamentoId={o.id} />

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">PDF</h3>
            <GerarPdfButton orcamentoId={o.id} />
            {o.pdf_url && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 mb-2">Última versão gerada:</p>
                <a
                  href={o.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-neutral-900 hover:underline"
                >
                  Abrir PDF <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
