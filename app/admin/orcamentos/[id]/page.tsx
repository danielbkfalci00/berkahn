import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Archive } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HeroUpload } from "@/components/admin/orcamentos/HeroUpload"
import { GerarPdfButton } from "@/components/admin/orcamentos/GerarPdfButton"
import { ArquivarButton } from "@/components/admin/orcamentos/ArquivarButton"
import { BaixarPdfButton } from "@/components/admin/orcamentos/BaixarPdfButton"
import { PADROES_ACABAMENTO, REGIMES_COMERCIAIS } from "@/lib/orcamento-estimativa-data"
import type { Orcamento } from "@/types/orcamento-estimativa"
import { getOrcamentoPdfState } from "@/lib/orcamento-pdf-storage"
import { commercialHref, commercialReturnTo, leadHref } from "@/lib/admin/return-to"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ returnTo?: string | string[] }>
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

export default async function OrcamentoDetalhePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const returnTo = commercialReturnTo((await searchParams).returnTo)
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
  const pdfState = getOrcamentoPdfState(o)
  const pdfCurrent = pdfState === "current"
  const pdfLegacy = pdfState === "legacy"
  const linkedLead = o.lead_id ? leadHref(o.lead_id, returnTo) : null

  // Gera signed URL da hero (bucket privado) pra preview persistir entre reloads
  let heroPreviewUrl: string | null = null
  if (o.hero_image_url) {
    if (o.hero_image_url.startsWith("http")) {
      heroPreviewUrl = o.hero_image_url
    } else {
      const { data: signed } = await supabase.storage
        .from("orcamento-heroes")
        .createSignedUrl(o.hero_image_url, 60 * 60)
      heroPreviewUrl = signed?.signedUrl ?? null
    }
  }

  const padrao = PADROES_ACABAMENTO.find((p) => p.id === o.projeto_padrao)?.nome
  const regime =
    o.regime_recomendado === "indefinido"
      ? "A definir"
      : REGIMES_COMERCIAIS.find((r) => r.id === o.regime_recomendado)?.nome

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={returnTo}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 mb-2"
        >
          <ArrowLeft className="h-3 w-3" />
          {returnTo.startsWith("/admin/leads/") ? "Voltar para lead" : "Voltar para lista"}
        </Link>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {o.cliente_nome}
            </h1>
            <p className="text-sm text-neutral-500 font-mono">{o.numero}</p>
            {linkedLead && <Link href={linkedLead} className="inline-flex min-h-11 items-center text-sm underline">Abrir lead vinculado</Link>}
            {linkedLead && o.status === "finalizado" && <Link href={`${linkedLead}&atendimento=envio&orcamento=${encodeURIComponent(o.numero)}#atendimento`} className="ml-3 inline-flex min-h-11 items-center text-sm underline">Registrar envio e próximo contato</Link>}
          </div>
          <div className="flex items-center gap-3">
            {o.status !== "arquivado" && (
              <Link href={commercialHref(`/admin/orcamentos/${o.id}/edit`, returnTo)}>
                <Button variant="outline" size="sm">
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Editar
                </Button>
              </Link>
            )}
            <ArquivarButton orcamentoId={o.id} status={o.status} atualizadoEm={o.atualizado_em} />
            <Badge variant={o.status === "finalizado" ? "default" : "secondary"}>
              {o.status === "rascunho" ? "Rascunho" : o.status === "finalizado" ? "Finalizado" : "Arquivado"}
            </Badge>
          </div>
        </div>
      </div>

      {o.status === "arquivado" && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-2 text-sm text-amber-800">
            <Archive className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              Orçamento arquivado — desarquive para editar, atualizar hero ou
              gerar PDF.
            </span>
          </div>
        </Card>
      )}

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
              Para editar qualquer campo, use o botão Editar no topo da página.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          {o.status !== "arquivado" && (
            <HeroUpload
              key={o.atualizado_em}
              orcamentoId={o.id}
              atualizadoEm={o.atualizado_em}
              hasImage={Boolean(o.hero_image_url)}
              initialPreviewUrl={heroPreviewUrl}
            />
          )}

          {(o.status !== "arquivado" || o.pdf_storage_path) && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">PDF</h3>
              {o.status !== "arquivado" && (
                <GerarPdfButton orcamentoId={o.id} atualizadoEm={o.atualizado_em} />
              )}
              {o.pdf_storage_path && (
                <div
                  className={
                    o.status !== "arquivado"
                      ? "mt-4 pt-4 border-t border-neutral-200"
                      : ""
                  }
                >
                  <p className="text-xs text-neutral-500 mb-2">
                    {pdfCurrent ? `PDF atualizado${o.pdf_generated_at ? ` · ${new Date(o.pdf_generated_at).toLocaleString("pt-BR")}` : ""}` : pdfLegacy ? "PDF do acervo: a correspondência com os dados atuais não foi verificada. Confira o conteúdo antes de enviar." : "O documento mudou após a geração. Gere um PDF atualizado antes de enviar."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {(pdfCurrent || pdfLegacy) && <BaixarPdfButton
                      orcamentoId={o.id}
                      label={pdfLegacy ? "Baixar PDF do acervo" : "Baixar PDF"}
                      filename={`Orcamento-${o.numero}.pdf`}
                    />}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
