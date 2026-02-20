"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ServiceCard {
  title: string;
  src: string;
  benefits?: string;
}

interface FocusCardsSectionProps {
  cards: ServiceCard[];
}

export function FocusCardsSection({ cards }: FocusCardsSectionProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  function handleClick(index: number) {
    setActiveCard((prev) => (prev === index ? null : index));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
      {cards.map((card, index) => {
        const isActive = activeCard === index;
        const hasActive = activeCard !== null;

        return (
          <motion.div
            key={card.title}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            className={cn(
              "relative rounded-lg overflow-hidden h-72 md:h-[28rem] w-full cursor-pointer select-none",
              "transition-[filter,transform] duration-300 ease-out",
              hasActive && !isActive && "blur-sm scale-[0.98]",
              hoveredCard !== null && hoveredCard !== index && !hasActive && "md:blur-sm md:scale-[0.98]"
            )}
            layout
          >
            {/* Image layer — slides up when active */}
            <motion.div
              className="absolute inset-0"
              animate={{ y: isActive ? "-25%" : "0%" }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <Image
                src={card.src}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Gradient overlay */}
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-300",
                  isActive
                    ? "bg-black/40"
                    : hoveredCard === index
                      ? "bg-black/50"
                      : "bg-gradient-to-t from-black/60 to-transparent md:opacity-0"
                )}
              />
            </motion.div>

            {/* Title overlay — hover on desktop, always on mobile */}
            <AnimatePresence>
              {!isActive && (
                <motion.div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-6 flex items-end justify-between transition-opacity duration-300",
                    hoveredCard === index ? "opacity-100" : "opacity-100 md:opacity-0"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xl md:text-2xl font-heading font-semibold text-white">
                    {card.title}
                  </span>
                  {card.benefits && (
                    <span className="text-white/60 text-sm">+</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Benefits panel — bottom half, visible when active */}
            <AnimatePresence>
              {isActive && card.benefits && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-black flex flex-col justify-center px-6 py-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-heading font-semibold text-white">
                      {card.title}
                    </span>
                    <span className="text-white/50 text-xs">✕</span>
                  </div>
                  <p className="text-sm md:text-base text-white/80 leading-relaxed">
                    {card.benefits}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
