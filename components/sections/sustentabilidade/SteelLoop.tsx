"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { LOOP_SECTION } from "@/lib/sustentabilidade-data";
import { FIGURE_SUPPORT } from "./scale";

/**
 * Geometria do circuito. Retângulo de cantos vivos, coerente com a ausência de
 * border-radius no vocabulário editorial da marca. Círculo com setas puxaria
 * para o clichê de infográfico de reciclagem.
 */
const PATH = "M 60 40 H 740 V 240 H 60 Z";

/**
 * "06 · o aço volta". O traçado do circuito se desenha conforme o scroll e um
 * quadrado percorre o caminho, representando o material em circulação. O
 * desenho usa strokeDashoffset, que repinta só o traço, e a posição do quadrado
 * sai de getPointAtLength, uma chamada por frame.
 *
 * Estado base do SVG: traçado inteiro visível e estações acesas. Sem JS ou com
 * prefers-reduced-motion a seção continua sendo um diagrama completo.
 */
export function SteelLoop() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const path = root.querySelector<SVGPathElement>("[data-loop-path]");
        const token = root.querySelector<SVGRectElement>("[data-loop-token]");
        const marks = gsap.utils.toArray<SVGGElement>("[data-loop-station]", root);
        if (!path) return;

        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        // Zero, não 0.25: rótulo legível sobre trecho ainda não desenhado lê
        // como texto solto no vazio. O circuito fantasma abaixo é que segura a
        // forma enquanto o traço não chega.
        gsap.set(marks, { opacity: 0 });

        const state = { progress: 0 };
        const moveToken = () => {
          if (!token) return;
          const point = path.getPointAtLength(length * state.progress);
          token.setAttribute("x", String(point.x - 7));
          token.setAttribute("y", String(point.y - 7));
        };
        moveToken();

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: path.ownerSVGElement ?? root,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 0.7,
          },
        });
        tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
        tl.to(state, { progress: 1, duration: 1, onUpdate: moveToken }, 0);
        marks.forEach((mark, index) => {
          tl.to(mark, { opacity: 1, duration: 0.06 }, index * 0.24 + 0.02);
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="ciclo"
      className="relative bg-carbon text-white before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[3px] before:bg-white before:content-['']"
      aria-labelledby="ciclo-title"
    >
      <div className="container py-xl md:py-2xl">
        <div className="grid gap-14 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <RevealOnScroll>
              <p className="font-tech text-xs lowercase tracking-wide text-white-50">
                {LOOP_SECTION.eyebrow}
              </p>
              <h2 id="ciclo-title" className="headline-md mt-4 max-w-md text-white">
                {LOOP_SECTION.headline}
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white-70">
                {LOOP_SECTION.copy}
              </p>
            </RevealOnScroll>

            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-white-10 pt-8">
              {LOOP_SECTION.figures.map((figure) => (
                <div key={figure.label}>
                  <p
                    className={`font-display ${FIGURE_SUPPORT} font-semibold leading-none tracking-tight text-white`}
                  >
                    {figure.value}
                    <span className="align-baseline text-[0.45em] font-medium text-white-70">
                      {figure.unit}
                    </span>
                  </p>
                  <span className="mt-3 block h-[3px] w-8 bg-white" aria-hidden="true" />
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-white-70">
                    {figure.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <svg
              viewBox="16 0 768 290"
              className="hidden w-full md:block"
              role="img"
              aria-label="Circuito do aço: bobina, perfil cortado, casa em pé, desmonte por parafuso e forno"
            >
              {/* Circuito fantasma: garante que a forma exista desde o primeiro
                  quadro. Sem ele, o meio da animação mostra uma linha solta. */}
              <path
                d={PATH}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <path
                data-loop-path
                d={PATH}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              {LOOP_SECTION.stations.map((station) => (
                <g key={station.id} data-loop-station>
                  <rect x={station.x - 3} y={station.y - 3} width="6" height="6" fill="#FFFFFF" />
                  <text
                    x={station.x}
                    y={station.y + station.dy}
                    textAnchor={station.anchor}
                    className="font-tech"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="20"
                  >
                    {station.label}
                  </text>
                </g>
              ))}
              <rect data-loop-token x={53} y={33} width="14" height="14" fill="#FFFFFF" />
            </svg>

            <ol className="border-t-[3px] border-white md:hidden">
              {LOOP_SECTION.stations.map((station, index) => (
                <li
                  key={station.id}
                  className="flex items-baseline gap-4 border-b border-white-10 py-3"
                >
                  <span className="font-tech text-[11px] tracking-wide text-white-50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-white">{station.label}</span>
                </li>
              ))}
            </ol>

            <figure className="mt-10">
              <div className="relative aspect-[16/9] overflow-hidden bg-carbon">
                <Image
                  src={LOOP_SECTION.image.src}
                  alt={LOOP_SECTION.image.alt}
                  fill
                  quality={70}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover grayscale"
                />
              </div>
              <figcaption className="mt-4 flex items-center gap-4">
                <span className="h-[3px] w-10 bg-white" aria-hidden="true" />
                <span className="font-tech text-xs tracking-wide text-white-50">
                  pátio de sucata
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
