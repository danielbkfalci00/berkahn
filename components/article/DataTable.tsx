"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { ArticleTable, ChartData, Comparison3DMatrix } from "@/types/article";

interface DataTableProps {
  table: ArticleTable;
  className?: string;
}

export function DataTable({ table, className = "" }: DataTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label="Tabela de dados do artigo"
      className={`overflow-x-auto ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      <table className="w-full bg-white rounded-lg shadow-luxury-md overflow-hidden">
        {/* Header */}
        <thead className="bg-black text-white">
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={index}
                className={`py-3 px-3 md:px-4 lg:px-6 font-heading text-sm md:text-base font-medium ${
                  index === 0 ? "text-left" : "text-center"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              className="border-b border-black-10 last:border-b-0 hover:bg-black-5 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: rowIndex * 0.05,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`py-3 px-3 md:px-4 lg:px-6 text-sm md:text-base ${
                    cellIndex === 0
                      ? "font-medium text-black"
                      : "text-center text-black-80"
                  } ${
                    table.highlightColumn !== undefined && cellIndex === table.highlightColumn
                      ? "bg-black-5 font-medium text-black"
                      : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Caption */}
      {table.caption && (
        <p className="mt-4 text-sm text-black-60 text-center">
          {table.caption}
        </p>
      )}
    </motion.div>
  );
}

// Compact comparison table variant
interface CompactTableProps {
  headers: string[];
  rows: (string | number)[][];
  className?: string;
}

export function CompactTable({ headers, rows, className = "" }: CompactTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label="Tabela comparativa do artigo"
      className={`overflow-x-auto rounded-lg border border-black-10 ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <table className="w-full text-sm">
        <thead className="bg-black-5">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`py-2 px-2 md:px-3 lg:px-4 text-xs md:text-sm font-medium text-black-80 ${
                  index === 0 ? "text-left" : "text-center"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-black-10 hover:bg-black-5/50 transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`py-2 px-2 md:px-3 lg:px-4 text-xs md:text-sm ${
                    cellIndex === 0 ? "font-medium" : "text-center text-black-70"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

interface DeferredChartDataProps {
  charts: ChartData[];
  heightClass: string;
}

/**
 * Server-rendered, no-JS-readable data shown until the interactive chart is near
 * the viewport. Keeps chart facts indexable without loading Recharts eagerly.
 */
export function DeferredChartData({ charts, heightClass }: DeferredChartDataProps) {
  return (
    <div tabIndex={0} role="region" aria-label="Dados dos gráficos do artigo" className={`my-8 ${heightClass} overflow-auto rounded-lg border border-black-10 bg-white p-4 md:p-6`}>
      {charts.map((chart) => {
        if (!chart.data?.length) return null;
        const keys = Object.keys(chart.data[0]).filter((key) => key !== "fill");

        return (
          <div key={chart.id} className="mb-6 last:mb-0">
            {chart.title && <h3 className="mb-3 text-base font-semibold">{chart.title}</h3>}
            <table className="w-full min-w-[32rem] text-sm">
              <caption className="sr-only">Dados do gráfico {chart.title || chart.id}</caption>
              <thead className="bg-black text-white">
                <tr>
                  {keys.map((key) => <th key={key} className="px-3 py-2 text-left">{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {chart.data.map((row: Record<string, unknown>, rowIndex: number) => (
                  <tr key={rowIndex} className="border-b border-black-10 last:border-b-0">
                    {keys.map((key) => <td key={key} className="px-3 py-2">{String(row[key] ?? "")}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export function DeferredComparisonData({ matrix, heightClass }: { matrix: Comparison3DMatrix; heightClass: string }) {
  return (
    <div tabIndex={0} role="region" aria-label="Dados da comparação do artigo" className={`my-8 ${heightClass} overflow-auto rounded-lg border border-black-10 bg-white p-4 md:p-6`}>
      <h3 className="mb-2 text-base font-semibold">{matrix.title}</h3>
      {matrix.description && <p className="mb-4 text-sm text-black-70">{matrix.description}</p>}
      <table className="w-full min-w-[32rem] text-sm">
        <caption className="sr-only">Dados da comparação {matrix.title}</caption>
        <thead className="bg-black text-white">
          <tr>
            <th className="px-3 py-2 text-left">Dimensão</th>
            {matrix.options.map((option) => <th key={option.name} className="px-3 py-2 text-center">{option.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {matrix.dimensions.map((dimension, dimensionIndex) => (
            <tr key={dimension} className="border-b border-black-10 last:border-b-0">
              <th className="px-3 py-2 text-left font-medium">{dimension}</th>
              {matrix.options.map((option) => (
                <td key={option.name} className="px-3 py-2 text-center">{option.scores[dimensionIndex] ?? 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
