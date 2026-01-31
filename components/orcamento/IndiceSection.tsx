"use client";

import { motion } from "framer-motion";
import { OrcamentoWatermark } from "./OrcamentoWatermark";

const INDICE_ITEMS = [
  { numero: "01", titulo: "Apresentação construtora", href: "#sobre" },
  { numero: "02", titulo: "Premissas adotadas para o orçamento", href: "#premissas" },
  { numero: "03", titulo: "Descrição analítica dos Materiais", href: "#materiais" },
  { numero: "04", titulo: "Planilha Orçamentária", href: "#investimento" },
  { numero: "05", titulo: "Plano de Gerenciamento Berkahn", href: "#plano" },
  { numero: "06", titulo: "Pagamento", href: "#pagamento" },
];

export function IndiceSection() {
  return (
    <section className="relative py-20 lg:py-32 bg-[#F4F2EC]">
      <OrcamentoWatermark variant="light" logoPosition="top-right" />
      <div className="container max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm uppercase tracking-[0.3em] text-black/40 mb-2">
            Sumário
          </span>
          <h2 className="font-heading text-4xl lg:text-6xl font-bold tracking-tight text-black">
            ÍNDICE
          </h2>
        </motion.div>

        {/* Items */}
        <div className="space-y-0">
          {INDICE_ITEMS.map((item, index) => (
            <motion.a
              key={item.numero}
              href={item.href}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group flex items-center gap-4 py-5 lg:py-6 border-b border-black/10 hover:bg-black/[0.02] transition-colors cursor-pointer"
            >
              {/* Número */}
              <span className="font-mono text-2xl lg:text-3xl font-bold text-black w-12 lg:w-16 shrink-0">
                {item.numero}
              </span>

              {/* Linha conectora */}
              <div className="flex-1 h-px bg-black/20 group-hover:bg-black/40 transition-colors" />

              {/* Título */}
              <span className="text-base lg:text-lg text-black/70 group-hover:text-black transition-colors text-right">
                {item.titulo}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Footer decorativo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-4 mt-16"
        >
          <div className="w-8 h-px bg-black/20" />
          <div className="w-1.5 h-1.5 rotate-45 bg-black/20" />
          <div className="w-8 h-px bg-black/20" />
        </motion.div>
      </div>
    </section>
  );
}
