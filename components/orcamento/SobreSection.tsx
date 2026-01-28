"use client";

import { motion } from "framer-motion";
import { Home, Building2, Factory, Zap, Leaf, Gauge, Shield, Volume2, Maximize2, Target, Scale } from "lucide-react";
import Image from "next/image";
import { BENEFITS } from "@/lib/lsf-data";
import { CountUp } from "@/components/animations/CountUp";

// Mapeamento de ícones
const iconMap: Record<string, React.ElementType> = {
  speed: Zap,
  sustainability: Leaf,
  energy: Gauge,
  durability: Shield,
  acoustic: Volume2,
  area: Maximize2,
  precision: Target,
  weight: Scale,
};

// Setores de atuação
const SETORES = [
  { icon: Home, label: "RESIDENCIAL" },
  { icon: Building2, label: "CORPORATIVO / COMERCIAL" },
  { icon: Factory, label: "INDUSTRIAL" },
];

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
        </motion.div>

        {/* Main Layout: 60% conteúdo | 40% foto */}
        <div className="grid lg:grid-cols-[1fr_40%] gap-8 lg:gap-12 items-start">

          {/* ESQUERDA: Conteúdo */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* NOSSA EXPERTISE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 lg:p-10 border border-black/5 shadow-luxury-sm"
            >
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-black mb-4">
                NOSSA EXPERTISE
              </h2>
              <p className="text-lg text-black/80 leading-relaxed">
                Somos uma construtora especializada em Light Steel Frame no Brasil.
                Priorizamos esta tecnologia por sua eficiência, precisão e sustentabilidade
                — mas nossa expertise vai além: <strong className="text-black">Dominamos múltiplos sistemas construtivos</strong> para entregar sempre a melhor solução.
              </p>
            </motion.div>

            {/* Setores de Atuação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm text-black/60 mb-4 text-center lg:text-left">
                Construímos para todos os setores
              </p>
              <div className="grid grid-cols-3 gap-3">
                {SETORES.map((setor, index) => {
                  const Icon = setor.icon;
                  return (
                    <motion.div
                      key={setor.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                      className="bg-black text-white rounded-xl p-4 lg:p-5 text-center"
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-white/70" strokeWidth={1.5} />
                      <span className="text-[10px] lg:text-xs font-medium tracking-wider">
                        {setor.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

          </div>

          {/* DIREITA: Foto */}
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

        {/* Seção: Vantagens do Light Steel Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="font-heading text-xl lg:text-2xl font-semibold text-black text-center mb-8">
            E quais são as Vantagens do Light Steel Frame?
          </h3>

          {/* Grid de 8 indicadores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BENEFITS.map((benefit, index) => {
              const Icon = iconMap[benefit.icon];
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white rounded-xl p-5 border border-black/5 shadow-luxury-sm text-center hover:shadow-luxury-md transition-shadow"
                >
                  {Icon && (
                    <Icon className="w-6 h-6 mx-auto mb-3 text-black/30" strokeWidth={1.5} />
                  )}
                  <CountUp
                    end={benefit.stat}
                    suffix={benefit.suffix}
                    className="font-heading text-3xl lg:text-4xl font-bold text-black"
                  />
                  <p className="text-xs text-black/50 mt-1 uppercase tracking-wider">
                    {benefit.description.split(" ").slice(0, 3).join(" ")}
                  </p>
                  <p className="text-sm text-black/70 mt-1 font-medium">
                    {benefit.title}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
