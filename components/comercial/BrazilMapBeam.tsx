"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function BrazilMapBeam() {
  // São Paulo position on the map (percentage-based)
  const spLeft = "62%";
  const spTop = "73%";

  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* Map image */}
      <Image
        src="/images/mapa-brazil.png"
        alt="Mapa do Brasil — sede em São Paulo"
        width={400}
        height={400}
        className="w-full h-auto opacity-50"
        draggable={false}
      />

      {/* Vertical beam from tooltip down to SP dot */}
      <motion.div
        className="absolute w-px"
        style={{
          left: spLeft,
          top: "32%",
          height: "38%",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0.5) 100%)",
        }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{
          opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 0 },
        }}
      />

      {/* Glow around beam */}
      <motion.div
        className="absolute w-4 -translate-x-1/2"
        style={{
          left: spLeft,
          top: "40%",
          height: "30%",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.06) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing ring at SP */}
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: spLeft, top: spTop }}
      >
        <span className="absolute inset-0 -m-1.5 animate-ping rounded-full bg-black/20" />
        <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-black/10 [animation-delay:0.5s]" />
      </span>

      {/* Solid dot at SP */}
      <motion.span
        className="absolute w-2.5 h-2.5 rounded-full bg-black -translate-x-1/2 -translate-y-1/2"
        style={{ left: spLeft, top: spTop }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* "Estamos aqui" tooltip */}
      <motion.div
        className="absolute -translate-x-1/2"
        style={{ left: spLeft, top: "24%" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="bg-white shadow-luxury-md rounded-md px-3.5 py-2 whitespace-nowrap">
          <p className="text-[11px] font-heading font-bold text-black tracking-tight leading-none">
            Estamos aqui
          </p>
          <p className="text-[10px] text-black-50 mt-0.5 leading-none">
            São Paulo, SP
          </p>
        </div>
        {/* Tooltip arrow */}
        <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1 shadow-sm" />
      </motion.div>
    </div>
  );
}
