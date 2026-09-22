"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { IMPACT_SECTION, type ImpactHero } from "@/lib/impact-data";

/** Cada batida tem uma composição: esquerda, centro grande, direita. */
const BEAT_ALIGN = ["items-start text-left", "items-center text-center", "items-end text-right"];
const BEAT_SIZE = ["text-[24vw] lg:text-[14vw]", "text-[30vw] lg:text-[19vw]", "text-[24vw] lg:text-[14vw]"];
const PLATE_FOCUS = ["object-[55%_50%]", "object-[60%_50%]", "object-[50%_45%]"];

const NUMBER_CLASS = "font-display font-semibold tracking-tight leading-none tabular-nums text-white";
const LABEL_CLASS = "font-tech text-xs lowercase tracking-wide text-white-50";
const CAPTION_CLASS = "font-tech text-xs tracking-wide text-white-50";

/**
 * "05 · impacto": três batidas, uma por conta que a construção a seco muda
 * (quem mora, quem paga, a cidade). O herói de cada batida é um número em
 * escala de viewport que conta do valor do sistema convencional ao do Light
 * Steel Frame. Cada batida tem a própria foto ao fundo.
 *
 * Com movimento, no desktop e no celular: track de 240vh com a tela presa; a
 * placa troca de foto a cada batida e avança (zoom + parallax) o tempo todo,
 * enquanto os números derivam no sentido oposto. Antes eram 320vh, e o celular
 * tinha só três cartões soltos, sem a sequência. Movimento reduzido: cartões
 * estáticos com os números finais.
 * As fontes de cada número ficam em lib/impact-data.ts, não na tela.
 */
export function ImpactPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const section = IMPACT_SECTION;
  const total = section.blocks.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = sectionRef.current;
        if (!root) return;
        const track = root.querySelector<HTMLElement>("[data-impact-track]");
        const plateWrap = root.querySelector<HTMLElement>("[data-impact-plates]");
        const plates = gsap.utils.toArray<HTMLElement>("[data-impact-plate]", root);
        const veil = root.querySelector<HTMLElement>("[data-impact-veil]");
        const beats = gsap.utils.toArray<HTMLElement>("[data-impact-beat]", root);
        if (!track || !plateWrap || !veil || plates.length !== total || beats.length !== total) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });

        // A placa inteira avança o tempo todo; a foto troca com cada batida.
        tl.fromTo(plateWrap, { scale: 1, yPercent: -3 }, { scale: 1.15, yPercent: 3, duration: total }, 0);
        tl.fromTo(veil, { opacity: 1 }, { opacity: 0.6, duration: 0.6 }, total - 0.8);

        section.blocks.forEach((block, index) => {
          const beat = beats[index];
          const count = makeCounter(beat, block.hero);
          // Números derivam contra a placa: segunda velocidade, profundidade.
          tl.fromTo(count.numberEl, { yPercent: 8 }, { yPercent: -8, duration: total }, 0);

          const at = index;
          if (index > 0) {
            tl.fromTo(plates[index], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, at - 0.05);
            tl.fromTo(beat, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.28 }, at);
          }
          tl.to(count.state, { value: block.hero.to, duration: 0.5, onUpdate: count.render }, at + (index === 0 ? 0.04 : 0.18));
          if (index < total - 1) {
            tl.to(beat, { autoAlpha: 0, y: -48, duration: 0.22 }, at + 0.78);
          }
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="impacto" className="relative bg-carbon text-white">
      <div className="container pt-2xl md:pt-3xl pb-12 md:pb-16">
        <RevealOnScroll>
          <p className={`${LABEL_CLASS} mb-4`}>{section.eyebrow}</p>
          <h2 className="headline-md text-white max-w-3xl">{section.headline}</h2>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white-70">
            {section.lede}
          </p>
        </RevealOnScroll>
      </div>

      {/* Com movimento: três batidas com a tela presa, desktop e celular */}
      <div data-impact-track className="relative hidden h-[240vh] motion-safe:block">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* sizes das fotos: tela cheia com zoom de 1.15 no desktop e, no
              celular, foto 3:2 cobrindo uma caixa da altura da tela, desenhada
              pela altura. "100vw" pedia de 2x a 3x menos pixels. */}
          <div data-impact-plates className="absolute inset-0 will-change-transform">
            {section.blocks.map((block, index) => (
              <div
                key={block.id}
                data-impact-plate
                className={`absolute inset-0 ${index > 0 ? "opacity-0" : ""}`}
              >
                <Image
                  src={block.image.src}
                  alt={index === 0 ? block.image.alt : ""}
                  fill
                  quality={80}
                  sizes="max(115vw, 173vh)"
                  className={`object-cover ${PLATE_FOCUS[index]}`}
                />
              </div>
            ))}
          </div>
          <div
            data-impact-veil
            className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/50"
            aria-hidden="true"
          />

          {section.blocks.map((block, index) => (
            <div
              key={block.id}
              data-impact-beat
              className={`absolute inset-0 flex flex-col justify-center ${index > 0 ? "opacity-0" : ""}`}
            >
              <div className="container">
                <Beat block={block} index={index} sizeClass={BEAT_SIZE[index]} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Movimento reduzido: três cartões estáticos com foto ao fundo */}
      <div className="hidden flex-col motion-reduce:flex">
        {section.blocks.map((block, index) => (
          <article
            key={block.id}
            className="relative min-h-[88svh] overflow-hidden flex flex-col justify-end"
          >
            <div className="absolute inset-0">
              <Image
                src={block.image.src}
                alt={block.image.alt}
                fill
                quality={80}
                sizes="max(115vw, 173vh)"
                className={`object-cover ${PLATE_FOCUS[index]}`}
              />
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/80 to-carbon/30"
              aria-hidden="true"
            />
            <div className="relative container pb-14 pt-32">
              <Beat block={block} index={index} sizeClass={BEAT_SIZE[index]} />
            </div>
          </article>
        ))}
      </div>

      {/* Saída da seção: a página que abre cada uma dessas contas. */}
      <div className="container pb-2xl pt-12 md:pb-3xl md:pt-16">
        <div className="border-t border-white-10 pt-10">
          <Link
            href="/sustentabilidade"
            className="group inline-flex items-center gap-4 text-sm font-medium uppercase tracking-wider text-white"
          >
            <span
              className="h-[3px] w-10 bg-white transition-all duration-500 ease-expo group-hover:w-16"
              aria-hidden="true"
            />
            O que a obra tira do mundo
          </Link>
          <p className="mt-4 max-w-md font-tech text-xs tracking-wide text-white-50">
            carbono, areia, água, madeira e entulho, com a procedência de cada número
          </p>
        </div>
      </div>
    </section>
  );
}

