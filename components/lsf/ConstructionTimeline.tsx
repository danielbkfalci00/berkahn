"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CONSTRUCTION_TIMELINE } from "@/lib/lsf-data";

export function ConstructionTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for progress indicator
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Transform scroll progress to line height (0% to 100%)
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-xl bg-white">
      <div className="container">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="label-text mb-4">PROCESSO CONSTRUTIVO</p>
            <h2 className="headline-md mb-6">
              Do Projeto à Obra Finalizada
            </h2>
            <p className="body-lg text-black-70 max-w-3xl mx-auto">
              A construção em Light Steel Frame segue um processo industrializado
              e eficiente, com etapas bem definidas que garantem qualidade e
              agilidade.
            </p>
          </div>
        </RevealOnScroll>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line (Background) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-black-10 -translate-x-1/2" />

          {/* Vertical Line (Progress) */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-black -translate-x-1/2 origin-top"
            style={{ height: lineHeight }}
          />

          {/* Timeline Items */}
          <div className="space-y-16 md:space-y-24">
            {CONSTRUCTION_TIMELINE.map((phase, index) => {
              const isEven = index % 2 === 0;

              return (
                <RevealOnScroll key={phase.phase} delay={index * 0.15}>
                  <div
                    className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                      isEven ? "" : "md:grid-flow-dense"
                    }`}
                  >
                    {/* Phase Number Circle (Timeline Dot) */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-black flex items-center justify-center z-10 border-4 border-white shadow-luxury-lg">
                      <span className="text-white font-heading text-xl font-medium">
                        {phase.phase}
                      </span>
                    </div>

                    {/* Content (alternates left/right on desktop) */}
                    <div
                      className={`pl-20 md:pl-0 ${
                        isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:col-start-2"
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.6,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                      >
                        <div className="inline-block mb-3">
                          <span className="label-text bg-black-5 px-4 py-2 rounded-full">
                            FASE {phase.phase}
                          </span>
                        </div>

                        <h3 className="headline-sm mb-4">{phase.title}</h3>

                        <p className="body-md text-black-70 mb-4 leading-relaxed">
                          {phase.description}
                        </p>

                        {/* Duration */}
                        <div
                          className={`flex items-center gap-2 text-sm text-black-50 ${
                            isEven ? "md:justify-end" : ""
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Duração: {phase.duration}</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Image (alternates right/left on desktop) */}
                    <div
                      className={`pl-20 md:pl-0 ${
                        isEven ? "md:pl-16" : "md:pr-16 md:col-start-1 md:row-start-1"
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.6,
                          delay: 0.2,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                        className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-luxury-lg group"
                      >
                        <Image
                          src={phase.imageUrl}
                          alt={phase.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black-90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>

        {/* Summary Footer */}
        <RevealOnScroll delay={0.5}>
          <div className="mt-16 p-8 bg-black-5 rounded-lg text-center max-w-3xl mx-auto">
            <p className="body-md text-black-70 mb-4">
              <strong className="text-black">
                Tempo total médio de construção:
              </strong>{" "}
              3 a 6 meses, dependendo do porte da edificação.
            </p>
            <p className="text-sm text-black-50">
              50% mais rápido que construção tradicional em alvenaria
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
