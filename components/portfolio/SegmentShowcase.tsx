"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SEGMENTS } from "@/types/project";
import { SegmentCard } from "./SegmentCard";

interface SegmentShowcaseProps {
  onSegmentClick: (segmentId: string) => void;
}

export function SegmentShowcase({ onSegmentClick }: SegmentShowcaseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="py-xl bg-white">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-lg"
        >
          <span className="label-text text-black-50 mb-4 block">
            Nossos Segmentos
          </span>
          <h2 className="headline-md text-black max-w-3xl mx-auto">
            Versatilidade que transforma
          </h2>
          <p className="body-md text-black-70 mt-4 max-w-2xl mx-auto">
            Do projeto residencial ao galpão industrial, entregamos soluções
            completas em Steel Frame para todos os segmentos.
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {SEGMENTS.map((segment, index) => (
            <SegmentCard
              key={segment.id}
              segment={segment}
              index={index}
              onClick={onSegmentClick}
            />
          ))}
        </div>

        {/* Bottom Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="mt-lg flex flex-wrap justify-center gap-8 md:gap-16"
        >
          <div className="text-center">
            <span className="block text-3xl md:text-4xl font-heading font-bold text-black">
              155+
            </span>
            <span className="text-black-50 text-sm uppercase tracking-wider">
              Projetos Totais
            </span>
          </div>
          <div className="text-center">
            <span className="block text-3xl md:text-4xl font-heading font-bold text-black">
              25
            </span>
            <span className="text-black-50 text-sm uppercase tracking-wider">
              Anos de Mercado
            </span>
          </div>
          <div className="text-center">
            <span className="block text-3xl md:text-4xl font-heading font-bold text-black">
              50mil
            </span>
            <span className="text-black-50 text-sm uppercase tracking-wider">
              m² Construídos
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
