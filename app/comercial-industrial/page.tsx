import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SegmentSolutions } from "@/components/comercial/SegmentSolutions";
import { ESGSection } from "@/components/comercial/ESGSection";
import { MetricsCards } from "@/components/comercial/MetricsCards";
import { ContentBlocksGrid } from "@/components/sections/ContentBlocksGrid";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CorporateContactForm } from "@/components/comercial/CorporateContactForm";
import { CTA } from "@/components/sections/CTA";
import {
  SEGMENT_SOLUTIONS,
  ESG_PILLARS,
  COMERCIAL_TRANSPARENCY_BLOCKS,
  COMERCIAL_METRICS,
  COMERCIAL_PROCESS_STEPS,
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
            <p className="body-lg text-black-70 max-w-4xl mb-16">
              O Light Steel Frame (LSF) é um sistema construtivo industrializado
              que utiliza perfis de aço galvanizado como estrutura. Diferente da
              construção convencional em alvenaria, o LSF trabalha com peças
              fabricadas sob medida em ambiente industrial e montadas no canteiro
              com velocidade, precisão e mínima geração de resíduos. A Berkahn
              aplica essa tecnologia em projetos comerciais, industriais e em
              construções temporárias, sempre combinando o LSF com sistemas
              híbridos quando o projeto exige.
            </p>
          </RevealOnScroll>

          <SegmentSolutions data={SEGMENT_SOLUTIONS} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. ESG e sustentabilidade */}
      {/* ================================================================ */}
      <section className="py-xl bg-black">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text text-white/40 mb-4">ESG & SUSTENTABILIDADE</p>
            <h2 className="headline-md text-white mb-6">
              Steel Frame e ESG: construir com responsabilidade é construir com
              inteligência.
            </h2>
            <p className="body-lg text-white/70 max-w-4xl mb-16">
              A construção civil é responsável por 37% das emissões globais de
              gases de efeito estufa, segundo o Programa das Nações Unidas para
              o Meio Ambiente (UNEP). Para empresas com compromissos ESG reais, a
              escolha do sistema construtivo é uma decisão estratégica que
              impacta diretamente os indicadores ambientais, sociais e de
              governança do negócio. O Light Steel Frame se alinha naturalmente
              às três dimensões do ESG. É uma consequência técnica do processo,
              documentada e mensurável.
            </p>
          </RevealOnScroll>

          <ESGSection data={ESG_PILLARS} />
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

          <ContentBlocksGrid data={COMERCIAL_TRANSPARENCY_BLOCKS} columns={2} />
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
            <p className="body-lg text-white/70 max-w-4xl mb-16">
              Dados concretos sobre o desempenho do Steel Frame em projetos
              comerciais e industriais. Cada métrica é documentada e verificável
              no projeto executivo.
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
            <p className="body-lg text-black-70 max-w-4xl mb-16">
              Um processo estruturado para que cada etapa do projeto tenha
              clareza, previsibilidade e controle. Da primeira reunião à entrega
              das chaves, você sabe exatamente onde está e o que vem a seguir.
            </p>
          </RevealOnScroll>

          <ProcessTimeline steps={COMERCIAL_PROCESS_STEPS} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. Formulário de contato corporativo */}
      {/* ================================================================ */}
      <section id="formulario" className="py-xl bg-black-5">
        <div className="container max-w-3xl">
          <RevealOnScroll>
            <p className="label-text mb-4">FALE COM A BERKAHN</p>
            <h2 className="headline-md mb-6">
              Conte-nos sobre o seu projeto.
            </h2>
            <p className="body-lg text-black-70 mb-12">
              Preencha o formulário abaixo e nossa equipe entrará em contato
              para uma consultoria técnica inicial, sem compromisso.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <CorporateContactForm />
          </RevealOnScroll>
        </div>
      </section>

      {/* 8. CTA de redirecionamento */}
      <CTA
        label="CONSTRUINDO PARA A SUA FAMÍLIA?"
        title="Construindo para a sua família?"
        description="Se o seu projeto é residencial, construção nova, reforma ou ampliação, conheça o que a Berkahn pode fazer pela sua casa."
        actionType="link"
        actionText="Conheça nossas soluções residenciais"
        actionHref="/residencial"
      />
    </>
  );
}
