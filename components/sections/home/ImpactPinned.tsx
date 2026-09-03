"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  IMPACT_SECTION,
  heroText,
  impactSources,
  type DataSource,
} from "@/lib/impact-data";

const SUPERSCRIPT = ["¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

/** Cada batida tem uma composição: esquerda, centro grande, direita. */
const BEAT_ALIGN = ["items-start text-left", "items-center text-center", "items-end text-right"];
const BEAT_SIZE = ["text-[14vw]", "text-[19vw]", "text-[14vw]"];

/**
 * "05 · impacto": três batidas pinadas, uma por conta que a construção a seco
 * muda (quem mora, quem paga, a cidade). O herói de cada batida é um número
 * em escala de viewport que conta conforme o scroll, saindo do valor do
 * sistema convencional e chegando ao do Light Steel Frame. Profundidade por
 * duas velocidades: a foto ao fundo avança devagar (zoom + parallax) enquanto
 * os números derivam no sentido oposto.
 *
 * Desktop com motion: track de 320vh com viewport preso. Mobile e
 * reduced-motion: pilha estática, mesmo padrão de ProcessPinned.
 */
export function ImpactPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const section = IMPACT_SECTION;
  const sources = impactSources(section);
  const sourceIndex = new Map(sources.map((source, index) => [source.id, index]));
  const noteOf = (source?: DataSource): Note | null => {
    const index = source ? sourceIndex.get(source.id) : undefined;
    if (index === undefined) return null;
    return { n: index + 1, glyph: SUPERSCRIPT[index] ?? String(index + 1) };
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const root = sectionRef.current;
        if (!root) return;
        const track = root.querySelector<HTMLElement>("[data-impact-track]");
        const plate = root.querySelector<HTMLElement>("[data-impact-plate]");
        const veil = root.querySelector<HTMLElement>("[data-impact-veil]");
        const beats = gsap.utils.toArray<HTMLElement>("[data-impact-beat]", root);
        const numbers = gsap.utils.toArray<HTMLElement>("[data-impact-number]", root);
        const total = section.blocks.length;
        if (!track || !plate || !veil || beats.length !== total || numbers.length !== total) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        // Placa de fundo: a casa se aproxima ao longo de todo o percurso.
        tl.fromTo(plate, { scale: 1, yPercent: -3 }, { scale: 1.15, yPercent: 3, duration: total }, 0);
        // Números derivam contra a placa: é a segunda velocidade que dá profundidade.
        tl.fromTo(numbers, { yPercent: 8 }, { yPercent: -8, duration: total }, 0);
        // O véu clareia na última batida, a casa aparece mais.
        tl.fromTo(veil, { opacity: 1 }, { opacity: 0.6, duration: 0.6 }, total - 0.8);

        section.blocks.forEach((block, index) => {
          const beat = beats[index];
          const numberEl = numbers[index];
          const { from, to, prefix, unit } = block.hero;
          const counter = { value: from };
          const render = () => {
            const value = Math.round(counter.value);
            numberEl.textContent = `${value === to && prefix ? prefix : ""}${value}${unit}`;
          };
          render();

          const at = index;
          if (index > 0) {
            tl.fromTo(beat, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.28 }, at);
          }
          tl.to(counter, { value: to, duration: 0.5, onUpdate: render }, at + (index === 0 ? 0.04 : 0.18));
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
          <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-4">
            {section.eyebrow}
          </p>
          <h2 className="headline-md text-white max-w-3xl">{section.headline}</h2>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white-70">
            {section.lede}
            <Sup note={noteOf(section.ledeSource)} />
          </p>
        </RevealOnScroll>
      </div>

      {/* Desktop com motion: três batidas com o viewport preso */}
      <div data-impact-track className="hidden motion-safe:lg:block relative h-[320vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div data-impact-plate className="absolute inset-0 will-change-transform">
            <Image
              src={section.image.src}
              alt={section.image.alt}
              fill
              quality={70}
              sizes="100vw"
              className="object-cover object-[50%_45%]"
            />
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
                <div className={`flex flex-col ${BEAT_ALIGN[index]}`}>
                  <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-6">
                    {block.index} · {block.audience}
                  </p>
                  <p
                    data-impact-number
                    className={`font-display font-semibold tracking-tight leading-none tabular-nums text-white ${BEAT_SIZE[index]}`}
                  >
                    {heroText(block.hero)}
                  </p>
                  <p className="mt-5 text-xs uppercase tracking-wider text-white-70 font-medium">
                    {block.hero.label}
                    <Sup note={noteOf(block.hero.source)} />
                  </p>
                  <p className="mt-8 max-w-xl font-display font-medium text-2xl xl:text-3xl tracking-tight text-white">
                    {block.claim}
                  </p>
                  <p className="mt-6 font-tech text-xs lowercase tracking-wide text-white-50">
                    {block.hero.compare}
                    <Sup note={noteOf(block.hero.compareSource)} />
                    {" · "}
                    {block.aside.value} {block.aside.label}
                    <Sup note={noteOf(block.aside.source)} />
                  </p>
                </div>
              </div>
            </div>
          ))}

          <p className="absolute bottom-8 left-0 right-0">
            <span className="container flex items-center gap-3">
              <span className="h-[3px] w-10 bg-white" aria-hidden="true" />
              <span className="font-tech text-xs lowercase tracking-wide text-white-50">
                {section.image.caption}
              </span>
            </span>
          </p>
        </div>
      </div>

      {/* Mobile e reduced-motion: pilha estática */}
      <div className="motion-safe:lg:hidden container flex flex-col gap-16">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden bg-carbon-soft">
            <Image
              src={section.image.src}
              alt={section.image.alt}
              fill
              quality={70}
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="h-[3px] w-10 bg-white" aria-hidden="true" />
            <span className="font-tech text-xs lowercase tracking-wide text-white-50">
              {section.image.caption}
            </span>
          </figcaption>
        </figure>

        {section.blocks.map((block, index) => (
          <RevealOnScroll key={block.id} delay={index * 0.1}>
            <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-4">
              {block.index} · {block.audience}
            </p>
            <p className="font-display font-semibold tracking-tight leading-none tabular-nums text-[22vw] sm:text-[16vw] text-white">
              {heroText(block.hero)}
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-white-70 font-medium">
              {block.hero.label}
              <Sup note={noteOf(block.hero.source)} />
            </p>
            <p className="mt-6 font-display font-medium text-2xl tracking-tight text-white">
              {block.claim}
            </p>
            <p className="mt-4 font-tech text-xs lowercase tracking-wide text-white-50">
              {block.hero.compare}
              <Sup note={noteOf(block.hero.compareSource)} />
              {" · "}
              {block.aside.value} {block.aside.label}
              <Sup note={noteOf(block.aside.source)} />
            </p>
          </RevealOnScroll>
        ))}
      </div>

      <div className="container pt-16 md:pt-20 pb-2xl md:pb-3xl grid gap-8 md:grid-cols-12 md:gap-10 md:items-start">
        <RevealOnScroll className="md:col-span-5">
          <Link
            href={section.cta.href}
            className="group inline-flex items-center gap-4 text-sm uppercase tracking-wider font-medium text-white"
          >
            <span className="h-[3px] w-10 bg-white transition-all duration-500 ease-expo group-hover:w-16" />
            {section.cta.label}
          </Link>
        </RevealOnScroll>

        <details
          id="fontes"
          className="md:col-span-6 md:col-start-7 font-tech text-[11px] md:text-xs tracking-wide leading-relaxed text-white-50"
        >
          <summary className="cursor-pointer lowercase hover:text-white-70">fontes dos números</summary>
          <ol className="mt-3 space-y-1 list-none">
            {sources.map((source, index) => (
              <li key={source.id}>
                {SUPERSCRIPT[index]}{" "}
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white-30 underline-offset-2 hover:text-white-70"
                  >
                    {source.name}
                  </a>
                ) : (
                  source.name
                )}
                {source.year ? ` (${source.year})` : ""}
                {source.note ? ` · ${source.note}` : ""}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </section>
  );
}

type Note = { n: number; glyph: string };

/** Marcador de fonte com rótulo para leitor de tela; aponta para a lista dobrada. */
function Sup({ note }: { note: Note | null }) {
  if (!note) return null;
  return (
    <sup className="ml-1 font-tech text-[10px] normal-case text-white-50">
      <a href="#fontes" aria-label={`fonte ${note.n}`} className="no-underline">
        {note.glyph}
      </a>
    </sup>
  );
}
