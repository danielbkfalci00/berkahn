"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ItensInclususSubsectionProps {
  itensInclusos: string[];
}

export function ItensInclususSubsection({ itensInclusos }: ItensInclususSubsectionProps) {
  return (
    <div className="bg-white py-lg">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#F4F2EC] rounded-2xl p-6 lg:p-8 border border-black/5"
        >
          {/* Header com ícone */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-black/20" />
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-black/60 font-semibold">
              INCLUI
            </span>
            <div className="w-8 h-px bg-black/20" />
          </div>

          {/* Grid de itens */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {itensInclusos.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-100"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm text-black/80">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
