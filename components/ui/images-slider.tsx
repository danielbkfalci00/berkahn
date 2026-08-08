"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Image, { getImageProps } from "next/image";
import React, { useEffect, useState, useCallback } from "react";

export function ImagesSlider({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  images: string[];
  children?: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Show first image immediately; preload remaining in background
  const [loadedImages, setLoadedImages] = useState<string[]>(
    images.length > 0 ? [images[0]] : []
  );

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === loadedImages.length ? 0 : prevIndex + 1
    );
  }, [loadedImages.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? loadedImages.length - 1 : prevIndex - 1
    );
  }, [loadedImages.length]);

  // Preload the same responsive Next/Image variants the browser will display.
  // Scheduling after window load keeps background slides from competing with LCP.
  useEffect(() => {
    if (images.length <= 1) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const preloadRemaining = () => {
      const loadPromises = images.slice(1).map(
        (image) =>
          new Promise<string>((resolve, reject) => {
            const { props } = getImageProps({
              src: image,
              alt: "",
              fill: true,
              sizes: "100vw",
            });
            const img = new window.Image();
            if (props.srcSet) img.srcset = props.srcSet;
            if (props.sizes) img.sizes = props.sizes;
            img.src = props.src;
            img.onload = () => resolve(image);
            img.onerror = reject;
          })
      );

      Promise.all(loadPromises)
        .then((loaded) => {
          if (!cancelled) setLoadedImages([images[0], ...loaded]);
        })
        .catch((error) => console.error("Failed to load images", error));
    };

    const schedulePreload = () => {
      timeoutId = window.setTimeout(preloadRemaining, 1500);
    };

    if (document.readyState === "complete") schedulePreload();
    else window.addEventListener("load", schedulePreload, { once: true });

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.removeEventListener("load", schedulePreload);
    };
  }, [images]);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  const slideVariants = {
    initial: {
      scale: 1.08,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    upExit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.8,
      },
    },
    downExit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div
      className={cn(
        "overflow-hidden h-full w-full relative flex items-center justify-center",
        className
      )}
    >
      {children}
      {overlay && (
        <div
          className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)}
        />
      )}
      {loadedImages.length > 0 && (
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={currentIndex === 0 ? false : "initial"}
            animate="visible"
            exit={direction === "up" ? "upExit" : "downExit"}
            variants={slideVariants}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={loadedImages[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
