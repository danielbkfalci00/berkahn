"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COMPARISON_DATA } from "@/lib/lsf-data";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ChevronDown } from "lucide-react";

// Categorias sempre visíveis (3 linhas)
const VISIBLE_CATEGORIES = ["Tempo de Obra", "Desperdício de Material", "Peso Estrutural"];

// Separar dados em visíveis e ocultos
const visibleRows = COMPARISON_DATA.filter(item => VISIBLE_CATEGORIES.includes(item.category));
const hiddenRows = COMPARISON_DATA.filter(item => !VISIBLE_CATEGORIES.includes(item.category));

// Componente de linha da tabela (reutilizável)
function TableRow({ item, index, isAnimated = false }: {
  item: typeof COMPARISON_DATA[0];
  index: number;
  isAnimated?: boolean;
}) {
  const rowContent = (
    <>
      {/* Category */}
      <td className="py-5 px-6 font-medium">{item.category}</td>

      {/* LSF Value */}
      <td className="py-5 px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          {item.winner === "lsf" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
          <span
            className={`body-md ${
              item.winner === "lsf" ? "font-medium" : "text-black-70"
            }`}
          >
            {item.lsf}
          </span>
        </div>
      </td>

      {/* Traditional Value */}
      <td className="py-5 px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          {item.winner === "traditional" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
          <span
            className={`body-md ${
              item.winner === "traditional" ? "font-medium" : "text-black-70"
            }`}
          >
            {item.traditional}
          </span>
        </div>
      </td>
    </>
  );

  if (isAnimated) {
    return (
      <motion.tr
        key={item.category}
        className="border-b border-black-10 last:border-b-0 hover:bg-black-5 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.05,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        {rowContent}
      </motion.tr>
    );
  }

  return (
    <motion.tr
      key={item.category}
      className="border-b border-black-10 hover:bg-black-5 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {rowContent}
    </motion.tr>
  );
}

export function ComparisonTableHome() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-xl bg-white">
      <div className="container">
        {/* Header */}
        <RevealOnScroll>
          <h2 className="headline-lg text-center mb-4">
            LSF vs. Construção Tradicional
          </h2>
          <p className="body-md text-black-50 text-center max-w-2xl mx-auto mb-12">
            Compare os principais aspectos entre o Light Steel Frame e a construção convencional
          </p>
        </RevealOnScroll>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-luxury-lg overflow-hidden">
            {/* Header */}
            <thead className="bg-black text-white">
              <tr>
                <th className="py-6 px-6 text-left font-heading text-lg">
                  Característica
                </th>
                <th className="py-6 px-6 text-center font-heading text-lg">
                  Light Steel Frame
                </th>
                <th className="py-6 px-6 text-center font-heading text-lg">
                  Construção Tradicional
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {/* Linhas sempre visíveis (3) */}
              {visibleRows.map((item, index) => (
                <TableRow key={item.category} item={item} index={index} />
              ))}

              {/* Linhas ocultas (7) - com AnimatePresence */}
              <AnimatePresence>
                {isExpanded && hiddenRows.map((item, index) => (
                  <TableRow
                    key={item.category}
                    item={item}
                    index={index}
                    isAnimated={true}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Botão Ver Mais */}
        <div className="flex justify-center py-4 border-t border-black-10 bg-white rounded-b-lg -mt-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 text-black hover:text-black-70 transition-colors duration-300 text-sm font-medium"
          >
            {isExpanded ? "Ver menos" : "Ver comparação completa"}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>

        {/* Summary */}
        <div className="mt-4 p-6 bg-black-5 rounded-lg">
          <p className="text-sm text-black-70 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 inline mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            indica vantagem competitiva no critério
          </p>
        </div>
      </div>
    </section>
  );
}
