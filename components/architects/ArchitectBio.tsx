"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { TextReveal } from "@/components/animations/TextReveal";
import type { Architect } from "@/lib/architects-data";

interface Props {
  architect: Architect;
}

export function ArchitectBio({ architect }: Props) {
  const paragraphs = architect.bio.split("\n\n");

  return (
    <section className="relative w-full bg-white py-28 lg:py-40 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-off-white">
              <Image
                src={architect.architectPhoto}
                alt={`${architect.architectName} — ${architect.studioName}`}
                fill
                quality={80}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-black-50">
              {architect.architectName}
              <span className="text-black-30 mx-2">·</span>
              <span className="text-black-30">{architect.studioName}</span>
            </p>
          </motion.div>

          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-7 lg:pt-4"
          >
            <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-8">
              Filosofia
              <span className="text-black-30 mx-2">·</span>
              <span className="text-black-30">do escritório</span>
            </p>

            <div className="space-y-6">
              {paragraphs.map((p, i) =>
                i === 0 ? (
                  <TextReveal
                    key={i}
                    text={p}
                    delay={0.3}
                    className="text-xl md:text-2xl font-light leading-[1.45] text-black tracking-tight"
                  />
                ) : (
                  <p
                    key={i}
                    className="text-base md:text-lg text-black-70 leading-relaxed font-light"
                  >
                    {p}
                  </p>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
