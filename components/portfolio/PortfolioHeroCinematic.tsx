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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
      >
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="label-text text-white/70 mb-6"
        >
          Portfólio Berkahn
        </motion.span>

        {/* Main Headline with CharReveal */}
        <h1 className="headline-lg text-white max-w-5xl">
          <CharReveal text="CONSTRUÍMOS" delay={0.4} />
          <br />
          <CharReveal text="HISTÓRIAS" delay={0.8} />
        </h1>

        {/* Subtitle with LineReveal */}
        <div className="mt-8 max-w-2xl">
          <LineReveal
            lines={[
              "Do sonho residencial ao empreendimento industrial.",
              "Cada estrutura conta uma história única.",
            ]}
            className="text-white/80 body-lg"
            lineClassName="text-center"
            delay={1.2}
          />
        </div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute bottom-24 left-6 md:left-12 lg:left-20 flex flex-col gap-4 md:flex-row md:gap-8"
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
              className="flex items-baseline gap-2"
            >
              <span className="text-white font-heading font-bold text-3xl md:text-4xl">
                <CountUp end={stat.value} suffix={stat.suffix} duration={2000} />
              </span>
              <span className="text-white/60 text-sm uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-2 bg-white/70 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
