"use client";

import { useState, useEffect } from "react";

const SCROLL_THRESHOLD = 50;

export function useHeaderScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isPastHeroEnd, setIsPastHeroEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > SCROLL_THRESHOLD);
      setIsPastHero(scrollY > window.innerHeight * 0.6);
      // Fim de um hero full-viewport (100svh) — usado pelo variant overlay do Header
      setIsPastHeroEnd(scrollY > window.innerHeight * 0.92);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    // innerHeight muda quando o chrome do browser mobile colapsa/expande —
    // re-avaliar os thresholds mantém o flip alinhado ao hero de 100svh
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return { isScrolled, isPastHero, isPastHeroEnd };
}
