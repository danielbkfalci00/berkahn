"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CountUp } from "@/components/animations/CountUp";
import { BENEFITS, COMPARISON_DATA } from "@/lib/lsf-data";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { cn } from "@/lib/utils";
import { Zap, Leaf, Gauge, Shield, Check, Volume2, Maximize2, Target, Scale } from "lucide-react";

// Mapear icons aos benefícios
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  speed: Zap,
  sustainability: Leaf,
  energy: Gauge,
  durability: Shield,
  acoustic: Volume2,
  area: Maximize2,
  precision: Target,
  weight: Scale,
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
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
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

        {/* ============================================ */}
        {/* Composição do Sistema - Diagrama de Camadas */}
        {/* ============================================ */}
        <div className="mb-16 lg:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Column 1: DIAGRAM IMAGE */}
            <RevealOnScroll className="order-2 lg:order-1">
              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <Image
                  src="/images/Lsf/lsf-wall-layers-diagram.webp"
                  alt="Diagrama técnico das camadas de parede LSF"
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </RevealOnScroll>

            {/* Column 2: TEXT CONTENT */}
            <RevealOnScroll delay={0.2} className="order-1 lg:order-2">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  A Composição do Sistema
                </h3>
                <h4 className="text-lg lg:text-xl font-medium text-white/70 mb-6">
                  Soluções que se adaptam ao seu projeto
                </h4>

                <div className="space-y-4">
                  <p className="text-base lg:text-lg text-white/80 leading-relaxed">
                    No LSF, as paredes funcionam como sistemas multicamadas que entregam
                    estanqueidade, isolamento e acabamento superiores à alvenaria
                    convencional.
                  </p>
                  <p className="text-base lg:text-lg text-white/80 leading-relaxed">
                    Para cada tipo de projeto, desenvolvemos uma composição específica
                    — espessuras, materiais isolantes, revestimentos e acabamentos são
                    definidos de acordo com as necessidades técnicas e preferências de
                    cada cliente.
                  </p>
                </div>

                {/* Tags de tipos de projeto */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {["Residencial", "Comercial", "Industrial", "Reformas"].map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium text-white/70 tracking-wide"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-white/50 mt-6 leading-relaxed">
                  O diagrama ao lado e as camadas detalhadas abaixo ilustram uma
                  composição padrão para projetos residenciais.
                </p>
              </div>
            </RevealOnScroll>

          </div>
        </div>

        {/* Transition Text - Bridge to Performance Indicators */}
        <RevealOnScroll>
          <div className="mb-12 lg:mb-16 max-w-3xl mx-auto text-center">
            <p className="text-lg lg:text-xl text-white/70 leading-relaxed">
              Essa configuração multicamadas resulta em vantagens mensuráveis que
              revolucionam a construção civil:
            </p>
          </div>
        </RevealOnScroll>

        {/* ============================================ */}
        {/* END NEW SECTION */}
        {/* ============================================ */}

        {/* Stats Grid */}
        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16 lg:mb-20 max-w-7xl mx-auto"
        >
          {BENEFITS.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="text-center p-4 sm:p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-sm"
              >
                {/* Icon */}
                {Icon && (
                  <div className="flex justify-center mb-4">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white/60" />
                  </div>
                )}

                {/* Number */}
                <div className="flex items-baseline justify-center">
                  <CountUp
                    end={benefit.stat}
                    suffix={benefit.suffix}
                    className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight"
                  />
                </div>

                {/* Label */}
                <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.12em] sm:tracking-[0.15em] text-white/50 mt-2 px-1">
                  {benefit.description.split(" ").slice(0, 4).join(" ")}
                </p>

                {/* Title */}
                <p className="text-xs sm:text-sm text-white/70 mt-1 font-medium">
                  {benefit.title}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mão de Obra Especializada */}
        <RevealOnScroll className="mt-6 lg:mt-8 mb-10 lg:mb-14 text-center">
          <p className="text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Contamos com <strong className="text-white font-semibold">mão de obra 100% especializada e certificada por empresa internacional (Sicla)</strong>,
            garantindo execução de excelência em todos os projetos.
          </p>
        </RevealOnScroll>

        {/* Imagem de Impacto — movida para SlideServices */}

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
