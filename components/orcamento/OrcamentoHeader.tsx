"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOrcamentoNavigation } from "@/hooks/useOrcamentoNavigation";
import type { OrcamentoProjeto } from "@/types/orcamento";

interface OrcamentoHeaderProps {
  projeto: OrcamentoProjeto;
}

/**
 * OrcamentoHeader - Header com Indicador de Seção Dinâmico
 *
 * - Oculto na seção hero
 * - Aparece após scroll com animação fade-in
 * - Exibe nome da seção atual nos dois lados
 * - Animação suave na troca de seção
 */
export function OrcamentoHeader({ projeto }: OrcamentoHeaderProps) {
  const { activeSection } = useOrcamentoNavigation();
  const [isVisible, setIsVisible] = useState(false);

  // Show header only after scrolling past the hero section
  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.9;
      setIsVisible(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md"
        >
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Left: Section indicator */}
              <div className="flex-1 flex items-center justify-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <span className="font-mono text-[10px] sm:text-xs text-black/60">
                      {activeSection.number}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-black/60 font-medium">
                      {activeSection.label}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Center: Clickable Title */}
              <button
                onClick={scrollToTop}
                className="flex-shrink-0 px-4 cursor-pointer group transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded"
                aria-label="Voltar para o topo do orçamento"
              >
                <h1 className="text-sm sm:text-base font-semibold tracking-tight text-black">
                  Berkahn & {projeto.titulo}
                </h1>
              </button>

              {/* Right: Section indicator (mirror) */}
              <div className="flex-1 flex items-center justify-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-black/60 font-medium">
                      {activeSection.label}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs text-black/60">
                      {activeSection.number}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
