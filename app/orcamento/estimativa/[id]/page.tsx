import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { createServiceClient } from "@/lib/supabase/admin"
import { validarToken, ORCAMENTO_TOKEN_HEADER } from "@/lib/orcamento-token"
import type { Orcamento } from "@/types/orcamento-estimativa"
import { CapaHero } from "@/components/orcamento/estimativa/CapaHero"
import { IndiceEstimativa } from "@/components/orcamento/estimativa/IndiceEstimativa"
import { NaturezaDocumento } from "@/components/orcamento/estimativa/NaturezaDocumento"
import { SobreBerkahn } from "@/components/orcamento/estimativa/SobreBerkahn"
import { OQueEntregamos } from "@/components/orcamento/estimativa/OQueEntregamos"
import { PadroesAcabamento } from "@/components/orcamento/estimativa/PadroesAcabamento"
import { EstimativaInvestimento } from "@/components/orcamento/estimativa/EstimativaInvestimento"
import { Premissas } from "@/components/orcamento/estimativa/Premissas"
import { CondicionantesExclusoes } from "@/components/orcamento/estimativa/CondicionantesExclusoes"
import { RegimesComerciais } from "@/components/orcamento/estimativa/RegimesComerciais"
import { ProximosPassos } from "@/components/orcamento/estimativa/ProximosPassos"
import { ContatoFinal } from "@/components/orcamento/estimativa/ContatoFinal"
import { SECOES_INDICE, HERO_DEFAULT } from "@/lib/orcamento-estimativa-data"
import styles from "./styles.module.css"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

async function resolveHeroUrl(
  supabase: ReturnType<typeof createServiceClient>,
  heroPath: string | null
): Promise<string> {
  if (!heroPath) return HERO_DEFAULT
  if (heroPath.startsWith("http")) return heroPath
  const { data } = await supabase.storage
    .from("orcamento-heroes")
    .createSignedUrl(heroPath, 60 * 10)
  return data?.signedUrl ?? HERO_DEFAULT
}

export default async function EstimativaPage({ params }: PageProps) {
  const { id } = await params
  const hdrs = await headers()
  const token = hdrs.get(ORCAMENTO_TOKEN_HEADER)
  if (!validarToken(id, token)) {
    notFound()
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("orcamentos")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }

  const orcamento = data as Orcamento
  const heroUrl = await resolveHeroUrl(
    supabase,
    orcamento.hero_image_url
  )

  return (
    <main className={styles.root}>
      <CapaHero
        clienteNome={orcamento.cliente_nome}
        numero={orcamento.numero}
        heroUrl={heroUrl}
        obraCidade={orcamento.obra_cidade}
        dataElaboracao={orcamento.data_elaboracao}
        validadeDias={orcamento.validade_dias}
      />
      <IndiceEstimativa secoes={SECOES_INDICE} />
      <NaturezaDocumento />
      <SobreBerkahn />
      <OQueEntregamos categoriasAtivas={orcamento.entrega_categorias_ativas} />
      <PadroesAcabamento padraoEscolhido={orcamento.projeto_padrao} />
      <EstimativaInvestimento
        valorMin={orcamento.valor_min}
        valorMax={orcamento.valor_max}
        valorM2Min={orcamento.valor_m2_min}
        valorM2Max={orcamento.valor_m2_max}
      />
      <Premissas
        areaM2={orcamento.projeto_area_m2}
        pavimentos={orcamento.projeto_pavimentos}
        padrao={orcamento.projeto_padrao}
        regime={orcamento.regime_recomendado}
        dataCotacao={orcamento.data_cotacao}
        validadeDias={orcamento.validade_dias}
        cidade={orcamento.obra_cidade}
        piscina={orcamento.projeto_piscina}
        obraReferencia={orcamento.obra_referencia}
      />
      <CondicionantesExclusoes
        condicionantesExtras={orcamento.condicionantes_extras}
        exclusoesExtras={orcamento.exclusoes_extras}
      />
      <RegimesComerciais regimeRecomendado={orcamento.regime_recomendado} />
      <ProximosPassos />
      <ContatoFinal responsavelTecnico={orcamento.responsavel_tecnico} />
    </main>
  )
}
