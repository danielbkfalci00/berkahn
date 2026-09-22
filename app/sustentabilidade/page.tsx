import type { Metadata } from "next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SustentabilidadeHero } from "@/components/sections/sustentabilidade/SustentabilidadeHero";
import { ExtractionTrack } from "@/components/sections/sustentabilidade/ExtractionTrack";
import { WallExploded } from "@/components/sections/sustentabilidade/WallExploded";
import { ImpactJourney } from "@/components/sections/sustentabilidade/WasteAndCycle";
import { PracticeList } from "@/components/sections/sustentabilidade/PracticeList";
import { CTA } from "@/components/sections/CTA";

const TITLE = "Sustentabilidade | Berkahn";
const DESCRIPTION =
  "Como o Light Steel Frame muda decisões de projeto, compra, montagem e destino dos materiais, e o que a Berkahn preserva em cada obra.";

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
 * /sustentabilidade: destino do CTA da seção "05 · impacto" da home.
 *
 * A tese: a construção convencional pressiona a extração e deixa resíduos; a
 * montagem a seco muda esse processo. A página concentra o movimento na
 * abertura das camadas da parede e usa a chegada da cor como virada narrativa.
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
      <ExtractionTrack />
      <WallExploded />
      <ImpactJourney />
      <PracticeList />
      <CTA
        variant="editorial"
        label="CONSTRUÇÃO A SECO"
        title="Veja como essas escolhas entram no seu projeto"
        actionText="Pedir uma análise do meu projeto"
        defaultSegment="residencial"
        description="Cada terreno e cada projeto pedem decisões próprias. Conte o que você quer construir e a gente mostra como o sistema pode entrar na sua obra."
        ctaLocation="sustentabilidade"
      />
    </>
  );
}
