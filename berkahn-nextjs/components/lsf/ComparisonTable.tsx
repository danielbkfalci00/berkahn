"use client";

import { motion } from "framer-motion";
import { COMPARISON_DATA } from "@/lib/lsf-data";

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow-luxury-lg overflow-hidden">
        {/* Header */}
        <thead className="bg-black text-white">
          <tr>
            <th className="py-6 px-6 text-left font-heading text-lg">
              Caracter\u00edstica
            </th>
            <th className="py-6 px-6 text-center font-heading text-lg">
              Light Steel Frame
            </th>
            <th className="py-6 px-6 text-center font-heading text-lg">
              Constru\u00e7\u00e3o Tradicional
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {COMPARISON_DATA.map((item, index) => (
            <motion.tr
              key={item.category}
              className="border-b border-black-10 last:border-b-0 hover:bg-black-5 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
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
                      item.winner === "traditional"
                        ? "font-medium"
                        : "text-black-70"
                    }`}
                  >
                    {item.traditional}
                  </span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="mt-6 p-6 bg-black-5 rounded-lg">
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
          indica vantagem competitiva no crit\u00e9rio
        </p>
      </div>
    </div>
  );
}
