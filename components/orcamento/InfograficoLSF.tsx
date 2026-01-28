"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Droplets,
  Recycle,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrcamentoWatermark } from "./OrcamentoWatermark";

interface BeneficioVisual {
  icon: React.ElementType;
  valor: number;
  sufixo: string;
  label: string;
  descricao: string;
  cor: string;
  comparativo?: {
    lsf: number;
    tradicional: number;
    unidade: string;
  };
}

const BENEFICIOS_VISUAIS: BeneficioVisual[] = [
  {
    icon: Droplets,
    valor: 90,
    sufixo: "%",
    label: "Menos Água",
    descricao: "Construção a seco com mínimo uso de água",
    cor: "light",
    comparativo: {
      lsf: 10,
      tradicional: 100,
      unidade: "% uso",
    },
  },
  {
    icon: Recycle,
    valor: 3,
    sufixo: "%",
    label: "Desperdício",
    descricao: "Apenas 3% de perda de materiais vs 25% tradicional",
    cor: "light",
    comparativo: {
      lsf: 3,
      tradicional: 25,
      unidade: "% perda",
    },
  },
  {
    icon: Target,
    valor: 99,
    sufixo: "%",
    label: "Precisão Orçamentária",
    descricao: "Orçamento preciso sem surpresas no final da obra",
    cor: "light",
    comparativo: {
      lsf: 99,
      tradicional: 60,
      unidade: "% precisão",
    },
  },
];

// Animated Bar Chart Component
function AnimatedBarChart({
  lsfValue,
  tradValue,
  unidade,
  cor,
  delay = 0,
}: {
  lsfValue: number;
  tradValue: number;
  unidade: string;
  cor: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const maxValue = Math.max(lsfValue, tradValue);
  const lsfWidth = (lsfValue / maxValue) * 100;
  const tradWidth = (tradValue / maxValue) * 100;

  const corClasses: Record<string, string> = {
    dark: "bg-white/80",
    light: "bg-white/70",
    neutral: "bg-white/60",
    accent: "bg-white/50",
  };

  return (
    <div ref={ref} className="space-y-3">
      {/* LSF Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/60 w-16">Steel Frame</span>
        <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${lsfWidth}%` } : { width: 0 }}
            transition={{
              duration: 1,
              delay: delay,
              ease: [0.19, 1, 0.22, 1],
            }}
            className={cn("h-full rounded-full", corClasses[cor] || "bg-black/70")}
          />
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.8 }}
          className="text-sm font-semibold text-white w-16 text-right"
        >
          {lsfValue} {unidade}
        </motion.span>
      </div>

      {/* Traditional Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/40 w-16">Alvenaria</span>
        <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${tradWidth}%` } : { width: 0 }}
            transition={{
              duration: 1,
              delay: delay + 0.2,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="h-full rounded-full bg-white/20"
          />
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: delay + 1 }}
          className="text-sm text-white/40 w-16 text-right"
        >
          {tradValue} {unidade}
        </motion.span>
      </div>
    </div>
  );
}

// Circular Progress Component
function CircularProgress({
  value,
  sufixo,
  cor,
  delay = 0,
}: {
  value: number;
  sufixo: string;
  cor: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const corStroke: Record<string, string> = {
    dark: "rgba(0, 0, 0, 0.7)",
    light: "rgba(255, 255, 255, 0.7)",
    neutral: "rgba(0, 0, 0, 0.5)",
    accent: "rgba(0, 0, 0, 0.4)",
  };

  return (
    <div ref={ref} className="relative w-28 h-28">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={corStroke[cor] || "rgba(0, 0, 0, 0.7)"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={
            isInView
              ? { strokeDashoffset }
              : { strokeDashoffset: circumference }
          }
          transition={{
            duration: 1.5,
            delay: delay,
            ease: [0.19, 1, 0.22, 1],
          }}
        />
      </svg>
      {/* Value in center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, delay: delay + 0.8 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="text-2xl font-bold text-white">
          {value}
          <span className="text-lg">{sufixo}</span>
        </span>
      </motion.div>
    </div>
  );
}

export function InfograficoLSF() {
  return (
    <section className="relative py-xl bg-gradient-to-b from-black via-black/95 to-black">
      <OrcamentoWatermark variant="dark" logoPosition="center" />
      <div className="container max-w-7xl relative z-10">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
              Eficiência Comprovada
            </span>
            <h2 className="headline-md text-white mb-4">
              Economia de recursos e precisão que fazem a diferença
            </h2>
            <p className="body-md text-white/60 max-w-2xl mx-auto">
              Vantagens exclusivas do Steel Frame que impactam diretamente
              no seu bolso e no meio ambiente.
            </p>
          </div>
        </RevealOnScroll>

        {/* Main Grid - Alternating Layout */}
        <div className="space-y-12">
          {BENEFICIOS_VISUAIS.map((beneficio, index) => {
            const Icon = beneficio.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={beneficio.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",
                  "p-6 lg:p-8 rounded-2xl",
                  "bg-gradient-to-br from-white/[0.03] to-transparent",
                  "border border-white/5 hover:border-white/10 transition-colors"
                )}
              >
                {/* Info Section */}
                <div
                  className={cn(
                    "flex flex-col sm:flex-row items-start gap-6",
                    !isEven && "lg:order-2"
                  )}
                >
                  {/* Circular Progress */}
                  <CircularProgress
                    value={beneficio.valor}
                    sufixo={beneficio.sufixo}
                    cor={beneficio.cor}
                    delay={index * 0.15}
                  />

                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          beneficio.cor === "dark" && "bg-black/15",
                          beneficio.cor === "light" && "bg-white/15",
                          beneficio.cor === "neutral" && "bg-black/10",
                          beneficio.cor === "accent" && "bg-black/8"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            beneficio.cor === "dark" && "text-white/70",
                            beneficio.cor === "light" && "text-white/70",
                            beneficio.cor === "neutral" && "text-white/60",
                            beneficio.cor === "accent" && "text-white/50"
                          )}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {beneficio.label}
                      </h3>
                    </div>
                    <p className="text-white/60 leading-relaxed">
                      {beneficio.descricao}
                    </p>
                  </div>
                </div>

                {/* Bar Chart Section */}
                {beneficio.comparativo && (
                  <div className={cn(!isEven && "lg:order-1")}>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-4">
                      Comparativo Visual
                    </p>
                    <AnimatedBarChart
                      lsfValue={beneficio.comparativo.lsf}
                      tradValue={beneficio.comparativo.tradicional}
                      unidade={beneficio.comparativo.unidade}
                      cor={beneficio.cor}
                      delay={index * 0.15 + 0.3}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
