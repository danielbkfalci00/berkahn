"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SCALE_SECTION } from "@/lib/sustentabilidade-data";
import { CountingNumber } from "./CountingNumber";
import { FIGURE_HERO } from "./scale";

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
      className="fluxograma-grid-bg relative bg-off-white py-xl md:py-2xl"
      aria-labelledby="escala-title"
    >
      <div className="container">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <RevealOnScroll>
              <p className="font-tech text-xs lowercase tracking-wide text-black-70">
                {SCALE_SECTION.eyebrow}
              </p>
              {/* Entre headline-md (36px) e headline-lg (72px): a frase tem 12 palavras
                  e em headline-lg virava uma parede de seis linhas. */}
              <h2
                id="escala-title"
                className="mt-5 max-w-xl font-heading font-bold tracking-tight text-[clamp(1.75rem,1rem+2vw,2.75rem)]"
              >
                {SCALE_SECTION.headline}
              </h2>
            </RevealOnScroll>

            {/* Índice das contas. Vivia no rodapé do hero, onde sumia sob o
                header ao primeiro scroll; aqui ele fica e vira o único alvo de
                toque no corpo da página. A numeração começa em 02 e casa com
                os eyebrows das seções. */}
            <nav aria-label="As contas desta página" className="mt-10 border-t-[3px] border-black">
              <ul>
                {SCALE_SECTION.index.map((item, index) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="group flex min-h-11 items-center gap-4 border-b border-black-10 py-2 font-tech text-xs lowercase tracking-wide text-black-70 transition-colors duration-300 hover:text-black focus-visible:text-black"
                    >
                      <span className="tabular-nums text-black-70">
                        {String(index + 2).padStart(2, "0")}
                      </span>
                      <span
                        className="h-[3px] w-8 bg-black-30 transition-all duration-500 ease-expo group-hover:w-14 group-hover:bg-black group-focus-visible:w-14 group-focus-visible:bg-black"
                        aria-hidden="true"
                      />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div
            data-scale-figures
            className="flex flex-col gap-12 will-change-transform md:col-span-5 md:col-start-8 md:pt-6"
          >
            {SCALE_SECTION.figures.map((figure, index) => (
              <RevealOnScroll key={figure.label} delay={index * 0.1}>
                <div>
                  <CountingNumber figure={figure} className={`${FIGURE_HERO} text-black`} />
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
