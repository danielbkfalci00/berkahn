"use client";

import { motion } from "framer-motion";

interface ItensInclususSubsectionProps {
  itensInclusos: string[];
}

export function ItensInclususSubsection({ itensInclusos }: ItensInclususSubsectionProps) {
  return (
    <div className="relative bg-black py-lg">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-black rounded-2xl p-8 lg:p-10 border border-white/10"
        >
          {/* Header técnico */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-white/20" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-white/60 font-mono">
                4.1 — ESCOPO INCLUÍDO
              </span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Blueprint bracket (canto superior direito) */}
            <svg
              className="w-8 h-8 text-white/30"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M24,0 L32,0 L32,8" />
            </svg>
          </div>

          {/* Lista compacta com bullets minimalistas */}
          <ul className="space-y-2">
            {itensInclusos.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                {/* Numeração técnica */}
                <span className="font-mono text-[10px] text-white/40 mt-1 w-6 flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Bullet minimalista */}
                <span className="text-white/40 text-lg font-light leading-none mt-0.5 flex-shrink-0">
                  +
                </span>

                {/* Item text */}
                <span className="text-sm text-white/90 leading-relaxed flex-1">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Blueprint bracket (canto inferior esquerdo) */}
          <svg
            className="absolute bottom-8 left-8 w-8 h-8 text-white/20"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M0,24 L0,32 L8,32" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
