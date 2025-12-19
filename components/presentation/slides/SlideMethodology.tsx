"use client";

import { motion } from "framer-motion";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { containerVariants, itemVariants, lineVariants } from "@/lib/animation-variants";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { MessageSquare, PenTool, HardHat, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Consulta",
    description: "Entendemos suas necessidades e apresentamos as melhores soluções",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Projeto",
    description: "Gerenciamos o desenvolvimento de todos os projetos necessários para viabilizar a execução da obra",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Execução",
    description: "Construímos com qualidade, acompanhamento constante e prazo definido",
    icon: HardHat,
  },
  {
    number: "04",
    title: "Entrega",
    description: "Entregamos sua obra pronta para uso com garantia e suporte",
    icon: CheckCircle2,
  },
];

export function SlideMethodology() {
  const { ref, isInView } = useInViewAnimation({ margin: "-20% 0px" });

  return (
    <SlideSection className="py-20 lg:py-32">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-16 lg:mb-24">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/50 mb-4">
            Como Trabalhamos
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Do Conceito à<br className="hidden sm:block" /> Entrega das Chaves
          </h2>
        </RevealOnScroll>

        {/* Steps */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Connecting Line - Desktop */}
          <motion.div
            variants={lineVariants}
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-black/10 origin-left"
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="relative text-center lg:text-left"
                >
                  {/* Icon */}
                  <div className="flex flex-col items-center lg:items-start mb-6">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-black/60 leading-relaxed max-w-xs mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </SlideSection>
  );
}
