"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Shield, Award, CheckCircle2 } from "lucide-react";

const stats = [
  {
    value: 20,
    suffix: "+",
    label: "ANOS DE",
    sublabel: "EXPERIÊNCIA",
    description: "Duas décadas construindo obras de alto padrão",
  },
  {
    value: 85,
    suffix: " MIL",
    label: "METROS",
    sublabel: "QUADRADOS",
    description: "Área total de construção gerenciada",
  },
  {
    value: 100,
    suffix: "%",
    label: "SATISFAÇÃO",
    sublabel: "CLIENTES",
    description: "Índice de recomendação e satisfação",
  },
  {
    value: 23,
    suffix: "",
    label: "PROJETOS",
    sublabel: "ENTREGUES",
    description: "Residências e empreendimentos finalizados",
  },
];

const certificacoes = [
  {
    icon: Shield,
    sigla: "ABNT NBR 16970",
    titulo: "Steel Frame",
    descricao: "Norma técnica brasileira LSF",
  },
  {
    icon: Award,
    sigla: "ISO 9001",
    titulo: "Gestão de Qualidade",
    descricao: "Sistema certificado",
  },
  {
    icon: CheckCircle2,
    sigla: "PBQP-H Nível A",
    titulo: "Qualidade Habitat",
    descricao: "Programa brasileiro",
  },
];

export function AboutBigNumbers() {
  return (
    <section className="relative min-h-screen bg-white flex items-center overflow-hidden">
      {/* Corner Brackets - Top Left */}
      <div className="absolute top-8 left-8 w-20 h-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-black" />
        <div className="absolute top-0 left-0 w-[2px] h-full bg-black" />
      </div>

      {/* Corner Brackets - Top Right */}
      <div className="absolute top-8 right-8 w-20 h-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-black" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-black" />
      </div>

      {/* Corner Brackets - Bottom Left */}
      <div className="absolute bottom-8 left-8 w-20 h-20 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-black" />
      </div>

      {/* Corner Brackets - Bottom Right */}
      <div className="absolute bottom-8 right-8 w-20 h-20 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-black" />
        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-black" />
      </div>

      {/* Número de seção */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-12 right-12 text-[280px] font-black text-black/[0.015] leading-none select-none font-heading"
      >
        02
      </motion.span>

      {/* Cross-hair central sutil */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-16 h-[1px] bg-black/5" />
        <div className="w-[1px] h-16 bg-black/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container max-w-7xl mx-auto px-8 lg:px-12 py-20">
        {/* Header */}
        <RevealOnScroll>
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-[1px] bg-black/20" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-black/40">
                Experiência Comprovada
              </span>
              <div className="w-16 h-[1px] bg-black/20" />
            </div>

            <h2 className="font-heading text-5xl lg:text-6xl font-bold tracking-tight text-black mb-4">
              NÚMEROS QUE
              <br />
              CONSTROEM CONFIANÇA
            </h2>
          </div>
        </RevealOnScroll>

        {/* Grid de Stats 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-black/10 border border-black/10 mb-20">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="relative bg-white p-12 lg:p-16 flex flex-col items-center justify-center text-center group hover:bg-black/[0.01] transition-colors"
            >
              {/* Corner interno */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Número gigante */}
              <div className="mb-6">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  duration={2500}
                  className="text-7xl lg:text-8xl xl:text-9xl font-black text-black leading-none"
                />
              </div>

              {/* Labels */}
              <div className="space-y-1 mb-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-black">
                  {stat.label}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/60">
                  {stat.sublabel}
                </div>
              </div>

              {/* Descrição */}
              <p className="text-xs text-black/50 max-w-[200px] leading-relaxed">
                {stat.description}
              </p>

              {/* Decoração inferior */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-black/10" />
            </motion.div>
          ))}
        </div>

        {/* Certificações (Technical Stamps) */}
        <RevealOnScroll delay={0.6}>
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-1 h-1 bg-black rotate-45" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                Certificações e Garantias Técnicas
              </h3>
              <div className="w-1 h-1 bg-black rotate-45" />
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {certificacoes.map((cert, idx) => {
                const Icon = cert.icon;
                return (
                  <motion.div
                    key={cert.sigla}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                  >
                    {/* Stamp border */}
                    <div className="border-2 border-black/80 rounded-sm p-6 bg-white hover:bg-black hover:border-black transition-all duration-300">
                      <div className="flex flex-col items-center gap-3 w-48">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center group-hover:border-white/20 transition-colors">
                          <Icon className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                        </div>

                        {/* Sigla */}
                        <div className="text-center">
                          <div className="text-xs font-black uppercase tracking-wider text-black group-hover:text-white transition-colors mb-1">
                            {cert.sigla}
                          </div>
                          <div className="text-[9px] font-semibold text-black/60 group-hover:text-white/60 transition-colors">
                            {cert.titulo}
                          </div>
                        </div>

                        {/* Descrição */}
                        <div className="w-full h-[1px] bg-black/10 group-hover:bg-white/10" />
                        <p className="text-[8px] text-center text-black/50 group-hover:text-white/50 transition-colors leading-relaxed">
                          {cert.descricao}
                        </p>
                      </div>
                    </div>

                    {/* Stamp corner marks */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
