"use client";

import { motion } from "motion/react";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { ComodoMetragem } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface RoomMetricsTableProps {
  comodos: ComodoMetragem[];
  metragemTotal: number;
}

const categoriaLabels: Record<ComodoMetragem["categoria"], string> = {
  social: "Social",
  intimo: "Íntimo",
  servico: "Serviço",
  circulacao: "Circulação",
};

const categoriaColors: Record<ComodoMetragem["categoria"], string> = {
  social: "bg-blue-100 text-blue-700",
  intimo: "bg-purple-100 text-purple-700",
  servico: "bg-amber-100 text-amber-700",
  circulacao: "bg-gray-100 text-gray-700",
};

export function RoomMetricsTable({
  comodos,
  metragemTotal,
}: RoomMetricsTableProps) {
  // Agrupa por categoria para resumo
  const porCategoria = comodos.reduce(
    (acc, comodo) => {
      acc[comodo.categoria] = (acc[comodo.categoria] || 0) + comodo.area;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <RevealOnScroll>
      <div className="space-y-6">
        {/* Tabela Principal */}
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">
                  Cômodo
                </th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold hidden sm:table-cell">
                  Categoria
                </th>
                <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold">
                  Área
                </th>
              </tr>
            </thead>
            <tbody>
              {comodos.map((comodo, index) => (
                <motion.tr
                  key={comodo.nome}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "border-b border-black/5 hover:bg-black/[0.02] transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-black/[0.01]"
                  )}
                >
                  <td className="px-4 sm:px-6 py-3.5">
                    <span className="text-black/80 font-medium">
                      {comodo.nome}
                    </span>
                    {/* Categoria mobile */}
                    <span
                      className={cn(
                        "sm:hidden ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                        categoriaColors[comodo.categoria]
                      )}
                    >
                      {categoriaLabels[comodo.categoria]}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-center hidden sm:table-cell">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        categoriaColors[comodo.categoria]
                      )}
                    >
                      {categoriaLabels[comodo.categoria]}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-right">
                    <span className="font-semibold text-black">
                      {comodo.area}m²
                    </span>
                  </td>
                </motion.tr>
              ))}

              {/* Total Row */}
              <tr className="bg-black/5 font-semibold">
                <td className="px-4 sm:px-6 py-4 text-black" colSpan={2}>
                  <span className="sm:hidden">Total</span>
                  <span className="hidden sm:inline">Total Geral</span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right text-black/90 text-lg">
                  {metragemTotal}m²
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Resumo por Categoria */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(porCategoria).map(([categoria, area]) => (
            <motion.div
              key={categoria}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "p-3 rounded-lg text-center",
                categoriaColors[categoria as ComodoMetragem["categoria"]]
              )}
            >
              <p className="text-xs font-medium opacity-80 mb-1">
                {categoriaLabels[categoria as ComodoMetragem["categoria"]]}
              </p>
              <p className="text-lg font-bold">{area}m²</p>
            </motion.div>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}
