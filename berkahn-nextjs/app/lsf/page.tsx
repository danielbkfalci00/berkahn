import Image from "next/image";
import { CTA } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { LSFDiagram } from "@/components/lsf/LSFDiagram";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { TechnicalSpecs } from "@/components/lsf/TechnicalSpecs";
import { ComparisonTable } from "@/components/lsf/ComparisonTable";
import { ConstructionTimeline } from "@/components/lsf/ConstructionTimeline";

export const metadata = {
  title: "Light Steel Frame | Berkahn Steel Frame",
  description:
    "Descubra o sistema construtivo Light Steel Frame: tecnologia industrializada que combina velocidade, sustentabilidade e eficiência energética. Construção de alta performance com precisão milimétrica.",
};

export default function LSFPage() {
  return (
    <>
      {/* 1. Hero Parallax */}
      <ParallaxHero
        title="Light Steel Frame"
        subtitle="Construção Industrializada de Alta Performance"
        backgroundImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
        height="100vh"
      />

      {/* 2. Introduction */}
      <section className="py-xl">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <RevealOnScroll>
              <div>
                <p className="label-text mb-4">SISTEMA CONSTRUTIVO INDUSTRIALIZADO</p>
                <h2 className="headline-lg mb-6">O Futuro da Construção Já Chegou</h2>
                <p className="body-md text-black-70 mb-4">
                  O Light Steel Frame (LSF) representa a evolução da construção civil, combinando a resistência do aço com a leveza e precisão da construção industrializada. Com origem na América do Norte e Europa, o sistema chegou ao Brasil trazendo consigo padrões internacionais de qualidade, velocidade e sustentabilidade.
                </p>
                <p className="body-md text-black-70">
                  Na BERKAHN, dominamos esta tecnologia e a adaptamos à realidade brasileira, garantindo construções que superam os métodos tradicionais em todos os aspectos: tempo, custo, qualidade e impacto ambiental.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="relative h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
                  alt="Estrutura Light Steel Frame"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 3. LSF Diagram - FEATURE HERO */}
      <section className="py-2xl bg-black-5">
        <div className="container">
          <RevealOnScroll>
            <h2 className="headline-md text-center mb-12">
              Sistema de 7 Camadas
            </h2>
            <p className="body-md text-black-70 text-center max-w-3xl mx-auto mb-16">
              O Light Steel Frame utiliza um sistema multicamadas que garante isolamento térmico e acústico superior, proteção contra intempéries e durabilidade estrutural.
            </p>
          </RevealOnScroll>

          <LSFDiagram />
        </div>
      </section>

      {/* 4. Benefits Grid */}
      <BenefitsGrid />

      {/* 5. Technical Specs */}
      <section className="py-xl bg-black-5">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <h2 className="headline-md text-center mb-12">
              Especificações Técnicas
            </h2>
          </RevealOnScroll>

          <TechnicalSpecs />
        </div>
      </section>

      {/* 6. Comparison Table */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <h2 className="headline-md text-center mb-12">
              LSF vs. Construção Tradicional
            </h2>
          </RevealOnScroll>

          <ComparisonTable />
        </div>
      </section>

      {/* 7. Construction Timeline */}
      <ConstructionTimeline />

      {/* 8. Project Gallery */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <h2 className="headline-md text-center mb-12">
              Projetos em Light Steel Frame
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gallery Images */}
            <div className="relative h-[400px] group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Residência Contemporânea"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-heading text-xl">Residência Contemporânea 180m²</p>
              </div>
            </div>

            <div className="relative h-[400px] group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Casa de Campo"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-heading text-xl">Casa de Campo com Varanda Integrada</p>
              </div>
            </div>

            <div className="relative h-[400px] group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Sobrado Moderno"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-heading text-xl">Sobrado Moderno 250m²</p>
              </div>
            </div>

            <div className="relative h-[400px] group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Escritório Corporativo"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-heading text-xl">Escritório Corporativo</p>
              </div>
            </div>

            <div className="relative h-[400px] group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Interior Minimalista"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-heading text-xl">Interior Minimalista</p>
              </div>
            </div>

            <div className="relative h-[400px] group overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Fachada com Revestimento"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-heading text-xl">Fachada com Revestimento Cerâmico</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <CTA />
    </>
  );
}
