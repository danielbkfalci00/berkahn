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
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-black/40 mb-4">
            Apresentação Construtora
          </span>
          <h1 className="font-heading text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-black mb-4">
            BERKAHN
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-black/70 mb-2">
            Mestres em construir
          </h2>
          <p className="body-md text-black/60 max-w-2xl mx-auto">
            Líderes em Light Steel Frame
          </p>
        </motion.div>

        {/* Main Layout: 60% conteúdo | 40% foto */}
        <div className="grid lg:grid-cols-[1fr_40%] gap-8 lg:gap-12 items-center">

          {/* ESQUERDA: Todo o conteúdo */}
          <div className="space-y-6 order-2 lg:order-1">

            {/* Texto narrativo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 lg:p-10 border border-black/5 shadow-luxury-sm"
            >
              <p className="text-lg text-black/80 leading-relaxed">
                Nascemos da experiência de quem conhece construção de verdade.
                São <strong className="text-black">20 anos somados</strong> em projetos
                industrializados que nos ensinaram uma coisa: a melhor surpresa
                é não ter surpresa nenhuma.
              </p>
            </motion.div>

            {/* Grid 3 colunas: valores */}
            <div className="grid grid-cols-3 gap-4">

              {/* Card: Excelência */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5 lg:p-6 border border-black/5 shadow-luxury-sm"
              >
                <Award className="w-6 h-6 text-black/30 mb-3" strokeWidth={1.5} />
                <h3 className="text-base lg:text-lg font-semibold text-black mb-1">Excelência</h3>
                <p className="text-xs lg:text-sm text-black/60">
                  Compromisso com qualidade
                </p>
              </motion.div>

              {/* Card: Inovação */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-5 lg:p-6 border border-black/5 shadow-luxury-sm"
              >
                <Lightbulb className="w-6 h-6 text-black/30 mb-3" strokeWidth={1.5} />
                <h3 className="text-base lg:text-lg font-semibold text-black mb-1">Inovação</h3>
                <p className="text-xs lg:text-sm text-black/60">
                  Tecnologia moderna
                </p>
              </motion.div>

              {/* Card: Precisão */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 lg:p-6 border border-black/5 shadow-luxury-sm"
              >
                <Target className="w-6 h-6 text-black/30 mb-3" strokeWidth={1.5} />
                <h3 className="text-base lg:text-lg font-semibold text-black mb-1">Precisão</h3>
                <p className="text-xs lg:text-sm text-black/60">
                  Tolerância de ±1mm
                </p>
              </motion.div>
            </div>

            {/* Grid 2 colunas: estatísticas */}
            <div className="grid grid-cols-2 gap-4">

              {/* Card: 20+ anos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="bg-black text-white rounded-2xl p-6 lg:p-8"
              >
                <span className="text-4xl lg:text-5xl font-bold">20+</span>
                <p className="text-sm text-white/60 mt-1">
                  anos de experiência combinada
                </p>
              </motion.div>

              {/* Card: 50% mais rápido */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-black text-white rounded-2xl p-6 lg:p-8"
              >
                <span className="text-4xl lg:text-5xl font-bold">50%</span>
                <p className="text-sm text-white/60 mt-1">
                  mais rápido que alvenaria
                </p>
              </motion.div>
            </div>

          </div>

          {/* DIREITA: Uma única foto - corpo inteiro */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-luxury-md order-1 lg:order-2"
          >
            <Image
              src="/images/orcamento/sobre_berkahn_1.webp"
              alt="Berkahn - Expertise em Light Steel Frame"
              width={600}
              height={800}
              quality={90}
              className="w-full h-auto"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
