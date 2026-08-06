"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import type { CompanyStory } from "@/types/orcamento";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { TimelineInteractive } from "./TimelineInteractive";

interface CompanyStorySectionProps {
  story: CompanyStory;
}

/**
 * Seção 1: História da Empresa - Storytelling Humanizado
 * Conceito: "Editorial Humanizado" - Kinfolk meets architectural portfolio
 * Estética: Polaroid photo + handwritten annotations + conversational copy
 */
export function CompanyStorySection({ story }: CompanyStorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 lg:py-32 bg-[#F4F2EC] overflow-hidden"
    >
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, #2D2D2D 0px, #2D2D2D 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(90deg, #2D2D2D 0px, #2D2D2D 1px, transparent 1px, transparent 60px)
          `,
        }}
      />

      <div className="container max-w-6xl relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Founder Story Hero */}
        <RevealOnScroll>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            {/* Left: Polaroid Photo */}
            <motion.div style={{ y }} className="relative">
              <div className="relative aspect-[4/5] bg-white p-4 shadow-xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="relative w-full h-full bg-[#F4F2EC]">
                  <Image
                    src={story.founding.firstProject.image}
                    alt={story.founding.firstProject.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Handwritten caption */}
                <p className="mt-4 font-handwritten text-xl text-[#2D2D2D] text-center">
                  {story.founding.firstProject.name}, {story.founding.year}
                </p>
              </div>

              {/* Handwritten annotation arrow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="absolute -right-4 lg:-right-8 top-1/2 font-handwritten text-lg text-[#2D2D2D] hidden md:block"
              >
                <span className="relative">
                  Onde tudo começou
                  <svg
                    className="absolute -right-12 top-0 w-16 h-16"
                    viewBox="0 0 64 64"
                  >
                    <path
                      d="M10 20 Q 30 10, 50 30 L 45 28 M 50 30 L 48 35"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Narrative Text */}
            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-4xl lg:text-5xl leading-tight text-[#2D2D2D]"
              >
                Nascemos para fazer diferente
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-4 text-lg leading-relaxed text-[#2D2D2D]/80"
              >
                <p>
                  A Berkahn é nova, mas quem está por trás não é.{" "}
                  <em className="font-serif italic">
                    “São 20 anos observando o que funciona — e o que não funciona — na construção civil.”
                  </em>
                </p>

                <p>
                  Vimos famílias perderem tempo e dinheiro com métodos
                  tradicionais imprevisíveis. Vimos projetos atrasarem,
                  orçamentos estourarem, e sonhos virarem dores de cabeça.
                </p>

                <div className="pt-4 pl-6 border-l-4 border-black/20">
                  <p className="text-2xl font-serif text-[#2D2D2D]">
                    Seu projeto é onde nossa história começa.
                  </p>
                  <p className="mt-2 text-base text-[#2D2D2D]/70">
                    E queremos que comece diferente.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Interactive Timeline */}
        <TimelineInteractive timeline={story.timeline} />
      </div>
    </section>
  );
}
