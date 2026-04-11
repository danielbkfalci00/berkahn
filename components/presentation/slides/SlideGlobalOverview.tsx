"use client";

import { motion } from "motion/react";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CountUp } from "@/components/animations/CountUp";
import { REGIONAL_SHARES, MARKET_SIZE, TOP_COMPANIES, SLIDE_SOURCES } from "@/lib/global-steel-frame-data";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

export function SlideGlobalOverview() {
  const { ref: regionsRef, isInView: regionsInView } = useInViewAnimation({ margin: "-10% 0px" });

  return (
    <SlideSection className="py-16 lg:py-24">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-6 lg:mb-10">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/30 mb-4">
            Panorama Global
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-4">
            Steel Frame no Mundo
          </h2>
          <p className="text-base sm:text-lg text-black/50 font-light max-w-2xl mx-auto leading-relaxed">
            Um mercado de bilhões em expansão acelerada — e o Brasil ainda representa
            apenas uma fração desse potencial.
          </p>
        </RevealOnScroll>

        {/* Hero Market Numbers */}
        <RevealOnScroll delay={0.15} className="mb-16 lg:mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {/* Current */}
            <div className="text-center">
              <div className="flex items-baseline justify-center">
                <span className="text-black/30 text-xl sm:text-2xl font-light mr-1.5">US$</span>
                <CountUp
                  end={MARKET_SIZE.current}
                  decimals={2}
                  className="font-heading text-6xl sm:text-7xl md:text-8xl font-extrabold text-black tracking-tight"
                />
                <span className="text-black/40 text-xl sm:text-2xl font-light ml-1">bi</span>
              </div>
              <p className="text-xs sm:text-sm text-black/40 mt-2 uppercase tracking-wider">
                Mercado Global {MARKET_SIZE.yearCurrent}
              </p>
            </div>

            {/* Arrow */}
            <div className="text-black/15">
              <svg width="48" height="16" viewBox="0 0 48 16" fill="none" className="hidden sm:block">
                <path d="M0 8h44M38 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <svg width="16" height="32" viewBox="0 0 16 32" fill="none" className="sm:hidden">
                <path d="M8 0v28M2 22l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Projected */}
            <div className="text-center">
              <div className="flex items-baseline justify-center">
                <span className="text-black/30 text-lg sm:text-xl font-light mr-1.5">US$</span>
                <CountUp
                  end={MARKET_SIZE.projected}
                  decimals={1}
                  className="font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold text-black/60 tracking-tight"
                />
                <span className="text-black/30 text-lg sm:text-xl font-light ml-1">bi</span>
              </div>
              <p className="text-xs sm:text-sm text-black/40 mt-2 uppercase tracking-wider">
                Projeção {MARKET_SIZE.yearProjected}
              </p>
              <p className="text-xs text-black/30 mt-0.5">
                CAGR {MARKET_SIZE.cagr}% ao ano
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Divider */}
        <div className="w-16 h-px bg-black/10 mx-auto mb-12 lg:mb-16" />

        {/* Regional Share Cards */}
        <RevealOnScroll className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-black/30">
            Participação por Região
          </p>
        </RevealOnScroll>

        <motion.div
          ref={regionsRef}
          variants={containerVariants}
          initial="hidden"
          animate={regionsInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          {REGIONAL_SHARES.map((region) => (
            <motion.div
              key={region.name}
              variants={itemVariants}
              className="relative overflow-hidden rounded-sm border border-black/5 bg-white p-6 sm:p-8 text-center group hover:border-black/15 transition-colors"
            >
              {/* Accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: region.color === "#FFFFFF" ? "#000" : region.color }}
              />

              <CountUp
                end={region.value}
                decimals={region.value % 1 !== 0 ? 1 : 0}
                suffix="%"
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight"
              />
              <p className="text-xs sm:text-sm text-black/50 mt-2 font-medium leading-tight">
                {region.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Context line */}
        <RevealOnScroll delay={0.3} className="mt-10 text-center">
          <p className="text-sm sm:text-base text-black/40 max-w-lg mx-auto leading-relaxed">
            O segmento residencial responde por 44-50% do consumo total.
          </p>
        </RevealOnScroll>

        {/* Top 5 Empresas Globais */}
        <RevealOnScroll delay={0.35} className="mt-16 lg:mt-20">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-black/30 mb-2">
              Top 5 Empresas Globais
            </p>
            <p className="text-sm text-black/40 max-w-md mx-auto">
              Controlam cerca de <strong className="text-black/70">28% do mercado mundial</strong> de LGSF
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {TOP_COMPANIES.map((company) => (
              <div
                key={company.name}
                className="p-4 border border-black/5 bg-white rounded-sm text-center hover:border-black/15 hover:shadow-luxury-sm transition-all"
              >
                <div className="text-2xl mb-2" aria-hidden="true">{company.flag}</div>
                <p className="font-heading text-xs sm:text-sm font-bold text-black leading-tight">
                  {company.name}
                </p>
                <p className="text-[10px] text-black/40 mt-1">{company.country}</p>
                {company.share && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1.5 uppercase tracking-wider">
                    {company.share} share
                  </p>
                )}
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Decorative Separator */}
        <RevealOnScroll delay={0.4} className="mt-16">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-black/10" />
            <div className="w-2 h-2 bg-black/15 rotate-45" />
            <div className="w-16 h-px bg-black/10" />
          </div>
        </RevealOnScroll>

        {/* Sources footer */}
        <p className="text-[10px] text-black/25 text-center mt-10 max-w-2xl mx-auto leading-relaxed">
          {SLIDE_SOURCES.overview}
        </p>
      </div>
    </SlideSection>
  );
}
