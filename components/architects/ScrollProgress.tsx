"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

interface Props {
  /** Cor da barra (default branco). Use cor escura em fundos claros. */
  color?: string;
}

export function ScrollProgress({ color = "rgba(255,255,255,0.7)" }: Props) {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        backgroundColor: color,
      }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none"
      aria-hidden
    />
  );
}
