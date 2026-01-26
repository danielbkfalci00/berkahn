"use client";

import { motion } from "framer-motion";

interface SectionMarkerProps {
  number: string | number;
  className?: string;
}

/**
 * Componente reutilizável para marcadores de seção
 * Uso: SectionMarker number="01" ou number={1}
 * Estilo: Círculo com número branco sobre fundo preto
 */
export function SectionMarker({ number: num, className = "" }: SectionMarkerProps) {
  const numberStr = typeof num === "string" ? num : String(num).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-current bg-black text-white font-mono text-xs font-bold tracking-widest ${className}`}
    >
      {numberStr}
    </motion.div>
  );
}
