"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SlideSection } from "../ui/SlideSection";
import { FounderCard } from "../ui/FounderCard";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const founders = [
  {
    name: "Daniel Falci",
    role: "Co-Fundador",
    bio: "Engenheiro civil com sólida experiência em planejamento, gerenciamento e execução de obras. Atuou em projetos residenciais, comerciais e logísticos de alto padrão em São Paulo.",
    image: "/images/founders/daniel-falci.webp",
    linkedin: "https://www.linkedin.com/in/danielbkfalci/",
  },
  {
    name: "Matheus Bertevello",
    role: "Co-Fundador",
    bio: "Engenheiro de Produção pela FEI com mais de 7 anos de experiência em melhoria de processos. Especialista em Lean Construction e melhorias em obras civis.",
    image: "/images/founders/matheus-bertevello.webp",
    linkedin: "https://www.linkedin.com/in/matheus-bertevello/",
  },
  {
    name: "Gabriel Vidal",
    role: "Co-Fundador",
    bio: "Engenheiro civil formado pelo UniCEUB, MBA em gerenciamento de projetos (IBMEC) e de empreendimentos na construção civil (Mackenzie). Especialista em orçamentos e viabilidades.",
    image: "/images/founders/gabriel-vidal.webp",
    linkedin: undefined,
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

export function SlideFounders() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <SlideSection className="py-20 lg:py-32">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-12 lg:mb-20">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/50 mb-4">
            Nossos Fundadores
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Experiência que<br className="hidden sm:block" /> Constrói Confiança
          </h2>
        </RevealOnScroll>

        {/* Founders Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12"
        >
          {founders.map((founder) => (
            <FounderCard
              key={founder.name}
              name={founder.name}
              role={founder.role}
              bio={founder.bio}
              image={founder.image}
              linkedin={founder.linkedin}
            />
          ))}
        </motion.div>
      </div>
    </SlideSection>
  );
}
