import { HeroPage } from "@/components/sections/HeroPage";
import { Stats } from "@/components/sections/Stats";
import { BerkahnTimeline } from "@/components/timeline/BerkahnTimeline";
import { CTA } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export const metadata = {
  title: "Empresa | Berkahn Steel Frame",
  description:
    "25 anos de experiência em Light Steel Frame. Conheça a história da Berkahn e nossa trajetória de inovação e excelência.",
};

export default function EmpresaPage() {
  return (
    <>
      {/* Hero */}
      <HeroPage
        title="Nossa História"
        subtitle="25 anos erguendo o amanhã"
        imageSrc="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
        imageAlt="Berkahn - Nossa História"
      />

      {/* Introduction */}
      <section className="py-xl">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <RevealOnScroll>
              <h2 className="headline-md mb-6">
                Inovação e excelência em cada projeto
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p className="body-md mb-6 text-black-70">
                Fundada em 1999, a Berkahn nasceu com a missão de revolucionar
                o mercado de construção brasileiro, trazendo tecnologia,
                sustentabilidade e processos industrializados para a realização
                de projetos residenciais de alto padrão.
              </p>
              <p className="body-md text-black-70">
                Ao longo de mais de duas décadas, consolidamos nossa expertise
                em Light Steel Frame (LSF), tornando-nos referência nacional em
                construções que combinam leveza estrutural, precisão
                milimétrica e acabamento superior.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Stats />

      {/* Story */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <h2 className="headline-md mb-6 text-center">Nossa Jornada</h2>
            <p className="body-md text-black-70 mb-6">
              Desde o início, nossa missão foi clara: democratizar a construção
              de qualidade no Brasil. Ao introduzir o Light Steel Frame como
              sistema construtivo principal, trouxemos para o mercado
              residencial brasileiro uma tecnologia que une velocidade de
              execução, sustentabilidade e desempenho estrutural superior.
            </p>
            <p className="body-md text-black-70">
              Hoje, com mais de 500 projetos concluídos e uma equipe de
              profissionais altamente especializados, continuamos comprometidos
              em transformar sonhos em realidade, entregando casas que
              combinam inovação, conforto e durabilidade.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Timeline */}
      <BerkahnTimeline />

      {/* Values */}
      <section className="py-xl bg-black-5">
        <div className="container">
          <RevealOnScroll>
            <h2 className="headline-md mb-12 text-center">Nossos Valores</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <RevealOnScroll delay={0.1}>
              <div className="text-center">
                <h3 className="headline-sm mb-4">Excelência</h3>
                <p className="body-md text-black-70">
                  Compromisso inabalável com qualidade e precisão em cada
                  detalhe dos nossos projetos.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <div className="text-center">
                <h3 className="headline-sm mb-4">Inovação</h3>
                <p className="body-md text-black-70">
                  Buscamos constantemente novas tecnologias e métodos para
                  entregar soluções cada vez mais eficientes.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.3}>
              <div className="text-center">
                <h3 className="headline-sm mb-4">Sustentabilidade</h3>
                <p className="body-md text-black-70">
                  Construímos com responsabilidade ambiental, minimizando
                  resíduos e otimizando recursos.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA />
    </>
  );
}
