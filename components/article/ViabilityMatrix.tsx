"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TabComparison } from "@/types/article";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

interface ViabilityMatrixProps {
  scenarios: TabComparison[];
}

export function ViabilityMatrix({ scenarios }: ViabilityMatrixProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>(
    scenarios[0]?.id || ""
  );

  const current = scenarios.find((s) => s.id === selectedScenario);

  if (!current) return null;

  const getScenarioColor = (id: string) => {
    if (id.includes("alta")) return "from-green-50 to-emerald-50";
    if (id.includes("media")) return "from-amber-50 to-yellow-50";
    if (id.includes("baixa")) return "from-red-50 to-rose-50";
    if (id.includes("saude")) return "from-blue-50 to-cyan-50";
    return "from-gray-50 to-slate-50";
  };

  const getBorderColor = (id: string) => {
    if (id.includes("alta")) return "border-green-200";
    if (id.includes("media")) return "border-amber-200";
    if (id.includes("baixa")) return "border-red-200";
    if (id.includes("saude")) return "border-blue-200";
    return "border-gray-200";
  };

  const getHeaderColor = (id: string) => {
    if (id.includes("alta")) return "bg-green-100 text-green-900";
    if (id.includes("media")) return "bg-amber-100 text-amber-900";
    if (id.includes("baixa")) return "bg-red-100 text-red-900";
    if (id.includes("saude")) return "bg-blue-100 text-blue-900";
    return "bg-gray-100 text-gray-900";
  };

  const getIconColor = (id: string) => {
    if (id.includes("alta")) return "text-green-600";
    if (id.includes("media")) return "text-amber-600";
    if (id.includes("baixa")) return "text-red-600";
    if (id.includes("saude")) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <RevealOnScroll>
      <div className="space-y-8">
        {/* Scenario Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarios.map((scenario) => (
            <motion.button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              whileHover={{ translateY: -2 }}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                selectedScenario === scenario.id
                  ? `${getBorderColor(scenario.id)} bg-white border-2 shadow-md`
                  : "bg-black-5 border border-black-10 hover:bg-black-10"
              }`}
            >
              <p className="text-sm">{scenario.title}</p>
            </motion.button>
          ))}
        </div>

        {/* Selected Scenario Details */}
        <motion.div
          key={selectedScenario}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-lg border-2 ${getBorderColor(
            selectedScenario
          )} bg-gradient-to-br ${getScenarioColor(selectedScenario)} p-8`}
        >
          {/* Header with Icon */}
          <div className="flex items-start gap-4 mb-6">
            {selectedScenario.includes("alta") && (
              <CheckCircle className={`w-8 h-8 flex-shrink-0 ${getIconColor(selectedScenario)}`} />
            )}
            {selectedScenario.includes("media") && (
              <AlertCircle className={`w-8 h-8 flex-shrink-0 ${getIconColor(selectedScenario)}`} />
            )}
            {selectedScenario.includes("baixa") && (
              <AlertCircle className={`w-8 h-8 flex-shrink-0 ${getIconColor(selectedScenario)}`} />
            )}
            {selectedScenario.includes("saude") && (
              <Lightbulb className={`w-8 h-8 flex-shrink-0 ${getIconColor(selectedScenario)}`} />
            )}
            <div>
              <h3 className="headline-sm">{current.title}</h3>
              {current.tabs?.[0]?.content?.description && (
                <p className="body-md text-black-70 mt-2">
                  {current.tabs[0].content.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          {current.tabs?.[0]?.content?.stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pt-6 border-t border-black-10">
              {current.tabs[0].content.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white bg-opacity-50 rounded-lg p-4 backdrop-blur"
                >
                  <p className="text-sm text-black-50 mb-1">{stat.label}</p>
                  <p className="headline-md text-black">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-lg font-semibold ml-1">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Items List */}
          {current.tabs?.[0]?.content?.items && (
            <div className="space-y-3 pt-4">
              <p className="font-semibold text-black mb-4">Características:</p>
              {current.tabs[0].content.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 bg-white bg-opacity-50 rounded-lg p-3 backdrop-blur"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                  <p className="body-sm text-black-80">{item}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 pt-6 border-t border-black-10"
          >
            <p className="body-sm text-black-70 mb-4">
              Seu projeto se encaixa neste perfil?
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black-90 transition-colors">
              Avaliar Viabilidade
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>

        {/* Additional Context */}
        <div className="bg-black-5 rounded-lg p-6 border border-black-10">
          <p className="body-sm text-black-70">
            <strong>💡 Dica:</strong> A viabilidade de construção modular depende de fatores como
            escala do projeto, prazo disponível, orçamento, localização e complexidade do design.
            Consulte fornecedores especializados para análise personalizada do seu projeto.
          </p>
        </div>
      </div>
    </RevealOnScroll>
  );
}
