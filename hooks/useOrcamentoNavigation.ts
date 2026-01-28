"use client";

import { useState, useEffect, useCallback } from "react";

export interface OrcamentoSection {
  id: string;
  label: string;
  number: string;
}

export const ORCAMENTO_SECTIONS: OrcamentoSection[] = [
  { id: "hero", label: "INTRO", number: "01" },
  { id: "premissas", label: "PREMISSAS", number: "02" },
  { id: "investimento", label: "INVESTIMENTO", number: "03" },
  { id: "pagamento", label: "PAGAMENTO", number: "04" },
  { id: "plano", label: "PLANO", number: "05" },
  { id: "contato", label: "CONTATO", number: "06" },
];

interface UseOrcamentoNavigationReturn {
  activeId: string;
  activeIndex: number;
  sections: OrcamentoSection[];
  scrollToSection: (id: string) => void;
}

export function useOrcamentoNavigation(): UseOrcamentoNavigationReturn {
  const [activeId, setActiveId] = useState<string>("hero");

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

  return {
    activeId,
    activeIndex: activeIndex >= 0 ? activeIndex : 0,
    sections: ORCAMENTO_SECTIONS,
    scrollToSection,
  };
}
