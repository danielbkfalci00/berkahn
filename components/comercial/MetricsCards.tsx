"use client";

import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { MetricCard } from "@/lib/comercial-data";

interface MetricsCardsProps {
  data: MetricCard[];
}

export function MetricsCards({ data }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((metric, index) => (
        <RevealOnScroll key={metric.label} delay={index * 0.1}>
          <div className="border border-white/10 p-8 hover:border-white/20 transition-colors duration-300">
            {/* Big Number or Text */}
            {metric.isText ? (
              <p className="font-heading text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                {metric.textValue}
              </p>
            ) : (
              <CountUp
                end={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                className="font-heading text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
                duration={2000}
              />
            )}

            {/* Label */}
            <p className="text-sm font-medium text-white/90 mb-3">
              {metric.label}
            </p>

            {/* Description */}
            <p className="body-sm text-white/50 leading-relaxed">
              {metric.description}
            </p>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
