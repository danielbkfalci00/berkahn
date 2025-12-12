"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import { ProjectCategory, SEGMENTS } from "@/types/project";
import { ProjectCardPremium } from "@/components/project/ProjectCardPremium";
import { CategoryFilterMinimal } from "@/components/portfolio/CategoryFilter";
import { PortfolioHeroCinematic } from "@/components/portfolio/PortfolioHeroCinematic";
import { SegmentShowcase } from "@/components/portfolio/SegmentShowcase";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { CTA } from "@/components/sections/CTA";
import { LineReveal } from "@/components/animations/TextReveal";

// Manifesto/Statement Section
function PortfolioManifesto() {
  return (
    <section className="py-3xl bg-white">
      <div className="container max-w-5xl">
        <div className="text-center">
          <LineReveal
            lines={[
              "Construir é mais do que erguer paredes.",
              "É materializar sonhos com precisão,",
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

// Projects Grid Section with scroll anchor
function PortfolioGrid({ scrollToRef }: { scrollToRef: React.RefObject<HTMLDivElement> }) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">(
    "all"
  );

  const filteredProjects =
    activeCategory === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  // Get count for each category
  const getCategoryCount = (category: ProjectCategory | "all") => {
    if (category === "all") return PROJECTS.length;
    return PROJECTS.filter((p) => p.category === category).length;
  };

  return (
    <section className="py-2xl bg-black-5 scroll-mt-20 relative">
      {/* Scroll anchor */}
      <div ref={scrollToRef} className="absolute top-0" />
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-12"
        >
          <p className="label-text text-black-50 mb-4">TODOS OS PROJETOS</p>
          <h2 className="headline-md mb-6">Explore Nosso Portfolio</h2>
          <p className="body-lg text-black-70 max-w-2xl mx-auto">
            Projetos exclusivos em Light Steel Frame para residencias,
            comercios, industrias e corporacoes.
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

          {/* Project count indicator */}
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-black-50 text-sm mt-4"
          >
            {getCategoryCount(activeCategory)} projeto{getCategoryCount(activeCategory) !== 1 ? 's' : ''} encontrado{getCategoryCount(activeCategory) !== 1 ? 's' : ''}
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCardPremium
                key={project.id}
                project={project}
                index={index}
                variant="default"
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
            Nao encontrou o que procura? Fale conosco para um projeto personalizado
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
      title: "Projeto",
      description: "Consultoria e planejamento personalizado para suas necessidades",
    },
    {
      number: "02",
      title: "Fabricacao",
      description: "Perfis cortados com precisao em nossa unidade industrial",
    },
    {
      number: "03",
      title: "Montagem",
      description: "Estrutura levantada em tempo recorde no seu terreno",
    },
    {
      number: "04",
      title: "Entrega",
      description: "Obra finalizada e pronta para uso",
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
          <p className="label-text text-black-50 mb-4">COMO FUNCIONA</p>
          <h2 className="headline-md">Do projeto a realidade</h2>
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
  const gridRef = useRef<HTMLDivElement>(null);

  const handleSegmentClick = (segmentId: string) => {
    // Scroll to grid section
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main>
      {/* 1. Hero Cinematico com Parallax */}
      <PortfolioHeroCinematic />

      {/* 2. Manifesto */}
      <PortfolioManifesto />

      {/* 3. Showcase dos 4 Segmentos */}
      <SegmentShowcase onSegmentClick={handleSegmentClick} />

      {/* 4. Grid de Projetos com Filtro */}
      <PortfolioGrid scrollToRef={gridRef} />

      {/* 5. Processo Construtivo */}
      <PortfolioProcess />

      {/* 6. Stats Counter */}
      <StatsCounter />

      {/* 7. CTA Final */}
      <CTA />
    </main>
  );
}
