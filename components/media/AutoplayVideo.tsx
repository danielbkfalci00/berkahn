"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type VideoSource = {
  src: string;
  type: string;
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

type AutoplayVideoProps = {
  /** Ordem recomendada: AV1 → HEVC → H.264 */
  sources: VideoSource[];
  poster: string;
  posterAlt: string;
  /** true no hero: o poster é o LCP da página */
  posterPriority?: boolean;
  /** true → abaixo de 768px só o poster é exibido (economia de dados/LCP) */
  disableOnMobile?: boolean;
  /** Classe extra do poster (ex.: Ken Burns quando não há vídeo) */
  posterClassName?: string;
  className?: string;
};

/**
 * Vídeo de fundo com poster-como-LCP.
 *
 * O poster (next/image) pinta no SSR; o <video> não tem sources no markup e
 * só é montado quando o container entra no viewport (IntersectionObserver).
 * Poster-only quando: prefers-reduced-motion, mobile com disableOnMobile,
 * Save-Data/2g, autoplay bloqueado ou lista de sources vazia.
 */
export function AutoplayVideo({
  sources,
  poster,
  posterAlt,
  posterPriority = false,
  disableOnMobile = false,
  posterClassName,
  className,
}: AutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (sources.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (disableOnMobile && window.matchMedia("(max-width: 767px)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (isVisible) {
          setShouldLoad(true);
          videoRef.current?.play().catch(() => {
            // Autoplay bloqueado: o poster permanece
          });
        } else {
          videoRef.current?.pause();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, [disableOnMobile, sources.length]);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const handlePlaying = () => setIsPlaying(true);
    video.addEventListener("playing", handlePlaying);
    video.load();
    video.play().catch(() => {
      // Autoplay bloqueado: o poster permanece
    });

    return () => video.removeEventListener("playing", handlePlaying);
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={poster}
        alt={posterAlt}
        fill
        priority={posterPriority}
        sizes="100vw"
        className={cn("object-cover", posterClassName)}
      />

      {shouldLoad && (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            isPlaying ? "opacity-100" : "opacity-0"
          )}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}
    </div>
  );
}
