"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import { ProjectCategory } from "@/types/project";
import { ProjectCardPremium } from "@/components/project/ProjectCardPremium";
import { CategoryFilterMinimal } from "@/components/portfolio/CategoryFilter";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { CTA } from "@/components/sections/CTA";
import { CharReveal, LineReveal } from "@/components/animations/TextReveal";
import { ArrowDown } from "lucide-react";

// Hero Section with Parallax
function PortfolioHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const backgroundY = useTransform(scrollY, [0, 1000], [0, -300]);
  const contentY = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
          alt="Arquitetura moderna em Steel Frame"
          fill
          className="object-cover scale-110"
          priority
          sizes="100vw"
          quality={90}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-6 container max-w-4xl"
        style={{ y: contentY, opacity }}
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="label-text text-white/80 mb-6"
        >
          NOSSOS PROJETOS
        </motion.p>

        {/* Title with character reveal */}
        <h1 className="headline-lg text-white mb-8">
          <CharReveal text="Portf\u00f3lio" delay={0.4} />
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-xl md:text-2xl text-white/70 font-heading font-light max-w-2xl mx-auto"
        >
          Cada projeto \u00e9 uma express\u00e3o \u00fanica de design, tecnologia e excel\u00eancia construtiva
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ opacity }}
      >
        <motion.div
          className="flex flex-col items-center gap-3 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <span className="text-white/60 text-xs uppercase tracking-widest">
            Explorar
          </span>
          <ArrowDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Manifesto/Statement Section
function PortfolioManifesto() {
  return (
    <section className="py-3xl bg-white">
      <div className="container max-w-5xl">
        <div className="text-center">
          <LineReveal
            lines={[
              "Construir \u00e9 mais do que erguer paredes.",
              "\u00c9 materializar sonhos com precis\u00e3o,",
              "tecnologia e respeito ao tempo de cada cliente.",
            ]}
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-black leading-tight"
            lineClassName="mb-2"
            delay={0.2}
          />

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="w-24 h-px bg-black mx-auto mt-12"
          />
        </div>
      </div>
    </section>
  );
}

// Projects Grid Section
function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">(
    "all"
  );

  const filteredProjects =
    activeCategory === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section className="py-2xl bg-black-5">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-12"
        >
          <p className="label-text mb-4">PROJETOS PRONTOS</p>
          <h2 className="headline-md mb-6">Escolha Seu Projeto</h2>
          <p className="body-lg text-black-70 max-w-2xl mx-auto">
            Projetos exclusivos em Light Steel Frame, desenvolvidos para
            diferentes estilos de vida e necessidades.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mb-16"
        >
          <CategoryFilterMinimal
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCardPremium
                key={project.id}
                project={project}
                index={index}
                variant={index === 0 && activeCategory === "all" ? "featured" : "default"}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-black-50 text-lg">
              Nenhum projeto encontrado nesta categoria.
            </p>
          </motion.div>
        )}

        {/* Custom project CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="mt-16 text-center"
        >
          <p className="body-md text-black-70">
            N\u00e3o encontrou o que procura?{" "}
            <a
              href="/contato"
              className="text-black font-medium hover:underline underline-offset-4 transition-all"
            >
              Fale conosco para um projeto personalizado
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Process Section
function PortfolioProcess() {
  const steps = [
    {
      number: "01",
      title: "Escolha",
      description: "Selecione o projeto que mais combina com seu estilo de vida",
    },
    {
      number: "02",
      title: "Personaliza\u00e7\u00e3o",
      description: "Adapte acabamentos e detalhes \u00e0s suas prefer\u00eancias",
    },
    {
      number: "03",
      title: "Produ\u00e7\u00e3o",
      description: "Fabricamos com precis\u00e3o industrial em nossa unidade",
    },
    {
      number: "04",
      title: "Entrega",
      description: "Montagem r\u00e1pida e eficiente no seu terreno",
    },
  ];

  return (
    <section className="py-2xl bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-16"
        >
          <p className="label-text mb-4">COMO FUNCIONA</p>
          <h2 className="headline-md">Do projeto \u00e0 realidade</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="text-center"
            >
              <span className="block font-heading text-5xl md:text-6xl text-black-10 mb-4">
                {step.number}
              </span>
              <h3 className="font-heading text-xl font-medium mb-2">
                {step.title}
              </h3>
              <p className="text-black-70 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function PortfolioPage() {
  return (
    <main>
      <PortfolioHero />
      <PortfolioManifesto />
      <PortfolioGrid />
      <PortfolioProcess />
      <StatsCounter />
      <CTA />
    </main>
  );
}
