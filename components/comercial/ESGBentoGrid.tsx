"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CountUp } from "@/components/animations/CountUp";
import {
  Recycle,
  Droplets,
  Award,
  ShieldCheck,
  QrCode,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ESGMetric {
  icon: LucideIcon;
  value: string;
  label: string;
  pillar: "E" | "S" | "G";
  numericValue?: number;
  suffix?: string;
  prefix?: string;
}

const ESG_METRICS: ESGMetric[] = [
  {
    icon: Recycle,
    value: "100%",
    label: "Aço reciclável, reprocessável infinitamente sem perda de qualidade",
    pillar: "E",
    numericValue: 100,
    suffix: "%",
  },
  {
    icon: Droplets,
    value: ">99%",
    label: "Menos água que construção convencional — consumo apenas na fundação",
    pillar: "E",
    numericValue: 99,
    suffix: "%",
    prefix: ">",
  },
  {
    icon: Award,
    value: "LEED · BREEAM · AQUA",
    label: "Aderência nativa às principais certificações internacionais de sustentabilidade",
    pillar: "E",
  },
  {
    icon: ShieldCheck,
    value: "Zero entulho",
    label: "Canteiro limpo, silencioso e seguro para trabalhadores e vizinhança",
    pillar: "S",
  },
  {
    icon: QrCode,
    value: "100%",
    label: "Rastreabilidade total: cada peça documentada, cada etapa mensurável",
    pillar: "G",
    numericValue: 100,
    suffix: "%",
  },
  {
    icon: Zap,
    value: "40%",
    label: "Redução no consumo de climatização durante toda a vida útil do imóvel",
    pillar: "E",
    numericValue: 40,
    suffix: "%",
  },
];

const pillarColors: Record<string, string> = {
  E: "border-emerald-500/30",
  S: "border-blue-500/30",
  G: "border-amber-500/30",
};

const pillarBadgeColors: Record<string, string> = {
  E: "bg-emerald-500/10 text-emerald-400",
  S: "bg-blue-500/10 text-blue-400",
  G: "bg-amber-500/10 text-amber-400",
};

export function ESGBentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ESG_METRICS.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <RevealOnScroll
            key={metric.label}
            delay={index * 0.08}
          >
            <div
              className={cn(
                "relative border border-white/10 p-6 sm:p-8 transition-all duration-500 hover:border-white/20 group h-full",
                pillarColors[metric.pillar]
              )}
            >
              {/* Pillar badge */}
              <span
                className={cn(
                  "absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5",
                  pillarBadgeColors[metric.pillar]
                )}
              >
                {metric.pillar === "E"
                  ? "Environmental"
                  : metric.pillar === "S"
                    ? "Social"
                    : "Governance"}
              </span>

              {/* Icon */}
              <div className="mb-5">
                <Icon
                  className="w-6 h-6 text-white/40 group-hover:text-white/70 transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>

              {/* Big value */}
              {metric.numericValue ? (
                <CountUp
                  end={metric.numericValue}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight block"
                  duration={2000}
                />
              ) : (
                <p className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
                  {metric.value}
                </p>
              )}

              {/* Label */}
              <p className="text-sm text-white/50 leading-relaxed">
                {metric.label}
              </p>
            </div>
          </RevealOnScroll>
        );
      })}
    </div>
  );
}
