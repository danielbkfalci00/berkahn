"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { ProcessStep } from "@/lib/types";

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto">
      {/* Vertical Line (Background) */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-black-10 -translate-x-1/2" />

      {/* Vertical Line (Progress) */}
      <motion.div
        className="absolute left-6 md:left-8 top-0 w-[2px] bg-black -translate-x-1/2 origin-top"
        style={{ height: lineHeight }}
      />

      {/* Steps */}
      <div className="space-y-12 md:space-y-16">
        {steps.map((step, index) => (
          <TimelineStep key={step.step} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}

/* ─── Individual Step with Active State Detection ─── */

function TimelineStep({ step, index }: { step: ProcessStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  return (
    <RevealOnScroll delay={index * 0.1}>
      <div ref={ref} className="relative pl-16 md:pl-24">
        {/* Step Circle */}
        <div
          className={cn(
            "absolute left-6 md:left-8 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-luxury-lg transition-colors duration-500",
            isInView ? "bg-black" : "bg-black-30"
          )}
        >
          <span className="text-white font-heading text-lg md:text-xl font-bold">
            {step.step}
          </span>
        </div>

        {/* Content */}
        <div>
          <span
            className={cn(
              "label-text mb-2 block transition-colors duration-500",
              isInView ? "text-black-50" : "text-black-30"
            )}
          >
            Etapa {step.step}
          </span>
          <h3
            className={cn(
              "font-heading text-xl md:text-2xl mb-3 tracking-tight transition-all duration-500",
              isInView ? "font-bold text-black" : "font-semibold text-black-50"
            )}
          >
            {step.title}
          </h3>
          <p
            className={cn(
              "body-md leading-relaxed transition-colors duration-500",
              isInView ? "text-black-70" : "text-black-50"
            )}
          >
            {step.description}
          </p>

          {step.image && (
            <div
              className={cn(
                "relative aspect-[16/10] overflow-hidden rounded-lg mt-4 transition-opacity duration-500",
                isInView ? "opacity-100" : "opacity-50"
              )}
            >
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}
