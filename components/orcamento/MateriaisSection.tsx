"use client";

import { motion } from "framer-motion";
import { MATERIAIS_DETALHADOS } from "@/lib/orcamento-data";
import { OrcamentoWatermark } from "./OrcamentoWatermark";
import { SectionLabel } from "./SectionLabel";

/**
 * MateriaisSection - Descrição Analítica de Materiais
 * Versão web com estrutura hierárquica (categorias + subitens)
 * Design profissional com tabela detalhada
 */
export function MateriaisSection() {
  return (
    <section className="relative py-xl bg-[#F4F2EC]">
      <OrcamentoWatermark variant="light" logoPosition="top-right" />
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <SectionLabel number="03" title="Descrição Analítica dos Materiais" variant="light" />
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
          className="bg-white rounded-xl shadow-luxury-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-4 text-left w-20 font-semibold tracking-wide">
                    ITEM
                  </th>
                  <th className="px-4 py-4 text-left font-semibold tracking-wide">
                    DESCRIÇÃO
                  </th>
                  <th className="px-4 py-4 text-center w-24 font-semibold tracking-wide">
                    UNID.
                  </th>
                  <th className="px-4 py-4 text-right w-28 font-semibold tracking-wide">
                    QNTD.
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATERIAIS_DETALHADOS.map((material, index) => (
                  <motion.tr
                    key={material.item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * index }}
                    className={`
                      border-b border-black/5 transition-colors
                      ${material.isCategoria
                        ? "bg-black/[0.03]"
                        : index % 2 === 0
                          ? "bg-white hover:bg-black/[0.02]"
                          : "bg-black/[0.01] hover:bg-black/[0.03]"
                      }
                    `}
                  >
                    {/* Coluna ITEM */}
                    <td className={`px-4 py-4 ${material.isCategoria ? "font-bold" : ""}`}>
                      {material.isCategoria ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
                          {material.item.replace(".", "")}
                        </span>
                      ) : (
                        <span className="text-black/60 pl-2 font-mono text-xs">
                          {material.item}
                        </span>
                      )}
                    </td>

                    {/* Coluna DESCRIÇÃO */}
                    <td className={`px-4 py-4 ${
                      material.isCategoria
                        ? "font-bold text-black"
                        : "text-black/80 pl-6"
                    }`}>
                      {material.descricao}
                    </td>

                    {/* Coluna UNIDADE */}
                    <td className="px-4 py-4 text-center text-black/50 font-mono text-xs">
                      {material.unidade || "—"}
                    </td>

                    {/* Coluna QUANTIDADE */}
                    <td className={`px-4 py-4 text-right font-mono text-sm ${
                      material.quantidade === "Incluso"
                        ? "text-emerald-600 font-medium"
                        : "text-black/70"
                    }`}>
                      {material.quantidade || "—"}
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
            className="px-6 py-4 border-t border-black/10 bg-black/[0.02]"
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
