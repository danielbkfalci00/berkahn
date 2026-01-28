"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { TimelineMilestone } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface TimelineInteractiveProps {
  timeline: TimelineMilestone[];
}

/**
 * Timeline Interativo com visual de régua/measuring tape
 * Hover revela foto do milestone
 * Star marker para "Seu projeto começa aqui"
 */
export function TimelineInteractive({ timeline }: TimelineInteractiveProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative py-12">
      {/* Vintage measuring tape line */}
      <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-[#2D2D2D]/20 via-[#2D2D2D] to-[#2D2D2D]/20 hidden md:block" />

      {/* Mobile: Vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#2D2D2D]/20 via-[#2D2D2D] to-[#2D2D2D]/20 md:hidden" />

      {/* Measuring marks - Desktop */}
      <div className="hidden md:block">
        {timeline.map((_, index) => (
          <div
            key={index}
            className="absolute top-1/2 w-px h-6 bg-[#2D2D2D]/30 transform -translate-y-1/2"
            style={{ left: `${(index / (timeline.length - 1)) * 100}%` }}
          />
        ))}
      </div>

      {/* Timeline items - Desktop horizontal / Mobile vertical */}
      <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-0">
        {timeline.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "flex md:flex-col items-center md:items-center relative cursor-pointer group",
              "pl-16 md:pl-0", // Mobile padding for vertical line
              item.isHighlight && "z-10"
            )}
          >
            {/* Year badge */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm mb-0 md:mb-4 mr-4 md:mr-0 transition-all duration-300 flex-shrink-0",
                "absolute left-0 md:static",
                item.isHighlight
                  ? "bg-[#2D2D2D] text-white shadow-lg"
                  : "bg-white text-[#2D2D2D] border-2 border-[#2D2D2D]/20 group-hover:border-[#2D2D2D] group-hover:shadow-md"
              )}
            >
              {item.year}
            </motion.div>

            {/* Milestone text */}
            <p
              className={cn(
                "text-left md:text-center text-sm md:max-w-[120px] transition-colors duration-300",
                item.isHighlight
                  ? "font-semibold text-[#2D2D2D]"
                  : "text-[#2D2D2D]/70 group-hover:text-[#2D2D2D]"
              )}
            >
              {item.milestone}
            </p>

            {/* Star marker for highlight */}
            {item.isHighlight && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -left-2 md:-top-8 md:left-1/2 md:-translate-x-1/2"
              >
                <svg
                  className="w-8 h-8 text-[#2D2D2D]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </motion.div>
            )}

            {/* Image preview on hover - Desktop only */}
            {item.image && hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute top-full mt-6 w-48 h-32 bg-white p-2 shadow-xl rounded-lg z-20 hidden md:block"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.milestone}
                    fill
                    className="object-cover rounded"
                    sizes="200px"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
