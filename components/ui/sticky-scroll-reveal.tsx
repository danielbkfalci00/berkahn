"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll, useReducedMotion } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type StickyScrollContent = {
  title: string;
  description: string;
  content?: React.ReactNode | any;
};

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: StickyScrollContent[];
  contentClassName?: string;
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* Desktop: Original scroll-container behavior (lg+) */}
      <div className="hidden lg:block">
        <DesktopStickyScroll
          content={content}
          contentClassName={contentClassName}
        />
      </div>

      {/* Mobile: Natural page-scroll with whileInView (<lg) */}
      <div className="lg:hidden">
        <MobileStickyScroll
          content={content}
          reducedMotion={!!prefersReducedMotion}
        />
      </div>
    </>
  );
};

/* ─── Desktop: Scroll-Container Layout (unchanged) ─── */

function DesktopStickyScroll({
  content,
  contentClassName,
}: {
  content: StickyScrollContent[];
  contentClassName?: string;
}) {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <div
      className="relative flex h-[36rem] justify-center gap-10 overflow-y-auto rounded-lg bg-black p-10"
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-lg">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-xl md:text-2xl font-heading font-bold text-white"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="body-md mt-6 max-w-sm text-white/70"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        className={cn(
          "sticky top-10 hidden h-80 w-96 overflow-hidden rounded-lg lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </div>
  );
}

/* ─── Mobile: Page-Scroll Layout with whileInView ─── */

function MobileStickyScroll({
  content,
  reducedMotion,
}: {
  content: StickyScrollContent[];
  reducedMotion: boolean;
}) {
  return (
    <div className="space-y-8 rounded-lg bg-black p-6">
      {content.map((item, index) => (
        <motion.div
          key={item.title + index}
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.6,
            delay: 0.05,
            ease: [0.19, 1, 0.22, 1],
          }}
        >
          {item.content && (
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg mb-5">
              {item.content}
            </div>
          )}

          <h2 className="text-xl font-heading font-bold text-white">
            {item.title}
          </h2>
          <p className="body-md mt-3 text-white/70">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
