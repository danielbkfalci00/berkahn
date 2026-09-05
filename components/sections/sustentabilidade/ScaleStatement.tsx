"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SCALE_SECTION } from "@/lib/sustentabilidade-data";
import { CountingNumber } from "./CountingNumber";

/**
 * Primeira aterrissagem depois do hero: o tamanho do problema, em dois números
 * que contam ao entrar. A profundidade aqui não vem de foto, vem de duas
 * velocidades: a coluna dos números deriva contra a coluna do texto enquanto a
 * seção atravessa a tela, sobre a grade técnica de fundo.
 */
export function ScaleStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const figures = root.querySelector<HTMLElement>("[data-scale-figures]");
        if (!figures) return;
        gsap.fromTo(
          figures,
          { yPercent: 7 },
          {
            yPercent: -7,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="conta"
      className="fluxograma-grid-bg relative bg-off-white py-2xl md:py-3xl"
      aria-labelledby="escala-title"
    >
      <div className="container">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <RevealOnScroll>
              <p className="font-tech text-xs lowercase tracking-wide text-black-50">
                {SCALE_SECTION.eyebrow}
              </p>
              <h2 id="escala-title" className="headline-md mt-4 max-w-xl">
                {SCALE_SECTION.headline}
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-black-70">
                {SCALE_SECTION.copy}
              </p>
            </RevealOnScroll>
          </div>

          <div
            data-scale-figures
            className="flex flex-col gap-12 will-change-transform md:col-span-5 md:col-start-8"
          >
            {SCALE_SECTION.figures.map((figure, index) => (
              <RevealOnScroll key={figure.label} delay={index * 0.1}>
                <div>
                  <CountingNumber
                    figure={figure}
                    className="text-[19vw] text-black md:text-[10vw] lg:text-[8.5vw]"
                    fillImage={index === 0 ? SCALE_SECTION.fillImage : undefined}
                  />
                  <span className="mt-4 block h-[3px] w-10 bg-black" aria-hidden="true" />
                  <p className="mt-3 max-w-xs text-xs font-medium uppercase tracking-wider text-black-70">
                    {figure.label}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
