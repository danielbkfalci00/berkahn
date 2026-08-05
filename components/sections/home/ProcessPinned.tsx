"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

type ProcessAct = {
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const ACTS: ProcessAct[] = [
  {
    label: "fase 01 · pré-obra e fundação",
    title: "Planejamento antes do canteiro",
    description:
      "Análise dos projetos, orçamento fechado e cronograma executivo. A fundação sai mais leve e econômica porque a estrutura pesa até 15 vezes menos que a alvenaria.",
    image: "/images/Services/servicos-foundations.webp",
    imageAlt: "Fundação e preparação do terreno para obra em Light Steel Frame",
  },
  {
    label: "fase 02 · superestrutura e vedação",
    title: "Precisão de milímetros",
    description:
      "Perfis de aço galvanizado montados com tolerância de 1 a 2 mm, com vedações, fachadas e instalações integradas na mesma etapa.",
    image: "/images/Services/servicos-structure.webp",
    imageAlt: "Superestrutura de aço galvanizado montada com precisão",
  },
  {
    label: "fase 03 · acabamento e entrega",
    title: "Entrega vistoriada",
    description:
      "Revestimentos, esquadrias e marcenaria com a mesma equipe técnica do primeiro dia. Obra seca, canteiro limpo, prazo cumprido.",
    image: "/images/Services/servicos-finished.webp",
    imageAlt: "Residência finalizada com acabamento de alto padrão",
  },
];

/**
 * Momento-assinatura 3: narrativa de processo em três atos.
 * Desktop: coluna de mídia presa (CSS sticky) com crossfade dirigido por
 * scroll (ScrollTrigger scrub); mobile e reduced-motion: stack estático.
 */
export function ProcessPinned() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const images = gsap.utils.toArray<HTMLElement>("[data-process-img]");
          const texts = gsap.utils.toArray<HTMLElement>("[data-process-text]");
          const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]");
          if (images.length < 3 || texts.length < 3) return;

          const tl = gsap.timeline({
            defaults: { duration: 0.5, ease: "none" },
            scrollTrigger: {
              trigger: "[data-process-track]",
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          });

          // Ato 1 -> 2
          tl.to(texts[0], { autoAlpha: 0 }, 0.7)
            .to(steps[0], { opacity: 0.3 }, 0.7)
            .to(images[1], { autoAlpha: 1 }, 0.7)
            .to(texts[1], { autoAlpha: 1 }, 0.8)
            .to(steps[1], { opacity: 1 }, 0.8)
            // Ato 2 -> 3
            .to(texts[1], { autoAlpha: 0 }, 1.7)
            .to(steps[1], { opacity: 0.3 }, 1.7)
            .to(images[2], { autoAlpha: 1 }, 1.7)
            .to(texts[2], { autoAlpha: 1 }, 1.8)
            .to(steps[2], { opacity: 1 }, 1.8);
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
            03 · como construímos
          </p>
          <h2 className="headline-md text-white max-w-2xl">
            A obra inteira com uma equipe só.
          </h2>
        </RevealOnScroll>
      </div>

      {/* Desktop com motion: track com mídia sticky e UM ato visível por vez.
          Altura clampada em svh e padding compensando o header fixo — nada
          corta em viewports baixos ou com zoom. */}
      <div data-process-track className="hidden motion-safe:lg:block relative h-[260vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center pt-24 pb-10">
          <div className="container grid grid-cols-12 gap-10 items-center">
            <div className="col-span-7 relative h-[56svh] min-h-[380px] overflow-hidden">
              {ACTS.map((act, index) => (
                <div
                  key={act.label}
                  data-process-img
                  className={index === 0 ? "absolute inset-0" : "absolute inset-0 opacity-0"}
                >
                  <Image
                    src={act.image}
                    alt={index === 0 ? act.imageAlt : ""}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="col-span-4 col-start-9">
              {/* Índice dos atos */}
              <div className="flex items-center gap-6 mb-10" aria-hidden="true">
                {ACTS.map((act, index) => (
                  <span
                    key={act.label}
                    data-process-step
                    className={
                      "font-tech text-sm tracking-wide text-white" +
                      (index === 0 ? "" : " opacity-30")
                    }
                  >
                    0{index + 1}
                  </span>
                ))}
                <span className="h-[3px] flex-1 bg-white-10" />
              </div>

              {/* Slot de ato único — blocos sobrepostos, crossfade por scroll */}
              <div className="relative min-h-[260px]">
                {ACTS.map((act, index) => (
                  <div
                    key={act.label}
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

      {/* Mobile sempre; desktop quando prefers-reduced-motion: stack estático completo */}
      <div className="motion-safe:lg:hidden container flex flex-col gap-14 pt-16">
        {ACTS.map((act, index) => (
          <RevealOnScroll key={act.label} delay={index * 0.1}>
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
