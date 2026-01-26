"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import type { ProjetoGaleria } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface MiniGaleriaProps {
  projetos: ProjetoGaleria[];
  titulo?: string;
  subtitulo?: string;
}

function ProjetoCard({
  projeto,
  index,
}: {
  projeto: ProjetoGaleria;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.19, 1, 0.22, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href="/projetos" className="block">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
          {/* Image */}
          <Image
            src={projeto.imagem}
            alt={projeto.titulo}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
              isHovered ? "opacity-100" : "opacity-70"
            )}
          />

          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 left-4"
          >
            <span className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-xs text-white font-medium">
              {projeto.categoria}
            </span>
          </motion.div>

          {/* Zoom Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isHovered
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </motion.div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={isHovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-2"
            >
              {projeto.metragem && (
                <span className="text-xs text-white/70">
                  {projeto.metragem}m²
                </span>
              )}
            </motion.div>

            <div className="flex items-end justify-between">
              <h3 className="text-lg font-semibold text-white">
                {projeto.titulo}
              </h3>
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={
                  isHovered ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }
                }
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <ArrowUpRight className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Border animation */}
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-white/0"
            animate={
              isHovered
                ? { borderColor: "rgba(255,255,255,0.3)" }
                : { borderColor: "rgba(255,255,255,0)" }
            }
            transition={{ duration: 0.3 }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export function MiniGaleria({
  projetos,
  titulo = "Projetos Realizados",
  subtitulo = "Conheça alguns dos nossos projetos entregues com sucesso",
}: MiniGaleriaProps) {
  return (
    <section className="py-xl bg-white">
      <div className="container max-w-7xl">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-black/40 mb-4">
              Portfólio
            </span>
            <h2 className="headline-md text-black mb-4">{titulo}</h2>
            <p className="body-md text-black/60 max-w-2xl mx-auto">
              {subtitulo}
            </p>
          </div>
        </RevealOnScroll>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projetos.map((projeto, index) => (
            <ProjetoCard key={projeto.id} projeto={projeto} index={index} />
          ))}
        </div>

        {/* CTA Link */}
        <RevealOnScroll delay={0.4}>
          <div className="text-center mt-10">
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black transition-colors group"
            >
              <span>Ver todos os projetos</span>
              <motion.div
                className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors"
              >
                <ArrowUpRight className="w-3 h-3 group-hover:text-white transition-colors" />
              </motion.div>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
