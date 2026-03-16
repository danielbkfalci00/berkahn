"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Myth } from "@/types/article";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { X, CheckCircle } from "lucide-react";

interface MythBusterProps {
  myths: Myth[];
  variant?: "accordion" | "cards";
}

export function MythBuster({ myths, variant = "accordion" }: MythBusterProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myths.map((item, index) => (
          <RevealOnScroll key={index} delay={index * 0.1}>
            <motion.div
              className="h-full cursor-pointer"
              onClick={() => toggleExpanded(index)}
              whileHover={{ translateY: -4 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {expandedIndex === index ? (
                  <motion.div
                    key="truth"
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-8 h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <h4 className="text-lg font-semibold text-green-900">
                          Realidade
                        </h4>
                      </div>
                      <p className="body-md text-green-800 leading-relaxed">
                        {item.truth}
                      </p>
                    </div>
                    <p className="text-sm text-green-600 mt-4">
                      Clique para voltar
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="myth"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-8 h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <h4 className="text-lg font-semibold text-red-900">
                          Mito
                        </h4>
                      </div>
                      <p className="body-md text-red-800 leading-relaxed">
                        "{item.myth}"
                      </p>
                    </div>
                    <p className="text-sm text-red-600 mt-4">
                      Clique para revelar a realidade
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </RevealOnScroll>
        ))}
      </div>
    );
  }

  // Default accordion variant
  return (
    <div className="space-y-4">
      {myths.map((item, index) => (
        <RevealOnScroll key={index} delay={index * 0.05}>
          <motion.div
            className="border border-black-10 rounded-lg overflow-hidden"
            layout
          >
            <motion.button
              onClick={() => toggleExpanded(index)}
              className="w-full px-6 py-4 bg-black-5 hover:bg-black-10 transition-colors flex items-start justify-between gap-4 text-left group"
              whileHover={{ backgroundColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex-shrink-0 mt-1 flex items-center justify-center transition-colors ${
                    expandedIndex === index
                      ? "bg-red-100"
                      : "bg-black-10 group-hover:bg-black-20"
                  }`}
                >
                  <X
                    className={`w-4 h-4 ${
                      expandedIndex === index ? "text-red-600" : "text-black-50"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-black leading-snug">
                    "{item.myth}"
                  </p>
                  <p className="text-sm text-black-50 mt-1">
                    {expandedIndex === index ? "Clique para fechar" : "Clique para ver a realidade"}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 mt-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-green-50 px-6 py-6 border-t border-black-10">
                    <div className="flex items-start gap-4 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">
                          Realidade
                        </h4>
                        <p className="body-md text-green-800 leading-relaxed">
                          {item.truth}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
