"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { COUNTRY_DATA, type CountryData } from "@/lib/global-steel-frame-data";

// TopoJSON Natural Earth 110m — CDN (cached, ~15KB gzip)
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mapa ISO numérico → dados do país
const countryByIso = new Map(
  COUNTRY_DATA.map((c) => [c.isoNumeric, c])
);

// Cor do país baseada em adoção
function getCountryFill(country: CountryData | undefined, isBrazil: boolean): string {
  if (!country) return "#e8e8e8"; // não-destacado: cinza claro
  if (isBrazil) return "#10B981"; // Brasil: emerald-500
  const v = country.metricValue;
  if (v >= 30) return "rgba(0,0,0,0.55)";   // alto (UK, Japão, EUA, Suécia)
  if (v >= 10) return "rgba(0,0,0,0.35)";   // médio (Austrália, Argentina)
  return "rgba(0,0,0,0.20)";                // baixo (Chile, NZ, Canadá)
}

interface GlobalAdoptionMapProps {
  isInView: boolean;
}

export default function GlobalAdoptionMap({ isInView }: GlobalAdoptionMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const hoveredCountry = useMemo(() => {
    if (!hoveredId) return null;
    return countryByIso.get(hoveredId) ?? null;
  }, [hoveredId]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      const rect = (e.currentTarget.closest("svg") as SVGElement)
        ?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    []
  );

  // Stagger delays para cada país (animação scroll-driven)
  const staggerDelays = useMemo(() => {
    const order = ["826", "392", "840", "752", "036", "032", "152", "554", "124", "076"];
    const map = new Map<string, number>();
    order.forEach((iso, i) => map.set(iso, i * 0.15));
    return map;
  }, []);

  return (
    <div
      className="relative w-full max-w-5xl mx-auto"
      role="img"
      aria-label="Mapa-múndi mostrando adoção de Steel Frame por país"
    >
      <ComposableMap
        width={800}
        height={420}
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 147, center: [0, 5] }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoId = geo.id as string;
              const country = countryByIso.get(geoId);
              const isBrazil = geoId === "076";
              const isHighlighted = !!country;
              const isHovered = hoveredId === geoId;
              const delay = staggerDelays.get(geoId) ?? 0;

              const baseFill = getCountryFill(country, isBrazil);
              const hoverFill = isBrazil
                ? "#059669"
                : isHighlighted
                  ? "rgba(0,0,0,0.7)"
                  : "#d4d4d4";

              // Animated or immediate fill
              const showFinal = prefersReducedMotion || !isHighlighted;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => isHighlighted && setHoveredId(geoId)}
                  onMouseLeave={() => setHoveredId(null)}
                  onMouseMove={isHighlighted ? handleMouseMove : undefined}
                  onClick={() => isHighlighted && setHoveredId(hoveredId === geoId ? null : geoId)}
                  tabIndex={isHighlighted ? 0 : undefined}
                  aria-label={country ? `${country.name}: ${country.metric}` : undefined}
                  onFocus={() => isHighlighted && setHoveredId(geoId)}
                  onBlur={() => setHoveredId(null)}
                  style={{
                    default: {
                      fill: showFinal
                        ? (isHovered ? hoverFill : baseFill)
                        : isInView
                          ? baseFill
                          : "#e8e8e8",
                      stroke: "#d0d0d0",
                      strokeWidth: 0.4,
                      outline: "none",
                      transition: showFinal
                        ? "fill 0.3s ease"
                        : `fill 0.6s cubic-bezier(0.19,1,0.22,1) ${delay}s`,
                      cursor: isHighlighted ? "pointer" : "default",
                    },
                    hover: {
                      fill: isHighlighted ? hoverFill : "#d4d4d4",
                      stroke: "#b0b0b0",
                      strokeWidth: isHighlighted ? 0.8 : 0.4,
                      outline: "none",
                      transition: "fill 0.2s ease",
                      cursor: isHighlighted ? "pointer" : "default",
                    },
                    pressed: {
                      fill: isHighlighted ? hoverFill : "#d4d4d4",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {hoveredCountry && (
        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="-translate-x-1/2 -translate-y-full -mt-3 bg-white/95 backdrop-blur-md border border-black/10 rounded-lg px-3.5 py-2.5 whitespace-nowrap shadow-luxury-lg">
            <p className="text-xs font-heading font-bold text-black leading-none flex items-center gap-1.5">
              <span>{hoveredCountry.flag}</span>
              <span>{hoveredCountry.name}</span>
            </p>
            <p className="text-[11px] text-black/60 mt-1 leading-tight">
              {hoveredCountry.metric}
            </p>
            <p className="text-[10px] text-black/40 mt-0.5 leading-tight">
              {hoveredCountry.detail}
            </p>
          </div>
        </motion.div>
      )}

      {/* Brasil pulso verde (CSS animation) */}
      {isInView && !prefersReducedMotion && (
        <style>{`
          @keyframes brasil-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          [aria-label*="Brasil"] {
            animation: brasil-pulse 2.5s ease-in-out infinite;
          }
        `}</style>
      )}

      {/* sr-only fallback table */}
      <div className="sr-only">
        <table>
          <caption>Adoção de Steel Frame por país</caption>
          <thead>
            <tr>
              <th>País</th>
              <th>Métrica</th>
              <th>Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {COUNTRY_DATA.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.metric}</td>
                <td>{c.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
