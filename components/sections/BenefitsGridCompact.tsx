"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { BENEFITS, Benefit } from "@/lib/lsf-data";

// Selecionar os 4 principais benefícios
const MAIN_BENEFITS = BENEFITS.slice(0, 4);

// SVG Icons (minimal, luxury style)
const icons: Record<string, React.ReactNode> = {
  speed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  ),
  sustainability: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  ),
  energy: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  ),
  acoustic: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  ),
};

export function BenefitsGridCompact() {
  const [active, setActive] = useState<Benefit | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <section className="py-xl bg-black-5">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text text-black-50 text-center mb-4">
            POR QUE LIGHT STEEL FRAME?
          </p>
          <h2 className="headline-md text-center mb-12">
            Vantagens do Sistema
          </h2>
        </RevealOnScroll>

        {/* Overlay quando card está expandido */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 h-full w-full z-10"
            />
          )}
        </AnimatePresence>

        {/* Card Expandido */}
        <AnimatePresence>
          {active && (
            <div className="fixed inset-0 grid place-items-center z-[100] p-4">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-luxury-xl"
              >
                {/* Header com ícone e número */}
                <div className="bg-black p-8 text-white text-center">
                  <div className="flex justify-center mb-4 text-white">
                    {icons[active.icon]}
                  </div>
                  <span className="text-5xl md:text-6xl font-heading font-light">
                    {active.stat}{active.suffix}
                  </span>
                  <h3 className="text-xl font-medium mt-2">
                    {active.title}
                  </h3>
                </div>

                {/* Conteúdo */}
                <div className="p-6 md:p-8">
                  <p className="text-lg font-medium text-black mb-4">
                    {active.description}
                  </p>

                  <div className="text-black-70 leading-relaxed">
                    <p>{active.details}</p>
                  </div>

                  {/* Botão fechar */}
                  <button
                    onClick={() => setActive(null)}
                    className="mt-6 w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-black-90 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Grid de Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {MAIN_BENEFITS.map((benefit, index) => (
            <RevealOnScroll key={benefit.title} delay={index * 0.1}>
              <div
                onClick={() => setActive(benefit)}
                className="bg-white p-6 md:p-8 rounded-xl shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-300 text-center cursor-pointer group"
              >
                {/* Icon */}
                <div className="flex justify-center text-black group-hover:scale-110 transition-transform duration-300 mb-4">
                  {icons[benefit.icon]}
                </div>

                {/* Stat */}
                <div className="mb-2">
                  <CountUp
                    end={benefit.stat}
                    suffix={benefit.suffix}
                    className="text-3xl md:text-4xl font-heading font-light"
                  />
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-base font-medium text-black">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-black-50 mt-2 line-clamp-1">
                  {benefit.description}
                </p>

                {/* Hint */}
                <p className="text-xs text-black-30 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Clique para detalhes
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
