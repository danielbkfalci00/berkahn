"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { StatWithContext, TestimonialContext } from "@/types/orcamento";

interface StatsWithContextProps {
  stats: StatWithContext[];
}

/**
 * Stats com contexto narrativo - "Números que Contam Histórias"
 * Count-up animation nos números
 * Suporta contexto textual OU testimonial
 */
export function StatsWithContext({ stats }: StatsWithContextProps) {
  return (
    <div>
      <h3 className="font-serif text-3xl lg:text-4xl text-center text-[#2D2D2D] mb-12">
        Números que Contam Histórias
      </h3>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ stat, index }: { stat: StatWithContext; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [count, setCount] = useState(0);

  // Count-up animation
  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      const endValue = stat.value;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(easeOut * endValue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, stat.value]);

  const isTestimonialContext = typeof stat.context !== "string";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="bg-white p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Animated Number */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-bold text-6xl lg:text-7xl text-[#C77D5C]">
          {count}
        </span>
        <span className="text-3xl font-medium text-[#C77D5C]">
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <h4 className="text-sm font-bold tracking-wider text-[#2D2D2D]/60 mb-4">
        {stat.label}
      </h4>

      {/* Context */}
      {!isTestimonialContext ? (
        <p className="text-base text-[#2D2D2D]/70 leading-relaxed">
          {stat.context as string}
        </p>
      ) : (
        // Testimonial context
        <TestimonialContextCard context={stat.context as TestimonialContext} />
      )}
    </motion.div>
  );
}

function TestimonialContextCard({ context }: { context: TestimonialContext }) {
  return (
    <div className="space-y-3">
      <p className="text-base italic text-[#2D2D2D]/80">"{context.quote}"</p>
      <div className="flex items-center gap-3">
        {context.image && (
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={context.image}
              alt={context.name || ""}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-[#2D2D2D]">{context.name}</p>
          <p className="text-xs text-[#2D2D2D]/60">{context.project}</p>
        </div>
      </div>
    </div>
  );
}
