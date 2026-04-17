"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowDown } from "lucide-react";

interface Props {
  eyebrow: string;
  body: string;
  variant?: "light" | "dark";
}

export function NarrativeDivider({
  eyebrow,
  body,
  variant = "dark",
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  const isDark = variant === "dark";

  return (
    <section
      ref={ref}
      className={`relative w-full px-6 lg:px-12 py-32 lg:py-44 overflow-hidden ${
        isDark ? "bg-black text-white" : "bg-off-white text-black"
      }`}
    >
      {/* Subtle texture / vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)"
            : "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(244,242,236,0.6) 100%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className={`text-[11px] uppercase tracking-[0.4em] mb-10 ${
            isDark ? "text-white/50" : "text-black-50"
          }`}
        >
          {eyebrow}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
          className="font-heading text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] tracking-tight"
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mt-14 inline-flex flex-col items-center gap-3"
        >
          <ArrowDown
            className={`w-4 h-4 ${isDark ? "text-white/40" : "text-black/40"}`}
          />
          <div
            className={`w-px h-12 bg-gradient-to-b to-transparent ${
              isDark ? "from-white/40" : "from-black/30"
            }`}
          />
        </motion.div>
      </div>
    </section>
  );
}
