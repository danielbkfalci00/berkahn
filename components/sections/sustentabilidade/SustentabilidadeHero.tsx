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
    (_context, contextSafe) => {
      const root = sectionRef.current;
      if (!root || !contextSafe) return;
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
          // A Promise resolve depois da execução síncrona deste callback, então
          // o split e o tween precisam de contextSafe para entrar no contexto e
          // serem revertidos se a rota sair antes de as fontes carregarem.
          document.fonts.ready.then(
            contextSafe(() => {
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
            })
          );
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
        className="relative flex h-full flex-col justify-end pb-32 md:pb-28"
      >
        <div className="container">
          <p data-hero-fade className="font-tech text-xs lowercase tracking-wide text-white-70">
            {HERO.eyebrow}
          </p>
          {/* .headline-hero trava em 62px, teto calibrado para a frase de outra
              página. Aqui a tese precisa ficar acima dos numerais, que chegam
              a 150px. */}
          <h1
            data-hero-title
            className="hero-text-shadow-strong mt-5 max-w-4xl font-display font-semibold leading-[1.04] tracking-tight text-white text-[clamp(2.75rem,1.4rem+5.2vw,5.5rem)]"
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

      {/* Marca de rolagem sem palavra: "role para ver a conta" colidia com o
          botão do header no primeiro scroll e era meta-texto. */}
      <span
        data-hero-fade
        className="animate-scroll-cue absolute bottom-8 left-1/2 h-12 w-[3px] -translate-x-1/2 bg-white/60 md:left-auto md:right-10 md:translate-x-0"
        aria-hidden="true"
      />
    </section>
  );
}
