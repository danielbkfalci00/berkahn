"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, Award, CheckCircle2 } from "lucide-react";
import type { CertificationExplained } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface CertificationsExplainedProps {
  certifications: CertificationExplained[];
}

/**
 * Certificações explicadas com flip cards 3D
 * Front: Badge com ícone e sigla
 * Back: Benefícios práticos + "why it matters"
 * Mobile-friendly (click to flip)
 */
export function CertificationsExplained({
  certifications,
}: CertificationsExplainedProps) {
  const [flipped, setFlipped] = useState<number | null>(null);

  const icons = [Shield, Award, CheckCircle2];

  return (
    <section className="relative py-20 bg-[#F4F2EC]">
      <div className="container max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="font-serif text-3xl lg:text-4xl text-[#2D2D2D] mb-4">
            Mais do que Certificações
          </h3>
          <p className="text-lg text-[#2D2D2D]/70">
            O que elas significam para você
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => {
            const Icon = icons[index] || Shield;
            const isFlipped = flipped === index;

            return (
              <motion.div
                key={cert.sigla}
                className="relative h-80 cursor-pointer"
                style={{ perspective: "1000px" }}
                onMouseEnter={() => setFlipped(index)}
                onMouseLeave={() => setFlipped(null)}
                onClick={() => setFlipped(isFlipped ? null : index)}
              >
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* FRONT */}
                  <div
                    className={cn(
                      "absolute inset-0",
                      "bg-white rounded-xl shadow-lg",
                      "flex flex-col items-center justify-center p-8"
                    )}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <Icon className="w-16 h-16 text-[#C77D5C] mb-6" />
                    <h4 className="text-xl font-bold text-[#2D2D2D] mb-2 text-center">
                      {cert.sigla}
                    </h4>
                    <p className="text-sm text-[#2D2D2D]/60 text-center">
                      Toque para saber mais
                    </p>
                  </div>

                  {/* BACK */}
                  <div
                    className={cn(
                      "absolute inset-0",
                      "bg-[#2D2D2D] text-white rounded-xl shadow-lg",
                      "flex flex-col p-6 overflow-y-auto"
                    )}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <h4 className="text-lg font-bold mb-4">{cert.sigla}</h4>

                    <p className="text-sm opacity-90 mb-4">
                      Em outras palavras...
                    </p>

                    <ul className="space-y-2 mb-4 flex-1">
                      {cert.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-[#C77D5C] mt-1">→</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm italic border-t border-white/20 pt-4 text-white/90">
                      {cert.whyItMatters}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
