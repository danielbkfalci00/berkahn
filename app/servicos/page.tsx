// Serviços Berkahn - Atualizado em 11/12/2025
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Serviços | Berkahn Steel Frame",
  description:
    "Construção residencial, comercial e industrial em Light Steel Frame. Projetos personalizados com execução rápida e acabamento premium em São Paulo.",
  openGraph: {
    title: "Serviços | Berkahn Steel Frame",
    description:
      "Construção residencial, comercial e industrial em Light Steel Frame. Projetos personalizados com execução rápida e acabamento premium em São Paulo.",
    url: "https://www.berkahn.com.br/servicos",
    siteName: "Construtora Berkahn",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/images/Compartilhamento/og-image.webp", width: 1200, height: 630, alt: "Serviços Berkahn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serviços | Berkahn Steel Frame",
    description: "Construção residencial, comercial e industrial em Light Steel Frame.",
    images: ["/images/Compartilhamento/og-image.webp"],
  },
  alternates: {
    canonical: "/servicos",
    languages: { "pt-BR": "https://www.berkahn.com.br/servicos" },
  },
};
import Link from "next/link";
import { HeroPage } from "@/components/sections/HeroPage";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CTA } from "@/components/sections/CTA";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { ExecutionPhases } from "@/components/servicos/ExecutionPhases";
import { Home, Building2, CheckIcon } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StatsGrid } from "@/components/article/StatHighlight";
import { HowWeWorkTimeline } from "@/components/servicos/HowWeWorkTimeline";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Dados dos serviços
const services = [
  {
    id: "residencial",
    title: "Residencial",
    description:
      "Casas e sobrados com design personalizado, conforto térmico superior e acabamento premium. Do projeto à entrega, com foco em eficiência e qualidade.",
    items: [
      "Casas térreas e sobrados",
      "Condomínios residenciais",
      "Casas de campo e chalés",
    ],
    image: "/images/Services/residencial.webp",
    icon: Home,
    href: "/residencial",
  },
  {
    id: "comercial",
    title: "Comercial & Industrial",
    description:
      "Edifícios comerciais, galpões e estruturas industriais com agilidade na execução e flexibilidade de layout. Soluções que otimizam espaços e reduzem custos operacionais.",
    items: [
      "Escritórios e coworkings",
      "Lojas e showrooms",
      "Galpões logísticos e centros de distribuição",
    ],
    image: "/images/Services/comercial.webp",
    icon: Building2,
    href: "/comercial-industrial",
  },
];

export default function ServicosPage() {
  return (
    <main>
      {/* HowTo structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Como construir em Steel Frame: o processo Berkahn",
          description: "Passo a passo do processo de construção em Light Steel Frame, da consulta inicial à entrega da obra com garantia.",
          totalTime: "PT4320H",
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: "BRL",
            value: "Sob consulta",
          },
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Consulta Inicial",
              text: "Reunião para entender suas necessidades, objetivos e expectativas. Analisamos o terreno, discutimos ideias e apresentamos as melhores soluções em Steel Frame para seu projeto.",
              url: "https://www.berkahn.com.br/servicos#consulta-inicial",
            },
            {
              "@type": "HowToStep",
              position: 2,
              name: "Pré Obra",
              text: "Desenvolvemos todos os projetos necessários para a obra, do arquitetônico ao estrutural e complementares, e acompanhamos cada um até a compatibilização. Modelagem BIM, orçamento detalhado e cronograma executivo.",
              url: "https://www.berkahn.com.br/servicos#projeto",
            },
            {
              "@type": "HowToStep",
              position: 3,
              name: "Execução da Obra",
              text: "Fundação, montagem estrutural, vedação e instalações. Construção até 50% mais rápida que alvenaria convencional com monitoramento constante.",
              url: "https://www.berkahn.com.br/servicos#execucao",
            },
            {
              "@type": "HowToStep",
              position: 4,
              name: "Entrega e Garantia",
              text: "Vistoria final, manual do proprietário e garantia estrutural de 5 anos. Suporte técnico pós-entrega.",
              url: "https://www.berkahn.com.br/servicos#entrega",
            },
          ],
        })}
      </script>

      {/* 1. Hero */}
      <div className="relative">
        <Breadcrumb
          items={[{ name: "Serviços", href: "/servicos" }]}
          schemaOnly
        />
        <HeroPage
          title="Serviços"
          subtitle="O que fazemos"
          imageSrc="/images/Services/hero-servicos.webp"
          imageAlt="Serviços Berkahn"
          imagePosition="object-[70%_center] md:object-center"
        />
      </div>

      {/* 2. Como Trabalhamos - Nova Timeline Visual */}
      <HowWeWorkTimeline />

      {/* 3. Execução de Obras - Tabs + Carousel */}
      <ExecutionPhases />

      {/* 4. Soluções Completas em Construção */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <div className="text-center">
              <h2 className="headline-lg mb-6">
                Soluções Completas em Construção
              </h2>
              <p className="body-lg text-black-70">
                Da concepção à entrega, oferecemos serviços integrados de
                construção civil para diferentes segmentos. Trabalhamos com
                métodos construtivos tradicionais e industrializados como Light
                Steel Frame, com foco em qualidade e prazo.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 5. Services Grid (Residencial, Comercial, Industrial) */}
      <section id="execucao" className="py-xl bg-black-5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <RevealOnScroll key={service.id} delay={index * 0.1}>
                <Link
                href={service.href}
                className="group block bg-white overflow-hidden shadow-luxury-sm hover:shadow-luxury-md transition-all duration-300 cursor-pointer"
              >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-black-5">
                    <Image
                      src={service.image}
                      alt={`Construção ${service.title}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
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

                    {/* Visual indicator */}
                    <span className="inline-flex items-center gap-1 text-black font-medium group-hover:gap-2 transition-all">
                      Saiba mais
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
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* TODO: REVELAR - Projetos Prontos (escondido temporariamente)
      <ProjectsGrid id="projetos" />
      */}

      {/* 6. CTA */}
      <CTA />
    </main>
  );
}
