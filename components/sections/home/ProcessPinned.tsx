"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { EXECUTION_PHASES } from "@/lib/servicos-data";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const ACTS = EXECUTION_PHASES.map((phase) => ({
  id: phase.id,
  label: `fase ${String(phase.number).padStart(2, "0")} · ${phase.shortTitle.toLowerCase()}`,
  title: phase.title,
  description: phase.summary ?? phase.description,
  image: phase.images.primary,
  imageAlt: phase.images.primaryAlt,
}));

/**
 * As quatro fases canônicas da execução. Mídia e texto fazem crossfade dentro
 * de um track sticky, no desktop e no celular. No desktop a foto fica numa
 * coluna ao lado do texto; no celular ela ocupa a tela inteira, atrás do texto,
 * com véu escuro. Só com movimento reduzido a seção vira pilha estática.
 *
 * Track de 250vh: 150vh de tela presa, uns 50vh de rolagem por fase. Antes
 * eram 340vh, 2,4 telas presas para quatro trocas.
 */
export function ProcessPinned() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const images = gsap.utils.toArray<HTMLElement>("[data-process-img]");
          const texts = gsap.utils.toArray<HTMLElement>("[data-process-text]");
          const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]");
          if (
            images.length !== ACTS.length ||
            texts.length !== ACTS.length ||
            steps.length !== ACTS.length
          ) {
            return;
          }

          const tl = gsap.timeline({
            defaults: { duration: 0.5, ease: "none" },
            scrollTrigger: {
              trigger: "[data-process-track]",
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          });

          for (let index = 1; index < ACTS.length; index++) {
            const transitionAt = index - 0.3;
            tl.to(texts[index - 1], { autoAlpha: 0 }, transitionAt)
              .to(steps[index - 1], { opacity: 0.3 }, transitionAt)
              .to(images[index], { autoAlpha: 1 }, transitionAt)
              .to(texts[index], { autoAlpha: 1 }, transitionAt + 0.1)
              .to(steps[index], { opacity: 1 }, transitionAt + 0.1);
          }
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-carbon text-white">
      <div className="container pt-2xl md:pt-3xl">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-4">
            03 · construtora completa
          </p>
          <h2 className="headline-md text-white max-w-3xl">
            Como construtora, fazemos a obra inteira.
          </h2>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white-70">
            Quatro fases coordenadas pela mesma equipe. Você não negocia com
            fornecedores soltos.
          </p>
        </RevealOnScroll>
      </div>

      <div data-process-track className="relative hidden h-[250vh] motion-safe:block">
        {/* O container não é `relative` de propósito: no celular a coluna da
            foto é absolute e se posiciona pelo sticky, cobrindo a tela toda. */}
        <div className="sticky top-0 h-[100svh] overflow-hidden lg:flex lg:flex-col lg:justify-center lg:pb-10 lg:pt-24">
          <div className="container flex h-full flex-col justify-end pb-16 lg:grid lg:h-auto lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-0">
            <div className="absolute inset-0 overflow-hidden lg:relative lg:inset-auto lg:col-span-7 lg:h-[56svh] lg:min-h-[380px]">
              {ACTS.map((act, index) => (
                <div
                  key={act.id}
                  data-process-img
                  className={index === 0 ? "absolute inset-0" : "absolute inset-0 opacity-0"}
                >
                  <Image
                    src={act.image}
                    alt={index === 0 ? act.imageAlt : ""}
                    fill
                    sizes="(min-width: 1024px) 60vw, 150vh"
                    className="object-cover"
                  />
                </div>
              ))}
              {/* Véu só no celular, onde o texto passa por cima da foto. */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/70 to-carbon/20 lg:hidden"
                aria-hidden="true"
              />
            </div>

            <div className="relative z-10 lg:col-span-4 lg:col-start-9">
              <div className="flex items-center gap-6 mb-10" aria-hidden="true">
                {ACTS.map((act, index) => (
                  <span
                    key={act.id}
                    data-process-step
                    className={
                      "font-tech text-sm tracking-wide text-white" +
                      (index === 0 ? "" : " opacity-30")
                    }
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ))}
                <span className="h-[3px] flex-1 bg-white-10" />
              </div>

              <div className="relative min-h-[240px] lg:min-h-[300px]">
                {ACTS.map((act, index) => (
                  <div
                    key={act.id}
                    data-process-text
                    className={
                      index === 0 ? "absolute inset-0" : "absolute inset-0 opacity-0"
                    }
                  >
                    <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-3">
                      {act.label}
                    </p>
                    <h3 className="font-display font-semibold text-2xl xl:text-3xl tracking-tight mb-4">
                      {act.title}
                    </h3>
                    <p className="text-white-70 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container hidden flex-col gap-14 pt-16 motion-reduce:flex">
        {ACTS.map((act, index) => (
          <RevealOnScroll key={act.id} delay={index * 0.1}>
            <div className="relative aspect-[16/10] overflow-hidden mb-6">
              <Image
                src={act.image}
                alt={act.imageAlt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-3">
              {act.label}
            </p>
            <h3 className="font-display font-semibold text-2xl tracking-tight mb-3">
              {act.title}
            </h3>
            <p className="text-white-70 leading-relaxed">{act.description}</p>
          </RevealOnScroll>
        ))}
      </div>

      <div className="container pb-2xl md:pb-3xl pt-14">
        <RevealOnScroll>
          <Link
            href="/etapas-da-obra"
            className="group inline-flex items-center gap-4 text-sm uppercase tracking-wider font-medium text-white"
          >
            <span className="h-[3px] w-10 bg-white transition-all duration-500 ease-expo group-hover:w-16" />
            As quatro fases da obra em detalhe
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
