"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

interface CaseStudyCardProps {
  title: string;
  image: string;
  alt: string;
  description: string;
  delay?: number;
}

export function CaseStudyCard({
  title,
  image,
  alt,
  description,
  delay = 0,
}: CaseStudyCardProps) {
  return (
    <RevealOnScroll delay={delay}>
      <motion.div
        whileHover={{ translateY: -8 }}
        transition={{ duration: 0.3 }}
        className="h-full rounded-lg overflow-hidden border border-black-10 bg-white shadow-sm hover:shadow-lg transition-shadow"
      >
        {/* Image Container */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-black-5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>

          {/* Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">
            <p className="text-xs font-semibold text-black uppercase tracking-wider">
              Case Study
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6">
          {/* Title */}
          <h3 className="headline-md mb-3 line-clamp-2 text-black">
            {title}
          </h3>

          {/* Description */}
          <p className="body-sm text-black-70 mb-6 line-clamp-3">
            {description}
          </p>

          {/* Stats Row (if applicable) */}
          <div className="mb-6 pb-6 border-b border-black-10">
            <p className="label-text text-black-50 mb-3">Destaques</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black-5 rounded-lg p-3">
                <p className="text-xs text-black-50 mb-1">Tempo Total</p>
                <p className="font-semibold text-black">100 dias</p>
              </div>
              <div className="bg-black-5 rounded-lg p-3">
                <p className="text-xs text-black-50 mb-1">Área</p>
                <p className="font-semibold text-black">3.300 m²</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ gap: "12px" }}
            className="inline-flex items-center gap-2 text-black font-medium hover:text-black-80 transition-colors group"
          >
            <span>Ver detalhes</span>
            <motion.svg
              className="w-4 h-4 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ translateX: 4 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </motion.svg>
          </motion.button>
        </div>
      </motion.div>
    </RevealOnScroll>
  );
}
