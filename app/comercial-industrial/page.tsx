import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SegmentShowcase } from "@/components/comercial/SegmentShowcase";
import { ESGBentoGrid } from "@/components/comercial/ESGBentoGrid";
import { MetricsCards } from "@/components/comercial/MetricsCards";
import { TransparencyAccordion } from "@/components/comercial/TransparencyAccordion";
import { ProcessTimelineVisual } from "@/components/comercial/ProcessTimelineVisual";
import { CorporateContactForm } from "@/components/comercial/CorporateContactForm";
import { BrazilMapBeam } from "@/components/comercial/BrazilMapBeam";
import { CTA } from "@/components/sections/CTA";
import {
  SEGMENT_SOLUTIONS,
  COMERCIAL_TRANSPARENCY_BLOCKS,
  COMERCIAL_METRICS,
} from "@/lib/comercial-data";

export const metadata = {
  title: "Comercial & Industrial | Berkahn Steel Frame",
  description:
    "Construção inteligente para negócios que precisam de resultado. Lojas, galpões, escritórios, construções temporárias — projetos com Steel Frame entregues mais rápido, com mais controle e menos impacto ambiental.",
};

export default function ComercialIndustrialPage() {
  return (
    <>
      {/* 1. Hero Section */}
      <ParallaxHero
        label="CONSTRUÇÃO CORPORATIVA"
        title="Construção inteligente para negócios que precisam de resultado."
        subtitle="Lojas, galpões, escritórios, construções temporárias. A Berkahn projeta e executa com Steel Frame para entregar mais rápido, com mais controle e menos impacto ambiental."
        ctaText="Solicite uma consultoria"
        ctaHref="#formulario"
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
      />

      {/* ================================================================ */}
      {/* 2. Soluções por segmento */}
      {/* ================================================================ */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">SOLUÇÕES POR SEGMENTO</p>
            <h2 className="headline-md mb-6">
              Cada negócio tem uma demanda. A engenharia se adapta.
            </h2>
            <p className="body-lg text-black-70 max-w-3xl mb-16">
              Steel Frame aplicado a projetos comerciais, industriais e
              temporários — com sistemas híbridos quando o projeto exige.
            </p>
          </RevealOnScroll>
        </div>

        <SegmentShowcase
          data={SEGMENT_SOLUTIONS.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            image: s.image,
            imageAlt: s.imageAlt,
          }))}
        />
      </section>

      {/* ================================================================ */}
      {/* 3. ESG e sustentabilidade */}
      {/* ================================================================ */}
      <section className="py-xl bg-black">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text text-white/40 mb-4">ESG & SUSTENTABILIDADE</p>
            <h2 className="headline-md text-white mb-6">
              Impacto ambiental, social e de governança — documentado e
              mensurável.
            </h2>
            <p className="body-lg text-white/70 max-w-3xl mb-16">
              O Steel Frame se alinha naturalmente às três dimensões do ESG.
              Não é discurso — são dados técnicos do processo construtivo.
            </p>
          </RevealOnScroll>

          <ESGBentoGrid />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. O que você precisa saber */}
      {/* ================================================================ */}
      <section className="py-xl bg-black-5">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">O QUE VOCÊ PRECISA SABER</p>
            <h2 className="headline-md mb-6">
              Transparência para decisões informadas.
            </h2>
            <p className="body-lg text-black-70 max-w-4xl mb-16">
              O Steel Frame é uma tecnologia comprovada e cada vez mais adotada,
              mas tem características que exigem atenção em determinados
              cenários. Conhecer essas características é tão importante quanto
              conhecer as vantagens, e faz parte da consultoria que a Berkahn
              oferece.
            </p>
          </RevealOnScroll>

          <TransparencyAccordion data={COMERCIAL_TRANSPARENCY_BLOCKS} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. Métricas & ROI */}
      {/* ================================================================ */}
      <section className="py-xl bg-black">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text text-white/40 mb-4">MÉTRICAS & ROI</p>
            <h2 className="headline-md text-white mb-6">
              Os números que importam para a decisão.
            </h2>
            <p className="body-lg text-white/70 max-w-3xl mb-16">
              Dados concretos e verificáveis sobre o desempenho do Steel Frame.
            </p>
          </RevealOnScroll>

          <MetricsCards data={COMERCIAL_METRICS} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. Do briefing à operação */}
      {/* ================================================================ */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">PROCESSO</p>
            <h2 className="headline-md mb-6">
              Do briefing à operação.
            </h2>
            <p className="body-lg text-black-70 max-w-3xl mb-16">
              Cada etapa com clareza, previsibilidade e controle. Você sabe
              exatamente onde está e o que vem a seguir.
            </p>
          </RevealOnScroll>

          <ProcessTimelineVisual />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. Formulário de contato corporativo */}
      {/* ================================================================ */}
      <section id="formulario" className="py-xl bg-black-5">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left column: Info + Map */}
            <div>
              <RevealOnScroll>
                <p className="label-text mb-4">FALE COM A BERKAHN</p>
                <h2 className="headline-md mb-6">
                  Conte-nos sobre o seu projeto.
                </h2>
                <p className="body-lg text-black-70 mb-8">
                  Preencha o formulário e nossa equipe entrará em contato para
                  uma consultoria técnica inicial, sem compromisso.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <div className="flex flex-col gap-3 mb-12">
                  <a
                    href="mailto:contato@berkahn.com.br"
                    className="text-sm text-black-50 hover:text-black transition-colors"
                  >
                    contato@berkahn.com.br
                  </a>
                  <a
                    href="tel:+5511999999999"
                    className="text-sm text-black-50 hover:text-black transition-colors"
                  >
                    +55 (11) 99999-9999
                  </a>
                </div>
              </RevealOnScroll>

              {/* Map (desktop only) */}
              <RevealOnScroll delay={0.2}>
                <div className="hidden lg:block">
                  <BrazilMapBeam />
                </div>
              </RevealOnScroll>
            </div>

            {/* Right column: Form card */}
            <RevealOnScroll delay={0.15}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-input">
                <CorporateContactForm />
              </div>
            </RevealOnScroll>
          </div>

          {/* Map (mobile only — below form) */}
          <div className="lg:hidden mt-12">
            <RevealOnScroll>
              <BrazilMapBeam />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 8. CTA de redirecionamento */}
      <CTA
        label="PROJETO RESIDENCIAL?"
        title="Construindo para a sua família?"
        description="Se o seu projeto é residencial, construção nova, reforma ou ampliação, conheça o que a Berkahn pode fazer pela sua casa."
        actionType="link"
        actionText="Conheça nossas soluções residenciais"
        actionHref="/residencial"
      />
    </>
  );
}
