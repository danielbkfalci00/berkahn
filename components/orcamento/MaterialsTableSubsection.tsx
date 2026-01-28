"use client";

import { motion } from "framer-motion";
import type { MaterialItemDetalhado } from "@/types/orcamento";

interface MaterialsTableSubsectionProps {
  data: MaterialItemDetalhado[];
  isNested?: boolean; // Quando true, renderiza dentro de ProjetosConsideradosSection
}

/**
 * Subsecção: Descrição Analítica de Materiais
 * Layout: Tabela hierárquica com categorias e subitens
 * Background: Off-White #F4F2EC
 * Apresentação: Estrutura numerada (1, 1.1, 2, 2.1, etc.) com quantidades
 */
export function MaterialsTableSubsection({ data, isNested }: MaterialsTableSubsectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
    },
  };

  return (
    <section className="relative py-xl bg-[#F4F2EC]">
      {/* Section marker line (architectural drawing style) */}
      <div className="absolute left-0 top-0 h-px w-full bg-black-10" />

      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header with section marker and breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-lg space-y-2"
        >
          {/* Breadcrumb contextual - only when nested */}
          {isNested && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/50 font-mono">
              Premissas Adotadas → Projetos Considerados → Descrição Analítica
            </p>
          )}

          {/* Título da subseção */}
          <h3 className="text-xl font-bold tracking-tight text-black uppercase">
            DESCRIÇÃO ANALÍTICA DE MATERIAIS
          </h3>
          <p className="text-sm text-black/60">
            Especificações técnicas dos materiais que serão utilizados na construção.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="overflow-hidden bg-white rounded-lg shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-3 text-left w-20 font-semibold tracking-wide text-xs">
                    ITEM
                  </th>
                  <th className="px-4 py-3 text-left font-semibold tracking-wide text-xs">
                    DESCRIÇÃO
                  </th>
                  <th className="px-4 py-3 text-center w-20 font-semibold tracking-wide text-xs">
                    UNID.
                  </th>
                  <th className="px-4 py-3 text-right w-24 font-semibold tracking-wide text-xs">
                    QNTD.
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <motion.tr
                    key={item.item}
                    variants={rowVariants}
                    className={`
                      border-b border-black/5 transition-colors
                      ${item.isCategoria
                        ? "bg-black/[0.03]"
                        : index % 2 === 0
                          ? "bg-white hover:bg-black/[0.02]"
                          : "bg-black/[0.01] hover:bg-black/[0.03]"
                      }
                    `}
                  >
                    {/* Coluna ITEM */}
                    <td className={`px-4 py-3 ${item.isCategoria ? "font-bold" : ""}`}>
                      {item.isCategoria ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-xs font-bold">
                          {item.item.replace(".", "")}
                        </span>
                      ) : (
                        <span className="text-black/60 pl-2 font-mono text-xs">
                          {item.item}
                        </span>
                      )}
                    </td>

                    {/* Coluna DESCRIÇÃO */}
                    <td className={`px-4 py-3 ${
                      item.isCategoria
                        ? "font-bold text-black"
                        : "text-black/80 pl-6"
                    }`}>
                      {item.descricao}
                    </td>

                    {/* Coluna UNIDADE */}
                    <td className="px-4 py-3 text-center text-black/50 font-mono text-xs">
                      {item.unidade || "—"}
                    </td>

                    {/* Coluna QUANTIDADE */}
                    <td className={`px-4 py-3 text-right font-mono text-sm ${
                      item.quantidade === "Incluso"
                        ? "text-emerald-600 font-medium"
                        : "text-black/70"
                    }`}>
                      {item.quantidade || "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-lg text-xs uppercase tracking-widest text-black/50 font-mono"
        >
          Especificações sujeitas a alterações conforme projeto executivo
        </motion.p>
      </div>
    </section>
  );
}
