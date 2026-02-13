"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function BrazilMapBeam() {
  // São Paulo position on the map (percentage-based)
  const spLeft = "57%";
  const spTop = "68%";

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
          top: "28%",
          height: "40%",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(96,165,250,0.15) 20%, rgba(96,165,250,0.35) 50%, rgba(96,165,250,0.5) 80%, rgba(96,165,250,0.7) 100%)",
        }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 0 },
        }}
      />

      {/* Elliptical glow at SP — spotlight effect */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: spLeft,
          top: spTop,
          width: "80px",
          height: "32px",
          background:
            "radial-gradient(ellipse at center, rgba(96,165,250,0.25) 0%, rgba(96,165,250,0.08) 50%, transparent 80%)",
          filter: "blur(8px)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing rings at SP — soft blue rings */}
      <motion.span
        className="absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          left: spLeft,
          top: spTop,
          border: "1px solid rgba(96,165,250,0.3)",
        }}
        animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.span
        className="absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          left: spLeft,
          top: spTop,
          border: "1px solid rgba(96,165,250,0.2)",
        }}
        animate={{ scale: [1, 2.8], opacity: [0.4, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      />

      {/* Solid dot at SP */}
      <motion.span
        className="absolute w-3 h-3 rounded-full bg-blue-500 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(96,165,250,0.5)]"
        style={{ left: spLeft, top: spTop }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* "Estamos aqui" tooltip */}
      <motion.div
        className="absolute -translate-x-1/2"
        style={{ left: spLeft, top: "20%" }}
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
