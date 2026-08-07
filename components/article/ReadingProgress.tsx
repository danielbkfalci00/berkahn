"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function ReadingProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // Smooth the progress animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return scaleX.on("change", (latest) => {
      const percent = latest * 100;
      setProgress(percent);
      const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "unknown";
      for (const threshold of [25, 50, 75, 90] as const) {
        if (percent < threshold) continue;
        const key = `article-progress:${slug}:${threshold}`;
        if (sessionStorage.getItem(key)) continue;
        const tracked = trackEvent("article_progress", {
          article_slug: slug,
          percent_scrolled: threshold,
        });
        if (tracked) sessionStorage.setItem(key, "1");
      }
    });
  }, [pathname, scaleX]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-black-5"
      initial={{ opacity: 0, y: -4 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -4
      }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
    >
      <motion.div
        className="h-full bg-black origin-left"
        style={{ scaleX }}
      />

      {/* Progress percentage indicator */}
      <motion.div
        className="absolute right-4 -bottom-6 text-xs font-medium text-black-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
      >
        {Math.round(progress)}%
      </motion.div>
    </motion.div>
  );
}
