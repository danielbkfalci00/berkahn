"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { HERO } from "@/lib/sustentabilidade-data";

export function SustentabilidadeHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = sectionRef.current;
      if (!root || !contextSafe) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const image = root.querySelector<HTMLElement>("[data-hero-image]");
        const content = root.querySelector<HTMLElement>("[data-hero-content]");
        const title = root.querySelector<HTMLElement>("[data-hero-title]");

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.08, yPercent: -2 },
            {
              scale: 1,
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: 0.4,
              },
            },
          );
        }

        if (content) {
          gsap.to(content, {
            yPercent: -10,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "55% top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // Só no desktop. No celular o título é o maior elemento da primeira
        // tela (LCP) e a revelação o escondia até o JS e as fontes chegarem:
        // Lighthouse mediu 12,5 s em produção.
        if (title && window.matchMedia("(min-width: 1024px)").matches) {
          document.fonts.ready.then(
            contextSafe(() => {
              SplitText.create(title, {
                type: "lines",
                mask: "lines",
                autoSplit: true,
                onSplit: (self) =>
                  gsap.from(self.lines, {
                    yPercent: 104,
                    duration: 1.05,
                    ease: "expo.out",
                    stagger: 0.07,
                  }),
              });
            }),
          );
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-carbon text-white"
      aria-labelledby="sustentabilidade-title"
    >
      <div data-hero-image className="absolute inset-[-8%] will-change-transform">
        {/* O quadro da foto é 16% maior que a tela e o parallax ainda aplica
            1.08; no celular a foto (16:9) cobre a altura, não a largura. O
            sizes antigo, 100vw, pedia de 2x a 3x menos pixels do que a tela
            mostra. No celular, porém, pedir a largura inteira desenhada (~5000px
            numa tela 3x) trazia fotos de 1,9 MB e travava o carregamento; lá o
            teto é 100vh, 2x a 3x a tela, em troca de um pouco de nitidez. */}
        <Image
          src={HERO.image.src}
          alt={HERO.image.alt}
          fill
          priority
          quality={80}
          sizes="(max-width: 767px) 100vh, max(125vw, 225vh)"
          className={`object-cover grayscale contrast-[1.08] ${HERO.image.focus ?? ""}`}
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18)_0%,rgba(0,0,0,.2)_35%,rgba(0,0,0,.9)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[32vw] min-w-20 bg-[linear-gradient(90deg,rgba(0,0,0,.36),transparent)]" />

      <div data-hero-content className="relative flex h-full items-end pb-20 md:pb-24">
        <div className="container grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1
            id="sustentabilidade-title"
            data-hero-title
            className="hero-text-shadow-strong max-w-5xl font-display text-[clamp(3rem,1.1rem+5.7vw,6.6rem)] font-semibold leading-[0.93] tracking-[-0.052em] text-white lg:col-span-9"
          >
            {HERO.headline}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white-70 lg:col-span-3 lg:pb-2 lg:text-lg">
            {HERO.lede}
          </p>
        </div>
      </div>
    </section>
  );
}