/** Uma batida: label, número-herói (prefixo + numeral + unidade), rótulo, frase e legenda. */
function Beat({
  block,
  index,
  sizeClass,
}: {
  block: (typeof IMPACT_SECTION)["blocks"][number];
  index: number;
  sizeClass: string;
}) {
  const { hero, aside } = block;
  return (
    <div className={`flex flex-col ${BEAT_ALIGN[index]}`}>
      <p className={`${LABEL_CLASS} mb-6`}>
        {block.index} · {block.audience}
      </p>
      <p className={`${NUMBER_CLASS} ${sizeClass}`}>
        {hero.prefix && (
          <span
            data-impact-prefix
            className="mr-[0.08em] align-baseline text-[0.55em] font-medium text-white-70"
          >
            {hero.prefix.trim()}
          </span>
        )}
        <span data-impact-number>{hero.to}</span>
        <span className="ml-[0.08em] align-baseline text-[0.42em] font-medium text-white-70">
          {hero.unit.trim()}
        </span>
      </p>
      <p className="mt-5 text-xs uppercase tracking-wider text-white-70 font-medium">{hero.label}</p>
      <p className="mt-6 max-w-xl font-display font-medium text-2xl xl:text-3xl tracking-tight text-white">
        {block.claim}
      </p>
      <p className={`mt-6 max-w-md ${CAPTION_CLASS}`}>
        {hero.compare}
        {" · "}
        {aside.value} {aside.label}
      </p>
    </div>
  );
}

/**
 * Liga um número-herói ao GSAP: escreve só o numeral e mostra o prefixo
 * ("<") apenas no valor final, para "< 5%" não virar "< 30%" no meio da conta.
 */
function makeCounter(root: HTMLElement, hero: ImpactHero) {
  const numberEl = root.querySelector<HTMLElement>("[data-impact-number]");
  const prefixEl = root.querySelector<HTMLElement>("[data-impact-prefix]");
  const state = { value: hero.from };
  const render = () => {
    const value = Math.round(state.value);
    if (numberEl) numberEl.textContent = String(value);
    if (prefixEl) prefixEl.style.opacity = value === hero.to ? "1" : "0";
  };
  render();
  return { numberEl: numberEl ?? root, state, render };
}
