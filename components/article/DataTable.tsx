"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArticleTable } from "@/types/article";

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
                className={`py-5 px-6 font-heading text-base font-medium ${
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
                  className={`py-4 px-6 ${
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
                className={`py-3 px-4 font-medium text-black-80 ${
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
                  className={`py-3 px-4 ${
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
