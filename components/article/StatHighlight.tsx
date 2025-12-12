"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CountUp } from "@/components/animations/CountUp";

interface StatHighlightProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  variant?: "inline" | "block" | "large";
  className?: string;
}

export function StatHighlight({
  value,
  suffix = "",
  prefix = "",
  label,
  description,
  variant = "block",
  className = "",
}: StatHighlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-baseline gap-1 ${className}`}>
        <span className="font-heading font-semibold text-black">
          {prefix}
          <CountUp end={value} className="inline" />
          {suffix}
        </span>
        <span className="text-black-70">{label}</span>
      </span>
    );
  }

  if (variant === "large") {
    return (
      <motion.div
        ref={ref}
        className={`py-16 px-8 bg-black text-white text-center rounded-lg ${className}`}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-heading text-6xl md:text-7xl lg:text-8xl font-light tracking-tight">
            {prefix}
          </span>
          <CountUp
            end={value}
            className="font-heading text-6xl md:text-7xl lg:text-8xl font-light tracking-tight"
          />
          <span className="font-heading text-4xl md:text-5xl lg:text-6xl font-light">
            {suffix}
          </span>
        </div>
        <p className="mt-4 text-xl md:text-2xl font-heading text-white/90">
          {label}
        </p>
        {description && (
          <p className="mt-2 text-sm text-white/60">
            {description}
          </p>
        )}
      </motion.div>
    );
  }

  // Default block variant
  return (
    <motion.div
      ref={ref}
      className={`p-6 bg-black-5 rounded-lg border border-black-10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="flex items-baseline gap-1">
        <span className="font-heading text-3xl md:text-4xl font-semibold text-black">
          {prefix}
        </span>
        <CountUp
          end={value}
          className="font-heading text-3xl md:text-4xl font-semibold text-black"
        />
        <span className="font-heading text-2xl md:text-3xl font-semibold text-black">
          {suffix}
        </span>
      </div>
      <p className="mt-2 font-medium text-black">{label}</p>
      {description && (
        <p className="mt-1 text-sm text-black-60">{description}</p>
      )}
    </motion.div>
  );
}

// Grid of stats
interface StatsGridProps {
  stats: Array<{
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description?: string;
  }>;
  className?: string;
}

export function StatsGrid({ stats, className = "" }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.19, 1, 0.22, 1]
          }}
        >
          <StatHighlight {...stat} />
        </motion.div>
      ))}
    </div>
  );
}
