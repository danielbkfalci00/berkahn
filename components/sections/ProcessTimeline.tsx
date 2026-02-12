"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { ProcessStep } from "@/lib/types";

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-progress line — pattern from HowWeWorkTimeline.tsx:20-26
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto">
      {/* Vertical Line (Background) — pattern from HowWeWorkTimeline.tsx:47 */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-black-10 -translate-x-1/2" />

      {/* Vertical Line (Progress) — pattern from HowWeWorkTimeline.tsx:50-53 */}
      <motion.div
        className="absolute left-6 md:left-8 top-0 w-[2px] bg-black -translate-x-1/2 origin-top"
        style={{ height: lineHeight }}
      />

      {/* Steps */}
      <div className="space-y-12 md:space-y-16">
        {steps.map((step, index) => (
          <RevealOnScroll key={step.step} delay={index * 0.1}>
            <div className="relative pl-16 md:pl-24">
              {/* Step Circle — pattern from HowWeWorkTimeline.tsx:68-72 */}
              <div className="absolute left-6 md:left-8 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black flex items-center justify-center z-10 border-4 border-white shadow-luxury-lg">
                <span className="text-white font-heading text-lg md:text-xl font-bold">
                  {step.step}
                </span>
              </div>

              {/* Content */}
              <div>
                <span className="label-text text-black-50 mb-2 block">
                  Etapa {step.step}
                </span>
                <h3 className="font-heading text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="body-md text-black-70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
