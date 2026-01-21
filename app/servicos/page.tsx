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
      "Casas e sobrados com design personalizado, conforto térmico superior e acabamento premium. Projetos que transformam sonhos em lares modernos e eficientes.",
    items: [
      "Casas térreas e sobrados",
      "Condomínios residenciais",
      "Casas de campo e chalés",
    ],
    image: "/images/Services/residencial.webp",
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

export default function ServicosPage() {
  return (
    <main>
      {/* 1. Hero */}
      <HeroPage
        title="Serviços"
        subtitle="O que fazemos"
        imageSrc="/images/Services/hero-servicos.webp"
        imageAlt="Serviços Berkahn"
        imagePosition="object-[70%_center] md:object-center"
      />

      {/* 2. Como Trabalhamos - Nova Timeline Visual */}
      <HowWeWorkTimeline />

      {/* 3. Execução de Obras - Tabs + Carousel */}
      <ExecutionPhases />

      {/* 4. Soluções Completas em Construção */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <div className="text-center">
              <h1 className="headline-lg mb-6">
                Soluções Completas em Construção
              </h1>
              <p className="body-lg text-black-70">
                Da concepção à entrega, oferecemos serviços integrados de
                construção civil para diferentes segmentos. Especializados em
                métodos construtivos tradicionais e inovadores como Light Steel
                Frame, sempre com foco em qualidade, prazo e excelência técnica.
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
                <div className="bg-white overflow-hidden shadow-luxury-sm hover:shadow-luxury-md transition-shadow duration-300">
                  {/* Image */}
                  <div className="aspect-video overflow-hidden bg-black-5">
                    <Image
                      src={service.image}
                      alt={`Construção ${service.title}`}
                      width={600}
                      height={338}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
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

      {/* TODO: REVELAR - Projetos Prontos (escondido temporariamente)
      <ProjectsGrid id="projetos" />
      */}

      {/* 6. CTA */}
      <CTA />
    </main>
  );
}
