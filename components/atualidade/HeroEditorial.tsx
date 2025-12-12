"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { CharReveal } from "@/components/animations/TextReveal";

interface HeroEditorialProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
}

export function HeroEditorial({
  title = "ATUALIDADES",
  subtitle = "Insights & Tendências em Steel Frame",
  imageSrc = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
}: HeroEditorialProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.7]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[70vh] min-h-[500px] max-h-[800px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={imageSrc}
          alt="Atualidades Berkahn"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
      </motion.div>

      {/* Dynamic Overlay */}
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/50 to-black/70"
        style={{ opacity: overlayOpacity }}
      />

      {/* Decorative Lines */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {/* Vertical line left */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-white/20 origin-top"
        />
        {/* Vertical line right */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="absolute right-8 md:right-16 top-0 bottom-0 w-px bg-white/20 origin-top"
        />
        {/* Horizontal line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute left-8 md:left-16 right-8 md:right-16 bottom-24 h-px bg-white/10 origin-left"
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-4xl"
        style={{ y: contentY }}
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/60 text-xs uppercase tracking-[0.3em] mb-6 font-body"
        >
          Blog & Notícias
        </motion.p>

        {/* Title with Character Reveal */}
        <h1 className="headline-lg text-white mb-6">
          <CharReveal text={title} delay={0.4} className="justify-center" />
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-white/80 text-lg md:text-xl font-light tracking-wide"
        >
          {subtitle}
        </motion.p>

        {/* Decorative Element */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="h-px bg-white/40 mx-auto mt-8"
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-[10px] uppercase tracking-[0.2em]">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
