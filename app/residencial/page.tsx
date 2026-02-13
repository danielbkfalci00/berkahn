import Image from "next/image";
import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { PartnersFlowingMenu } from "@/components/residencial/PartnersFlowingMenu";
import { CTA } from "@/components/sections/CTA";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ComparisonBars } from "@/components/residencial/ComparisonBars";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ResidencialContactForm } from "@/components/residencial/ResidencialContactForm";
import { DomeGallery } from "@/components/presentation/DomeGallery";
import { FocusCardsSection } from "@/components/residencial/FocusCardsSection";
import { BenefitsMorphingGrid } from "@/components/residencial/BenefitsMorphingGrid";
import { TransparencyAccordion } from "@/components/residencial/TransparencyAccordion";
import { Masonry } from "@/components/ui/masonry";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/core/image-comparison";
import {
  RESIDENCIAL_SERVICES,
  RESIDENCIAL_BENEFITS_SCROLL,
  RESIDENCIAL_TRANSPARENCY_BLOCKS,
  RESIDENCIAL_COMPARISON_BARS,
  RESIDENCIAL_PROCESS_STEPS,
  GALLERY_MASONRY_ITEMS,
  GALLERY_IMAGES_PROJECTS,
  RESIDENCIAL_3D_GALLERY,
} from "@/lib/residencial-data";

export const metadata = {
  title: "Residencial | Berkahn Steel Frame",
  description:
    "Sua casa com a precisão de um processo industrial. Construção nova, reforma ou ampliação com Light Steel Frame: obra rápida, limpa e com orçamento previsível.",
};

export default function ResidencialPage() {
  return (
    <>
      {/* ================================================================ */}
      {/* 1. Hero Section */}
      {/* ================================================================ */}
      <ParallaxHero
        label="CONSTRUÇÃO RESIDENCIAL"
        title="Sua casa com a precisão de um processo industrial."
        subtitle="Construção nova, reforma ou ampliação com Light Steel Frame. Obra rápida, limpa e com orçamento fechado desde o início."
        ctaText="Fale com a Berkahn"
        ctaHref="#formulario"
        backgroundImage="/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp"
        images={[
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-lateral-piscina.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-living.webp",
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-cover.webp",
          "/images/hero/hero-home-1.webp",
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
              O Light Steel Frame é o sistema construtivo que domina mais de 90% das construções residenciais nos EUA, Canadá e Japão. A Berkahn trouxe essa tecnologia para o Brasil com engenharia própria e cobre o ciclo completo da sua obra.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <FocusCardsSection cards={RESIDENCIAL_SERVICES} />
          </RevealOnScroll>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. Partners */}
      {/* ================================================================ */}
      <PartnersFlowingMenu />

      {/* ================================================================ */}
      {/* 4. Por que Steel Frame — MorphingDialog Grid */}
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

          {/* Sub-block: Versatilidade arquitetônica + Masonry Grid */}
          <div className="mt-16 pt-16 border-t border-black-10">
            <RevealOnScroll>
              <h3 className="headline-sm mb-6">Versatilidade arquitetônica</h3>
              <p className="body-lg text-black-70 leading-relaxed max-w-3xl mb-12">
                O Steel Frame permite desde linhas minimalistas até fachadas com curvas complexas. Combinado com madeira, concreto aparente ou vidro, adapta-se a qualquer linguagem arquitetônica.
              </p>
            </RevealOnScroll>

            <Masonry
              items={GALLERY_MASONRY_ITEMS}
              scaleOnHover
              hoverScale={0.95}
              blurToFocus
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. Design & Personalização — DomeGallery (bg preto) */}
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
      {/* 6. Transparência — Accordion */}
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
      {/* 7. Reformas & Ampliações — Imagem + Texto */}
      {/* ================================================================ */}
      <section className="py-xl">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Before/After Comparison */}
            <RevealOnScroll>
              <ImageComparison
                className="aspect-[16/10] w-full rounded-lg border border-black-10 overflow-hidden"
                enableHover
                springOptions={{ bounce: 0.3 }}
              >
                <ImageComparisonImage
                  src="/images/Apresentação/estrutura-1.webp"
                  alt="Estrutura Steel Frame — antes do acabamento"
                  position="left"
                />
                <ImageComparisonImage
                  src="/images/Apresentação/acabamentos_2.webp"
                  alt="Casa finalizada — após acabamento"
                  position="right"
                />
                <ImageComparisonSlider className="w-0.5 bg-white/50 backdrop-blur-sm" />
              </ImageComparison>
            </RevealOnScroll>

            {/* Text */}
            <RevealOnScroll delay={0.2}>
              <div>
                <p className="label-text mb-4">REFORMAS & AMPLIAÇÕES</p>
                <h2 className="headline-md mb-6">
                  Reformar sem o caos de uma obra tradicional.
                </h2>
                <p className="body-lg text-black-70 mb-8">
                  O LSF pesa entre 60 e 100 kg/m², contra 1.200 a 1.500 kg/m² da alvenaria. Isso permite ampliar sobre lajes existentes sem reforço de fundação na maioria dos casos.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-heading font-semibold mb-1">Peso até 15x menor</p>
                      <p className="body-md text-black-70">Ampliações verticais sem reforço estrutural.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-heading font-semibold mb-1">Obra limpa e rápida</p>
                      <p className="body-md text-black-70">Canteiro limpo, o morador pode continuar no imóvel durante a obra.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-heading font-semibold mb-1">Prazo definido</p>
                      <p className="body-md text-black-70">Mesmo nível de planejamento de construções novas.</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. Comparativo LSF vs. Tradicional */}
      {/* ================================================================ */}
      <section className="py-xl bg-black-5">
        <div className="container max-w-5xl">
          <RevealOnScroll>
            <p className="label-text mb-4">COMPARATIVO</p>
            <h2 className="headline-md mb-6">
              Steel Frame vs. alvenaria: os dados.
            </h2>
            <p className="body-lg text-black-70 max-w-3xl mb-12">
              Veja como o Steel Frame se compara à construção tradicional nos critérios que mais importam.
            </p>
          </RevealOnScroll>

          <ComparisonBars data={RESIDENCIAL_COMPARISON_BARS} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. Como funciona o processo */}
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
      {/* 10. Formulário de contato */}
      {/* ================================================================ */}
      <section id="formulario" className="py-xl bg-black-5">
        <div className="container max-w-3xl">
          <RevealOnScroll>
            <p className="label-text mb-4">FALE CONOSCO</p>
            <h2 className="headline-md mb-4">
              Fale com a Berkahn sobre o seu projeto.
            </h2>
            <p className="body-lg text-black-70 mb-12">
              Descreva o que você tem em mente. Respondemos com uma análise técnica inicial, sem compromisso.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <ResidencialContactForm />
          </RevealOnScroll>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 11. CTA de redirecionamento */}
      {/* ================================================================ */}
      <CTA
        label="SOLUÇÕES CORPORATIVAS"
        title="A Berkahn também atende empresas."
        description="Projetos comerciais, industriais ou construções temporárias em Steel Frame. Veja como a Berkahn pode atender seu negócio."
        actionType="link"
        actionText="Conheça nossas soluções corporativas"
        actionHref="/comercial-industrial"
      />

      {/* ================================================================ */}
      {/* 12. Galeria 3D — Projetos */}
      {/* ================================================================ */}
      <section className="bg-white overflow-hidden">
        <ThreeDMarquee images={RESIDENCIAL_3D_GALLERY} />
      </section>
    </>
  );
}
