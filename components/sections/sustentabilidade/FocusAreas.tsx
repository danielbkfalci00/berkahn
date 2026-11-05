"use client";

import Image from "next/image";
import { useState } from "react";
import { FOCUS_SECTION } from "@/lib/sustentabilidade-data";

/**
 * Três frentes do plano climático. Cada cartão é um botão: escolher um abre o
 * detalhe logo abaixo (foto à esquerda, texto à direita no desktop). Começa com
 * a primeira aberta, então o conteúdo existe mesmo antes de qualquer clique.
 */
export function FocusAreas() {
  const [activeId, setActiveId] = useState<string>(FOCUS_SECTION.areas[0].id);
  const active = FOCUS_SECTION.areas.find((area) => area.id === activeId) ?? FOCUS_SECTION.areas[0];

  return (
    <section
      id="frentes"
      className="bg-off-white py-xl text-black md:py-3xl"
      aria-labelledby="frentes-title"
    >
      <div className="container">
        <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
          <h2
            id="frentes-title"
            className="max-w-5xl font-display text-[clamp(2.7rem,1.3rem+4.4vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] lg:col-span-8"
          >
            {FOCUS_SECTION.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-black-70 lg:col-span-4 lg:self-end lg:text-lg">
            {FOCUS_SECTION.lede}
          </p>
        </div>

        <div role="tablist" aria-label="Frentes de atuação" className="mt-14 grid gap-3 md:mt-20 md:grid-cols-3 md:gap-4">
          {FOCUS_SECTION.areas.map((area) => {
            const isActive = area.id === activeId;
            return (
              <button
                key={area.id}
                type="button"
                role="tab"
                id={`frente-tab-${area.id}`}
                aria-selected={isActive}
                aria-controls="frente-panel"
                onClick={() => setActiveId(area.id)}
                className={`group relative flex min-h-[8.5rem] flex-col justify-between overflow-hidden p-5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:min-h-[15rem] md:p-6 ${
                  isActive ? "bg-black text-white" : "bg-white text-black hover:bg-black/[0.04]"
                }`}
              >
                <span className={`text-xs font-medium tracking-[0.18em] ${isActive ? "text-white-50" : "text-black-50"}`}>
                  {area.label}
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold leading-tight tracking-[-0.025em] md:text-2xl">
                    {area.title}
                  </span>
                  <span className={`mt-2 block text-sm leading-relaxed ${isActive ? "text-white-70" : "text-black-70"}`}>
                    {area.summary}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          id="frente-panel"
          role="tabpanel"
          aria-labelledby={`frente-tab-${active.id}`}
          className="mt-3 grid gap-0 bg-white md:mt-4 md:grid-cols-2"
        >
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[26rem]">
            <Image
              key={active.id}
              src={active.image.src}
              alt={active.image.alt}
              fill
              quality={80}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`object-cover saturate-[.9] contrast-[.98] ${active.image.focus ?? ""}`}
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 md:p-10 lg:p-14">
            <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-3xl">
              {active.title}
            </h3>
            {active.detail.map((paragraph) => (
              <p key={paragraph} className="max-w-xl text-base leading-relaxed text-black-70">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
