import type { Metadata } from "next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SustentabilidadeHero } from "@/components/sections/sustentabilidade/SustentabilidadeHero";
import { ScaleStatement } from "@/components/sections/sustentabilidade/ScaleStatement";
import { ExtractionTrack } from "@/components/sections/sustentabilidade/ExtractionTrack";
import { ForestLayers } from "@/components/sections/sustentabilidade/ForestLayers";
import { WallExploded } from "@/components/sections/sustentabilidade/WallExploded";
import { WasteScales } from "@/components/sections/sustentabilidade/WasteScales";
import { SteelLoop } from "@/components/sections/sustentabilidade/SteelLoop";
import { PracticeList } from "@/components/sections/sustentabilidade/PracticeList";
import { CTA } from "@/components/sections/CTA";

const TITLE = "Sustentabilidade | Berkahn";
const DESCRIPTION =
  "O que uma obra extrai, desperdiça e deixa para trás, e o que a construção a seco em Light Steel Frame muda nessa conta. Com a procedência de cada número.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.berkahn.com.br/sustentabilidade",
    siteName: "Construtora Berkahn",
    type: "article",
    locale: "pt_BR",
    images: [
      {
        url: "/images/Compartilhamento/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Sustentabilidade Berkahn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/Compartilhamento/og-image.webp"],
  },
  alternates: {
    canonical: "/sustentabilidade",
    languages: { "pt-BR": "https://www.berkahn.com.br/sustentabilidade" },
  },
};

/**
 * /sustentabilidade — destino do CTA da seção "05 · impacto" da home.
 *
 * A tese: construir a seco muda o que a casa tira do mundo. A página segue a
 * ordem extração → madeira → parede → resíduo → ciclo do aço → prática, e cada
 * seção tem a própria mecânica de scroll para nenhuma repetir a anterior:
 * parallax de plano no hero, contagem em duas velocidades no 01, track
 * horizontal pinado no 02, planos com desfoque fixo no 03, corte que se abre em
 * Z no 04, colunas que preenchem por clip-path no 05 e traçado que se fecha no
 * 06.
 *
 * Toda a procedência dos números vive em lib/sustentabilidade-data.ts. Nenhuma
 * fonte vai para a tela, por decisão do Bruno, mas nenhum número entra sem ela.
 */
export default function SustentabilidadePage() {
  return (
    <>
      {/* Organization já é declarada em app/layout.tsx; aqui só a página. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Sustentabilidade",
            description: DESCRIPTION,
            url: "https://www.berkahn.com.br/sustentabilidade",
            inLanguage: "pt-BR",
            isPartOf: { "@id": "https://www.berkahn.com.br/#website" },
            provider: { "@id": "https://www.berkahn.com.br/#organization" },
            about: {
              "@type": "Thing",
              name: "Construção a seco em Light Steel Frame e impacto ambiental",
            },
          }),
        }}
      />
      <SmoothScroll />
      <div className="relative">
        <Breadcrumb items={[{ name: "Sustentabilidade", href: "/sustentabilidade" }]} schemaOnly />
        <SustentabilidadeHero />
      </div>
      <ScaleStatement />
      <ExtractionTrack />
      <ForestLayers />
      <WallExploded />
      <WasteScales />
      <SteelLoop />
      <PracticeList />
      <CTA
        label="CONSTRUÇÃO A SECO"
        title="Vamos calcular isso no seu projeto"
        description="Cada terreno e cada programa mudam o que a obra consome. Conte o que você quer construir e a gente devolve o escopo, o prazo e o que o canteiro vai gerar."
        ctaLocation="sustentabilidade"
      />
    </>
  );
}
