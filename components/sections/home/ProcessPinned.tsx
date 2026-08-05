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
          if (images.length < 3 || texts.length < 3) return;

          gsap.set(images.slice(1), { autoAlpha: 0 });
          gsap.set(texts.slice(1), { opacity: 0.3 });

          const tl = gsap.timeline({
            defaults: { duration: 0.6, ease: "none" },
            scrollTrigger: {
              trigger: "[data-process-track]",
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          });

          tl.to(texts[0], { opacity: 0.3 }, 0.7)
            .to(images[1], { autoAlpha: 1 }, 0.7)
            .to(texts[1], { opacity: 1 }, 0.7)
            .to(texts[1], { opacity: 0.3 }, 1.7)
            .to(images[2], { autoAlpha: 1 }, 1.7)
            .to(texts[2], { opacity: 1 }, 1.7);
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-carbon text-white">
      <div className="container pt-2xl md:pt-3xl">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-bronze mb-4">
            03 · como construímos
          </p>
          <h2 className="headline-md text-white max-w-2xl">
            A obra inteira com uma equipe só.
          </h2>
        </RevealOnScroll>
      </div>

      {/* Desktop: track de 300vh com mídia sticky e crossfade por scroll */}
      <div data-process-track className="hidden lg:block relative h-[300vh]">
        <div className="sticky top-0 h-screen flex items-center">
          <div className="container grid grid-cols-12 gap-10 items-center">
            <div className="col-span-7 relative aspect-[16/11] overflow-hidden">
              {ACTS.map((act, index) => (
                <div key={act.label} data-process-img className="absolute inset-0">
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

            <div className="col-span-4 col-start-9 flex flex-col gap-12">
              {ACTS.map((act) => (
                <div key={act.label} data-process-text>
                  <p className="font-tech text-xs lowercase tracking-wide text-bronze mb-3">
                    {act.label}
                  </p>
                  <h3 className="font-display font-semibold text-2xl tracking-tight mb-3">
                    {act.title}
                  </h3>
                  <p className="text-white-70 leading-relaxed text-sm">
                    {act.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / reduced-motion: stack estático */}
      <div className="lg:hidden container flex flex-col gap-14 pt-16">
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
            <p className="font-tech text-xs lowercase tracking-wide text-bronze mb-3">
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
            <span className="h-[3px] w-10 bg-bronze transition-all duration-500 ease-expo group-hover:w-16" />
            As quatro fases da obra em detalhe
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
