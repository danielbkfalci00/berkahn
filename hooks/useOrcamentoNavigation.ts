"use client";

import { useState, useEffect, useCallback } from "react";

export interface OrcamentoSection {
  id: string;
  label: string;
  number: string;
}

export const ORCAMENTO_SECTIONS: OrcamentoSection[] = [
  { id: "sobre", label: "SOBRE", number: "01" },
  { id: "lsf", label: "STEEL FRAME", number: "02" },
  { id: "premissas", label: "PROJETO", number: "03" },
  { id: "investimento", label: "INVESTIMENTO", number: "04" },
  { id: "pagamento", label: "PAGAMENTO", number: "05" },
  { id: "plano", label: "GESTÃO", number: "06" },
  { id: "contato", label: "CONTATO", number: "07" },
];

interface UseOrcamentoNavigationReturn {
  activeId: string;
  activeIndex: number;
  activeSection: OrcamentoSection;
  sections: OrcamentoSection[];
  scrollToSection: (id: string) => void;
}

export function useOrcamentoNavigation(): UseOrcamentoNavigationReturn {
  const [activeId, setActiveId] = useState<string>("sobre");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ORCAMENTO_SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(section.id);
            }
          });
        },
        {
          root: null,
          // Trigger when section is 40% into viewport from top
          rootMargin: "-40% 0px -40% 0px",
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const activeIndex = ORCAMENTO_SECTIONS.findIndex((s) => s.id === activeId);

  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return {
    activeId,
    activeIndex: safeIndex,
    activeSection: ORCAMENTO_SECTIONS[safeIndex],
    sections: ORCAMENTO_SECTIONS,
    scrollToSection,
  };
}
