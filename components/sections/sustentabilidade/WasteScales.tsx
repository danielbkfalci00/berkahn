"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { WASTE_SECTION } from "@/lib/sustentabilidade-data";
import { CountingNumber } from "./CountingNumber";

/**
 * "05 · o que sobra". Duas colunas medem a perda de material lado a lado. A
 * coluna da obra convencional é preenchida pela própria foto do entulho, que
 * sobe até 30% da moldura; a do canteiro a seco sobe até 5%. O preenchimento é
 * `clip-path: inset()` e não `height`, para não provocar layout a cada frame, e
 * não é `scaleY` porque escalar deformaria a foto.
 *
 * Sem JS ou com prefers-reduced-motion as duas colunas já renderizam na altura
 * final: o estado base do inline style é o estado final da animação.
 */
export function WasteScales() {
  const sectionRef = useRef<HTMLElement>(null);
  const columns = WASTE_SECTION.columns;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fills = gsap.utils.toArray<HTMLElement>("[data-fill]", root);
        fills.forEach((fill) => {
          const target = Number(fill.dataset.fill ?? 0);
          gsap.fromTo(
            fill,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: `inset(${100 - target}% 0% 0% 0%)`,
              ease: "expo.out",
              duration: 1.6,
              scrollTrigger: { trigger: root, start: "top 62%", once: true },
            }
          );
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="sobra"
      className="bg-off-white py-2xl md:py-3xl"
      aria-labelledby="sobra-title"
    >
      <div className="container">
        <div className="grid gap-14 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <RevealOnScroll>
              <p className="font-tech text-xs lowercase tracking-wide text-black-50">
                {WASTE_SECTION.eyebrow}
              </p>
              <h2 id="sobra-title" className="headline-md mt-4 max-w-md">
                {WASTE_SECTION.headline}
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-black-70">
                {WASTE_SECTION.copy}
              </p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-black">
                {WASTE_SECTION.closing}
              </p>

              <div className="mt-10 border-t-[3px] border-black pt-6">
                <CountingNumber
                  figure={WASTE_SECTION.recycling}
                  className="text-[16vw] text-black md:text-[6vw]"
                />
                <p className="mt-3 max-w-xs text-xs font-medium uppercase tracking-wider text-black-70">
                  {WASTE_SECTION.recycling.label}
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="grid grid-cols-2 gap-5">
              {columns.map((column) => (
                <div key={column.id}>
                  <div className="fluxograma-grid-bg relative h-[34vh] min-h-[230px] overflow-hidden border border-black-10 bg-white md:h-[46vh] md:min-h-[300px]">
                    {/* Régua de escala: 0 embaixo, 100 no topo. A moldura vazia
                        é o argumento, então ela precisa ler como instrumento. */}
                    <span className="absolute inset-x-0 top-0 h-px bg-black-30" aria-hidden="true" />
                    <span
                      className="absolute inset-x-0 top-1/2 h-px bg-black-10"
                      aria-hidden="true"
                    />
                    <span className="absolute right-2 top-1 z-10 font-tech text-[10px] text-black-30">
                      100
                    </span>
                    <span className="absolute bottom-1 right-2 z-10 font-tech text-[10px] text-black-30">
                      0
                    </span>
                    <div
                      data-fill={column.value}
                      className="absolute inset-0"
                      style={{ clipPath: `inset(${100 - column.value}% 0% 0% 0%)` }}
                    >
                      {column.id === "convencional" ? (
                        <Image
                          src={WASTE_SECTION.image.src}
                          alt={WASTE_SECTION.image.alt}
                          fill
                          quality={70}
                          sizes="(min-width: 768px) 28vw, 45vw"
                          className="object-cover grayscale"
                        />
                      ) : (
                        <div className="h-full w-full bg-carbon" />
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="font-display text-3xl font-semibold leading-none tracking-tight text-black md:text-4xl">
                      <span className="align-baseline text-[0.42em] font-medium text-black-50">
                        {column.prefix.trim()}
                      </span>
                      <span className="ml-[0.06em]">{column.value}</span>
                      <span className="align-baseline text-[0.5em] font-medium text-black-50">
                        {column.unit}
                      </span>
                    </p>
                    <span className="mt-3 block h-[3px] w-8 bg-black" aria-hidden="true" />
                    <p className="mt-2 font-tech text-[11px] lowercase tracking-wide text-black-50">
                      {column.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-black-70">{column.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
