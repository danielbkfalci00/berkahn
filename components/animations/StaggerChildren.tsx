"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scale";
}

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function StaggerChildren({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
  once = true,
  animation = "fadeUp",
}: StaggerChildrenProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    margin: "0px 0px -10% 0px",
  });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

// Item filho para ser usado dentro do StaggerChildren
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scale";
}

export function StaggerItem({
  children,
  className,
  animation = "fadeUp",
}: StaggerItemProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={animations[animation]}
      transition={{
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1], // ease-out-expo
      }}
    >
      {children}
    </motion.div>
  );
}
