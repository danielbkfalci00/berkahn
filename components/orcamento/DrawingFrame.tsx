"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface DrawingFrameProps {
  src: string;
  label: string;
  alt?: string;
  onOpen?: () => void;
}

/**
 * Componente reutilizável para exibir desenhos técnicos (plantas e elevações)
 *
 * Mudanças v2:
 * - Removido aspect-[5/7] fixo - imagem usa seu aspect ratio natural
 * - Click target é apenas a imagem (não o container todo)
 * - Hover effect apenas na imagem, sem frame extra
 * - Reduzido spacing do label
 */
export function DrawingFrame({ src, label, alt = label, onOpen }: DrawingFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="group"
    >
      {/* Image container - click target é apenas a imagem */}
      <button
        onClick={onOpen}
        className="relative block w-full overflow-hidden rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
        aria-label={`Ver ${label} em tela cheia`}
      >
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          quality={90}
          className="w-full h-auto object-contain
                     transition-transform duration-500 ease-out
                     group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </button>

      {/* Label - refined typography, reduced spacing */}
      <p className="mt-3 text-center font-mono text-[11px] tracking-[0.2em] uppercase
                   text-white/70 group-hover:text-white transition-colors duration-300">
        {label}
      </p>
    </motion.div>
  );
}
