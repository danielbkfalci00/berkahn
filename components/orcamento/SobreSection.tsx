"use client";

import { motion } from "framer-motion";
import { Zap, Leaf, Gauge, Shield, Volume2, Maximize2, Target, Scale } from "lucide-react";
import Image from "next/image";
import { BENEFITS } from "@/lib/lsf-data";
import { CountUp } from "@/components/animations/CountUp";
import { OrcamentoWatermark } from "./OrcamentoWatermark";
import { SectionLabel } from "./SectionLabel";

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

// Setores de atuação com imagens (mesmo da home)
const SETORES = [
  {
    label: "RESIDENCIAL",
    description: "Projetos residenciais com qualidade técnica e acabamento de alto nível.",
    image: "/images/Services/residencial.webp",
  },
  {
    label: "CORPORATIVO / COMERCIAL",
    description: "Ambientes corporativos com identidade e eficiência.",
    image: "/images/Services/comercial.webp",
  },
  {
    label: "INDUSTRIAL",
    description: "Estruturas industriais para máxima eficiência e durabilidade.",
    image: "/images/Services/industrial.webp",
  },
];

export function SobreSection() {
  return (
    <>
      {/* Hero Header - Transição marcante */}
      <section className="relative bg-black text-white py-20 lg:py-28 overflow-hidden">
        <OrcamentoWatermark variant="dark" logoPosition="center" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90 z-[1]" />

        <div className="container max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Section tag */}
            <SectionLabel number="01" title="Apresentação Construtora" variant="dark" />

            {/* Main title */}
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
              BERKAHN
            </h1>

            {/* Subtitle */}
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-light text-white/70 mb-6">
              Mestres em construir
            </h2>

            {/* Tagline */}
            <p className="text-sm text-white/50 uppercase tracking-[0.2em]">
              Líderes em Light Steel Frame
            </p>

            {/* Decorative element */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="w-16 h-px bg-white/20" />
              <div className="w-1.5 h-1.5 rotate-45 bg-white/30" />
              <div className="w-16 h-px bg-white/20" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content section */}
      <section className="relative py-xl bg-gradient-to-b from-white via-white to-black/[0.02]">
        <OrcamentoWatermark variant="light" logoPosition="top-right" />
        <div className="container max-w-7xl relative z-10">

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

            {/* Setores de Atuação - Cards com imagens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm text-black/60 mb-4 text-center lg:text-left uppercase tracking-widest">
                Construímos para todos os setores
              </p>
              <div className="grid grid-cols-3 gap-3">
                {SETORES.map((setor, index) => (
                  <motion.div
                    key={setor.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    className="group relative h-[180px] lg:h-[220px] rounded-xl overflow-hidden"
                  >
                    {/* Background Image */}
                    <Image
                      src={setor.image}
                      alt={setor.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 33vw, 200px"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/40" />
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center text-white">
                      <h4 className="text-[10px] lg:text-xs font-bold tracking-wider mb-1">
                        {setor.label}
                      </h4>
                      <div className="w-6 h-px bg-white/40 mb-2" />
                      <p className="text-[8px] lg:text-[10px] text-white/70 leading-tight hidden sm:block">
                        {setor.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
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
    </>
  );
}
