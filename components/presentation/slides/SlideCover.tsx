"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SlideSection } from "../ui/SlideSection";
import { CharReveal } from "@/components/animations/TextReveal";
import { ChevronDown } from "lucide-react";

export function SlideCover() {
  return (
    <SlideSection dark className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-home-2.webp"
          alt="Construção Steel Frame de alto padrão"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-[0.2em] text-white mb-6">
            <CharReveal text="BERKAHN" delay={0.3} />
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-sm sm:text-base md:text-lg uppercase tracking-[0.3em] text-white/70 font-light"
        >
          Especialistas em Light Steel Frame. Mestres em construir.
        </motion.p>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="w-24 h-px bg-white/30 mx-auto mt-8"
        />
      </div>

      {/* Scroll Indicator - CSS animation instead of Framer Motion for better CPU efficiency */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 text-white/50 animate-bounce-slow">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </motion.div>
    </SlideSection>
  );
}
