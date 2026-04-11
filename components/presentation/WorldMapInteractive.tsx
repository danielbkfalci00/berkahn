"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { COUNTRY_DATA, type CountryData } from "@/lib/global-steel-frame-data";

/**
 * Mapa-múndi SVG com contornos geográficos simplificados + hotspots interativos.
 * Projeção: Equiretangular (Natural Earth, domínio público).
 * Padrão visual: BrazilMapBeam (dots + pulsos + tooltips).
 */
export function WorldMapInteractive() {
  const [active, setActive] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto select-none">
      {/* SVG do mapa-múndi — contornos geográficos simplificados */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        role="img"
        aria-label="Mapa-múndi mostrando adoção de Steel Frame por país"
      >
        <defs>
          {/* Grid de fundo sutil */}
          <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Grid de fundo */}
        <rect width="1000" height="500" fill="url(#mapGrid)" />

        {/* Continentes — Natural Earth simplificado */}
        <g fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" strokeLinejoin="round">

          {/* ═══ AMÉRICA DO NORTE ═══ */}
          {/* Groenlândia */}
          <path d="M310,28 L330,22 L355,25 L370,35 L375,55 L365,72 L350,78 L335,75 L318,65 L308,48 L305,35 Z" />
          {/* Canadá */}
          <path d="M100,85 L120,78 L145,80 L165,75 L185,78 L205,72 L225,75 L245,80 L260,90 L268,105 L265,120 L255,132 L240,140 L225,138 L210,142 L195,148 L180,145 L165,150 L150,148 L138,155 L130,150 L120,155 L108,150 L95,145 L85,135 L80,120 L82,105 L90,92 Z" />
          {/* Ilhas árticas canadenses */}
          <path d="M150,55 L170,50 L190,52 L205,58 L215,65 L210,75 L195,78 L175,75 L158,70 L148,62 Z" />
          <path d="M220,48 L240,42 L260,45 L275,55 L280,68 L270,78 L255,82 L238,78 L225,68 L218,55 Z" />
          {/* EUA */}
          <path d="M80,135 L95,145 L108,150 L120,155 L130,150 L138,155 L150,148 L165,150 L180,145 L195,148 L210,142 L225,138 L240,140 L250,150 L248,165 L240,178 L228,185 L215,190 L200,192 L185,195 L170,198 L155,195 L140,190 L125,188 L110,185 L95,180 L82,172 L72,162 L68,148 Z" />
          {/* Alasca */}
          <path d="M42,90 L55,82 L72,78 L85,82 L92,92 L88,105 L78,112 L65,110 L52,105 L42,98 Z" />
          {/* México */}
          <path d="M110,195 L125,192 L140,195 L155,198 L170,202 L178,212 L180,225 L175,238 L165,248 L155,252 L145,248 L138,240 L132,232 L125,225 L118,218 L112,208 Z" />

          {/* ═══ AMÉRICA CENTRAL & CARIBE ═══ */}
          <path d="M165,248 L175,245 L188,248 L198,255 L205,262 L200,268 L190,270 L180,265 L170,258 Z" />
          {/* Cuba */}
          <path d="M175,228 L195,225 L210,228 L218,235 L210,240 L195,242 L180,238 Z" />

          {/* ═══ AMÉRICA DO SUL ═══ */}
          <path d="M205,275 L220,268 L238,270 L255,278 L270,290 L282,305 L290,322 L295,340 L298,358 L295,375 L288,390 L278,402 L268,408 L258,405 L250,395 L242,382 L235,368 L228,352 L222,335 L218,318 L215,302 L210,288 Z" />

          {/* ═══ EUROPA ═══ */}
          {/* Escandinávia */}
          <path d="M470,32 L478,28 L488,30 L495,38 L498,50 L500,65 L498,78 L492,88 L485,95 L478,92 L472,82 L468,70 L465,55 L466,42 Z" />
          {/* Ilhas Britânicas */}
          <path d="M430,72 L438,68 L445,70 L448,78 L446,88 L440,95 L432,92 L428,82 Z" />
          {/* Europa Continental */}
          <path d="M445,95 L455,90 L468,88 L478,92 L492,88 L502,92 L515,95 L528,100 L540,108 L548,118 L545,130 L535,138 L522,142 L510,140 L498,142 L488,148 L478,150 L468,148 L458,145 L448,140 L440,132 L435,120 L438,108 L442,100 Z" />
          {/* Península Ibérica */}
          <path d="M420,120 L432,115 L440,120 L442,132 L438,142 L430,148 L420,148 L415,140 L412,130 Z" />
          {/* Itália */}
          <path d="M468,130 L475,128 L480,135 L482,148 L478,158 L472,162 L466,158 L464,148 L465,138 Z" />
          {/* Grécia & Balcãs */}
          <path d="M498,135 L508,132 L515,138 L518,148 L515,158 L508,162 L500,158 L496,148 L497,140 Z" />

          {/* ═══ ÁFRICA ═══ */}
          <path d="M430,165 L445,158 L460,155 L478,158 L495,162 L510,168 L525,178 L535,192 L540,210 L542,232 L540,255 L535,278 L528,298 L518,315 L505,328 L492,338 L478,342 L465,338 L455,328 L448,315 L442,298 L438,278 L435,255 L433,232 L432,210 L430,190 Z" />
          {/* Madagascar */}
          <path d="M548,295 L555,288 L560,295 L558,310 L552,318 L546,312 L545,302 Z" />

          {/* ═══ ÁSIA ═══ */}
          {/* Rússia / Norte da Ásia */}
          <path d="M540,30 L570,25 L600,22 L640,25 L680,28 L720,32 L760,38 L800,42 L835,48 L860,55 L870,68 L865,82 L850,90 L830,95 L810,92 L790,88 L770,85 L750,82 L730,78 L710,80 L690,82 L670,85 L650,88 L630,92 L610,95 L590,98 L570,95 L555,90 L545,80 L540,65 L538,48 Z" />
          {/* Oriente Médio */}
          <path d="M535,145 L548,140 L562,142 L575,148 L585,158 L588,170 L582,182 L572,188 L560,185 L548,180 L540,172 L535,160 Z" />
          {/* Índia */}
          <path d="M610,155 L625,148 L640,150 L652,158 L660,170 L665,185 L662,200 L655,215 L645,225 L632,228 L620,225 L610,215 L605,200 L602,185 L605,170 Z" />
          {/* China / Leste Asiático */}
          <path d="M670,85 L690,82 L710,80 L730,78 L750,82 L770,85 L782,95 L788,108 L785,122 L778,135 L768,145 L755,152 L740,155 L725,152 L712,148 L700,142 L690,132 L682,120 L675,108 L672,95 Z" />
          {/* Península Coreana */}
          <path d="M790,108 L798,105 L805,112 L802,125 L795,132 L788,128 L786,118 Z" />
          {/* Japão */}
          <path d="M812,98 L820,92 L828,95 L832,105 L830,118 L825,128 L818,135 L812,130 L808,118 L810,108 Z" />
          {/* Sudeste Asiático continental */}
          <path d="M680,168 L695,162 L712,165 L725,172 L732,185 L728,200 L718,212 L705,218 L692,215 L682,205 L678,192 L676,178 Z" />
          {/* Indonésia / Malásia */}
          <path d="M700,238 L720,232 L742,235 L762,240 L778,248 L788,258 L782,268 L768,272 L748,270 L728,265 L712,258 L702,248 Z" />
          <path d="M792,252 L808,248 L822,255 L828,268 L820,278 L808,280 L795,275 L790,262 Z" />

          {/* ═══ OCEANIA ═══ */}
          {/* Austrália */}
          <path d="M775,318 L800,308 L825,305 L850,308 L872,318 L888,332 L895,350 L892,368 L882,382 L868,392 L850,398 L832,395 L815,388 L800,378 L788,365 L780,348 L775,332 Z" />
          {/* Nova Zelândia */}
          <path d="M908,372 L915,368 L920,375 L922,388 L918,398 L912,402 L906,395 L905,382 Z" />
          <path d="M912,405 L918,402 L922,408 L920,418 L915,422 L910,415 Z" />
        </g>
      </svg>

      {/* Hotspots posicionados sobre o mapa */}
      {COUNTRY_DATA.map((country, i) => (
        <Hotspot
          key={country.id}
          country={country}
          index={i}
          isActive={active === country.id}
          onActivate={() => setActive(active === country.id ? null : country.id)}
          onDeactivate={() => setActive(null)}
          prefersReducedMotion={prefersReducedMotion ?? false}
        />
      ))}

      {/* Legenda sr-only para acessibilidade */}
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

// ─── Hotspot individual ──────────────────────────────────────────

interface HotspotProps {
  country: CountryData;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  prefersReducedMotion: boolean;
}

function Hotspot({
  country,
  index,
  isActive,
  onActivate,
  onDeactivate,
  prefersReducedMotion,
}: HotspotProps) {
  const isBrazil = country.id === "br";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${country.mapPosition.x}%`, top: `${country.mapPosition.y}%` }}
    >
      {/* Pulsing ring */}
      {!prefersReducedMotion && (
        <motion.span
          className="absolute w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          style={{
            border: `1px solid ${isBrazil ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.25)"}`,
          }}
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: index * 0.15 }}
        />
      )}

      {/* Dot button */}
      <button
        className={`relative w-2.5 h-2.5 rounded-full transition-transform duration-200 ${
          isBrazil
            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : "bg-white shadow-[0_0_6px_rgba(255,255,255,0.3)]"
        } ${isActive ? "scale-150" : "hover:scale-125"}`}
        onClick={onActivate}
        onMouseEnter={onActivate}
        onMouseLeave={onDeactivate}
        aria-label={`${country.name}: ${country.metric}`}
      />

      {/* Tooltip */}
      {isActive && (
        <motion.div
          className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg px-3.5 py-2.5 whitespace-nowrap shadow-luxury-lg">
            <p className="text-xs font-heading font-bold text-white leading-none flex items-center gap-1.5">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </p>
            <p className="text-[11px] text-white/70 mt-1 leading-tight">{country.metric}</p>
            <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{country.detail}</p>
          </div>
          {/* Arrow */}
          <div className="w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45 mx-auto -mt-1" />
        </motion.div>
      )}
    </div>
  );
}
