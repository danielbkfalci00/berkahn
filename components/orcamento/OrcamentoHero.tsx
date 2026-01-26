"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CharReveal } from "@/components/animations/TextReveal";
import { Calendar, Ruler } from "lucide-react";
import type { OrcamentoProjeto } from "@/types/orcamento";

interface OrcamentoHeroProps {
  projeto: OrcamentoProjeto;
  numeroOrcamento: string;
  validoAte: string;
}

export function OrcamentoHero({
  projeto,
  numeroOrcamento,
  validoAte,
}: OrcamentoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Fade out content on scroll
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], ["0%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={projeto.imagemRender || "/images/hero/hero-home-2.webp"}
          alt={projeto.titulo}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient Overlay with Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 z-[1]" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content with fade on scroll */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 text-center max-w-5xl mx-auto px-6"
      >
        {/* Label with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/80">
            Projeto {projeto.titulo}
          </span>
        </motion.div>

        {/* Project Title - DESTAQUE PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 hero-text-shadow-strong">
            <CharReveal text={projeto.titulo} delay={0.3} />
          </h1>
        </motion.div>

        {/* Berkahn - Secondary Branding */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-white/30" />
          <p className="text-lg lg:text-xl font-heading tracking-[0.3em] text-white/80">
            BERKAHN
          </p>
          <div className="h-px w-12 bg-white/30" />
        </motion.div>

        {/* Decorative Line with animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-6"
        />

        {/* Location - Large Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-xl md:text-2xl font-heading tracking-wide text-white/90 mb-6"
        >
          {projeto.localizacao}
        </motion.p>

        {/* Project Details Badge - Metragem Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center justify-center mb-8"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
            <Ruler className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">{projeto.metragem}m²</span>
          </div>
        </motion.div>

        {/* Orçamento Info with glassmorphism card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="inline-flex flex-col sm:flex-row items-center gap-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4"
        >
          <div className="flex items-center gap-2 text-white/60">
            <span className="text-xs uppercase tracking-wider">Revisão</span>
            <span className="text-sm font-medium text-white">01</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Valido ate</span>
            <span className="text-sm font-medium text-white">{validoAte}</span>
          </div>
        </motion.div>

      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/10 z-10 hidden lg:block" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-white/10 z-10 hidden lg:block" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-white/10 z-10 hidden lg:block" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/10 z-10 hidden lg:block" />
    </section>
  );
}
