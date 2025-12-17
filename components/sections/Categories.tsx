"use client";

import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const categories = [
  {
    title: "RESIDENCIAL",
    description:
      "Projetos residenciais que traduzem qualidade técnica, acabamento de alto nível e soluções integradas para elevar cada ambiente.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    href: "/servicos#residencial",
  },
  {
    title: "CORPORATIVO / COMERCIAL",
    description:
      "Ambientes corporativos executados para refletir identidade e eficiência, com gestão de obra precisa e soluções técnicas de alto padrão.",
    image: "/images/Services/comercial.webp",
    href: "/servicos#comercial",
  },
  {
    title: "INDUSTRIAL",
    description:
      "Estruturas industriais projetadas para máxima eficiência, durabilidade e conformidade com as normas técnicas mais exigentes.",
    image: "/images/Services/industrial.webp",
    href: "/servicos#industrial",
  },
];

export function Categories() {
  return (
    <section className="py-xl bg-white">
      <div className="container">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-black/60 mb-4">
              Segmentos de Atuação
            </p>
            <h2 className="headline-md text-black">
              Construímos para todos os setores
            </h2>
          </div>
        </RevealOnScroll>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <RevealOnScroll key={category.title} delay={index * 0.1}>
              <div className="group relative h-[500px] overflow-hidden">
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/40" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-heading font-bold tracking-wide mb-4">
                    {category.title}
                  </h3>

                  {/* Decorative Line */}
                  <div className="w-12 h-[1px] bg-white/60 mb-6" />

                  {/* Description */}
                  <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-xs">
                    {category.description}
                  </p>

                  {/* Botão Saiba Mais */}
                  <Link
                    href="/servicos"
                    className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest font-medium transition-all duration-300 hover:bg-black hover:text-white hover:border hover:border-white mt-8"
                  >
                    Saiba Mais
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
