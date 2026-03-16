"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { BeforeAfterComparison } from "@/types/article";

interface BeforeAfterSliderProps {
  comparison: BeforeAfterComparison;
  className?: string;
}

export function BeforeAfterSlider({
  comparison,
  className = "",
}: BeforeAfterSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [sliderPosition, setSliderPosition] = useState(50); // Percentage
  const [isDragging, setIsDragging] = useState(false);

  // Handle slider movement
  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  // Mouse events
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  // Touch events
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Title */}
      {comparison.title && (
        <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6">
          <h3 className="headline-sm">{comparison.title}</h3>
        </div>
      )}

      {/* Before/After Container */}
      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div
          ref={containerRef}
          className="relative aspect-video cursor-ew-resize select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
        >
          {/* After Image (Background) */}
          <div className="absolute inset-0">
            <Image
              src={comparison.afterImage}
              alt={comparison.afterLabel || "Depois"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            {/* After Label */}
            <div className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium">
              {comparison.afterLabel || "Depois"}
            </div>
          </div>

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0 transition-none"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          >
            <Image
              src={comparison.beforeImage}
              alt={comparison.beforeLabel || "Antes"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            {/* Before Label */}
            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1.5 rounded-md text-sm font-medium shadow-md">
              {comparison.beforeLabel || "Antes"}
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Handle Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-luxury-md flex items-center justify-center">
              {/* Arrows */}
              <div className="flex items-center gap-0.5">
                <svg
                  className="w-3 h-3 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <svg
                  className="w-3 h-3 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions (Mobile) */}
        <p className="text-xs text-black-60 text-center mt-3 md:hidden">
          Arraste o controle para comparar
        </p>
        <p className="text-xs text-black-60 text-center mt-3 hidden md:block">
          Arraste ou clique para comparar as imagens
        </p>
      </div>
    </motion.div>
  );
}
