"use client";

import { motion } from "framer-motion";
import { useOrcamentoNavigation } from "@/hooks/useOrcamentoNavigation";
import { cn } from "@/lib/utils";

/**
 * OrcamentoSideNav - Blueprint Style Navigation
 *
 * Design inspirado em plantas arquitetônicas com:
 * - Linha vertical principal (régua)
 * - Marcadores horizontais entre seções (cotas)
 * - Indicador animado que desliza entre seções
 * - Tipografia mono para números, sans para labels
 */
export function OrcamentoSideNav() {
  const { activeId, activeIndex, sections, scrollToSection } =
    useOrcamentoNavigation();

  return (
    <nav
      className="fixed left-4 lg:left-8 xl:left-12 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
      aria-label="Navegação do orçamento"
    >
      {/* Container com fundo para garantir visibilidade */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg px-5 py-5 shadow-lg border border-black/10">
        <div className="relative">
          {/* Linha vertical principal - Régua arquitetônica */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-black/20" />

          {/* Indicador ativo animado */}
          <motion.div
            className="absolute left-0 w-0.5 bg-black rounded-full"
            style={{ height: 24 }}
            animate={{
              top: activeIndex * 36 + 4, // Ajustado para o novo spacing
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />

          {/* Links de navegação */}
          <div className="relative pl-5 space-y-3">
            {sections.map((section, index) => {
              const isActive = activeId === section.id;
              const isPast = index < activeIndex;

              return (
                <div key={section.id} className="relative">
                  {/* Linha horizontal de cota */}
                  <div
                    className={cn(
                      "absolute -left-5 top-1/2 w-3 h-px transition-colors duration-300",
                      isActive ? "bg-black" : isPast ? "bg-black/40" : "bg-black/15"
                    )}
                  />

                  {/* Marcador de nó na linha vertical */}
                  <div
                    className={cn(
                      "absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300",
                      isActive
                        ? "bg-black scale-125"
                        : isPast
                        ? "bg-black/50"
                        : "bg-black/20"
                    )}
                  />

                  {/* Link clicável */}
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "group flex items-baseline gap-2 text-left transition-all duration-300 whitespace-nowrap",
                      isActive
                        ? "opacity-100"
                        : "opacity-50 hover:opacity-80"
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {/* Número mono */}
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-wider transition-colors duration-300",
                        isActive ? "text-black font-semibold" : "text-black/60"
                      )}
                    >
                      {section.number}
                    </span>

                    {/* Label */}
                    <span
                      className={cn(
                        "text-[9px] uppercase tracking-[0.15em] transition-colors duration-300",
                        isActive
                          ? "text-black font-medium"
                          : "text-black/50 group-hover:text-black/70"
                      )}
                    >
                      {section.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Terminações da linha */}
          <div className="absolute left-0 bottom-0 w-2 h-px bg-black/20" />
          <div className="absolute left-0 top-0 w-2 h-px bg-black/20" />
        </div>
      </div>
    </nav>
  );
}
