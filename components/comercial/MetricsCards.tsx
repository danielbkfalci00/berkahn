"use client";

import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { MetricCard } from "@/lib/comercial-data";

interface MetricsCardsProps {
  data: MetricCard[];
}

export function MetricsCards({ data }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
      {data.map((metric, index) => (
        <RevealOnScroll key={metric.label} delay={index * 0.1}>
          <div className="bg-black p-6 sm:p-8 lg:p-10 h-full flex flex-col">
            {/* Big Number or Text */}
            {metric.isText ? (
              <p className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tighter leading-none">
                {metric.textValue}
              </p>
            ) : (
              <CountUp
                end={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tighter leading-none block"
                duration={2000}
              />
            )}

            {/* Decorative line */}
            <div className="w-8 h-px bg-white/20 mb-4" />

            {/* Label */}
            <p className="text-xs sm:text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">
              {metric.label}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-white/40 leading-relaxed mt-auto">
              {metric.description}
            </p>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
