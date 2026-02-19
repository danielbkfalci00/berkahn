import Image from "next/image";
import { CTA } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { WallLayersTabs } from "@/components/lsf/WallLayersTabs";
import { TechnicalSpecs } from "@/components/lsf/TechnicalSpecs";
import { ComparisonTable } from "@/components/lsf/ComparisonTable";
import { FAQ } from "@/components/lsf/FAQ";
import { LSF_FAQ } from "@/lib/lsf-data";

export const metadata = {
  title: "Light Steel Frame | Berkahn Steel Frame",
  description:
    "Sistema construtivo Light Steel Frame: construção industrializada com velocidade, sustentabilidade e eficiência energética. Alta performance com precisão milimétrica.",
};

export default function LSFPage() {
  return (
    <>
      {/* 1. Hero Parallax */}
      <ParallaxHero
        title="Light Steel Frame"
        backgroundImage="/images/Lsf/lsf-hero-structure.webp"
        height="100vh"
      />

      {/* 2. Introduction */}
      <section className="pt-xl pb-lg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <RevealOnScroll>
              <div>
                <p className="label-text mb-4">SISTEMA CONSTRUTIVO INDUSTRIALIZADO</p>

                <div className="space-y-4">
                  <p className="body-lg text-black-70">
                    O Light Steel Frame (LSF) é um sistema construtivo industrializado a seco caracterizado pela utilização de uma estrutura primária formada por perfis leves de aço galvanizado (aço estrutural de conformação a frio).
                  </p>
                  <p className="body-lg text-black-70">
                    Esse sistema representa o estado atual da construção racionalizada, com alta precisão geométrica, controle de qualidade e redução drástica de resíduos no canteiro de obras.
                  </p>
                  <p className="body-lg text-black-70">
                    Os perfis de aço compõem o esqueleto estrutural em painéis modulares, suportando lajes, paredes e coberturas em edificações de pequeno e médio porte.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="relative h-[500px]">
                <Image
                  src="/images/Lsf/lsf-1.webp"
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

      {/* 3. Composição do Sistema - NOVA SEÇÃO */}
      <section className="pt-0 pb-md bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Coluna 1: IMAGEM (esquerda no desktop, segunda no mobile) */}
            <RevealOnScroll className="order-2 lg:order-1">
              <div className="relative h-[500px] lg:h-[650px] overflow-hidden">
                <Image
                  src="/images/Lsf/lsf-wall-layers-diagram.webp"
                  alt="Diagrama técnico das camadas de parede LSF"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </RevealOnScroll>

            {/* Coluna 2: TEXTO (direita no desktop, primeira no mobile) */}
            <RevealOnScroll delay={0.2} className="order-1 lg:order-2">
              <div>
                <h2 className="headline-md mb-4">A Composição do Sistema</h2>
                <h3 className="text-xl font-medium mb-6 text-black-70">
                  Soluções que se adaptam ao seu projeto
                </h3>

                <div className="space-y-4">
                  <p className="body-lg text-black-70 leading-relaxed">
                    No LSF, as paredes funcionam como sistemas multicamadas que entregam
                    estanqueidade, isolamento e acabamento superiores à alvenaria
                    convencional.
                  </p>
                  <p className="body-lg text-black-70 leading-relaxed">
                    Para cada tipo de projeto, desenvolvemos uma composição específica
                    — espessuras, materiais isolantes, revestimentos e acabamentos são
                    definidos de acordo com as necessidades técnicas e preferências de
                    cada cliente.
                  </p>
                </div>

                {/* Tags de tipos de projeto */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {["Residencial", "Comercial", "Industrial", "Reformas"].map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-black-5 text-xs font-medium text-black-70 tracking-wide"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-black-50 mt-6 leading-relaxed">
                  O diagrama ao lado e as camadas detalhadas abaixo ilustram uma
                  composição padrão para projetos residenciais.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* 5. LSF Diagram - Sistema de 7 Camadas */}
      <section className="pt-lg pb-2xl bg-black-5">
        <div className="container">
          <RevealOnScroll>
            <h2 className="headline-md text-center mb-12">
              Sistema de 6 Camadas
            </h2>
            <p className="body-md text-black-70 text-center max-w-3xl mx-auto mb-16">
              Exemplo de composição para projetos residenciais. O sistema multicamadas
              pode ser adaptado conforme as exigências de cada projeto — isolamento
              térmico, acústico, proteção contra intempéries e resistência ao fogo
              variam de acordo com a aplicação.
            </p>
          </RevealOnScroll>

          <WallLayersTabs />
        </div>
      </section>

      {/* 6. Technical Specs */}
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

      {/* 7. Project Gallery */}
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

      {/* 8. FAQ */}
      <section className="py-xl bg-black-5">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <p className="label-text text-center mb-4">DÚVIDAS FREQUENTES</p>
            <h2 className="headline-md text-center mb-12">
              Perguntas Frequentes sobre o Light Steel Frame
            </h2>
          </RevealOnScroll>

          <FAQ />
        </div>
      </section>

      {/* 9. CTA */}
      <CTA />

      {/* FAQ Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: LSF_FAQ.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </>
  );
}
