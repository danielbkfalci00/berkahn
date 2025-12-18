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
      className="relative h-[70vh] md:h-screen min-h-[500px] md:min-h-[600px] flex items-start justify-start pt-32 md:pt-40 overflow-hidden"
    >
      {/* Background Image Layer (slowest parallax) */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBackground, top: "-20%", bottom: "-20%", height: "140%" }}
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

      {/* Content Layer (normal scroll speed) */}
      <div className="relative z-20 text-left">
        <div className="hero-content-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.19, 1, 0.22, 1], // ease-expo
            }}
          >
            {/* Decorative Line */}
            <motion.div
              className="hero-decorative-line w-24 mb-8"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "6rem" }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.19, 1, 0.22, 1],
              }}
            />

            {/* Label */}
            <motion.p
              className="hero-label text-white mb-6 hero-text-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.3,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              SISTEMA CONSTRUTIVO INDUSTRIALIZADO
            </motion.p>

            <motion.h1
              className="headline-lg text-white mb-6 hero-text-shadow-strong"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
