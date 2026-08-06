"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type RailProject = {
  name: string;
  meta: string;
  image: string;
  imageAlt: string;
  /** object-position para acertar o corte 4:5 de cada fonte */
  imageClassName?: string;
};

const PROJECTS: RailProject[] = [
  {
    name: "Casa Santa Cristina",
    meta: "residencial",
    image: "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-cover.webp",
    imageAlt: "Casa Santa Cristina, residência construída pela Berkahn",
    imageClassName: "object-[50%_70%]",
  },
  {
    name: "Casa Laranjeiras",
    meta: "residencial",
    image: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp",
    imageAlt: "Fachada frontal da Casa Laranjeiras",
    imageClassName: "object-[50%_85%]",
  },
  {
    name: "Vila da Mata",
    meta: "residencial",
    image: "/images/apresentacao/Vila-da-mata/vila-da-mata-1.webp",
    imageAlt: "Vila da Mata, projeto residencial da Berkahn",
    imageClassName: "object-[50%_60%]",
  },
  {
    name: "Execução em detalhe",
    meta: "estrutura · light steel frame",
    image: "/images/galeria/projeto-47.webp",
    imageAlt: "Detalhe de montante de aço galvanizado em obra da Berkahn",
  },
];

const CARD_SIZES = "(min-width: 1024px) 32vw, (min-width: 640px) 55vw, 80vw";
const TOTAL_SLIDES = PROJECTS.length + 1;

/**
 * Galeria de projetos sobre o Embla (já é dep do projeto): drag com mouse e
 * touch com física/momentum, snap, supressão de clique acidental. O wheel
 * vertical continua com a página (Embla não captura wheel). Setas + barra de
 * progresso com índice completam a navegação.
 */
export function ProjectsRail() {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const syncState = useCallback((emblaApi: NonNullable<CarouselApi>) => {
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setCurrent(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    const handleScroll = (emblaApi: NonNullable<CarouselApi>) => {
      setProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
    };

    syncState(api);
    handleScroll(api);
    api.on("select", syncState);
    api.on("reInit", syncState);
    api.on("scroll", handleScroll);

    return () => {
      api.off("select", syncState);
      api.off("reInit", syncState);
      api.off("scroll", handleScroll);
    };
  }, [api, syncState]);

  return (
    <section id="projetos" className="bg-white py-2xl md:py-3xl overflow-hidden">
      <Carousel
        opts={{ align: "start", containScroll: "trimSnaps" }}
        setApi={setApi}
      >
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
                  onClick={() => api?.scrollPrev()}
                  disabled={!canPrev}
                  aria-label="Projetos anteriores"
                  className="flex h-11 w-11 items-center justify-center border border-black-10 text-black transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  disabled={!canNext}
                  aria-label="Próximos projetos"
                  className="flex h-11 w-11 items-center justify-center border border-black-10 text-black transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-30 disabled:pointer-events-none"
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

        <CarouselContent className="-ml-5 md:-ml-7 pl-6 md:pl-16 lg:pl-24 cursor-grab active:cursor-grabbing">
          {PROJECTS.map((project) => (
            <CarouselItem
              key={project.name}
              className="pl-5 md:pl-7 basis-[80vw] sm:basis-[55vw] lg:basis-[32vw]"
            >
              <Link href="/portfolio" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes={CARD_SIZES}
                    draggable={false}
                    className={cn(
                      "object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]",
                      project.imageClassName
                    )}
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
                      className="h-[3px] w-8 bg-black transition-all duration-500 ease-expo group-hover:w-14"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}

          {/* Card final: portfólio completo */}
          <CarouselItem className="pl-5 md:pl-7 basis-[80vw] sm:basis-[55vw] lg:basis-[32vw]">
            <Link href="/portfolio" className="group block">
              <div className="flex aspect-[4/5] flex-col items-start justify-end bg-carbon p-8 transition-colors duration-500 group-hover:bg-carbon-soft">
                <span className="h-[3px] w-10 bg-white mb-6 transition-all duration-500 ease-expo group-hover:w-16" />
                <p className="font-display font-semibold text-2xl tracking-tight text-white mb-2">
                  Ver portfólio completo
                </p>
                <p className="font-tech text-xs lowercase tracking-wide text-white-50">
                  todos os projetos
                </p>
              </div>
            </Link>
          </CarouselItem>
        </CarouselContent>

        {/* Progresso técnico: índice + barra */}
        <div className="container mt-10 flex items-center gap-6">
          <p className="font-tech text-xs tracking-wide text-black-50 whitespace-nowrap">
            0{current + 1} / 0{TOTAL_SLIDES}
          </p>
          <div className="h-[2px] flex-1 bg-black-10">
            <div
              className="h-full bg-black"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </Carousel>
    </section>
  );
}
