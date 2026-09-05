"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { HERO } from "@/lib/sustentabilidade-data";

/**
 * Abertura de tela cheia. A foto recua devagar enquanto o texto sobe mais
 * rápido e sai antes, o que dá a sensação de câmera avançando na cena em vez
 * de página rolando. A headline emerge por baixo de uma máscara de linha,
 * mesmo recurso do EditorialStatement da home.
 *
 * O split só acontece depois de as fontes carregarem; medir linha com a fonte
 * de fallback quebra a quebra de linha e deixa palavra órfã.
 */
export function SustentabilidadeHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const plate = root.querySelector<HTMLElement>("[data-hero-plate]");
        const content = root.querySelector<HTMLElement>("[data-hero-content]");
        const title = root.querySelector<HTMLElement>("[data-hero-title]");
        const rest = gsap.utils.toArray<HTMLElement>("[data-hero-fade]", root);

        if (plate) {
          gsap.fromTo(
            plate,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 8,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
            }
          );
        }

        if (content) {
          gsap.to(content, {
            yPercent: -18,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: { trigger: root, start: "center top", end: "bottom top", scrub: true },
          });
        }

        gsap.from(rest, { autoAlpha: 0, y: 24, duration: 0.9, ease: "expo.out", delay: 0.5, stagger: 0.12 });

        if (title) {
          document.fonts.ready.then(() => {
            SplitText.create(title, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 1.1,
                  ease: "expo.out",
                  stagger: 0.09,
                }),
            });
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-carbon text-white"
    >
      <div data-hero-plate className="absolute inset-[-8%] will-change-transform">
        <Image
          src={HERO.image.src}
          alt={HERO.image.alt}
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover grayscale"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/70 to-carbon/45"
        aria-hidden="true"
      />

      <div
        data-hero-content
        className="relative flex h-full flex-col justify-end pb-32 md:justify-center md:pb-0"
      >
        <div className="container">
          <p data-hero-fade className="font-tech text-xs lowercase tracking-wide text-white-70">
            {HERO.eyebrow}
          </p>
          <h1
            data-hero-title
            className="headline-hero mt-5 max-w-4xl hero-text-shadow-strong"
          >
            {HERO.headline}
          </h1>
          <p
            data-hero-fade
            className="mt-6 max-w-xl text-base leading-relaxed text-white-70 md:text-lg"
          >
            {HERO.lede}
          </p>
        </div>
      </div>

      {/* Índice das contas. Serve de navegação da página inteira. */}
      <nav
        data-hero-fade
        aria-label="Contas desta página"
        className="absolute bottom-8 left-0 right-0 hidden lg:block"
      >
        <div className="container">
          <ul className="flex flex-col gap-2">
            {HERO.index.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group inline-flex items-center gap-4 font-tech text-xs lowercase tracking-wide text-white-50 transition-colors duration-300 hover:text-white"
                >
                  <span
                    className="h-[3px] w-10 bg-white/40 transition-all duration-500 ease-expo group-hover:w-16 group-hover:bg-white"
                    aria-hidden="true"
                  />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div
        data-hero-fade
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 lg:left-auto lg:right-10 lg:translate-x-0"
      >
        <span className="font-tech text-[10px] lowercase tracking-wide text-white-50">
          {HERO.cue}
        </span>
        <span className="animate-scroll-cue h-10 w-[3px] bg-white/70" aria-hidden="true" />
      </div>
    </section>
  );
}
