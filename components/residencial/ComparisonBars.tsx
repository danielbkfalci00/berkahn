"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CountUp } from "@/components/animations/CountUp";
import type { ComparisonBarItem } from "@/lib/residencial-data";

interface ComparisonBarsProps {
  data: ComparisonBarItem[];
}

/* ─── Helper: animated or static value ─── */

function BarValue({
  numeric,
  prefix,
  suffix,
  label,
  className,
  animate,
}: {
  numeric?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  className?: string;
  animate: boolean;
}) {
  if (numeric !== undefined && animate) {
    return (
      <CountUp
        end={numeric}
        prefix={prefix}
        suffix={suffix}
        className={className}
      />
    );
  }
  return <p className={className}>{label}</p>;
}

/* ─── Main component ─── */

export function ComparisonBars({ data }: ComparisonBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px -80px 0px",
  });
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {data.map((item, index) => {
          const cardDelay = prefersReducedMotion ? 0 : index * 0.08;
          const barDelay = prefersReducedMotion ? 0 : index * 0.1;

          return (
            <motion.div
              key={item.category}
              className="bg-white shadow-luxury-md rounded-xl p-5 md:p-8"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.8,
                delay: cardDelay,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              {/* Category title */}
              <p className="font-heading font-semibold text-black mb-4">
                {item.category}
              </p>

              {/* Steel Frame bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs uppercase tracking-wider text-black-50">
                    Steel Frame
                  </span>
                  <BarValue
                    numeric={item.lsfNumeric}
                    prefix={item.numericPrefix}
                    suffix={item.numericSuffix}
                    label={item.lsfValue}
                    className="text-sm font-medium text-black"
                    animate={!prefersReducedMotion}
                  />
                </div>
                <div className="h-2.5 rounded-full bg-black-5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-black"
                    initial={{ width: 0 }}
                    animate={
                      isInView
                        ? { width: `${item.lsfPercent}%` }
                        : { width: 0 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0 : 1.2,
                      delay: barDelay,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                  />
                </div>
              </div>

              {/* Traditional bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs uppercase tracking-wider text-black-50">
                    Tradicional
                  </span>
                  <BarValue
                    numeric={item.traditionalNumeric}
                    prefix={item.numericPrefix}
                    suffix={item.numericSuffix}
                    label={item.traditionalValue}
                    className="text-sm font-medium text-black-70"
                    animate={!prefersReducedMotion}
                  />
                </div>
                <div className="h-2.5 rounded-full bg-black-5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-black-30"
                    initial={{ width: 0 }}
                    animate={
                      isInView
                        ? { width: `${item.traditionalPercent}%` }
                        : { width: 0 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0 : 1.2,
                      delay: barDelay + 0.15,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8 text-sm text-black-50">
        <div className="flex items-center gap-2">
          <span className="w-4 h-2 rounded-full bg-black inline-block" />
          <span>Steel Frame</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-2 rounded-full bg-black-30 inline-block" />
          <span>Construção Tradicional</span>
        </div>
      </div>
    </div>
  );
}
