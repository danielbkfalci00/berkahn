"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

interface SegmentItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface SegmentShowcaseProps {
  data: SegmentItem[];
}

export function SegmentShowcase({ data }: SegmentShowcaseProps) {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const breakpoints = data.map((_, index) => index / data.length);
    const closest = breakpoints.reduce((acc, bp, index) => {
      return Math.abs(latest - bp) < Math.abs(latest - breakpoints[acc])
        ? index
        : acc;
    }, 0);
    setActiveCard(closest);
  });

  return (
    <>
      {/* Desktop: Sticky scroll */}
      <div
        ref={ref}
        className="hidden lg:flex relative h-[36rem] justify-between gap-16 overflow-y-auto rounded-none scrollbar-hide"
      >
        {/* Left: Scrollable text */}
        <div className="relative flex items-start w-1/2">
          <div className="max-w-xl">
            {data.map((item, index) => (
              <div key={item.id} className="my-20 first:mt-4">
                <motion.p
                  animate={{ opacity: activeCard === index ? 0.5 : 0.15 }}
                  className="label-text text-black-30 mb-3"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.p>
                <motion.h3
                  animate={{ opacity: activeCard === index ? 1 : 0.2 }}
                  className="font-heading text-2xl md:text-3xl font-semibold text-black mb-4 tracking-tight"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  animate={{ opacity: activeCard === index ? 1 : 0.2 }}
                  className="body-md text-black-70 leading-relaxed"
                >
                  {item.description}
                </motion.p>
              </div>
            ))}
            <div className="h-48" />
          </div>
        </div>

        {/* Right: Sticky image */}
        <div className="sticky top-8 w-1/2 h-[28rem]">
          <div className="relative w-full h-full overflow-hidden bg-black-5">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                animate={{
                  opacity: activeCard === index ? 1 : 0,
                  scale: activeCard === index ? 1 : 1.05,
                }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </motion.div>
            ))}
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-white text-xs font-medium tracking-wider">
              {String(activeCard + 1).padStart(2, "0")} / {String(data.length).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked cards */}
      <div className="lg:hidden space-y-12">
        {data.map((item, index) => (
          <RevealOnScroll key={item.id} delay={index * 0.1}>
            <div>
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black-5 mb-6">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 text-white text-xs font-medium tracking-wider">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
              {/* Text */}
              <h3 className="font-heading text-xl font-semibold text-black mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="body-md text-black-70 leading-relaxed">
                {item.description}
              </p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </>
  );
}
