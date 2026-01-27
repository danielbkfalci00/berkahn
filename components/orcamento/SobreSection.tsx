"use client";

import { motion } from "framer-motion";
import { Award, Lightbulb, Clock } from "lucide-react";

export function SobreSection() {
  return (
    <section className="py-xl bg-gradient-to-b from-white via-white to-black/[0.02]">
      <div className="container max-w-5xl">

        {/* Decorative line (padrão das outras seções) */}
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
            A Berkahn
          </span>
          <h2 className="headline-md text-black mb-4">
            Mestres em construir
          </h2>
          <p className="body-md text-black/60 max-w-2xl mx-auto">
            Especialistas em Light Steel Frame
          </p>
        </motion.div>

        {/* Card principal com narrativa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 lg:p-8 border border-black/5 shadow-luxury-sm mb-6"
        >
          {/* Narrativa - storytelling direto */}
          <p className="text-lg text-black/80 leading-relaxed max-w-3xl">
            Nascemos da experiência de quem conhece construção de verdade.
            São <strong className="text-black">20 anos somados</strong> em projetos
            industrializados que nos ensinaram uma coisa: a melhor surpresa
            é não ter surpresa nenhuma.
          </p>
        </motion.div>

        {/* Grid: Valores + Big Number */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card: Excelência */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-black/5 shadow-luxury-sm"
          >
            <Award className="w-7 h-7 text-black/30 mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-black mb-1">Excelência</h3>
            <p className="text-sm text-black/60">
              Compromisso com qualidade e precisão em cada etapa
            </p>
          </motion.div>

          {/* Card: Inovação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-black/5 shadow-luxury-sm"
          >
            <Lightbulb className="w-7 h-7 text-black/30 mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-black mb-1">Inovação</h3>
            <p className="text-sm text-black/60">
              Tecnologia de ponta e métodos construtivos modernos
            </p>
          </motion.div>

          {/* Card: Agilidade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-black/5 shadow-luxury-sm"
          >
            <Clock className="w-7 h-7 text-black/30 mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-black mb-1">Agilidade</h3>
            <p className="text-sm text-black/60">
              Sistema industrializado que reduz o tempo de obra em 50%
            </p>
          </motion.div>

          {/* Card: Big Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-black text-white rounded-2xl p-6 flex flex-col justify-center"
          >
            <span className="text-5xl font-bold">20+</span>
            <p className="text-sm text-white/60 mt-1">
              anos de experiência combinada
            </p>
          </motion.div>
        </div>

        {/* Card grande: Diferencial principal - TANGÍVEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-4 bg-black text-white rounded-2xl p-6 lg:p-8"
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
    </section>
  );
}
