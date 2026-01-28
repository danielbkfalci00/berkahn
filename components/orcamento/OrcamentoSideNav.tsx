"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrcamentoNavigation } from "@/hooks/useOrcamentoNavigation";
import { cn } from "@/lib/utils";

/**
 * OrcamentoSideNav - Design Minimalista Elegante
 *
 * Visual simplificado com apenas dots animados:
 * - Dot pequeno/transparente quando inativo
 * - Dot maior/sólido quando ativo
 * - Animação suave de scale via Framer Motion
 * - Aparece apenas após scroll passar a seção hero
 */
export function OrcamentoSideNav() {
  const { activeId, sections, scrollToSection } = useOrcamentoNavigation();
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar navegação apenas após passar a seção hero
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        // Mostrar quando o hero estiver 80% fora da viewport
        setIsVisible(heroBottom < window.innerHeight * 0.2);
      }
    };

    // Verificar posição inicial
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-4 lg:left-8 xl:left-12 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
          aria-label="Navegação do orçamento"
        >
          {/* Container com fundo para garantir visibilidade */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-5 shadow-lg border border-black/5">
            <div className="flex flex-col gap-3">
              {sections.map((section) => {
                const isActive = activeId === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="group flex items-center gap-3 text-left transition-all duration-200"
                    aria-current={isActive ? "true" : undefined}
                  >
                    {/* Dot animado - único indicador visual */}
                    <motion.div
                      className={cn(
                        "rounded-full flex-shrink-0 transition-colors duration-200",
                        isActive
                          ? "bg-black"
                          : "bg-black/20 group-hover:bg-black/40"
                      )}
                      animate={{
                        width: isActive ? 10 : 6,
                        height: isActive ? 10 : 6,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />

                    {/* Número + Label */}
                    <div
                      className={cn(
                        "flex items-baseline gap-1.5 transition-opacity duration-200",
                        isActive
                          ? "opacity-100"
                          : "opacity-40 group-hover:opacity-70"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] tracking-wider transition-colors duration-200",
                          isActive ? "text-black font-semibold" : "text-black/60"
                        )}
                      >
                        {section.number}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] uppercase tracking-[0.12em] transition-colors duration-200 whitespace-nowrap",
                          isActive
                            ? "text-black font-medium"
                            : "text-black/50 group-hover:text-black/70"
                        )}
                      >
                        {section.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
