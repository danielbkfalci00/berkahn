"use client";

import { motion } from "motion/react";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CountUp } from "@/components/animations/CountUp";
import {
  COUNTRY_RANKING,
  SPEED_RECORDS,
  SUSTAINABILITY_STATS,
  STRIKING_FACTS,
  SLIDE_SOURCES,
} from "@/lib/global-steel-frame-data";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { Recycle, Droplets, Trash2, Building2, Timer, Info } from "lucide-react";

const sustainabilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  recycle: Recycle,
  droplets: Droplets,
  "trash-2": Trash2,
};

const recordIcons = [Building2, Building2, Timer];

export function SlideGlobalLeaders() {
  const { ref: barsRef, isInView: barsInView } = useInViewAnimation({ margin: "-10% 0px" });
  const { ref: recordsRef, isInView: recordsInView } = useInViewAnimation({ margin: "-10% 0px" });
  const { ref: sustainRef, isInView: sustainInView } = useInViewAnimation({ margin: "-10% 0px" });
  const { ref: factsRef, isInView: factsInView } = useInViewAnimation({ margin: "-10% 0px" });

  const maxValue = Math.max(...COUNTRY_RANKING.map((c) => c.metricValue));

  return (
    <SlideSection dark className="py-16 lg:py-24">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 mb-4">
            Comparativo Global
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Quem Lidera a<br className="hidden sm:block" /> Revolução do Aço
          </h2>
          <p className="text-base sm:text-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Os países mais desenvolvidos já adotaram o steel frame como padrão.
            O Brasil está no início de uma curva de crescimento acelerado.
          </p>
        </RevealOnScroll>

        {/* Methodology note */}
        <RevealOnScroll className="max-w-3xl mx-auto mb-5 flex items-start gap-2.5 text-[11px] text-white/35 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-white/30 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-white/50">Nota metodológica:</strong> as métricas variam por país
            conforme dado disponível (estrutural, total, residencial, comercial, etc.). A tag ao lado
            de cada barra explicita o tipo de medição.
          </p>
        </RevealOnScroll>

        {/* Horizontal Bar Chart */}
        <motion.div
          ref={barsRef}
          variants={containerVariants}
          initial="hidden"
          animate={barsInView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto mb-16 lg:mb-20 space-y-3"
          role="img"
          aria-label="Ranking de adoção de Steel Frame por país"
        >
          {COUNTRY_RANKING.map((country) => {
            const isBrazil = country.id === "br";
            const barWidth = (country.metricValue / maxValue) * 100;

            return (
              <motion.div key={country.id} variants={itemVariants} className="group">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Name + tag */}
                  <div className="w-32 sm:w-44 flex-shrink-0 text-right">
                    <span
                      className={`text-xs sm:text-sm font-medium block ${
                        isBrazil ? "text-emerald-400" : "text-white/70"
                      }`}
                    >
                      {country.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-white/30 block mt-0.5">
                      {country.metricLabel}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-7 sm:h-8 bg-white/[0.04] rounded-sm overflow-hidden">
                    <motion.div
                      className={`h-full rounded-sm ${
                        isBrazil
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                          : "bg-gradient-to-r from-white/10 to-white/25"
                      }`}
                      initial={{ width: 0 }}
                      animate={barsInView ? { width: `${barWidth}%` } : { width: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.19, 1, 0.22, 1],
                        delay: 0.1,
                      }}
                    />
                  </div>

                  {/* Value */}
                  <span
                    className={`text-sm sm:text-base font-bold w-16 text-left flex-shrink-0 tabular-nums ${
                      isBrazil ? "text-emerald-400" : "text-white/80"
                    }`}
                  >
                    {country.metricValue}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Fatos Marcantes */}
        <RevealOnScroll className="mb-5 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Fatos Marcantes
          </p>
        </RevealOnScroll>

        <motion.div
          ref={factsRef}
          variants={containerVariants}
          initial="hidden"
          animate={factsInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto mb-16 lg:mb-20"
        >
          {STRIKING_FACTS.map((fact) => (
            <motion.div
              key={fact.title}
              variants={itemVariants}
              className="p-4 border border-white/8 bg-white/[0.02] rounded-sm hover:bg-white/[0.04] transition-colors"
            >
              <p className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {fact.stat}
              </p>
              <p className="text-[11px] sm:text-xs text-white/70 mt-1.5 font-medium leading-tight">
                {fact.title}
              </p>
              <p className="text-[10px] text-white/40 mt-1 leading-tight">
                {fact.detail}
              </p>
              <p className="text-[9px] text-white/25 mt-2 uppercase tracking-wider">
                {fact.source}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* sr-only table fallback */}
        <div className="sr-only">
          <table>
            <caption>Ranking de adoção de Steel Frame por país</caption>
            <thead>
              <tr><th>País</th><th>Adoção (%)</th><th>Detalhe</th></tr>
            </thead>
            <tbody>
              {COUNTRY_RANKING.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.metricValue}%</td>
                  <td>{c.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Two-column: Records + Sustainability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">

          {/* Speed Records */}
          <div>
            <RevealOnScroll className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Recordes de Velocidade
              </p>
            </RevealOnScroll>

            <motion.div
              ref={recordsRef}
              variants={containerVariants}
              initial="hidden"
              animate={recordsInView ? "visible" : "hidden"}
              className="space-y-4"
            >
              {SPEED_RECORDS.map((record, i) => {
                const Icon = recordIcons[i];
                return (
                  <motion.div
                    key={record.label}
                    variants={itemVariants}
                    className="flex items-center gap-4 p-4 border border-white/8 bg-white/[0.02] rounded-sm"
                  >
                    <Icon className="w-5 h-5 text-white/25 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <CountUp
                          end={record.stat}
                          suffix={record.suffix}
                          className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight"
                        />
                        <span className="text-sm text-white/50">{record.label}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-white/30 mt-0.5">{record.detail}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Sustainability */}
          <div>
            <RevealOnScroll className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Sustentabilidade
              </p>
            </RevealOnScroll>

            <motion.div
              ref={sustainRef}
              variants={containerVariants}
              initial="hidden"
              animate={sustainInView ? "visible" : "hidden"}
              className="space-y-4"
            >
              {SUSTAINABILITY_STATS.map((stat) => {
                const Icon = sustainabilityIcons[stat.icon];
                return (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="flex items-center gap-4 p-4 border border-white/8 bg-white/[0.02] rounded-sm"
                  >
                    {Icon && <Icon className="w-5 h-5 text-white/25 flex-shrink-0" />}
                    <div>
                      <CountUp
                        end={stat.stat}
                        suffix={stat.suffix}
                        className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight"
                      />
                      <p className="text-[10px] sm:text-xs text-white/50 mt-0.5">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Extra: steel recyclability */}
              <motion.p
                variants={itemVariants}
                className="text-xs text-white/30 leading-relaxed pl-9"
              >
                O aço é o material mais reciclado do planeta — 92% de conteúdo reciclado
                na América do Norte, 99% de taxa de recuperação em demolições no Reino Unido.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Decorative Separator */}
        <RevealOnScroll delay={0.4} className="mt-16">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-white/10" />
            <div className="w-2 h-2 bg-white/20 rotate-45" />
            <div className="w-16 h-px bg-white/10" />
          </div>
        </RevealOnScroll>

        {/* Sources footer */}
        <p className="text-[10px] text-white/25 text-center mt-10 max-w-2xl mx-auto leading-relaxed">
          {SLIDE_SOURCES.leaders}
        </p>
      </div>
    </SlideSection>
  );
}
