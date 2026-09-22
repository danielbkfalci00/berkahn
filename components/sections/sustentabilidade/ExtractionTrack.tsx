"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EXTRACTION_SECTION, HERO } from "@/lib/sustentabilidade-data";

export function ExtractionTrack() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.querySelector<HTMLElement>("[data-extraction-track]");
        const forest = root.querySelector<HTMLElement>("[data-extraction-forest]");
        const quarry = root.querySelector<HTMLElement>("[data-extraction-quarry]");
        if (!track || !forest || !quarry) return;

        gsap.set(forest, { display: "block", clipPath: "inset(0 0 0 0)" });
        gsap.set(quarry, { scale: 1.08 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top 75%",
            end: "bottom 35%",
            scrub: 0.45,
          },
        });

        timeline
          .to(forest, { clipPath: "inset(0 0 100% 0)", duration: 1 }, 0)
          .to(quarry, { scale: 1, duration: 1 }, 0);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="extracao"
      className="bg-carbon text-white"
      aria-labelledby="extracao-title"
    >
      <div className="container pb-16 pt-xl md:pt-3xl lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2
              id="extracao-title"
              className="max-w-4xl font-display text-[clamp(2.7rem,1.3rem+4.5vw,6rem)] font-semibold leading-[0.94] tracking-[-0.05em]"
            >
              {EXTRACTION_SECTION.headline}
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white-70 lg:col-span-4 lg:col-start-9 lg:self-end lg:text-lg">
            {EXTRACTION_SECTION.lede}
          </p>
        </div>
      </div>

      {/* Tela dividida: a foto ocupa a metade esquerda, de borda a borda e da
          altura da tela, presa enquanto o texto da direita rola. Antes ela
          ficava numa coluna do container com 76vh e sobrava preto em cima e
          embaixo. */}
      <div className="grid lg:grid-cols-2">
          <div data-extraction-track className="relative">
            <figure className="relative aspect-[4/5] overflow-hidden bg-carbon-soft lg:sticky lg:top-0 lg:aspect-auto lg:h-[100svh]">
              <div data-extraction-quarry className="absolute inset-0 will-change-transform">
                <Image
                  src={EXTRACTION_SECTION.image.src}
                  alt={EXTRACTION_SECTION.image.alt}
                  fill
                  quality={80}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={`object-cover grayscale contrast-[1.08] ${EXTRACTION_SECTION.image.focus ?? ""}`}
                />
              </div>
              {/* A mata entra em cor e a pedreira embaixo é monocromática. O
                  corte do clip-path sobe, então a linha entre cor e cinza viaja
                  pela imagem: é a cor sendo trocada pela extração. */}
              <div data-extraction-forest className="absolute inset-0 hidden will-change-[clip-path]">
                <Image
                  src={HERO.image.src}
                  alt=""
                  fill
                  quality={75}
                  sizes="50vw"
                  className="object-cover saturate-[.9] contrast-[.98]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
              <figcaption className="absolute bottom-6 left-6 right-6 max-w-sm text-xs leading-relaxed text-white/60 md:bottom-8 md:left-8">
                A mesma cadeia que ergue cidades começa na paisagem.
              </figcaption>
            </figure>
          </div>

          <div className="px-6 pb-xl pt-16 sm:px-8 lg:px-16 lg:py-0 xl:px-24">
            <div className="lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center">
              <p className="font-display text-[clamp(5rem,10vw,10rem)] font-semibold leading-[0.78] tracking-[-0.075em]">
                {EXTRACTION_SECTION.figure.value}
              </p>
              <p className="mt-8 max-w-sm text-base leading-relaxed text-white-70">
                {EXTRACTION_SECTION.figure.label}
              </p>
            </div>

            <div className="mt-16 space-y-16 lg:mt-0 lg:space-y-0">
              {EXTRACTION_SECTION.beats.map((beat) => (
                <article key={beat.title} className="lg:flex lg:min-h-[80svh] lg:flex-col lg:justify-center">
                  <h3 className="max-w-sm font-display text-2xl font-semibold leading-tight tracking-[-0.025em] md:text-3xl">
                    {beat.title}
                  </h3>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-white-70">
                    {beat.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
      </div>
    </section>
  );
}
