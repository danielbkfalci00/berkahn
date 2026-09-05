"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { EXTRACTION_SECTION } from "@/lib/sustentabilidade-data";
import { CountingNumber } from "./CountingNumber";

/**
 * "02 · o que a obra arranca". No desktop o viewport prende e as três batidas
 * atravessam a tela na horizontal, cada painel girando em Y conforme passa pelo
 * centro. O eixo horizontal é o que separa esta seção da seção 05 da home, que
 * usa pinagem vertical: o mesmo recurso duas vezes na mesma visita cansa.
 *
 * A rotação de cada painel usa `containerAnimation`, que é como o ScrollTrigger
 * resolve gatilhos dentro de um track que se move na horizontal. Sem isso, o
 * start/end seria medido contra o scroll da página e nunca bateria com a
 * posição real do painel.
 *
 * Mobile e reduced-motion: os três painéis empilham na vertical e os números
 * contam ao entrar, sem pin e sem giro.
 */
export function ExtractionTrack() {
  const sectionRef = useRef<HTMLElement>(null);
  const beats = EXTRACTION_SECTION.beats;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.querySelector<HTMLElement>("[data-track]");
        const rail = root.querySelector<HTMLElement>("[data-rail]");
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root);
        if (!track || !rail || panels.length !== beats.length) return;

        // Track alto com filho sticky, e não ScrollTrigger.pin: o pin cria um
        // spacer e reescreve a posição do elemento, o que briga com o Lenis.
        // A altura do track é a sobra horizontal do rail mais um viewport.
        let distance = 0;
        const measure = () => {
          distance = Math.max(0, rail.scrollWidth - window.innerWidth);
          track.style.height = `${window.innerHeight + distance}px`;
        };
        measure();

        const drift = gsap.to(rail, {
          x: () => -distance,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
        });

        panels.forEach((panel) => {
          const plate = panel.querySelector<HTMLElement>("[data-panel-plate]");
          gsap.fromTo(
            panel,
            { rotateY: 11 },
            {
              rotateY: -11,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: drift,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
          if (plate) {
            gsap.fromTo(
              plate,
              { xPercent: -6, scale: 1.14 },
              {
                xPercent: 6,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: drift,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }
        });

        return () => {
          track.style.height = "";
        };
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="extracao"
      className="bg-carbon text-white"
      aria-labelledby="extracao-title"
    >
      <div className="container pt-2xl md:pt-3xl">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-white-50">
            {EXTRACTION_SECTION.eyebrow}
          </p>
          <h2 id="extracao-title" className="headline-md mt-4 max-w-2xl text-white">
            {EXTRACTION_SECTION.headline}
          </h2>
        </RevealOnScroll>
      </div>

      {/* Desktop com motion: track horizontal com o viewport preso. */}
      <div data-track className="relative mt-16 hidden motion-safe:lg:block">
        <div
          className="sticky top-0 flex h-screen items-center overflow-hidden"
          style={{ perspective: "1600px" }}
        >
          <div
            data-rail
            className="flex w-max items-center gap-[6vw] px-[8vw] will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {beats.map((beat, index) => (
              <article
                key={beat.id}
                data-panel
                className="relative w-[62vw] max-w-[860px] shrink-0 will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative h-[46vh] max-h-[480px] overflow-hidden bg-carbon-soft">
                  <div data-panel-plate className="absolute inset-[-8%] will-change-transform">
                    <Image
                      src={beat.image.src}
                      alt={beat.image.alt}
                      fill
                      quality={70}
                      sizes="62vw"
                      className={`object-cover grayscale ${beat.focus}`}
                    />
                  </div>
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/45 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <p className="font-tech text-xs lowercase tracking-wide text-white-70">
                      {beat.index} · {beat.kicker}
                    </p>
                    <CountingNumber figure={beat.hero} className="mt-3 text-[9vw] text-white" />
                  </div>
                </div>
                <div className="mt-6 flex items-start gap-6">
                  <span className="mt-2 h-[3px] w-10 shrink-0 bg-white" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white-70">
                      {beat.hero.label}
                    </p>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-white-70">
                      {beat.claim}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile e reduced-motion: pilha vertical. */}
      <div className="container motion-safe:lg:hidden">
        <div className="mt-12 flex flex-col gap-16 pb-2xl">
          {beats.map((beat) => (
            <article key={beat.id}>
              <div className="relative aspect-[4/3] overflow-hidden bg-carbon-soft">
                <Image
                  src={beat.image.src}
                  alt={beat.image.alt}
                  fill
                  quality={70}
                  sizes="100vw"
                  className={`object-cover grayscale ${beat.focus}`}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/50 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-tech text-xs lowercase tracking-wide text-white-70">
                    {beat.index} · {beat.kicker}
                  </p>
                  <CountingNumber figure={beat.hero} className="mt-2 text-[18vw] text-white" />
                </div>
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-white-70">
                {beat.hero.label}
              </p>
              <p className="mt-3 text-base leading-relaxed text-white-70">{beat.claim}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
