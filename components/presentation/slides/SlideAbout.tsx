"use client";

import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const paragraphs = [
  {
    text: (
      <>
        Reunindo mais de <strong>duas décadas de experiência</strong> em projetos
        residenciais e corporativos, nos orgulhamos de ser reconhecidos como uma
        empresa <strong>comprometida com a excelência</strong> em cada detalhe.
      </>
    ),
  },
  {
    text: (
      <>
        Nos destacamos pela habilidade de identificar e transformar as demandas
        dos nossos clientes em <strong>projetos e construções exclusivas</strong>,
        conduzindo todo o processo até a entrega do empreendimento pronto para uso.
      </>
    ),
  },
  {
    text: (
      <>
        Atuamos desde a elaboração de{" "}
        <strong>estudos de viabilidade e gerenciamento de projetos</strong> até a{" "}
        <strong>execução completa de obras</strong> em Steel Frame, sistema que nos
        permite entregar com mais qualidade, velocidade e sustentabilidade.
      </>
    ),
  },
  {
    text: (
      <>
        Acreditamos na <strong>transparência das ações</strong>, no{" "}
        <strong>respeito aos nossos clientes e parceiros</strong>, e na{" "}
        <strong>responsabilidade ambiental</strong> que a construção industrializada
        nos proporciona.
      </>
    ),
  },
];

export function SlideAbout() {
  return (
    <SlideSection className="py-20 lg:py-32">
      <div className="container max-w-3xl mx-auto px-6">
        {/* Label */}
        <RevealOnScroll className="text-center mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/40 mb-6">
            Quem Somos
          </p>
          <div className="w-12 h-px bg-black/20 mx-auto" />
        </RevealOnScroll>

        {/* Paragraphs */}
        <div className="space-y-8 lg:space-y-10">
          {paragraphs.map((para, index) => (
            <RevealOnScroll key={index} delay={index * 0.15}>
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-black/70 text-center font-light [&>strong]:font-semibold [&>strong]:text-black">
                {para.text}
              </p>
            </RevealOnScroll>
          ))}
        </div>

        {/* Decorative Separator */}
        <RevealOnScroll delay={0.6} className="mt-16 lg:mt-20">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-black/10" />
            <div className="w-2 h-2 bg-black/20 rotate-45" />
            <div className="w-16 h-px bg-black/10" />
          </div>
        </RevealOnScroll>
      </div>
    </SlideSection>
  );
}
