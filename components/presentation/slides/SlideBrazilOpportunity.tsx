"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CountUp } from "@/components/animations/CountUp";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import {
  BRAZIL_MARKET_GROWTH,
  BRAZIL_FACTS,
  BRAZIL_COMPANIES,
  MCKINSEY_INSIGHT,
  SLIDE_SOURCES,
} from "@/lib/global-steel-frame-data";
import { Landmark, TrendingUp } from "lucide-react";

// Recharts carregado client-only
const BrazilGrowthChart = dynamic(
  () => import("@/components/presentation/charts/BrazilGrowthChart"),
  { ssr: false }
);

export function SlideBrazilOpportunity() {
  const { ref: statsRef, isInView: statsInView } = useInViewAnimation({ margin: "-10% 0px" });
  const { ref: chartRef, isInView: chartInView } = useInViewAnimation({ margin: "-10% 0px" });
  const { ref: compareRef, isInView: compareInView } = useInViewAnimation({ margin: "-10% 0px" });
  const { ref: factsRef, isInView: factsInView } = useInViewAnimation({ margin: "-10% 0px" });
  const { ref: companiesRef, isInView: companiesInView } = useInViewAnimation({ margin: "-10% 0px" });

  return (
    <SlideSection className="py-16 lg:py-24">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-8 lg:mb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/30 mb-4">
            A Oportunidade
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6">
            O Brasil Diante de Uma<br className="hidden sm:block" /> Transformação Inevitável
          </h2>
        </RevealOnScroll>

        {/* Hero Stat: 88.2% */}
        <RevealOnScroll delay={0.1} className="text-center mb-12 lg:mb-16">
          <CountUp
            end={88.2}
            decimals={1}
            suffix="%"
            className="font-heading text-7xl sm:text-8xl md:text-9xl font-extrabold text-black tracking-tight"
          />
          <p className="text-base sm:text-lg text-black/50 font-light mt-2 max-w-md mx-auto">
            das casas brasileiras ainda são construídas em alvenaria tradicional.
          </p>
          <p className="text-sm text-black/30 mt-1">
            Enquanto isso, o Steel Frame representa apenas 2,2% do mercado global.
          </p>
        </RevealOnScroll>

        {/* Divider */}
        <div className="w-16 h-px bg-black/10 mx-auto mb-12 lg:mb-16" />

        {/* Two-column: Key Stats + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16 lg:mb-20">

          {/* Left: Key Indicators */}
          <div>
            <RevealOnScroll className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                Indicadores-Chave
              </p>
            </RevealOnScroll>

            <motion.div
              ref={statsRef}
              variants={containerVariants}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: 5.97, suffix: "M", label: "Déficit habitacional", decimals: 2 },
                { value: 54, suffix: "%", label: "Capacidade ociosa da indústria", decimals: 0 },
                { value: 70, suffix: "%", label: "Obras com métodos artesanais", decimals: 0 },
                { value: 27.7, suffix: "%", label: "Crescimento LSF em 2023", decimals: 1, highlight: true },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className={`p-5 rounded-sm text-center border ${
                    stat.highlight
                      ? "border-emerald-500/20 bg-emerald-50"
                      : "border-black/5 bg-white"
                  }`}
                >
                  <CountUp
                    end={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.highlight ? "+" : ""}
                    decimals={stat.decimals}
                    className={`font-heading text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      stat.highlight ? "text-emerald-600" : "text-black"
                    }`}
                  />
                  <p className="text-[10px] sm:text-xs text-black/40 mt-1.5 leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Revenue Growth Chart */}
          <div>
            <RevealOnScroll className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-black/30">
                Receita do Setor de Estruturas em Aço
              </p>
            </RevealOnScroll>

            <motion.div
              ref={chartRef}
              initial={{ opacity: 0, y: 20 }}
              animate={chartInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="bg-black rounded-sm p-5 sm:p-6"
            >
              <BrazilGrowthChart />
              <p className="text-[10px] sm:text-xs text-white/30 text-center mt-3">
                Receita quase triplicou: R$ 7,1 bi (2019) → R$ 17,2 bi (2023)
              </p>
            </motion.div>
          </div>
        </div>

        {/* Comparison Table: Brasil vs Referência Global */}
        <RevealOnScroll className="mb-5 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-black/30">
            Brasil vs Referência Global
          </p>
        </RevealOnScroll>

        <motion.div
          ref={compareRef}
          variants={containerVariants}
          initial="hidden"
          animate={compareInView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <div className="border border-black/5 rounded-sm overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-black text-white text-xs sm:text-sm font-medium">
              <div className="p-3 sm:p-4">Indicador</div>
              <div className="p-3 sm:p-4 text-center">Brasil</div>
              <div className="p-3 sm:p-4 text-center">Referência</div>
            </div>
            {/* Data rows */}
            {[
              { label: "Construção em alvenaria", br: "88,2%", ref: "16% (Suécia)" },
              { label: "Share do mercado global LGSF", br: "2,2%", ref: "21% (EUA)" },
              { label: "Obras com métodos artesanais", br: "70%", ref: "10-30% (países desenvolvidos)" },
              { label: "Desperdício de materiais em obra", br: "≥30%", ref: "5-10% (construção industrializada)", highlight: true },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                variants={itemVariants}
                className={`grid grid-cols-3 text-xs sm:text-sm ${
                  i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"
                } ${row.highlight ? "font-medium" : ""}`}
              >
                <div className="p-3 sm:p-4 text-black/70">{row.label}</div>
                <div className={`p-3 sm:p-4 text-center ${row.highlight ? "text-emerald-600 font-bold" : "text-black/80"}`}>
                  {row.br}
                </div>
                <div className="p-3 sm:p-4 text-center text-black/40">{row.ref}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* sr-only table fallbacks */}
        <div className="sr-only">
          <table>
            <caption>Receita do setor de estruturas em aço no Brasil</caption>
            <thead><tr><th>Ano</th><th>Receita (R$ bilhões)</th></tr></thead>
            <tbody>
              {BRAZIL_MARKET_GROWTH.map((item) => (
                <tr key={item.year}><td>{item.year}</td><td>{item.revenue}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Marcos & Fatos do Brasil */}
        <RevealOnScroll className="mb-5 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-black/30">
            Marcos & Fatos do Brasil
          </p>
        </RevealOnScroll>

        <motion.div
          ref={factsRef}
          variants={containerVariants}
          initial="hidden"
          animate={factsInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-16 lg:mb-20"
        >
          {BRAZIL_FACTS.map((fact, i) => (
            <motion.div
              key={fact.label}
              variants={itemVariants}
              className="p-5 border border-black/5 bg-white rounded-sm hover:shadow-luxury-sm transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                {i === 0 && <Landmark className="w-4 h-4 text-black/30" />}
                <p className="font-heading text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                  {fact.value}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-black/70 font-medium leading-tight">
                {fact.label}
              </p>
              <p className="text-[10px] text-black/40 mt-1.5 leading-tight">
                {fact.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Empresas brasileiras em ascensão */}
        <RevealOnScroll className="mb-5 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-black/30">
            Empresas em Ascensão no Brasil
          </p>
        </RevealOnScroll>

        <motion.div
          ref={companiesRef}
          variants={containerVariants}
          initial="hidden"
          animate={companiesInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-16 lg:mb-20"
        >
          {BRAZIL_COMPANIES.map((company) => (
            <motion.div
              key={company.name}
              variants={itemVariants}
              className="p-6 border border-emerald-500/15 bg-emerald-50/40 rounded-sm"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg font-bold text-black">
                    {company.name}
                  </h3>
                  <p className="text-sm text-emerald-700 font-medium mt-1">
                    {company.highlight}
                  </p>
                  <p className="text-xs text-black/50 mt-1.5 leading-relaxed">
                    {company.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* McKinsey insight */}
        <RevealOnScroll delay={0.15} className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block border-l-2 border-black/20 pl-5 py-2 text-left">
            <p className="font-heading text-base sm:text-lg text-black/70 leading-relaxed italic">
              &ldquo;{MCKINSEY_INSIGHT.quote}&rdquo;
            </p>
            <p className="text-[10px] text-black/30 mt-2 uppercase tracking-wider">
              — {MCKINSEY_INSIGHT.source}
            </p>
          </div>
        </RevealOnScroll>

        {/* Closing statement — brand font, not Caveat */}
        <RevealOnScroll delay={0.2} className="text-center max-w-2xl mx-auto">
          <p className="font-heading text-lg sm:text-xl text-black/50 leading-relaxed font-light">
            Com capacidade industrial ociosa de 54% e um déficit de quase 6 milhões de moradias,
            o Brasil não precisa de novas fábricas — precisa de quem saiba construir com o que já existe.
          </p>
          <div className="w-16 h-px bg-black/10 mx-auto mt-8" />
        </RevealOnScroll>

        {/* Decorative Separator */}
        <RevealOnScroll delay={0.3} className="mt-12">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-black/10" />
            <div className="w-2 h-2 bg-black/15 rotate-45" />
            <div className="w-16 h-px bg-black/10" />
          </div>
        </RevealOnScroll>

        {/* Sources footer */}
        <p className="text-[10px] text-black/25 text-center mt-10 max-w-2xl mx-auto leading-relaxed">
          {SLIDE_SOURCES.brazil}
        </p>
      </div>
    </SlideSection>
  );
}
