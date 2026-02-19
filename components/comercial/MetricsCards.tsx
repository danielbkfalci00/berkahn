"use client";

import Image from "next/image";
import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { MetricCard } from "@/lib/comercial-data";

interface MetricsCardsProps {
  data: MetricCard[];
}

export function MetricsCards({ data }: MetricsCardsProps) {
  return (
    <div className="container py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((metric, index) => {
          const isLast = index === data.length - 1;
          const isFirstRow = index < 2;

          return (
            <RevealOnScroll key={metric.label} delay={index * 0.1}>
              <div
                className={[
                  "group flex flex-col px-6 lg:px-8 py-8",
                  // Mobile: border-b on all except last
                  !isLast && "border-b border-white/10 sm:border-b-0",
                  // Tablet (2-col): border-b on first row, border-r on odd index
                  isFirstRow && "sm:border-b sm:border-white/10 lg:border-b-0",
                  index % 2 === 0 && !isLast && "sm:border-r sm:border-white/10",
                  // Desktop (4-col): border-r on all except last
                  !isLast && "lg:border-r lg:border-white/10",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Thumbnail image */}
                {metric.image && (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-5">
                    <Image
                      src={metric.image}
                      alt={metric.imageAlt || ""}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                )}

                {/* Big number */}
                {metric.isText ? (
                  <p className="font-heading text-2xl xl:text-3xl font-bold text-white mb-4 tracking-tighter leading-none">
                    {metric.textValue}
                  </p>
                ) : (
                  <CountUp
                    end={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    className="font-heading text-4xl xl:text-5xl font-bold text-white mb-4 tracking-tighter leading-none block"
                    duration={2000}
                  />
                )}

                {/* Decorative line */}
                <div className="w-8 h-px bg-white/20 mb-4" />

                {/* Label */}
                <p className="text-xs font-medium text-white/70 mb-2 uppercase tracking-wider">
                  {metric.label}
                </p>

                {/* Description */}
                <p className="text-sm text-white/40 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}
