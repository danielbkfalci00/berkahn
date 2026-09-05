"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { FOREST_SECTION } from "@/lib/sustentabilidade-data";
import { CountingNumber } from "./CountingNumber";

/** Desfoque estático por plano. É a nitidez, não o movimento, que o olho lê como distância. */
const PLANE_BLUR = ["blur-[3px]", "blur-[1px]"];
const PLANE_SPEED = [10, 22];

/**
 * "03 · a madeira que ninguém conta". Dois planos de mata recuam em velocidades
 * diferentes atrás do texto, com desfoque fixo crescente por distância. O
 * desfoque é aplicado uma vez em CSS e rasterizado uma vez; animar blur custaria
 * um repaint por frame.
 *
 * Depois da mata vem a foto da fôrma, que é o argumento: a madeira que a obra
 * convencional consome e joga fora.
 */
export function ForestLayers() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const planes = gsap.utils.toArray<HTMLElement>("[data-forest-plane]", root);
        planes.forEach((plane, index) => {
          gsap.fromTo(
            plane,
            { yPercent: -PLANE_SPEED[index] / 2 },
            {
              yPercent: PLANE_SPEED[index] / 2,
              ease: "none",
              scrollTrigger: {
                trigger: plane.closest("[data-forest-stage]"),
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

        const photo = root.querySelector<HTMLElement>("[data-forest-photo]");
        if (photo) {
          gsap.fromTo(
            photo,
            { yPercent: -7, scale: 1.1 },
            {
              yPercent: 7,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: photo.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="madeira"
      className="bg-carbon-soft text-white"
      aria-labelledby="madeira-title"
    >
      <div data-forest-stage className="relative overflow-hidden">
        {FOREST_SECTION.planes.map((plane, index) => (
          <div
            key={plane.src}
            data-forest-plane
            className={`absolute inset-[-14%] will-change-transform ${PLANE_BLUR[index]}`}
            style={{ opacity: index === 0 ? 0.35 : 0.55 }}
            aria-hidden="true"
          >
            <Image
              src={plane.src}
              alt=""
              fill
              quality={65}
              sizes="100vw"
              className="object-cover grayscale"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-carbon-soft/60" aria-hidden="true" />

        <div className="relative container py-2xl md:py-3xl">
          <RevealOnScroll>
            <p className="font-tech text-xs lowercase tracking-wide text-white-50">
              {FOREST_SECTION.eyebrow}
            </p>
            <h2 id="madeira-title" className="headline-md mt-4 max-w-3xl text-white">
              {FOREST_SECTION.headline}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white-70 md:text-lg">
              {FOREST_SECTION.copy}
            </p>
          </RevealOnScroll>

          <div className="mt-16 grid gap-10 border-t border-white-10 pt-10 sm:grid-cols-3">
            {FOREST_SECTION.figures.map((figure, index) => (
              <RevealOnScroll key={figure.label} delay={index * 0.1}>
                <div>
                  <CountingNumber figure={figure} className="text-[13vw] text-white sm:text-[5vw]" />
                  <span className="mt-3 block h-[3px] w-8 bg-white" aria-hidden="true" />
                  <p className="mt-3 text-xs font-medium uppercase tracking-wider text-white-70">
                    {figure.label}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>

      <div className="container pb-2xl md:pb-3xl">
        <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-12">
          <figure className="md:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden bg-carbon md:aspect-[16/10]">
              <div data-forest-photo className="absolute inset-[-8%] will-change-transform">
                <Image
                  src={FOREST_SECTION.photo.src}
                  alt={FOREST_SECTION.photo.alt}
                  fill
                  quality={70}
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover grayscale"
                />
              </div>
            </div>
            <figcaption className="mt-4 flex items-center gap-4">
              <span className="h-[3px] w-10 bg-white" aria-hidden="true" />
              <span className="font-tech text-xs tracking-wide text-white-50">
                {FOREST_SECTION.caption}
              </span>
            </figcaption>
          </figure>

          <RevealOnScroll className="md:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-white-70 md:text-lg">
              {FOREST_SECTION.closing}
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
