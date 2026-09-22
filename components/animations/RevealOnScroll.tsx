"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Surge subindo 40px quando entra na tela, uma vez só.
 *
 * Mesmo comportamento da versão anterior, mas com IntersectionObserver e
 * transição CSS em vez do framer-motion. Este componente aparece em ~260
 * pontos do site, inclusive nas páginas legais, e era o que colocava os
 * 134 KB do framer-motion em todas as páginas por causa de um fade.
 *
 * Movimento reduzido: aparece direto, pelas classes motion-reduce.
 */
export function RevealOnScroll({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:!transition-none ${className ?? ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translateY(40px)",
        transition: `opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s, transform 0.8s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
