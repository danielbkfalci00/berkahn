"use client";

import { motion } from "framer-motion";
import { AlertTriangle, XCircle } from "lucide-react";

interface NaoIncluiSubsectionProps {
  itensExclusos: string[];
  isPDFMode?: boolean;
}

export function NaoIncluiSubsection({ itensExclusos, isPDFMode = false }: NaoIncluiSubsectionProps) {
  return (
    <div className={`relative bg-black ${isPDFMode ? "py-2" : "py-md"}`}>
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative rounded-2xl ${isPDFMode ? "p-3" : "p-6 lg:p-8"} border-l-4 border-l-amber-500 border border-white/10 bg-white/[0.03]`}
        >
          {/* Header com ícone de alerta */}
          <div className={`flex items-center gap-3 ${isPDFMode ? "mb-3" : "mb-6"}`}>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Não Inclui
              </h3>
              <p className="text-xs text-white/40">
                Itens listados abaixo não fazem parte deste orçamento
              </p>
            </div>
          </div>

          {/* Linha separadora */}
          <div className={`h-px bg-white/10 ${isPDFMode ? "mb-3" : "mb-6"}`} />

          {/* Lista com ícones XCircle */}
          <ul className={isPDFMode ? "space-y-1.5" : "space-y-3"}>
            {itensExclusos.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                <XCircle className="w-4 h-4 text-amber-500/60 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/80 leading-relaxed flex-1">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Blueprint bracket (canto inferior direito) */}
          <svg
            className="absolute bottom-6 right-6 w-6 h-6 text-amber-500/15"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M24,32 L32,32 L32,24" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
