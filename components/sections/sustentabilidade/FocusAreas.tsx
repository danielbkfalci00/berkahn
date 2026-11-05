"use client";

import Image from "next/image";
import { useState } from "react";
import { FOCUS_SECTION } from "@/lib/sustentabilidade-data";

/**
 * Três frentes do plano climático, em um bloco que cabe numa tela.
 *
 * Desktop: lista de abas à esquerda e painel à direita (foto em cima, texto
 * embaixo), com altura limitada pela janela. Celular: abas curtas em linha e o
 * painel logo abaixo. Começa com a primeira aberta, então o conteúdo existe
 * mesmo antes de qualquer clique.
 */
export function FocusAreas() {
  const [activeId, setActiveId] = useState<string>(FOCUS_SECTION.areas[0].id);
  const active = FOCUS_SECTION.areas.find((area) => area.id === activeId) ?? FOCUS_SECTION.areas[0];

  return (
    <section
      id="frentes"
      className="bg-off-white py-xl text-black md:py-24"
      aria-labelledby="frentes-title"
    >
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <h2
            id="frentes-title"
            className="max-w-4xl font-display text-[clamp(2.3rem,1.2rem+3.6vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.045em] lg:col-span-8"
          >
            {FOCUS_SECTION.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-black-70 lg:col-span-4 lg:self-end">
            {FOCUS_SECTION.lede}
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:mt-12 lg:h-[clamp(30rem,68svh,40rem)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-4">
          <div
            role="tablist"
            aria-label="Frentes de atuação"
            aria-orientation="vertical"
            className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:grid-rows-3 lg:gap-3"
          >
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
                  className={`flex flex-col justify-between p-4 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:p-6 ${
                    isActive ? "bg-black text-white" : "bg-white text-black hover:bg-black/[0.04]"
                  }`}
                >
                  <span className={`text-xs font-medium tracking-[0.18em] ${isActive ? "text-white-50" : "text-black-50"}`}>
                    {area.label}
                  </span>
                  <span>
                    <span className="block font-display text-base font-semibold leading-tight tracking-[-0.02em] lg:hidden">
                      {area.short}
                    </span>
                    <span className="hidden font-display text-xl font-semibold leading-tight tracking-[-0.025em] lg:block xl:text-2xl">
                      {area.title}
                    </span>
                    <span
                      className={`mt-2 hidden text-sm leading-relaxed lg:block ${isActive ? "text-white-70" : "text-black-70"}`}
                    >
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
            className="grid min-h-0 grid-rows-[auto_1fr] bg-white lg:grid-rows-[minmax(0,1.15fr)_minmax(0,1fr)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto">
              <Image
                key={active.id}
                src={active.image.src}
                alt={active.image.alt}
                fill
                quality={90}
                sizes="(min-width: 1024px) 62vw, 100vw"
                className={`object-cover saturate-[.92] ${active.image.focus ?? ""}`}
              />
            </div>
            <div className="flex min-h-0 flex-col justify-center gap-3 p-5 md:p-7 lg:gap-3 lg:px-10 lg:py-6">
              <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.03em] md:text-2xl">
                {active.title}
              </h3>
              {active.detail.map((paragraph) => (
                <p key={paragraph} className="max-w-2xl text-[0.95rem] leading-relaxed text-black-70">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
