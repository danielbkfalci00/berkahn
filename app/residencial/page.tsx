import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { Partners } from "@/components/sections/Partners";
import { CTA } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ResidencialContactForm } from "@/components/residencial/ResidencialContactForm";
import { BrazilMapBeam } from "@/components/comercial/BrazilMapBeam";
import { DomeGallery } from "@/components/presentation/DomeGallery";
import { FocusCardsSection } from "@/components/residencial/FocusCardsSection";
import { BenefitsMorphingGrid } from "@/components/residencial/BenefitsMorphingGrid";
import { TransparencyAccordion } from "@/components/residencial/TransparencyAccordion";
import {
  RESIDENCIAL_SERVICES,
  RESIDENCIAL_BENEFITS_SCROLL,
  RESIDENCIAL_TRANSPARENCY_BLOCKS,
  RESIDENCIAL_PROCESS_STEPS,
  GALLERY_IMAGES_PROJECTS,
} from "@/lib/residencial-data";

export const metadata = {
  title: "Residencial | Berkahn Steel Frame",
  description:
    "Construção residencial com velocidade e precisão industrial. Construção nova, reforma ou ampliação com Light Steel Frame: obra rápida, limpa e com orçamento previsível.",
};

export default function ResidencialPage() {
  return (
    <>
      {/* ================================================================ */}
      {/* 1. Hero Section */}
      {/* ================================================================ */}
      <ParallaxHero
        label="CONSTRUÇÃO RESIDENCIAL"
        title="Construção residencial com velocidade e precisão industrial."
        subtitle="Construção nova, reforma ou ampliação com Light Steel Frame. Obra rápida, limpa e com orçamento fechado desde o início."
        ctaText="Fale com a Berkahn"
        ctaHref="#formulario"
        backgroundImage="/images/Residencial/hero-01.webp"
        images={[
          "/images/Residencial/hero-01.webp",
          "/images/Residencial/hero-02.webp",
          "/images/Residencial/hero-03.webp",
        ]}
      />

      {/* ================================================================ */}
      {/* 2. O que fazemos — Focus Cards */}
      {/* ================================================================ */}
      <section className="pt-xl pb-lg">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">O QUE FAZEMOS POR VOCÊ</p>
            <h2 className="headline-md mb-6">
              A Berkahn constrói, reforma e amplia.
            </h2>
            <p className="body-lg text-black-70 max-w-3xl mb-12">
              Nos EUA, mais de 90% das casas são construídas com métodos a seco — sem tijolos, sem argamassa. O Light Steel Frame é a evolução desse conceito: mais leve, mais preciso e 100% reciclável. A Berkahn trouxe essa tecnologia para o Brasil com engenharia própria e cobre o ciclo completo da sua obra.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <FocusCardsSection cards={RESIDENCIAL_SERVICES} />
          </RevealOnScroll>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. Por que Steel Frame — MorphingDialog Grid */}
      {/* ================================================================ */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">POR QUE STEEL FRAME</p>
            <h2 className="headline-md mb-6">
              O que muda quando a estrutura é industrializada.
            </h2>
            <p className="body-lg text-black-70 max-w-3xl mb-12">
              A diferença entre Steel Frame e alvenaria aparece na obra e continua depois que você mora no imóvel.
            </p>
          </RevealOnScroll>

          <BenefitsMorphingGrid benefits={RESIDENCIAL_BENEFITS_SCROLL} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. O nosso processo */}
      {/* ================================================================ */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">NOSSO PROCESSO</p>
            <h2 className="headline-md mb-6">
              Do primeiro contato à entrega das chaves.
            </h2>
            <p className="body-lg text-black-70 max-w-3xl mb-16">
              Você acompanha cada etapa, do orçamento ao acabamento.
            </p>
          </RevealOnScroll>

          <ProcessTimeline steps={RESIDENCIAL_PROCESS_STEPS} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. O que você precisa saber — Transparência */}
      {/* ================================================================ */}
      <section className="py-xl bg-black-5">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <p className="label-text mb-4">O QUE VOCÊ PRECISA SABER</p>
            <h2 className="headline-md mb-6">
              O que vale saber antes de decidir.
            </h2>
            <p className="body-lg text-black-70 mb-12">
              O Steel Frame tem vantagens claras e pontos que pedem atenção. Preferimos que você saiba de tudo antes de fechar.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <TransparencyAccordion items={RESIDENCIAL_TRANSPARENCY_BLOCKS} />
          </RevealOnScroll>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. CTA para /lsf */}
      {/* ================================================================ */}
      <CTA
        label="LIGHT STEEL FRAME"
        title="Quer entender o sistema construtivo a fundo?"
        description="Saiba como o Light Steel Frame funciona, suas camadas, especificações técnicas e por que é o futuro da construção."
        actionType="link"
        actionText="Conheça o Light Steel Frame"
        actionHref="/lsf"
      />

      {/* ================================================================ */}
      {/* 7. Design & Personalização — DomeGallery (bg preto) */}
      {/* ================================================================ */}
      <section className="py-xl bg-black">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* DomeGallery — projetos residenciais */}
            <div className="order-2 lg:order-1 h-[400px] md:h-[500px]">
              <DomeGallery
                images={GALLERY_IMAGES_PROJECTS}
                fit={0.7}
                minRadius={400}
                segments={20}
                grayscale={false}
                overlayBlurColor="#000000"
              />
            </div>

            {/* Text Column */}
            <RevealOnScroll delay={0.2} className="order-1 lg:order-2">
              <div>
                <p className="label-text text-white/50 mb-4">DESIGN & PERSONALIZAÇÃO</p>
                <h2 className="headline-md text-white mb-8">
                  Projeto sob medida, do traço ao acabamento.
                </h2>
                <p className="body-lg text-white/70">
                  A Berkahn trabalha com arquitetas parceiras em diferentes linguagens de design. O Steel Frame dá liberdade criativa ao projeto mantendo prazo e orçamento sob controle.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. Partners */}
      {/* ================================================================ */}
      <Partners
        label="PARCERIAS QUE SUSTENTAM A QUALIDADE"
        title="Marcas que Garantem o Padrão Berkahn"
        marquee
      />

      {/* ================================================================ */}
      {/* 9. Formulário de contato */}
      {/* ================================================================ */}
      <section id="formulario" className="py-xl bg-black-5">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left column: Info + Map */}
            <div>
              <RevealOnScroll>
                <p className="label-text mb-4">FALE CONOSCO</p>
                <h2 className="headline-md mb-6">
                  Fale com a Berkahn sobre o seu projeto.
                </h2>
                <p className="body-lg text-black-70 mb-8">
                  Descreva o que você tem em mente. Respondemos com uma análise técnica inicial, sem compromisso.
                </p>
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
                <ResidencialContactForm />
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

      {/* ================================================================ */}
      {/* 10. CTA corporativas */}
      {/* ================================================================ */}
      <CTA
        label="SOLUÇÕES CORPORATIVAS"
        title="A Berkahn também atende empresas."
        description="Projetos comerciais, industriais ou construções temporárias em Steel Frame. Veja como a Berkahn pode atender seu negócio."
        actionType="link"
        actionText="Conheça nossas soluções corporativas"
        actionHref="/comercial-industrial"
      />
    </>
  );
}
