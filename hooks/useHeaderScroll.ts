"use client";

import { useState, useEffect } from "react";

const SCROLL_THRESHOLD = 50;

type UseHeaderScrollOptions = {
  /**
   * Fim do hero em múltiplos da altura do viewport — usado pelo variant
   * overlay do Header. 0.92 = hero de 100svh; a home pinada usa ~1.55
   * (runway de 260vh menos o viewport preso).
   */
  heroEndFactor?: number;
};

export function useHeaderScroll({ heroEndFactor = 0.92 }: UseHeaderScrollOptions = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isPastHeroEnd, setIsPastHeroEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > SCROLL_THRESHOLD);
      setIsPastHero(scrollY > window.innerHeight * 0.6);
      setIsPastHeroEnd(scrollY > window.innerHeight * heroEndFactor);
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
  }, [heroEndFactor]);

  return { isScrolled, isPastHero, isPastHeroEnd };
}
