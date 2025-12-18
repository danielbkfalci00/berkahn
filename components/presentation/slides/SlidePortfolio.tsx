"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CountUp } from "@/components/animations/CountUp";

const stats = [
  { value: 20, suffix: "+", label: "Anos de experiência combinada" },
  { value: 23, suffix: "+", label: "Projetos" },
  { value: 85, suffix: "+ mil m²", label: "Área construída" },
  { value: 100, suffix: "%", label: "Satisfação" },
];

const projects = [
  {
    name: "Casa de Campo",
    image: "/images/Services/Projetos prontos/casa_campo/casa-campo-moderna.webp",
  },
  {
    name: "Loft Urbano",
    image: "/images/Services/Projetos prontos/loft/loft-urbano.webp",
  },
  {
    name: "Chalé Rústico",
    image: "/images/Services/Projetos prontos/chale/chale-rustico.webp",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
  },
};

export function SlidePortfolio() {
  const statsRef = useRef(null);
  const projectsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-20% 0px" });
  const projectsInView = useInView(projectsRef, { once: true, margin: "-10% 0px" });

  return (
    <SlideSection dark className="py-20 lg:py-32">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/50 mb-4">
            Trajetória dos Nossos Fundadores
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Números que<br className="hidden sm:block" /> Falam por Si
          </h2>
        </RevealOnScroll>

        {/* Stats Grid */}
        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16 lg:mb-24"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center"
            >
              <div className="flex items-baseline justify-center">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight"
                />
              </div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/50 mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Grid - Bento Style */}
        <motion.div
          ref={projectsRef}
          variants={containerVariants}
          initial="hidden"
          animate={projectsInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-sm group ${
                index === 0 ? "md:row-span-1" : ""
              }`}
            >
              <div className="relative aspect-[4/3] md:aspect-[3/4]">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm sm:text-base font-medium tracking-wide">
                    {project.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideSection>
  );
}
