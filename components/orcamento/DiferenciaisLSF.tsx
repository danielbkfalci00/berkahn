"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Check,
  X,
  Clock,
  Droplets,
  Trash2,
  ThermometerSun,
  Recycle,
  Calendar,
} from "lucide-react";
import type { ComparativoItem, StatItem } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface DiferenciaisLSFProps {
  comparativo: ComparativoItem[];
  beneficios: StatItem[];
}

// Animated comparison row component
function ComparativoRow({
  item,
  index,
}: {
  item: ComparativoItem;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="group"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1.5fr] gap-4 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors rounded-lg px-4 -mx-4">
        {/* Criterio */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white/50 group-hover:bg-white/80 transition-colors" />
          <span className="font-medium text-white">{item.criterio}</span>
        </div>

        {/* Steel Frame */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              item.vencedor === "lsf"
                ? "bg-white/15 border border-white/25"
                : "bg-white/5 border border-white/10"
            )}
          >
            {item.vencedor === "lsf" ? (
              <Check className="w-4 h-4 text-white/80" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-white/30" />
            )}
          </motion.div>
          <span
            className={cn(
              "text-sm",
              item.vencedor === "lsf" ? "text-white font-semibold" : "text-white/60"
            )}
          >
            {item.lsf}
          </span>
        </div>

        {/* Tradicional */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              item.vencedor === "tradicional"
                ? "bg-white/15 border border-white/25"
                : "bg-white/5 border border-white/10"
            )}
          >
            {item.vencedor === "tradicional" ? (
              <Check className="w-4 h-4 text-white/80" />
            ) : (
              <X className="w-3 h-3 text-white/30" />
            )}
          </motion.div>
          <span
            className={cn(
              "text-sm",
              item.vencedor === "tradicional" ? "text-white font-semibold" : "text-white/40"
            )}
          >
            {item.tradicional}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function DiferenciaisLSF({
  comparativo,
  beneficios,
}: DiferenciaisLSFProps) {
  return (
    <section className="py-xl bg-black text-white overflow-hidden">
      <div className="container max-w-7xl">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
              Tecnologia Construtiva
            </span>
            <h2 className="headline-md text-white mb-4">
              Por que escolher Steel Frame?
            </h2>
            <p className="body-md text-white/60 max-w-2xl mx-auto">
              O sistema construtivo que combina velocidade, precisão e
              sustentabilidade para entregar sua casa dos sonhos.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Image Column */}
          <div className="lg:col-span-2">
            <RevealOnScroll>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/images/Lsf/lsf-hero-structure.webp"
                  alt="Estrutura Steel Frame"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                {/* Floating badges on image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white/70" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          Até 6x mais rápido
                        </p>
                        <p className="text-white/60 text-sm">
                          Comparado à alvenaria tradicional
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Corner decoration */}
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
              </div>
            </RevealOnScroll>

            {/* Quick Stats below image on mobile */}
            <div className="grid grid-cols-2 gap-4 mt-6 lg:mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center"
              >
                <Recycle className="w-5 h-5 text-white/70 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">90%</p>
                <p className="text-xs text-white/50">Reciclável</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center"
              >
                <Calendar className="w-5 h-5 text-white/70 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">100+</p>
                <p className="text-xs text-white/50">Anos de vida útil</p>
              </motion.div>
            </div>
          </div>

          {/* Comparison Table Column */}
          <div className="lg:col-span-3">
            <RevealOnScroll delay={0.2}>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Comparativo Detalhado
                </h3>
                <p className="text-sm text-white/50">
                  Veja lado a lado as diferenças entre os sistemas construtivos
                </p>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1.5fr] gap-4 pb-4 mb-2 border-b border-white/10">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Critério
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-white/70" />
                  Steel Frame
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  Alvenaria
                </div>
              </div>

              {/* Comparison Rows */}
              <div className="space-y-1">
                {comparativo.map((item, index) => (
                  <ComparativoRow key={item.criterio} item={item} index={index} />
                ))}
              </div>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/40"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white/80" />
                  </div>
                  <span>Melhor opção</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <X className="w-3 h-3 text-white/30" />
                  </div>
                  <span>Desvantagem</span>
                </div>
              </motion.div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Technical Specs Banner */}
        <RevealOnScroll delay={0.4}>
          <div className="mt-16 pt-12 border-t border-white/10">
            <div className="bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/20 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Certificação ABNT NBR 16970
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    O Light Steel Frame é um sistema construtivo industrializado
                    que utiliza perfis de aço galvanizado, oferecendo{" "}
                    <strong className="text-white">precisão milimétrica</strong>,{" "}
                    <strong className="text-white">
                      mínimo desperdício de materiais
                    </strong>{" "}
                    e{" "}
                    <strong className="text-white">
                      excelente desempenho termoacústico
                    </strong>
                    .
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-white">+10</span>
                    </div>
                    <p className="text-sm text-white font-medium">Anos</p>
                    <p className="text-xs text-white/50">Garantia</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-white">+99%</span>
                    </div>
                    <p className="text-sm text-white font-medium">Precisão</p>
                    <p className="text-xs text-white/50">Orçamentária</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-white">3%</span>
                    </div>
                    <p className="text-sm text-white font-medium">Desperdício</p>
                    <p className="text-xs text-white/50">Máximo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
