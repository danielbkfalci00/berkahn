"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) setActiveCard(index);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    textRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const ease = [0.19, 1, 0.22, 1] as const;

  return (
    <>
      {/* Desktop: Viewport sticky scroll */}
      <div className="hidden lg:block container">
        <div className="grid grid-cols-2 gap-16 relative">
          {/* Left: Text blocks that scroll with the page */}
          <div>
            {data.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                data-index={index}
                className="min-h-[50vh] flex items-center"
              >
                <div className="py-12 max-w-lg">
                  <motion.p
                    animate={{
                      opacity: prefersReducedMotion
                        ? 0.5
                        : activeCard === index
                          ? 0.5
                          : 0.15,
                    }}
                    transition={{ duration: 0.5, ease }}
                    className="label-text text-black-30 mb-3"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.p>
                  <motion.h3
                    animate={{
                      opacity: prefersReducedMotion
                        ? 1
                        : activeCard === index
                          ? 1
                          : 0.3,
                    }}
                    transition={{ duration: 0.5, ease }}
                    className="font-heading text-2xl md:text-3xl font-semibold text-black mb-4 tracking-tight"
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    animate={{
                      opacity: prefersReducedMotion
                        ? 1
                        : activeCard === index
                          ? 1
                          : 0.3,
                    }}
                    transition={{ duration: 0.5, ease }}
                    className="body-md text-black-70 leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Sticky image panel */}
          <div className="relative">
            <div className="sticky top-[15vh] h-[70vh]">
              <div className="relative w-full h-full overflow-hidden bg-black-5">
                {data.map((item, index) => (
                  <motion.div
                    key={item.id}
                    animate={{
                      opacity: activeCard === index ? 1 : 0,
                      scale: activeCard === index ? 1 : 1.04,
                    }}
                    transition={{ duration: 0.6, ease }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </motion.div>
                ))}
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-white text-xs font-medium tracking-wider">
                  {String(activeCard + 1).padStart(2, "0")} /{" "}
                  {String(data.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked cards */}
      <div className="lg:hidden container space-y-12">
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
