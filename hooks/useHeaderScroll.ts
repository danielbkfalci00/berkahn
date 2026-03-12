"use client";

import { useState, useEffect } from "react";

const SCROLL_THRESHOLD = 50;

export function useHeaderScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > SCROLL_THRESHOLD);
      setIsPastHero(scrollY > window.innerHeight * 0.6);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { isScrolled, isPastHero };
}
