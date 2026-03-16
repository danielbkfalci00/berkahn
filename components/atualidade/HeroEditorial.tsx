"use client";

import { motion, useScroll, useTransform } from "motion/react";
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
      className="relative h-[70vh] min-h-[500px] max-h-[800px] flex items-start justify-start pt-24 md:pt-32 overflow-hidden"
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

      {/* Gradient Overlay Dinâmico para legibilidade - top vignette */}
      <motion.div
        className="absolute inset-0 z-5 hero-overlay-top"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />

      {/* Decorative Lines - Left Side */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {/* Vertical line left */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-white/30 origin-top"
        />
        {/* Horizontal line left */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute left-8 md:left-16 top-24 md:top-32 w-24 h-px bg-white/40 origin-left"
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 text-left"
        style={{ y: contentY }}
      >
        <div className="hero-content-left">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-label text-white mb-6 hero-text-shadow"
          >
            Blog & Notícias
          </motion.p>

          {/* Title with Character Reveal */}
          <h1 className="headline-lg text-white mb-6 hero-text-shadow-strong">
            <CharReveal text={title} delay={0.4} className="justify-start" />
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-white text-lg md:text-xl font-light tracking-wide max-w-2xl hero-text-shadow"
          >
            {subtitle}
          </motion.p>

          {/* Decorative Element */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="h-px bg-white/40 mt-8"
          />
        </div>
      </motion.div>
    </section>
  );
}
