"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { EXECUTION_PHASES } from "@/lib/servicos-data";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const ACTS = EXECUTION_PHASES.map((phase) => ({
  id: phase.id,
  title: phase.title,
  description: phase.summary ?? phase.description,
  image: phase.images.primary,
  imageAlt: phase.images.primaryAlt,
}));

// Opacidade das fases que não estão ativas: legíveis, mas claramente atrás.
const DIM = 0.32;

/**
 * As quatro fases canônicas da execução, com a tela presa.
 *
 * Desktop: tela dividida. A foto da fase ocupa a metade esquerda de borda a
 * borda e a altura inteira; à direita, as quatro fases como lista com nome.
 * A fase atual acende e abre a descrição, as outras ficam apagadas, e uma
 * barra acompanha o progresso. Celular: a foto ocupa a tela inteira atrás da
 * mesma lista, com véu. Movimento reduzido: pilha estática.
 *
 * Antes: foto pequena no meio de uma tela preta, abas "01 02 03 04" e o link
 * sozinho numa faixa preta depois do trecho preso. O link agora fecha a
 * lista.
 *
 * Track de 250vh: 150vh de tela presa, uns 50vh de rolagem por fase.
 */
export function ProcessPinned() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const images = gsap.utils.toArray<HTMLElement>("[data-process-img]", root);
        const items = gsap.utils.toArray<HTMLElement>("[data-process-item]", root);
        const descs = gsap.utils.toArray<HTMLElement>("[data-process-desc]", root);
        const bar = root.querySelector<HTMLElement>("[data-process-bar]");
        const track = root.querySelector<HTMLElement>("[data-process-track]");
        if (!bar || !track || images.length !== ACTS.length || items.length !== ACTS.length) return;

        // O HTML base mostra tudo aberto (é o que se lê sem JS); aqui a lista
        // começa com só a primeira fase acesa.
        gsap.set(images.slice(1), { autoAlpha: 0 });
        gsap.set(items.slice(1), { opacity: DIM });
        gsap.set(descs.slice(1), { height: 0, autoAlpha: 0 });
        gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          defaults: { duration: 0.4, ease: "none" },
          scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.5 },
        });

        tl.to(bar, { scaleX: 1, duration: ACTS.length - 1 }, 0);

        for (let index = 1; index < ACTS.length; index++) {
          const at = index - 0.5;
          tl.to(items[index - 1], { opacity: DIM }, at)
            .to(descs[index - 1], { height: 0, autoAlpha: 0 }, at)
            .to(images[index], { autoAlpha: 1 }, at)
            .to(items[index], { opacity: 1 }, at)
            .to(descs[index], { height: "auto", autoAlpha: 1 }, at);
        }
      });
    },
    { scope: sectionRef }
  );

  const link = (
    <Link
      href="/etapas-da-obra"
      className="group inline-flex items-center gap-4 text-sm font-medium uppercase tracking-wider text-white"
    >
      <span className="h-[3px] w-10 bg-white transition-all duration-500 ease-expo group-hover:w-16" />
      As quatro fases da obra em detalhe
    </Link>
  );

  return (
    <section ref={sectionRef} className="bg-carbon text-white" aria-labelledby="processo-title">
      <div className="container pb-16 pt-2xl md:pt-3xl lg:pb-24">
        <RevealOnScroll>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-white-50">
            Construtora completa
          </p>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <h2
              id="processo-title"
              className="max-w-4xl font-display text-[clamp(2.4rem,1.2rem+3.6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em] lg:col-span-8"
            >
              Como construtora, fazemos a obra inteira.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-white-70 lg:col-span-4 lg:self-end lg:text-lg">
              Quatro fases coordenadas pela mesma equipe. Você não negocia com fornecedores soltos.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <div data-process-track className="relative hidden h-[250vh] motion-safe:block">
        <div className="sticky top-0 h-[100svh] overflow-hidden lg:grid lg:grid-cols-2">
          <div className="absolute inset-0 lg:relative">
            {ACTS.map((act, index) => (
              <div key={act.id} data-process-img className="absolute inset-0">
                {/* sizes pela altura: foto 3:2 cobrindo meia tela (desktop) ou
                    a tela inteira (celular), desenhada pela altura. */}
                <Image
                  src={act.image}
                  alt={index === 0 ? act.imageAlt : ""}
                  fill
                  quality={80}
                  sizes="(min-width: 1024px) max(50vw, 150vh), 150vh"
                  className="object-cover"
                />
              </div>
            ))}
            <div
              className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/70 to-carbon/10 lg:hidden"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 sm:px-8 lg:justify-center lg:px-16 lg:pb-0 xl:px-24">
            <div className="mb-8 h-[2px] w-full max-w-md bg-white-10" aria-hidden="true">
              <div data-process-bar className="h-full w-full bg-white" />
            </div>

            <ol className="max-w-md space-y-5 lg:space-y-7">
              {ACTS.map((act) => (
                <li key={act.id} data-process-item>
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] lg:text-[clamp(1.5rem,2vw,2rem)]">
                    {act.title}
                  </h3>
                  <div data-process-desc className="overflow-hidden">
                    <p className="pt-3 text-base leading-relaxed text-white/80 lg:text-white-70">{act.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 lg:mt-14">{link}</div>
          </div>
        </div>
      </div>

      {/* Movimento reduzido: pilha estática, com o link no fim. */}
      <div className="container hidden flex-col gap-14 pb-2xl motion-reduce:flex md:pb-3xl">
        {ACTS.map((act) => (
          <div key={act.id}>
            <div className="relative mb-6 aspect-[16/10] overflow-hidden">
              <Image src={act.image} alt={act.imageAlt} fill sizes="100vw" className="object-cover" />
            </div>
            <h3 className="mb-3 font-display text-2xl font-semibold tracking-tight">{act.title}</h3>
            <p className="leading-relaxed text-white-70">{act.description}</p>
          </div>
        ))}
        <div>{link}</div>
      </div>
    </section>
  );
}
