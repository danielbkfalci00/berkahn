"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

type RailProject = {
  name: string;
  meta: string;
  image: string;
  imageAlt: string;
};

const PROJECTS: RailProject[] = [
  {
    name: "Casa Santa Cristina",
    meta: "residencial",
    image: "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-cover.webp",
    imageAlt: "Casa Santa Cristina, residência construída pela Berkahn",
  },
  {
    name: "Casa Laranjeiras",
    meta: "residencial",
    image: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp",
    imageAlt: "Fachada frontal da Casa Laranjeiras",
  },
  {
    name: "Vila da Mata",
    meta: "residencial",
    image: "/images/apresentacao/Vila-da-mata/vila-da-mata-1.webp",
    imageAlt: "Vila da Mata, projeto residencial da Berkahn",
  },
  {
    name: "Execução em detalhe",
    meta: "estrutura · light steel frame",
    image: "/images/galeria/projeto-47.webp",
    imageAlt: "Detalhe de montante de aço galvanizado em obra da Berkahn",
  },
];

const CARD_SIZES = "(min-width: 1024px) 32vw, (min-width: 640px) 55vw, 80vw";
const RAIL_GAP_PX = 28;

/**
 * Galeria de projetos em rail horizontal com scroll-snap CSS.
 * O wheel vertical fica com a página (Lenis) — a navegação horizontal é
 * por setas no desktop e swipe nativo no touch. Sem data-lenis-prevent:
 * um container só-horizontal engoliria o wheel e travaria o scroll da página.
 */
export function ProjectsRail() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-rail-card]");
    const step = card ? card.offsetWidth + RAIL_GAP_PX : rail.clientWidth * 0.4;
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section id="projetos" className="bg-white py-2xl md:py-3xl overflow-hidden">
      <div className="container">
        <RevealOnScroll>
          <div className="flex items-end justify-between gap-6 mb-12 md:mb-16">
            <div>
              <p className="font-tech text-xs lowercase tracking-wide text-black-50 mb-4">
                05 · projetos
              </p>
              <h2 className="headline-md max-w-2xl">
                Obra entregue é a melhor vitrine.
              </h2>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Projetos anteriores"
                className="flex h-11 w-11 items-center justify-center border border-black-10 text-black transition-colors duration-300 hover:bg-black hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Próximos projetos"
                className="flex h-11 w-11 items-center justify-center border border-black-10 text-black transition-colors duration-300 hover:bg-black hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <p
              className="md:hidden font-tech text-xs lowercase tracking-wide text-black-30 whitespace-nowrap"
              aria-hidden="true"
            >
              deslize →
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <div
        ref={railRef}
        className="flex gap-5 md:gap-7 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 md:px-16 lg:px-24"
      >
        {PROJECTS.map((project) => (
          <Link
            key={project.name}
            href="/portfolio"
            data-rail-card
            className="group shrink-0 snap-start w-[80vw] sm:w-[55vw] lg:w-[32vw]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes={CARD_SIZES}
                className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-5">
              <p className="font-tech text-xs lowercase tracking-wide text-black-50 mb-1.5">
                {project.meta}
              </p>
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight">
                  {project.name}
                </h3>
                <span
                  className="h-[3px] w-8 bg-bronze transition-all duration-500 ease-expo group-hover:w-14"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Link>
        ))}

        {/* Card final: portfólio completo */}
        <Link
          href="/portfolio"
          className="group shrink-0 snap-start w-[80vw] sm:w-[55vw] lg:w-[32vw]"
        >
          <div className="flex aspect-[4/5] flex-col items-start justify-end bg-carbon p-8 transition-colors duration-500 group-hover:bg-carbon-soft">
            <span className="h-[3px] w-10 bg-bronze mb-6 transition-all duration-500 ease-expo group-hover:w-16" />
            <p className="font-display font-semibold text-2xl tracking-tight text-white mb-2">
              Ver portfólio completo
            </p>
            <p className="font-tech text-xs lowercase tracking-wide text-white-50">
              todos os projetos
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
