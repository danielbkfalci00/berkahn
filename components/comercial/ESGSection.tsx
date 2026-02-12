"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { ESGPillar } from "@/lib/comercial-data";

interface ESGSectionProps {
  data: ESGPillar[];
}

export function ESGSection({ data }: ESGSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-0">
      {data.map((pillar, index) => (
        <RevealOnScroll key={pillar.badge} delay={index * 0.15}>
          <div
            className={`${
              index < data.length - 1
                ? "lg:border-r lg:border-white/10 pb-10 lg:pb-0"
                : ""
            } ${index > 0 ? "border-t border-white/10 pt-10 lg:border-t-0 lg:pt-0" : ""} ${
              index > 0 ? "lg:pl-12" : ""
            } ${index < data.length - 1 ? "lg:pr-12" : ""}`}
          >
            {/* Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center w-10 h-10 border border-white/20 text-white font-heading text-lg font-bold">
                {pillar.badge}
              </span>
              <span className="text-xs uppercase tracking-widest text-white/40 font-medium">
                {pillar.badgeLabel}
              </span>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4">
              {pillar.paragraphs.map((paragraph, i) => (
                <p key={i} className="body-md text-white/70 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
