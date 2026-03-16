"use client";

import { useRef } from "react";
import { useInView, UseInViewOptions } from "motion/react";

type MarginType = UseInViewOptions["margin"];

interface UseInViewAnimationOptions {
  once?: boolean;
  margin?: MarginType;
  amount?: number | "some" | "all";
}

/**
 * Hook customizado para animações baseadas em visibilidade
 * Combina useRef + useInView para reduzir boilerplate
 *
 * @param options - Opções de configuração do IntersectionObserver
 * @returns { ref, isInView } - Ref para anexar ao elemento e estado de visibilidade
 *
 * @example
 * const { ref, isInView } = useInViewAnimation({ margin: "-20% 0px" });
 *
 * <motion.div
 *   ref={ref}
 *   initial="hidden"
 *   animate={isInView ? "visible" : "hidden"}
 * />
 */
export function useInViewAnimation(options: UseInViewAnimationOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: options.margin,
    amount: options.amount ?? 0.3,
  });

  return { ref, isInView };
}
