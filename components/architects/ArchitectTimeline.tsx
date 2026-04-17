"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { Architect } from "@/lib/architects-data";

interface Props {
  architect: Architect;
}

export function ArchitectTimeline({ architect }: Props) {
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <section className="relative w-full bg-white py-24 lg:py-36 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="mb-16 lg:mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-3">
            Linha do tempo
          </p>
          <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black">
            Marcos do escritório
          </h3>
        </motion.div>

        <div ref={lineRef} className="relative">
          {/* Vertical line — draws from top to bottom on viewport enter */}
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={lineInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.6, ease: [0.19, 1, 0.22, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute left-[7px] lg:left-1/2 top-3 bottom-3 w-px bg-gradient-to-b from-black-10 via-black-30 to-black-10 lg:-translate-x-1/2"
          />

          <div className="space-y-12 lg:space-y-20">
            {architect.history.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.08,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="relative grid lg:grid-cols-2 gap-x-16 items-center"
                >
                  {/* Dot — pops in after line draw + item reveal */}
                  <motion.div
                    aria-hidden
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + i * 0.08,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="absolute left-0 lg:left-1/2 top-3 lg:top-1/2 w-4 h-4 bg-white border-[3px] border-black rounded-full lg:-translate-x-1/2 lg:-translate-y-1/2 z-10"
                  />

                  {/* Year */}
                  <div
                    className={`pl-8 lg:pl-0 ${
                      isLeft
                        ? "lg:text-right lg:pr-12"
                        : "lg:order-2 lg:pl-12"
                    }`}
                  >
                    <p className="font-heading text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight text-black tabular-nums">
                      {item.year}
                    </p>
                  </div>

                  {/* Milestone */}
                  <div
                    className={`pl-8 lg:pl-0 mt-2 lg:mt-0 ${
                      isLeft ? "" : "lg:order-1 lg:text-right lg:pr-12"
                    }`}
                  >
                    <p className="text-base md:text-lg text-black-70 font-light leading-relaxed">
                      {item.milestone}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
