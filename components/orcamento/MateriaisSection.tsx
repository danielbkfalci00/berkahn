"use client";

import { motion } from "framer-motion";
import { MATERIAIS_ANALITICOS } from "@/lib/orcamento-data";

/**
 * MateriaisSection - Descrição Analítica de Materiais
 * Versão web com animações Framer Motion
 */
export function MateriaisSection() {
  return (
    <section className="py-xl bg-[#F4F2EC]">
      <div className="container max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-black/50 font-mono mb-2">
            Especificações
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-black mb-3">
            DESCRIÇÃO ANALÍTICA DE MATERIAIS
          </h2>
          <p className="text-sm text-black/60 max-w-2xl">
            Especificações técnicas dos materiais que serão utilizados na construção.
          </p>
        </motion.div>

        {/* Tabela de Materiais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-luxury-sm"
        >
          <div className="overflow-hidden rounded-lg border border-black/10">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-3 text-left w-12 font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Componente</th>
                  <th className="px-4 py-3 text-left font-semibold">Especificação Técnica</th>
                </tr>
              </thead>
              <tbody>
                {MATERIAIS_ANALITICOS.map((material, index) => (
                  <motion.tr
                    key={material.letra}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className={index % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}
                  >
                    <td className="px-4 py-4">
                      <span className="w-8 h-8 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center">
                        {material.letra}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-black">
                      {material.categoria}
                    </td>
                    <td className="px-4 py-4 text-black/70">
                      {material.especificacao}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notas */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 pt-4 border-t border-black/10"
          >
            <p className="text-xs text-black/50 italic">
              * Especificações sujeitas a alterações conforme projeto executivo final
            </p>
            <p className="text-xs text-black/40 mt-1">
              Todos os materiais seguem normas ABNT e possuem certificação de qualidade
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
