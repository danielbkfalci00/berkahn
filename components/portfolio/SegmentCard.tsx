"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ProjectSegmentInfo } from "@/types/project";

interface SegmentCardProps {
  segment: ProjectSegmentInfo;
  index: number;
  onClick: (segmentId: string) => void;
}

export function SegmentCard({ segment, index, onClick }: SegmentCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1],
      }}
      onClick={() => onClick(segment.id)}
      className="group relative aspect-[4/3] overflow-hidden bg-black-5 cursor-pointer text-left"
    >
      {/* Background Image */}
      <Image
        src={segment.image}
        alt={segment.name}
        fill
        className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Overlay - Darkens on hover */}
      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/60" />

      {/* Border that appears on hover */}
      <div className="absolute inset-4 border border-white/0 transition-all duration-500 group-hover:border-white/20" />

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        {/* Project Count */}
        <motion.span
          className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2 transition-transform duration-500 group-hover:-translate-y-2"
        >
          {segment.projectCount}+ Projetos
        </motion.span>

        {/* Segment Name */}
        <h3 className="text-white font-heading font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight transition-transform duration-500 group-hover:-translate-y-2">
          {segment.name}
        </h3>

        {/* Description - Appears on hover */}
        <p className="text-white/70 text-sm md:text-base mt-2 max-w-xs opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {segment.description}
        </p>

        {/* Arrow Icon */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
          <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:border-white">
            <svg
              className="w-4 h-4 text-white transition-colors duration-500 group-hover:text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
