"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/animations/CountUp";
import type { Architect } from "@/lib/architects-data";

interface Props {
  architect: Architect;
}

export function ArchitectMetrics({ architect }: Props) {
  const isLargeArea = architect.metrics.areaBuilt >= 1000;

  const stats = [
    {
      label: "Anos no mercado",
      end: architect.metrics.yearsActive,
      decimals: 0,
      suffix: "",
      unit: "",
    },
    {
      label: "Projetos entregues",
      end: architect.metrics.completedProjects,
      decimals: 0,
      suffix: "+",
      unit: "",
    },
    {
      label: "Metros² construídos",
      end: isLargeArea ? architect.metrics.areaBuilt / 1000 : architect.metrics.areaBuilt,
      decimals: isLargeArea ? 1 : 0,
      suffix: isLargeArea ? "k" : "",
      unit: "m²",
    },
  ];

  return (
    <section className="relative w-full bg-off-white py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-12 lg:mb-20 text-center">
          Em números
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.12,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="px-6 py-8 md:py-0 text-center"
            >
              <p className="font-heading text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-black tabular-nums">
                <CountUp
                  as="span"
                  end={stat.end}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  duration={1800 + i * 200}
                />
                {stat.unit && (
                  <span className="text-3xl md:text-4xl text-black-50 ml-1 font-light">
                    {stat.unit}
                  </span>
                )}
              </p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-black-50 mt-4">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
