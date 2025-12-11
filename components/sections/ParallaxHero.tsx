"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  height?: string;
}

export function ParallaxHero({
  title,
  subtitle,
  backgroundImage,
  height = "100vh",
}: ParallaxHeroProps) {
  const ref = useRef<HTMLElement>(null);

  // Track scroll position
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Transform scroll to parallax values
  // Background moves slowest (0.5x)
  const yBackground = useTransform(scrollY, [0, 1000], [0, -300]);
  // Text moves at normal speed (1x - handled by normal scroll)
  // Scroll indicator moves fastest (1.5x)
  const yIndicator = useTransform(scrollY, [0, 500], [0, -150]);
  const opacityIndicator = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height, minHeight: "600px" }}
    >
      {/* Background Image Layer (slowest parallax) */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBackground }}
      >
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
      </motion.div>

      {/* Gradient Overlay - 70% opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-black-70 via-black-70 to-black-90 z-10" />

      {/* Content Layer (normal scroll speed) */}
      <div className="relative z-20 text-center px-6 container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.19, 1, 0.22, 1], // ease-expo
          }}
        >
          {subtitle && (
            <motion.p
              className="label-text text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            className="headline-lg text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              className="text-xl md:text-2xl text-white-70 max-w-3xl mx-auto font-heading font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.6,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator (fastest parallax) */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        style={{
          y: yIndicator,
          opacity: opacityIndicator,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-3 bg-white rounded-full"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <p className="text-white text-xs uppercase tracking-widest">Scroll</p>
        </div>
      </motion.div>
    </section>
  );
}
