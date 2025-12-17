"use client";

// Serviços Berkahn - Atualizado em 11/12/2025
import Image from "next/image";
import Link from "next/link";
import { HeroPage } from "@/components/sections/HeroPage";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CTA } from "@/components/sections/CTA";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { ExecutionPhases } from "@/components/servicos/ExecutionPhases";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";
import { Home, Building2, Factory, CheckIcon } from "lucide-react";
import { StatsGrid } from "@/components/article/StatHighlight";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Dados dos serviços
const services = [
  {
    id: "residencial",
    title: "Residencial",
    description:
      "Casas e sobrados com design personalizado, conforto térmico superior e acabamento premium. Projetos que transformam sonhos em lares modernos e eficientes.",
    items: [
      "Casas térreas e sobrados",
      "Condomínios residenciais",
      "Casas de campo e chalés",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: Home,
  },
  {
    id: "comercial",
    title: "Comercial",
    description:
      "Edifícios comerciais, lojas e escritórios com agilidade na execução e flexibilidade de layout. Soluções que otimizam espaços e reduzem custos operacionais.",
    items: [
      "Escritórios e coworkings",
      "Lojas e showrooms",
      "Centros médicos e clínicas",
    ],
    image: "/images/Services/comercial.webp",
    icon: Building2,
  },
  {
    id: "industrial",
    title: "Industrial",
    description:
      "Galpões e estruturas industriais com alta resistência e prazos reduzidos de construção. Projetos robustos que atendem às demandas mais exigentes do setor.",
    items: [
      "Galpões logísticos",
      "Centros de distribuição",
      "Estruturas modulares",
    ],
    image: "/images/Services/industrial.webp",
    icon: Factory,
  },
];

// Dados da metodologia
const methodology = [
  {
    step: 1,
    title: "Consulta",
    description:
      "Entendemos suas necessidades e apresentamos as melhores soluções.",
  },
  {
    step: 2,
    title: "Projeto",
    description:
      "Desenvolvemos o projeto completo com precisão técnica e design.",
  },
  {
    step: 3,
    title: "Execução",
    description:
      "Construímos com qualidade, acompanhamento constante e prazo definido.",
  },
  {
    step: 4,
    title: "Entrega",
    description:
      "Entregamos sua obra pronta para uso, com garantia e suporte.",
  },
];

// Stats com categorias
const stats = [
  {
    value: "150+",
    label: "Projetos Concluídos",
    category: "PROJETOS"
  },
  {
    value: "95%",
    label: "Satisfação dos Clientes",
    category: "SATISFAÇÃO"
  },
  {
    value: "70%",
    label: "Redução no Tempo de Obra",
    category: "TEMPO"
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
    desc: "Cronograma definido e cumprido com rigor e transparência. Sistema industrializado que reduz o tempo de obra em até 70% comparado à construção convencional.",
  },
  {
    category: "SUPORTE",
    title: "Suporte Completo",
    desc: "Acompanhamento em todas as etapas, do projeto arquitetônico à entrega final. Consultoria técnica especializada e assistência durante todo o ciclo de vida da edificação.",
  },
];

export default function ServicosPage() {
  return (
    <main>
      {/* 1. Hero */}
      <HeroPage
        title="Serviços"
        subtitle="O que fazemos"
        imageSrc="/images/servicos-hero.png"
        imageAlt="Serviços Berkahn"
      />

      {/* 2. Execução de Obras - Tabs + Carousel */}
      <ExecutionPhases />

      {/* 3. Introduction */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <div className="text-center">
              <h1 className="headline-lg mb-6">
                Construções em Steel Frame
              </h1>
              <p className="body-lg text-black-70">
                Da concepção à entrega, oferecemos serviços integrados de
                construção em Light Steel Frame para diferentes segmentos,
                sempre com foco em qualidade, prazo e excelência técnica.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 4. Services Grid */}
      <section id="execucao" className="py-xl bg-black-5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <RevealOnScroll key={service.id} delay={index * 0.1}>
                <div className="bg-white overflow-hidden shadow-luxury-sm hover:shadow-luxury-md transition-shadow duration-300">
                  {/* Image */}
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={service.image}
                      alt={`Construção ${service.title}`}
                      width={600}
                      height={338}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                      <service.icon className="w-6 h-6" />
                    </div>

                    <h3 className="headline-sm mb-4">{service.title}</h3>
                    <p className="body-md text-black-70 mb-6">
                      {service.description}
                    </p>

                    {/* Items list */}
                    <ul className="space-y-2 mb-6">
                      {service.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 text-black-70"
                        >
                          <CheckIcon className="w-5 h-5 text-black flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* Link */}
                    <ContactFormDialog>
                      <button className="inline-flex items-center gap-2 text-black font-medium hover:gap-4 transition-all duration-300 cursor-pointer">
                        Solicitar orçamento
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </button>
                    </ContactFormDialog>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Methodology */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="label-text mb-4">Nossa metodologia</p>
              <h2 className="headline-lg">Como trabalhamos</h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {methodology.map((item, index) => (
              <RevealOnScroll key={item.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-black-5 text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold font-heading">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-3">{item.title}</h3>
                  <p className="body-md text-black-70">{item.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Por Que Escolher a Berkahn */}
      <section id="diferencial" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <RevealOnScroll>
            <p className="label-text text-black-50 text-center mb-4">
              DIFERENCIAL BERKAHN
            </p>
            <h2 className="headline-lg text-center mb-16">
              Por Que Escolher a Berkahn
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

      {/* 7. Projetos Prontos */}
      <ProjectsGrid id="projetos" />

      {/* 8. CTA */}
      <CTA />
    </main>
  );
}
