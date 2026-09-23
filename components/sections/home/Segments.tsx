"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";

type Segment = {
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
  focus: string;
};

const SEGMENTS: Segment[] = [
  {
    title: "Residencial",
    description:
      "Projetos residenciais com qualidade técnica, acabamento criterioso e soluções integradas do projeto à entrega.",
    href: "/residencial",
    cta: "Ver residencial",
    // hero-03 (2837px) no lugar de Services/residencial.webp, que tinha 900px
    // e era a foto mais ampliada da home. É a mesma foto que a página
    // /residencial usa no destaque.
    image: "/images/Residencial/hero-03.webp",
    imageAlt: "Residência contemporânea com fachada de vidro e varanda suspensa em meio às árvores",
    focus: "object-[62%_50%]",
  },
  {
    title: "Comercial & Industrial",
    description:
      "Ambientes corporativos e estruturas industriais com gestão de obra precisa, eficiência e soluções técnicas sob medida.",
    href: "/comercial-industrial",
    cta: "Ver comercial e industrial",
    image: "/images/Services/comercial.webp",
    imageAlt: "Edifício comercial de fachada branca com marquise escura na entrada",
    focus: "object-[40%_50%]",
  },
];

/**
 * Segmentos como dois painéis grandes, lado a lado e quase de borda a borda.
 * Antes eram dois cartões de foto com número, iguais a qualquer template.
 *
 * Desktop: o painel sob o mouse (ou com foco de teclado) cresce e empurra o
 * outro; é só CSS, via flex-grow. Rolagem: as fotos têm parallax e os painéis
 * sobem em sequência na entrada. Celular: painéis empilhados, cada um com três
 * quartos da tela. Movimento reduzido: sem parallax, sem subida, e o painel
 * não cresce.
 */
export function Segments() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-segment]", root);
        gsap.from(panels, {
          y: 60,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: { trigger: panels[0], start: "top 85%", once: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-segment-photo]", root).forEach((photo) => {
          gsap.fromTo(
            photo,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: photo.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-white py-2xl md:py-3xl" aria-labelledby="segmentos-title">
      <div className="container">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-black-50">Segmentos</p>
        <h2
          id="segmentos-title"
          className="max-w-4xl font-display text-[clamp(2.4rem,1.2rem+3.6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
        >
          Construímos para todos os setores.
        </h2>
      </div>

      <div className="mt-12 flex flex-col gap-2 px-2 md:mt-16 md:h-[88svh] md:min-h-[560px] md:flex-row md:px-3">
        {SEGMENTS.map((segment) => (
          <Link
            key={segment.href}
            href={segment.href}
            data-segment
            className="group relative flex min-h-[72svh] overflow-hidden bg-carbon text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:min-h-0 md:flex-1 md:transition-[flex-grow] md:duration-700 md:ease-expo md:hover:grow-[1.6] md:focus-visible:grow-[1.6] motion-reduce:md:transition-none motion-reduce:md:hover:grow"
          >
            <div data-segment-photo className="absolute inset-x-0 -inset-y-[6%]">
              {/* sizes pela altura: foto 3:2 ou 16:9 cobrindo um painel alto,
                  com a sobra de 12% do parallax e até 62% da largura quando o
                  painel cresce. */}
              <Image
                src={segment.image}
                alt={segment.imageAlt}
                fill
                quality={80}
                sizes="(min-width: 768px) max(62vw, 148vh), 121vh"
                className={`object-cover transition-transform duration-1000 ease-expo group-hover:scale-[1.04] motion-reduce:transition-none ${segment.focus}`}
              />
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5"
              aria-hidden="true"
            />

            <div className="relative mt-auto w-full p-6 pb-8 md:p-10 lg:p-14">
              <h3 className="font-display text-[clamp(2.2rem,1rem+3.4vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                {segment.title}
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">{segment.description}</p>
              <span className="mt-7 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-wider">
                {segment.cta}
                <span
                  className="h-[3px] w-8 bg-white transition-all duration-500 ease-expo group-hover:w-14"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
