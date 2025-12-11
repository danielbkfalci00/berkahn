"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LSF_LAYERS } from "@/lib/lsf-data";
import { Badge } from "@/components/ui/badge";

export function LSFDiagram() {
  const [selectedLayer, setSelectedLayer] = useState<number>(4); // Default: Estrutura Steel Frame

  const selected = LSF_LAYERS.find((layer) => layer.id === selectedLayer);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Left: Visual Diagram (7 layers stacked) */}
      <div className="order-2 lg:order-1">
        <div className="bg-white rounded-lg shadow-luxury-lg p-8">
          <p className="label-text mb-6 text-center">SISTEMA MULTICAMADAS</p>

          {/* Diagram: 7 layers stacked */}
          <div className="space-y-2">
            {LSF_LAYERS.map((layer, index) => (
              <motion.button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`w-full text-left transition-all duration-300 rounded-lg overflow-hidden ${
                  selectedLayer === layer.id
                    ? "ring-2 ring-black"
                    : "hover:ring-1 hover:ring-black-30"
                }`}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.19, 1, 0.22, 1],
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="p-4 flex items-center justify-between"
                  style={{
                    backgroundColor: layer.color,
                    height: `${60 + (7 - layer.id) * 10}px`, // Layers get thicker towards center
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        layer.id <= 3 ? "text-white" : "text-black"
                      }`}
                    >
                      {layer.id}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        layer.id <= 3 ? "text-white" : "text-black"
                      }`}
                    >
                      {layer.name}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      layer.id <= 3
                        ? "border-white text-white"
                        : "border-black text-black"
                    } bg-transparent`}
                  >
                    {layer.thickness}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-black-10">
            <p className="text-xs text-black-50 text-center">
              Clique em cada camada para ver detalhes completos
            </p>
          </div>
        </div>
      </div>

      {/* Right: Layer Details */}
      <div className="order-1 lg:order-2">
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="bg-white rounded-lg shadow-luxury-lg p-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge className="mb-3">Camada {selected.id}</Badge>
                  <h3 className="headline-sm mb-2">{selected.name}</h3>
                  <p className="body-md text-black-70">{selected.description}</p>
                </div>
              </div>

              {/* Full Description */}
              <div className="mb-6 pb-6 border-b border-black-10">
                <p className="body-md leading-relaxed">{selected.fullDescription}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="label-text text-xs mb-2">ESPESSURA</p>
                  <p className="body-md font-medium">{selected.thickness}</p>
                </div>
                <div>
                  <p className="label-text text-xs mb-2">MATERIAL</p>
                  <p className="body-md font-medium">{selected.material}</p>
                </div>
              </div>

              {/* Function */}
              <div className="mt-4 p-4 bg-black-5 rounded-lg">
                <p className="label-text text-xs mb-2">FUNÇÃO PRINCIPAL</p>
                <p className="body-md">{selected.function}</p>
              </div>

              {/* Navigation Hint */}
              <div className="mt-6 pt-6 border-t border-black-10">
                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={() =>
                      setSelectedLayer(selected.id > 1 ? selected.id - 1 : 7)
                    }
                    className="text-black-70 hover:text-black transition-colors flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                    Camada anterior
                  </button>

                  <button
                    onClick={() =>
                      setSelectedLayer(selected.id < 7 ? selected.id + 1 : 1)
                    }
                    className="text-black-70 hover:text-black transition-colors flex items-center gap-2"
                  >
                    Próxima camada
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
