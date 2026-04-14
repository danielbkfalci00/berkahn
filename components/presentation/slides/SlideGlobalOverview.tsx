"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { COUNTRY_RANKING, SLIDE_SOURCES } from "@/lib/global-steel-frame-data";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

// react-simple-maps carregado client-only (usa D3 que não é SSR-safe)
const GlobalAdoptionMap = dynamic(
  () => import("@/components/presentation/GlobalAdoptionMap"),
  { ssr: false }
);

const maxCountryValue = Math.max(...COUNTRY_RANKING.map((c) => c.metricValue));

export function SlideGlobalOverview() {
  const { ref: mapRef, isInView: mapInView } = useInViewAnimation({ margin: "-10% 0px" });
  const { ref: barsRef, isInView: barsInView } = useInViewAnimation({ margin: "-10% 0px" });

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

        {/* Global Adoption Map + Country Bar Chart */}
        <div ref={mapRef} className="mb-8">
          <RevealOnScroll className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-black/30">
              Adoção por País
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Map */}
            <div className="w-full">
              <GlobalAdoptionMap isInView={mapInView} />
            </div>

            {/* Right: Vertical Bar Chart — Country Ranking */}
            <motion.div
              ref={barsRef}
              variants={containerVariants}
              initial="hidden"
              animate={barsInView ? "visible" : "hidden"}
              className="flex flex-col"
            >
              {/* Bar chart area */}
              <div className="flex items-end gap-2 h-56 sm:h-64 mb-3">
                {COUNTRY_RANKING.map((country) => {
                  const isBrazil = country.id === "br";
                  const barHeightPct = (country.metricValue / maxCountryValue) * 100;

                  return (
                    <motion.div
                      key={country.id}
                      variants={itemVariants}
                      className="flex flex-col items-center flex-1 h-full justify-end"
                    >
                      {/* Value label above bar */}
                      <span
                        className={`text-[10px] font-bold tabular-nums mb-1 ${
                          isBrazil ? "text-emerald-600" : "text-black/60"
                        }`}
                      >
                        {country.metricValue}%
                      </span>

                      {/* Bar */}
                      <motion.div
                        className={`w-full rounded-t-sm ${
                          isBrazil
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                            : "bg-gradient-to-t from-black/60 to-black/30"
                        }`}
                        style={{
                          height: `${barHeightPct}%`,
                          transformOrigin: "bottom",
                        }}
                        initial={{ scaleY: 0 }}
                        animate={barsInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Country labels below bars (rotated) */}
              <div className="flex gap-2">
                {COUNTRY_RANKING.map((country) => {
                  const isBrazil = country.id === "br";
                  return (
                    <div key={country.id} className="flex-1 flex justify-center">
                      <span
                        className={`text-[9px] sm:text-[10px] leading-tight text-center block ${
                          isBrazil ? "text-emerald-600 font-semibold" : "text-black/40"
                        }`}
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", height: 52 }}
                      >
                        {country.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Methodology note */}
              <p className="text-[10px] text-black/30 leading-relaxed mt-4">
                As métricas variam por país conforme dado disponível — estrutural, residencial, total ou proxy.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative Separator */}
        <RevealOnScroll delay={0.4} className="mt-12">
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
