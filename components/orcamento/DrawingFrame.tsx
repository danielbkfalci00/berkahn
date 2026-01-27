"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface DrawingFrameProps {
  src: string;
  label: string;
  alt?: string;
  onOpen?: () => void;
}

/**
 * Componente reutilizável para exibir desenhos técnicos (plantas e elevações)
 * Apresentação: Galeria maximalista sem bordas sobre fundo escuro
 * Interação: Scale hover + Click para expandir em lightbox
 */
export function DrawingFrame({ src, label, alt = label, onOpen }: DrawingFrameProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="cursor-pointer group"
      onClick={onOpen}
    >
      {/* Image container - no borders, maximalist */}
      <div className="relative aspect-[5/7] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={90}
        />

        {/* Subtle glow overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-white/5 via-transparent to-transparent" />
      </div>

      {/* Label - refined typography */}
      <p className="mt-4 text-center font-mono text-[11px] tracking-[0.2em] uppercase text-white/80 group-hover:text-white transition-colors duration-300">
        {label}
      </p>
    </motion.div>
  );
}
