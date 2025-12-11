import Image from "next/image";
import { Stats } from "@/components/sections/Stats";
import { BerkahnTimeline } from "@/components/timeline/BerkahnTimeline";
import { CTA } from "@/components/sections/CTA";

export const metadata = {
  title: "Empresa | Berkahn Steel Frame",
  description:
    "Construtora moderna com expertise em Steel Frame e sistemas integrados. Conheça a BERKAHN e nossa abordagem inovadora na construção civil.",
};

export default function EmpresaPage() {
  return (
    <>
      {/* Hero - Apenas Texto */}
      <section className="py-2xl">
        <div className="container max-w-4xl">
          <h1 className="headline-lg text-center mb-12">Nossa História</h1>
          <div className="space-y-6">
            <p className="body-lg text-black-70">
              Nossa construtora nasce da união de anos de experiência em projetos,
              gerenciamento e execução de obras. Somos especialistas em soluções
              modernas de engenharia, com ênfase no Steel Frame, e nosso diferencial
              está na capacidade de integrar este sistema leve e eficiente com outras
              estruturas, incluindo concreto e aço laminado, para otimizar cada projeto.
            </p>
            <p className="body-lg text-black-70">
              A BERKAHN surge como uma empresa jovem, porém construída sobre bases
              sólidas e conhecimento empírico de seus fundadores. Após anos vivenciando
              de perto as limitações dos métodos tradicionais na engenharia residencial
              e corporativa — lidando com desperdícios, retrabalhos, atrasos e custos
              imprevisíveis que se repetem obra após obra — decidimos transformar a
              forma como se constrói no Brasil.
            </p>
            <p className="body-lg text-black-70">
              Nossa premissa reside na convicção de que construir bem exige mais do
              que empilhar materiais: exige método, precisão e propósito. Por isso,
              abandonamos as limitações do passado e introduzimos processos mais
              eficientes e tecnologias mais leves, rápidas e sustentáveis, reunindo
              conhecimento em planejamento e construção, sempre com foco em qualidade
              e desempenho. Somos, com orgulho, uma empresa brasileira com visão
              contemporânea, que utiliza esta integração de sistemas e processos
              industriais para oferecer mais qualidade, velocidade e sustentabilidade.
              A BERKAHN nasce com um propósito claro: elevar o padrão e a otimização
              da construção, proporcionando aos clientes uma experiência transparente,
              precisa e moderna, e entregando obras mais inteligentes, eficientes e
              humanas que resultem numa nova concepção de excelência na construção civil.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction - Imagem Full Width */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
          alt="Berkahn - Construção em Steel Frame"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </section>

      {/* Stats */}
      <Stats />

      {/* Story */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <h2 className="headline-md mb-6 text-center">Nossa Jornada</h2>
          <p className="body-md text-black-70 mb-6">
            Nossa fundação foi motivada pela experiência dos fundadores no mercado
            brasileiro de construção. Ao observar os desafios recorrentes — desperdícios,
            prazos estendidos e falta de previsibilidade —, decidimos criar uma empresa
            que operasse de forma diferente, introduzindo o Light Steel Frame e processos
            industrializados como pilares de eficiência e qualidade.
          </p>
          <p className="body-md text-black-70">
            Hoje, com uma equipe de profissionais altamente especializados e um portfólio
            crescente de projetos, continuamos comprometidos em transformar a forma como
            se constrói no Brasil, entregando residências que combinam inovação, conforto
            e durabilidade.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <BerkahnTimeline />

      {/* Values */}
      <section className="py-xl bg-black-5">
        <div className="container">
          <h2 className="headline-md mb-12 text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <h3 className="headline-sm mb-4">Excelência</h3>
              <p className="body-md text-black-70">
                Compromisso inabalável com qualidade e precisão em cada
                detalhe dos nossos projetos.
              </p>
            </div>
            <div className="text-center">
              <h3 className="headline-sm mb-4">Inovação</h3>
              <p className="body-md text-black-70">
                Buscamos constantemente novas tecnologias e métodos para
                entregar soluções cada vez mais eficientes.
              </p>
            </div>
            <div className="text-center">
              <h3 className="headline-sm mb-4">Sustentabilidade</h3>
              <p className="body-md text-black-70">
                Construímos com responsabilidade ambiental, minimizando
                resíduos e otimizando recursos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA />
    </>
  );
}
