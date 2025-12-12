"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number; // -1 to 1, negative = opposite direction
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
}

export function ParallaxImage({
  src,
  alt,
  speed = 0.2,
  className = "",
  containerClassName = "",
  priority = false,
  quality = 85,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate parallax range based on speed
  const yRange = 100 * Math.abs(speed);
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    speed > 0 ? [`-${yRange}px`, `${yRange}px`] : [`${yRange}px`, `-${yRange}px`]
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 scale-110" // Scale to prevent gaps during parallax
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          priority={priority}
          quality={quality}
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}

// Parallax with opacity fade
interface ParallaxFadeImageProps extends ParallaxImageProps {
  fadeRange?: [number, number]; // Scroll progress range for fade
}

export function ParallaxFadeImage({
  src,
  alt,
  speed = 0.2,
  className = "",
  containerClassName = "",
  priority = false,
  quality = 85,
  fadeRange = [0.3, 0.7],
}: ParallaxFadeImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRange = 100 * Math.abs(speed);
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    speed > 0 ? [`-${yRange}px`, `${yRange}px`] : [`${yRange}px`, `-${yRange}px`]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, fadeRange[0], fadeRange[1], 1],
    [0.3, 1, 1, 0.3]
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 scale-110"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          priority={priority}
          quality={quality}
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}

// Mouse-tracking parallax for hover effects
interface MouseParallaxProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

export function MouseParallax({
  children,
  intensity = 10,
  className = "",
}: MouseParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    ref.current.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={ref} className="transition-transform duration-200 ease-out">
        {children}
      </div>
    </div>
  );
}
