"use client";

import { motion } from "motion/react";
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
      <section className="relative bg-white text-black py-16 lg:py-24 overflow-hidden">
        <OrcamentoWatermark variant="light" logoPosition="center" />

        <div className="container px-4 sm:px-6 lg:px-8 relative z-10 mb-4">
          <SectionLabel number="01" title="Apresentação Construtora" variant="light" className="mb-0" />
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className=""
          >
            {/* Main title */}
            <h2 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
              BERKAHN
            </h2>

            {/* Introductory paragraph */}
            <p className="text-xl text-black/60 max-w-2xl leading-relaxed">
              Especialistas em construção com Light Steel Frame, oferecemos soluções construtivas de alta precisão e qualidade técnica. Com metodologia própria e equipe especializada, transformamos projetos em realidade com agilidade, eficiência e compromisso com prazos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content section */}
      <section className="relative py-xl bg-gradient-to-b from-white via-white to-black/[0.02]">
        <OrcamentoWatermark variant="light" logoPosition="top-right" />
        <div className="container max-w-7xl relative z-10">

        {/* Main Layout: 60% conteúdo | 40% foto */}
        <div className="grid lg:grid-cols-[1fr_40%] gap-8 lg:gap-12 items-center">

          {/* ESQUERDA: Conteúdo */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* NOSSA EXPERTISE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-10 lg:p-14 border border-black/5 shadow-luxury-sm"
            >
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-black mb-4">
                NOSSA EXPERTISE
              </h2>
              <p className="text-xl text-black/80 leading-relaxed">
                Somos uma construtora especializada em Light Steel Frame.
                Priorizamos esta tecnologia por sua eficiência, precisão e sustentabilidade
                — mas nossa expertise vai além: <strong className="text-black">Dominamos múltiplos sistemas construtivos</strong> para entregar sempre a melhor solução.
              </p>
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

        {/* Setores de Atuação - Full width, centralizado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-12"
        >
          <p className="text-base text-black/60 mb-8 uppercase tracking-widest">
            Construímos para todos os setores
          </p>
          <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
            {SETORES.map((setor, index) => (
              <motion.div
                key={setor.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="group relative h-[260px] lg:h-[360px] rounded-xl overflow-hidden"
              >
                <Image
                  src={setor.image}
                  alt={setor.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                  <h4 className="text-sm lg:text-base font-bold tracking-wider mb-2">
                    {setor.label}
                  </h4>
                  <div className="w-8 h-px bg-white/40 mb-2" />
                  <p className="text-xs lg:text-sm text-white/70 leading-tight">
                    {setor.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seção: Vantagens do Light Steel Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-black text-center mb-10">
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
                  className="bg-white rounded-xl p-6 lg:p-8 border border-black/5 shadow-luxury-sm text-center hover:shadow-luxury-md transition-shadow"
                >
                  {Icon && (
                    <Icon className="w-7 h-7 mx-auto mb-4 text-black/30" strokeWidth={1.5} />
                  )}
                  <CountUp
                    end={benefit.stat}
                    suffix={benefit.suffix}
                    className="font-heading text-3xl lg:text-4xl font-bold text-black"
                  />
                  <p className="text-sm text-black/50 mt-1 uppercase tracking-wider">
                    {benefit.description.split(" ").slice(0, 3).join(" ")}
                  </p>
                  <p className="text-base text-black/70 mt-1 font-medium">
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
