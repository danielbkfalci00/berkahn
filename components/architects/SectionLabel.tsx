"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface Props {
  id: string;
  kicker: string;
  title: string;
  subtitle?: string;
  variant?: "light" | "dark";
}

export function SectionLabel({
  id,
  kicker,
  title,
  subtitle,
  variant = "light",
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const isDark = variant === "dark";

  return (
    <section
      ref={ref}
      id={id}
      className={`relative w-full px-6 lg:px-12 pt-28 lg:pt-36 pb-12 lg:pb-16 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-[1500px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl"
        >
          <p
            className={`text-[11px] uppercase tracking-[0.4em] mb-6 ${
              isDark ? "text-white/50" : "text-black-50"
            }`}
          >
            {kicker}
          </p>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-light leading-[1.02] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p
              className={`mt-6 text-lg md:text-xl font-light leading-relaxed max-w-xl ${
                isDark ? "text-white/70" : "text-black-70"
              }`}
            >
              {subtitle}
            </p>
          )}
          <div
            className={`mt-10 w-16 h-px ${
              isDark ? "bg-white/30" : "bg-black/20"
            }`}
          />
        </motion.div>
      </div>
    </section>
  );
}
