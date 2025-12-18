import Image from "next/image";
import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { BerkahnTimeline } from "@/components/timeline/BerkahnTimeline";
import { Founders } from "@/components/sections/Founders";
import { CTA } from "@/components/sections/CTA";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckIcon } from "lucide-react";

export const metadata = {
  title: "Empresa | Berkahn Steel Frame",
  description:
    "Construtora moderna com expertise em Steel Frame e sistemas integrados. Conheça a BERKAHN e nossa abordagem inovadora na construção civil.",
};

// Stats com categorias - foco em compromissos e entregas
const stats = [
  {
    value: "40%",
    label: "Redução no Tempo de Obra",
    category: "EFICIÊNCIA"
  },
  {
    value: "100%",
    label: "Satisfação",
    category: "QUALIDADE"
  },
  {
    value: "100%",
    label: "Compromisso com Prazos",
    category: "CONFIANÇA"
  },
];

// Diferenciais
const diferenciais = [
  {
    category: "CERTIFICAÇÃO",
    title: "Certificações Técnicas",
    desc: "Seguimos rigorosamente as normas NBR 16970 (Steel Frame) e NBR 15575 (Desempenho de Edificações). Garantia de qualidade certificada e conformidade técnica em cada projeto.",
  },
  {
    category: "EQUIPE",
    title: "Equipe Especializada",
    desc: "Profissionais capacitados com vasta experiência em Steel Frame. Equipe técnica treinada em processos industrializados e construção sustentável de alta performance.",
  },
  {
    category: "PROCESSO",
    title: "Prazos Garantidos",
    desc: "Cronograma definido e cumprido com rigor e transparência. Sistema industrializado que reduz o tempo de obra em até 40% comparado à construção convencional.",
  },
  {
    category: "SUPORTE",
    title: "Suporte Completo",
    desc: "Acompanhamento em todas as etapas, do projeto arquitetônico à entrega final. Consultoria técnica especializada e assistência durante todo o ciclo de vida da edificação.",
  },
];

export default function EmpresaPage() {
  return (
    <>
      {/* Hero com Imagem e Stats Overlay */}
      <section className="relative h-screen min-h-[600px] flex items-start justify-start pt-32 md:pt-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/empresa/primeira-imagem.webp"
            alt="Berkahn - Construção em Steel Frame"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Hero Content - Título no topo */}
        <div className="relative z-20 text-left">
          <div className="hero-content-left">
            {/* Decorative Line */}
            <div className="hero-decorative-line w-24 mb-8" />

            {/* Label */}
            <p className="hero-label text-white mb-4 hero-text-shadow">SOBRE NÓS</p>

            {/* Título */}
            <h1 className="headline-lg text-white hero-text-shadow-strong">Nossa História</h1>
          </div>
        </div>

        {/* Stats Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 lg:pb-16">
          <div className="container">
            {/* Label contextual */}
            <p className="label-text text-white/50 text-center mb-6 tracking-widest">
              TRAJETÓRIA DOS NOSSOS FUNDADORES
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {[
                { value: 20, suffix: "+", label: "Anos de experiência combinada" },
                { value: 23, suffix: "+", label: "Projetos" },
                { value: 85, suffix: "+ mil m²", label: "Área construída" },
                { value: 100, suffix: "%", label: "Satisfação" },
              ].map((stat, index) => (
                <RevealOnScroll key={stat.label} delay={index * 0.1}>
                  <div className="text-center">
                    <CountUp
                      end={stat.value}
                      suffix={stat.suffix}
                      className="text-4xl lg:text-5xl font-heading font-light mb-2 text-white"
                    />
                    <p className="label-text text-white/70">{stat.label}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <h2 className="headline-md mb-8 text-center">Nossa Jornada</h2>

          {/* Texto da antiga hero */}
          <div className="space-y-6">
            <p className="body-lg text-black-70">
              Nossa construtora nasce da união de anos de experiência em projetos,
              gerenciamento e execução de obras. Somos especialistas em soluções
              modernas de engenharia, com ênfase no Steel Frame, e nosso diferencial
              está na capacidade de integrar este sistema leve e eficiente com outras
              estruturas, incluindo concreto e aço laminado, para otimizar cada projeto.
            </p>
            <p className="body-lg text-black-70">
              Juntos, nossos fundadores acumulam mais de duas décadas atuando em
              projetos residenciais e corporativos, tendo gerenciado mais de 85 mil
              metros quadrados de construção ao longo de suas carreiras. Essa bagagem
              técnica e gerencial é o alicerce sobre o qual a Berkahn foi construída.
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

          {/* Separador */}
          <div className="mt-12 mb-8 border-t border-black-10"></div>

          {/* Texto adicional sobre hoje */}
          <p className="body-md text-black-70">
            Hoje, com uma equipe de profissionais altamente especializados e um portfólio
            crescente de projetos, continuamos comprometidos em transformar a forma como
            se constrói no Brasil, entregando residências que combinam inovação, conforto
            e durabilidade.
          </p>
        </div>
      </section>

      {/* Timeline - COMENTADO */}
      {/* <BerkahnTimeline /> */}

      {/* Founders */}
      <Founders />

      {/* Por Que Escolher a Berkahn */}
      <section id="diferencial" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <RevealOnScroll>
            <p className="label-text text-black-50 text-center mb-4">
              NOSSO COMPROMISSO
            </p>
            <h2 className="headline-lg text-center mb-16">
              O Que Entregamos
            </h2>
          </RevealOnScroll>

          {/* Stats Cards - 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <Card className="text-center border-black-10 hover:shadow-luxury-md transition-shadow duration-300">
                  <CardContent className="pt-8 pb-8">
                    <Badge
                      variant="outline"
                      className="mb-4 text-[10px] tracking-widest border-black-20"
                    >
                      {stat.category}
                    </Badge>
                    <p className="text-5xl font-heading font-bold mb-3 text-black">
                      {stat.value}
                    </p>
                    <p className="text-sm text-black-70 leading-relaxed">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>

          {/* Separator */}
          <Separator className="my-16 bg-black-10" />

          {/* Diferenciais com Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diferenciais.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <Card className="h-full shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-300 border-black-10 group">
                  <CardContent className="p-8">
                    {/* Badge + Título */}
                    <div className="space-y-4 mb-6">
                      <Badge
                        variant="outline"
                        className="text-xs tracking-wider border-black-20"
                      >
                        {item.category}
                      </Badge>
                      <h3 className="headline-sm leading-tight">{item.title}</h3>
                    </div>

                    {/* Separator */}
                    <Separator className="mb-6 bg-black-10" />

                    {/* Descrição */}
                    <p className="body-md text-black-70 leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    {/* CheckIcon Refinado */}
                    <div className="flex items-center gap-2 text-black-50 group-hover:text-black transition-colors">
                      <CheckIcon className="w-5 h-5" />
                      <span className="text-sm font-medium tracking-wide">VERIFICADO</span>
                    </div>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

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
