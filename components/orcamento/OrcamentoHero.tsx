"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CharReveal } from "@/components/animations/TextReveal";
import { Ruler } from "lucide-react";
import type { OrcamentoProjeto } from "@/types/orcamento";
import { OrcamentoWatermark } from "./OrcamentoWatermark";

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
      className="relative min-h-screen flex overflow-hidden"
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

      {/* Watermark */}
      <div className="z-[3]">
        <OrcamentoWatermark variant="dark" logoPosition="center" />
      </div>

      {/* Content with fade on scroll */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center justify-between w-full min-h-screen py-20 sm:py-24 lg:py-28"
      >
        {/* Top spacer */}
        <div className="flex-1" />

        {/* Center content: Title + Info */}
        <div className="flex flex-col items-center">
          {/* Project Title - DESTAQUE PRINCIPAL */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 hero-text-shadow-strong">
              <CharReveal text={`Projeto ${projeto.titulo}`} delay={0.3} className="text-center" />
            </h1>
          </motion.div>

          {/* Project Info - Local e Cliente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col items-center gap-2 mb-6"
          >
            <p className="text-lg sm:text-xl text-white/90">
              <span className="text-white/60">Local:</span> {projeto.localizacao}
            </p>
            {projeto.cliente && (
              <p className="text-lg sm:text-xl text-white/90">
                <span className="text-white/60">Cliente:</span> {projeto.cliente}
              </p>
            )}
          </motion.div>

          {/* Revisão */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="text-base sm:text-lg text-white/80">Revisão 00</span>
          </motion.div>

          {/* Decorative Line with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-6"
          />
        </div>

        {/* Bottom spacer */}
        <div className="flex-1" />

        {/* Berkahn Logo - Fixed at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col items-center"
        >
          <Image
            src="/images/logo-berkahn-construtora.png"
            alt="Berkahn Construtora de Alto Padrão"
            width={400}
            height={150}
            className="brightness-0 invert opacity-90 w-[280px] sm:w-[340px] md:w-[400px] h-auto"
          />
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
