"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { LOOP_SECTION } from "@/lib/sustentabilidade-data";

/**
 * Geometria do circuito. Retângulo de cantos vivos, coerente com a ausência de
 * border-radius no vocabulário editorial da marca. Círculo com setas puxaria
 * para o clichê de infográfico de reciclagem.
 */
const PATH = "M 60 40 H 740 V 300 H 60 Z";
/** Estações posicionadas sobre o traçado, em coordenadas do viewBox. */
const STATIONS = [
  { x: 60, y: 40, anchor: "start" as const, dy: -16 },
  { x: 400, y: 40, anchor: "middle" as const, dy: -16 },
  { x: 740, y: 170, anchor: "end" as const, dy: -12 },
  { x: 400, y: 300, anchor: "middle" as const, dy: 28 },
  { x: 60, y: 300, anchor: "start" as const, dy: 28 },
];

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
        gsap.set(marks, { opacity: 0.25 });

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
          scrollTrigger: { trigger: root, start: "top 72%", end: "bottom 78%", scrub: 0.7 },
        });
        tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
        tl.to(state, { progress: 1, duration: 1, onUpdate: moveToken }, 0);
        marks.forEach((mark, index) => {
          tl.to(mark, { opacity: 1, duration: 0.08 }, index * 0.22 + 0.04);
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="ciclo"
      className="bg-carbon-soft text-white"
      aria-labelledby="ciclo-title"
    >
      <div className="container py-2xl md:py-3xl">
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
                  <p className="font-display text-4xl font-semibold leading-none tracking-tight text-white md:text-5xl">
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
              viewBox="0 0 800 360"
              className="w-full"
              role="img"
              aria-label="Circuito do aço: bobina, perfil cortado, casa em pé, desmonte por parafuso e forno"
            >
              <path
                data-loop-path
                d={PATH}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              {STATIONS.map((station, index) => (
                <g key={LOOP_SECTION.stations[index].id} data-loop-station>
                  <rect x={station.x - 3} y={station.y - 3} width="6" height="6" fill="#FFFFFF" />
                  <text
                    x={station.x}
                    y={station.y + station.dy}
                    textAnchor={station.anchor}
                    fill="rgba(255,255,255,0.7)"
                    fontSize="13"
                    fontFamily="var(--font-space-mono), monospace"
                  >
                    {LOOP_SECTION.stations[index].label}
                  </text>
                </g>
              ))}
              <rect data-loop-token x={53} y={33} width="14" height="14" fill="#FFFFFF" />
            </svg>

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
                  pátio de sucata · o fim de linha do aço é o começo do próximo
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
