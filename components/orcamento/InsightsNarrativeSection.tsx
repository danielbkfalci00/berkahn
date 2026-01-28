"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import type { CompanyStory, Insight } from "@/types/orcamento";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StatsWithContext } from "./StatsWithContext";
import { cn } from "@/lib/utils";

interface InsightsNarrativeSectionProps {
  story: CompanyStory;
}

/**
 * Seção 2: Insights Narrativos - O que aprendemos em 20 anos
 * Layout magazine asymétrico com proof cards
 * Substitui AboutBigNumbers.tsx
 */
export function InsightsNarrativeSection({
  story,
}: InsightsNarrativeSectionProps) {
  return (
    <section className="relative py-24 lg:py-32 bg-[#E8E2D5]">
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl lg:text-5xl text-[#2D2D2D] mb-4">
              O Que Acreditamos
            </h2>
            <p className="text-lg text-[#2D2D2D]/70 max-w-2xl mx-auto">
              Três lições que transformam sonhos em realidade
            </p>
          </div>
        </RevealOnScroll>

        {/* Insights Cards - Asymmetric Magazine Layout */}
        <div className="space-y-24">
          {story.insights.map((insight, index) => (
            <InsightCard
              key={insight.title}
              insight={insight}
              index={index}
              isReverse={index % 2 !== 0}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="my-32 relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2D2D2D]/20 to-transparent" />
        </div>

        {/* Stats With Context */}
        <StatsWithContext stats={story.statsWithContext} />
      </div>
    </section>
  );
}

// Insight Card Component
function InsightCard({
  insight,
  index,
  isReverse,
}: {
  insight: Insight;
  index: number;
  isReverse: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "grid lg:grid-cols-2 gap-12 items-center",
        isReverse && "lg:grid-flow-dense"
      )}
    >
      {/* Text Content */}
      <div className={cn("space-y-6", isReverse && "lg:col-start-2")}>
        <div className="inline-block">
          <span className="font-handwritten text-2xl text-[#2D2D2D]">
            Lição #{index + 1}
          </span>
        </div>

        <h3 className="font-serif text-3xl lg:text-4xl text-[#2D2D2D]">
          {insight.subtitle}
        </h3>

        <p className="text-lg leading-relaxed text-[#2D2D2D]/80">
          {insight.description}
        </p>

        {/* Proof Card - Project type */}
        {insight.proof.type === "project" && (
          <div className="mt-6 p-6 bg-white/60 backdrop-blur rounded-lg border-l-4 border-black/30">
            <p className="text-sm font-semibold text-[#2D2D2D]/60 mb-2">
              Exemplo Real
            </p>
            <p className="text-xl font-serif text-[#2D2D2D] mb-1">
              {insight.proof.name}
            </p>
            <p className="text-[#2D2D2D] font-medium">
              "{insight.proof.quote}"
            </p>
          </div>
        )}

        {/* Proof Card - Testimonial type */}
        {insight.proof.type === "testimonial" && (
          <div className="mt-6 p-6 bg-white/60 backdrop-blur rounded-lg">
            <p className="text-lg italic text-[#2D2D2D]/80 mb-4">
              "{insight.proof.quote}"
            </p>
            <p className="text-sm font-medium text-[#2D2D2D]">
              — {insight.proof.name}
            </p>
          </div>
        )}

        {/* Proof Card - Metric type */}
        {insight.proof.type === "metric" && (
          <div className="mt-6 flex items-center gap-4">
            <div className="text-5xl font-bold text-[#2D2D2D]">
              {insight.proof.value}
            </div>
            <p className="text-[#2D2D2D]/70">{insight.proof.label}</p>
          </div>
        )}
      </div>

      {/* Image */}
      <div className={cn(isReverse && "lg:col-start-1")}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl"
        >
          {insight.proof.image && (
            <Image
              src={insight.proof.image}
              alt={insight.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}

          {/* Handwritten annotation overlay */}
          <div className="absolute bottom-4 left-4 font-handwritten text-white text-xl bg-[#2D2D2D]/70 px-4 py-2 rounded">
            {insight.title}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
