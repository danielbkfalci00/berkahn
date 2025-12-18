"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
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
    description: "Desenvolvemos o projeto completo com precisão técnica e design",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.5 },
  },
};

export function SlideMethodology() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

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
                  variants={stepVariants}
                  className="relative text-center lg:text-left"
                >
                  {/* Number & Icon */}
                  <div className="flex flex-col items-center lg:items-start mb-6">
                    <div className="relative">
                      <span className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-black/5">
                        {step.number}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
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
