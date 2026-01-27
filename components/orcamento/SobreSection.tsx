"use client";

import { motion } from "framer-motion";
import { Award, Lightbulb, Target } from "lucide-react";
import Image from "next/image";

export function SobreSection() {
  return (
    <section className="py-xl bg-gradient-to-b from-white via-white to-black/[0.02]">
      <div className="container max-w-7xl">

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-px bg-black/20" />
          <div className="w-2 h-2 rotate-45 bg-black/20" />
          <div className="w-12 h-px bg-black/20" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-xs uppercase tracking-[0.3em] text-black/40 mb-4">
            A Berkahn
          </h1>
          <h2 className="headline-md text-black mb-4">
            Mestres em construir
          </h2>
          <p className="body-md text-black/60 max-w-2xl mx-auto">
            Líderes em Light Steel Frame
          </p>
        </motion.div>

        {/* Main Layout: Image + Content Grid */}
        <div className="grid lg:grid-cols-[38%_1fr] gap-6 items-start">

          {/* Left: Large Anchor Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-luxury-md group"
          >
            <Image
              src="/images/orcamento/sobre_berkahn_1.webp"
              alt="Berkahn - Expertise em Light Steel Frame"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 38vw"
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>

          {/* Right: Content Grid */}
          <div className="space-y-6">

            {/* Narrative Card with Subtle Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-8 lg:p-10 border border-black/5 shadow-luxury-sm overflow-hidden"
            >
              {/* Background accent image (very subtle) */}
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-[0.03]">
                <Image
                  src="/images/orcamento/sobre_berkahn_2.webp"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>

              <p className="text-lg text-black/80 leading-relaxed relative z-10">
                Nascemos da experiência de quem conhece construção de verdade.
                São <strong className="text-black">20 anos somados</strong> em projetos
                industrializados que nos ensinaram uma coisa: a melhor surpresa
                é não ter surpresa nenhuma.
              </p>
            </motion.div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Card: Excelência */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-black/5 shadow-luxury-sm"
              >
                <Award className="w-7 h-7 text-black/30 mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-black mb-1">Excelência</h3>
                <p className="text-sm text-black/60">
                  Compromisso com qualidade e precisão
                </p>
              </motion.div>

              {/* Card: Inovação */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-6 border border-black/5 shadow-luxury-sm"
              >
                <Lightbulb className="w-7 h-7 text-black/30 mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-black mb-1">Inovação</h3>
                <p className="text-sm text-black/60">
                  Tecnologia e métodos modernos
                </p>
              </motion.div>

              {/* Card: Precisão (NOVO - substituiu Agilidade) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-black/5 shadow-luxury-sm"
              >
                <Target className="w-7 h-7 text-black/30 mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-black mb-1">Precisão</h3>
                <p className="text-sm text-black/60">
                  Tolerância de ±1mm em cada peça
                </p>
              </motion.div>

              {/* Card: Big Number */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="bg-black text-white rounded-2xl p-6 flex flex-col justify-center col-span-2 lg:col-span-3"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">20+</span>
                  <p className="text-sm text-white/60">
                    anos de experiência combinada
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Featured Card: 50% mais rápido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-black text-white rounded-2xl p-8 lg:p-10"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white/60 mb-1">
                    Tempo de obra
                  </h3>
                  <p className="text-4xl lg:text-5xl font-bold">
                    50% mais rápido
                  </p>
                </div>
                <p className="text-white/70 max-w-md lg:text-right">
                  O sistema Light Steel Frame permite construir em metade do tempo
                  de uma obra convencional. Menos tempo em obra significa menos
                  custos indiretos e entrada mais rápida no imóvel.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
