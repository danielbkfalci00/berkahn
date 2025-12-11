// Serviços Berkahn - Atualizado em 11/12/2025
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroPage } from "@/components/sections/HeroPage";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CTA } from "@/components/sections/CTA";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { Home, Building2, Factory, Wrench, CheckIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Serviços | Berkahn Steel Frame",
  description:
    "Conheça os serviços da Berkahn: construção residencial, comercial, industrial e reformas em Light Steel Frame com excelência e tecnologia.",
  keywords: [
    "construção steel frame",
    "construção residencial",
    "construção comercial",
    "construção industrial",
    "reformas steel frame",
    "light steel frame",
  ],
};

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
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: Factory,
  },
  {
    id: "reformas",
    title: "Reformas",
    description:
      "Ampliações e reformas em steel frame com mínimo impacto e máxima eficiência. Transforme espaços existentes com rapidez e qualidade superior.",
    items: [
      "Ampliações residenciais",
      "Retrofit de edificações",
      "Coberturas e mezaninos",
    ],
    image:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: Wrench,
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

export default function ServicosPage() {
  return (
    <main>
      {/* Hero */}
      <HeroPage
        title="Serviços"
        subtitle="O que fazemos"
        imageSrc="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
        imageAlt="Serviços Berkahn"
      />

      {/* Introduction */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <div className="text-center">
              <p className="label-text mb-4">Construções em Steel Frame</p>
              <h2 className="headline-lg mb-6">
                Soluções completas para seu projeto
              </h2>
              <p className="body-lg text-black-70">
                Da concepção à entrega, oferecemos serviços integrados de
                construção em Light Steel Frame para diferentes segmentos,
                sempre com foco em qualidade, prazo e excelência técnica.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-xl bg-black-5">
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
                    <Link
                      href="/contato"
                      className="inline-flex items-center gap-2 text-black font-medium hover:gap-4 transition-all duration-300"
                    >
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
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
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

      {/* Projetos Prontos */}
      <ProjectsGrid />

      {/* CTA */}
      <CTA />
    </main>
  );
}
