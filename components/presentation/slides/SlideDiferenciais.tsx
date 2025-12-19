"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CountUp } from "@/components/animations/CountUp";
import { BENEFITS, COMPARISON_DATA } from "@/lib/lsf-data";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { cn } from "@/lib/utils";
import { Zap, Leaf, Gauge, Shield, Check } from "lucide-react";

// Mapear icons aos benefícios
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  speed: Zap,
  sustainability: Leaf,
  energy: Gauge,
  durability: Shield,
};

// Selecionar 6 critérios mais impactantes para o comparativo
const selectedComparisons = COMPARISON_DATA.slice(0, 6);

export function SlideDiferenciais() {
  const { ref: statsRef, isInView: statsInView } = useInViewAnimation({ margin: "-20% 0px" });
  const { ref: comparisonRef, isInView: comparisonInView } = useInViewAnimation({ margin: "-10% 0px" });

  return (
    <SlideSection dark className="py-16 lg:py-24">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 mb-4">
            Light Steel Frame
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            A Revolução que<br className="hidden sm:block" /> Constrói o Futuro
          </h2>
          <p className="text-base sm:text-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Sistema construtivo industrializado que combina velocidade, sustentabilidade
            e eficiência energética superior à construção tradicional.
          </p>
          <div className="w-16 h-px bg-white/20 mx-auto mt-8" />
        </RevealOnScroll>

        {/* Stats Grid */}
        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-20"
        >
          {BENEFITS.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="text-center p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              >
                {/* Icon */}
                {Icon && (
                  <div className="flex justify-center mb-4">
                    <Icon className="w-8 h-8 text-white/40" />
                  </div>
                )}

                {/* Number */}
                <div className="flex items-baseline justify-center">
                  <CountUp
                    end={benefit.stat}
                    suffix={benefit.suffix}
                    className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight"
                  />
                </div>

                {/* Label */}
                <p className="text-xs sm:text-sm uppercase tracking-[0.15em] text-white/50 mt-2">
                  {benefit.description.split(" ").slice(0, 3).join(" ")}
                </p>

                {/* Title */}
                <p className="text-sm text-white/70 mt-1 font-medium">
                  {benefit.title}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Imagem de Impacto */}
        <RevealOnScroll className="mb-16 lg:mb-20">
          <div className="relative h-[40vh] lg:h-[50vh] w-full overflow-hidden">
            <Image
              src="/images/Lsf/lsf-hero-structure.webp"
              alt="Estrutura Steel Frame em construção"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* Caption */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/70 text-sm uppercase tracking-widest">
                Estrutura Steel Frame
              </p>
              <p className="text-white/50 text-xs mt-1">
                Perfis de aço galvanizado montados com precisão milimétrica
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Comparativo */}
        <RevealOnScroll className="mb-8">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 text-center mb-2">
            Comparativo
          </p>
          <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-8">
            LSF vs Construção Tradicional
          </h3>
        </RevealOnScroll>

        <motion.div
          ref={comparisonRef}
          variants={containerVariants}
          initial="hidden"
          animate={comparisonInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {selectedComparisons.map((item) => (
            <motion.div
              key={item.category}
              variants={itemVariants}
              className={cn(
                "p-5 border transition-colors",
                item.winner === "lsf"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-white/10 bg-white/[0.02]"
              )}
            >
              {/* Category */}
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
                {item.category}
              </p>

              {/* Values Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* LSF */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white/60">LSF</span>
                    {item.winner === "lsf" && (
                      <Check className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      item.winner === "lsf" ? "text-emerald-400" : "text-white/80"
                    )}
                  >
                    {item.lsf}
                  </p>
                </div>

                {/* Traditional */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white/60">Tradicional</span>
                    {item.winner === "traditional" && (
                      <Check className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      item.winner === "traditional" ? "text-emerald-400" : "text-white/50"
                    )}
                  >
                    {item.traditional}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mão de Obra Especializada */}
        <RevealOnScroll className="mt-16 lg:mt-20 text-center">
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Contamos com <strong className="text-white font-semibold">mão de obra 100% especializada</strong>,
            com equipe certificada por empresa internacional (SICLA), garantindo execução de excelência
            em todos os projetos.
          </p>
        </RevealOnScroll>

        {/* Decorative Separator */}
        <RevealOnScroll delay={0.4} className="mt-16">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-white/10" />
            <div className="w-2 h-2 bg-white/20 rotate-45" />
            <div className="w-16 h-px bg-white/10" />
          </div>
        </RevealOnScroll>
      </div>
    </SlideSection>
  );
}
