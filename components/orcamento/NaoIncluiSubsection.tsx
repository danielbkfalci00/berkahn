"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

interface NaoIncluiSubsectionProps {
  itensExclusos: string[];
}

export function NaoIncluiSubsection({ itensExclusos }: NaoIncluiSubsectionProps) {
  return (
    <div className="bg-[#F4F2EC] py-lg">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 lg:p-8 border border-black/5 shadow-luxury-sm"
        >
          {/* Header com ícone */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-black/20" />
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-black/50" />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-black/60 font-semibold">
              NÃO INCLUI
            </span>
            <div className="w-8 h-px bg-black/20" />
          </div>

          {/* Grid de itens */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {itensExclusos.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="flex items-start gap-3 p-3 bg-black/[0.02] rounded-lg border border-black/5"
              >
                <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3 h-3 text-black/40" />
                </div>
                <span className="text-sm text-black/60">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
