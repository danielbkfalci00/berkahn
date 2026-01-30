"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CharReveal } from "@/components/animations/TextReveal";
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
  return (
    <section
      className="relative min-h-screen flex overflow-hidden bg-black"
    >
      {/* Background Image (static — no parallax for smooth scroll) */}
      <div className="absolute -inset-1 z-0">
        <Image
          src={projeto.imagemRender || "/images/hero/hero-home-2.webp"}
          alt={projeto.titulo}
          fill
          priority
          className="object-cover object-bottom"
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlay - only darkens bottom half for text readability */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)' }} />

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
      <div
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
            src="/images/logo-berkahn-construtora-branco.png"
            alt="Berkahn Construtora de Alto Padrão"
            width={400}
            height={150}
            className="opacity-90 w-[280px] sm:w-[340px] md:w-[400px] h-auto"
          />
        </motion.div>

      </div>

    </section>
  );
}
