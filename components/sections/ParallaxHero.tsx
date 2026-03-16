"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ImagesSlider } from "@/components/ui/images-slider";

interface ParallaxHeroProps {
  title: string;
  subtitle?: string;
  label?: string;
  backgroundImage: string;
  images?: string[];
  height?: string;
  imagePosition?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function ParallaxHero({
  title,
  subtitle,
  label,
  backgroundImage,
  images,
  height = "100vh",
  imagePosition,
  ctaText,
  ctaHref,
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
      className="relative min-h-[70vh] md:min-h-screen flex items-start justify-start pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden"
    >
      {/* Background Image Layer (slowest parallax) */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBackground, top: "-20%", bottom: "-20%", height: "140%" }}
      >
        {images && images.length > 1 ? (
          <ImagesSlider
            images={images}
            overlay={false}
            autoplay
            direction="up"
            className="h-full w-full"
          />
        ) : (
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className={`object-cover ${imagePosition || ""}`}
            priority
            sizes="100vw"
            quality={90}
          />
        )}
      </motion.div>

      {/* Overlay for text readability - static, above parallax */}
      <div className="absolute inset-0 z-5 hero-overlay-top" aria-hidden="true" />

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
              {label || "SISTEMA CONSTRUTIVO INDUSTRIALIZADO"}
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

            {subtitle && (
              <motion.p
                className="body-lg text-white/90 max-w-2xl hero-text-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                {subtitle}
              </motion.p>
            )}

            {ctaText && (
              <motion.a
                href={ctaHref || "#"}
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-black uppercase tracking-wider text-sm font-medium hover:bg-white/90 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                {ctaText}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
