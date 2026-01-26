"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface DrawingFrameProps {
  src: string;
  label: string;
  alt?: string;
  onOpen?: () => void;
}

/**
 * Componente reutilizável para exibir desenhos técnicos (plantas e elevações)
 * Apresentação: Frame branco com border sobre fundo escuro
 * Interação: Hover fade + Click para expandir em lightbox
 */
export function DrawingFrame({ src, label, alt = label, onOpen }: DrawingFrameProps) {
  const [isHovered, setIsHovered] = useState(false);

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
      className="cursor-pointer group"
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Frame with border */}
      <div
        className={`relative aspect-[5/7] border-2 border-white p-3 transition-all duration-700 ${
          isHovered ? "border-white-70" : "border-white"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={90}
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.05 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white pointer-events-none"
        />
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0.7 }}
        animate={{ opacity: isHovered ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-center font-mono text-xs tracking-wider uppercase text-white"
      >
        {label}
      </motion.p>
    </motion.div>
  );
}
