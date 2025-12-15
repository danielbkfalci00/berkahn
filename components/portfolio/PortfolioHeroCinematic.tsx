"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { CharReveal, LineReveal } from "@/components/animations/TextReveal";
import { CountUp } from "@/components/animations/CountUp";

interface StatBadge {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatBadge[] = [
  { value: 150, suffix: "+", label: "Projetos" },
  { value: 50, suffix: "mil m²", label: "Construídos" },
  { value: 4, suffix: "", label: "Segmentos" },
];

export function PortfolioHeroCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for background (-0.5x speed)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Fade out content as user scrolls
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] w-full overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 scale-110"
      >
        <Image
          src="https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=2000&q=80"
          alt="Arquitetura moderna Steel Frame"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex flex-col items-start justify-between px-6 pt-32 pb-16"
      >
        {/* Top Content - Label, Title, Subtitle */}
        <div className="hero-content-left">
          {/* Decorative Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="hero-decorative-line w-24 mb-8"
          />

          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="hero-label text-white mb-6 hero-text-shadow"
          >
            Portfólio Berkahn
          </motion.span>

          {/* Main Headline with CharReveal */}
          <h1 className="headline-lg text-white max-w-5xl hero-text-shadow-strong">
            <CharReveal text="CONSTRUÍMOS" delay={0.4} className="justify-start" />
            <br />
            <CharReveal text="HISTÓRIAS" delay={0.8} className="justify-start" />
          </h1>

          {/* Subtitle with LineReveal */}
          <div className="mt-8 max-w-2xl">
            <LineReveal
              lines={[
                "Do sonho residencial ao empreendimento industrial.",
                "Cada estrutura conta uma história única.",
              ]}
              className="text-white body-lg hero-text-shadow"
              lineClassName="text-left"
              delay={1.2}
            />
          </div>
        </div>

        {/* Bottom Stats Badges */}
        <div className="self-start w-full">
          <div className="hero-content-left">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-wrap items-center justify-start gap-4 md:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 1.8 + index * 0.1,
                    duration: 0.6,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="backdrop-blur-sm bg-white/10 rounded-lg px-4 py-3 md:px-6 md:py-4 border border-white/20"
                >
                  <span className="text-white font-heading font-bold text-2xl md:text-3xl block hero-text-shadow-strong">
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2000} />
                  </span>
                  <span className="text-white/80 text-xs md:text-sm uppercase tracking-wider block mt-1 hero-text-shadow">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
