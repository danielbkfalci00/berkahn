"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { MetricCard } from "@/lib/comercial-data";

/* ─── Config ─── */

const STACK_TOP_BASE = 100; // px — first card sticky top (clears navbar)
const STACK_OFFSET = 35; // px — vertical offset between stacked cards
const SCALE_DECREMENT = 0.03; // scale reduction per depth level

/* ─── Main Component ─── */

interface MetricsCardsProps {
  data: MetricCard[];
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="container">
        <MobileFallback data={data} />
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Scroll Stack */}
      <div className="hidden lg:block">
        <ScrollStackDesktop data={data} />
      </div>

      {/* Mobile: Simple stacked cards */}
      <div className="lg:hidden container">
        <MobileFallback data={data} />
      </div>
    </>
  );
}

/* ─── Desktop: Scroll Stack ─── */

function ScrollStackDesktop({ data }: { data: MetricCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${data.length * 100}vh` }}
      className="relative"
    >
      {data.map((metric, index) => (
        <StickyMetricCard
          key={metric.label}
          metric={metric}
          index={index}
          total={data.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

/* ─── Sticky Metric Card ─── */

function StickyMetricCard({
  metric,
  index,
  total,
  scrollYProgress,
}: {
  metric: MetricCard;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segmentSize = 1 / total;
  const scaleStart = (index + 1) * segmentSize;
  const isLastCard = index === total - 1;

  // Cards scale down as subsequent cards arrive on top
  const targetScale = isLastCard ? 1 : 1 - (total - 1 - index) * SCALE_DECREMENT;
  const scale = useTransform(
    scrollYProgress,
    isLastCard
      ? [0, 1]
      : [scaleStart - segmentSize * 0.3, scaleStart + segmentSize * 0.3],
    isLastCard ? [1, 1] : [1, targetScale]
  );

  // Slight brightness reduction for stacked cards (depth cue)
  const filter = useTransform(
    scrollYProgress,
    isLastCard
      ? [0, 1]
      : [scaleStart - segmentSize * 0.3, scaleStart + segmentSize * 0.5],
    isLastCard ? ["brightness(1)", "brightness(1)"] : ["brightness(1)", "brightness(0.7)"]
  );

  const stickyTop = STACK_TOP_BASE + index * STACK_OFFSET;

  return (
    <motion.div
      className="sticky container"
      style={{
        top: `${stickyTop}px`,
        scale,
        filter,
        zIndex: index + 1,
        transformOrigin: "top center",
      }}
    >
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden h-[420px] grid grid-cols-5 gap-0">
        {/* Left: Metric content (3 cols) */}
        <div className="col-span-3 flex flex-col justify-center p-10 xl:p-14">
          {/* Card counter */}
          <p className="label-text text-white/30 mb-6">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>

          {/* Big Number or Text */}
          {metric.isText ? (
            <p className="font-heading text-5xl xl:text-7xl font-bold text-white mb-4 tracking-tighter leading-none">
              {metric.textValue}
            </p>
          ) : (
            <CountUp
              end={metric.value}
              prefix={metric.prefix}
              suffix={metric.suffix}
              className="font-heading text-5xl xl:text-7xl font-bold text-white mb-4 tracking-tighter leading-none block"
              duration={2000}
            />
          )}

          {/* Decorative line */}
          <div className="w-10 h-px bg-white/20 mb-4" />

          {/* Label */}
          <p className="text-sm font-medium text-white/80 mb-3 uppercase tracking-wider">
            {metric.label}
          </p>

          {/* Description */}
          <p className="text-sm text-white/40 leading-relaxed max-w-md">
            {metric.description}
          </p>
        </div>

        {/* Right: Image (2 cols) */}
        <div className="col-span-2 relative">
          {metric.image ? (
            <>
              <Image
                src={metric.image}
                alt={metric.imageAlt || metric.label}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 512px, 100vw"
              />
              {/* Gradient overlay blending image into dark card */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="h-full bg-white/5" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Mobile Fallback ─── */

function MobileFallback({ data }: { data: MetricCard[] }) {
  return (
    <div className="space-y-6">
      {data.map((metric, index) => (
        <RevealOnScroll key={metric.label} delay={index * 0.1}>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
            {/* Image */}
            {metric.image && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={metric.image}
                  alt={metric.imageAlt || metric.label}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Big Number or Text */}
              {metric.isText ? (
                <p className="font-heading text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tighter leading-none">
                  {metric.textValue}
                </p>
              ) : (
                <CountUp
                  end={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  className="font-heading text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tighter leading-none block"
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
              <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
                {metric.description}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
