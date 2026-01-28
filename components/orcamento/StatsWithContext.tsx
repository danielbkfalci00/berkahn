"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { StatWithContext } from "@/types/orcamento";

interface StatsWithContextProps {
  stats: StatWithContext[];
}

/**
 * Stats simplificado - "20 Anos de Aprendizado Combinados"
 * Big number heroico centralizado com count-up animation
 * Paleta monocromática (sem laranja)
 */
export function StatsWithContext({ stats }: StatsWithContextProps) {
  const stat = stats[0]; // Apenas primeiro stat
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView && stat) {
      const duration = 2000;
      const startTime = Date.now();
      const endValue = stat.value;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(easeOut * endValue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, stat]);

  if (!stat) return null;

  return (
    <div ref={ref} className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="inline-block"
      >
        <span className="font-bold text-8xl lg:text-9xl text-black">
          {count}
        </span>
        <p className="text-xl font-mono uppercase tracking-widest text-[#2D2D2D]/70 mt-4">
          {stat.label}
        </p>
        {typeof stat.context === "string" && (
          <p className="text-lg text-[#2D2D2D]/60 mt-2 max-w-md mx-auto">
            {stat.context}
          </p>
        )}
      </motion.div>
    </div>
  );
}
