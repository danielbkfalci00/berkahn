"use client";

import { motion } from "motion/react";
import type { Architect } from "@/lib/architects-data";

interface Props {
  architect: Architect;
}

export function ArchitectBerkahnPartnership({ architect }: Props) {
  return (
    <section className="relative w-full bg-black text-white py-24 lg:py-36 px-6 lg:px-12 overflow-hidden">
      {/* Subtle texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(255,255,255,1) 0%, transparent 50%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/50 mb-6"
        >
          Berkahn × {architect.studioName}
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="font-heading text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] tracking-tight max-w-3xl"
        >
          Como funciona a parceria com a Berkahn.
        </motion.h3>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-5"
          >
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-light">
              O {architect.studioName} assina o projeto arquitetônico —
              implantação, programa, partido formal, materialidade. A Berkahn
              entra como parceira técnica de execução: detalhamento estrutural
              em steel frame, compatibilização de instalações e gestão integral
              da obra.
            </p>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-light">
              Você contrata os dois lados de forma transparente, ou contrata só
              a Berkahn e nós estruturamos a parceria com o escritório.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-8"
          >
            <div className="flex items-baseline gap-6 border-l border-white/20 pl-6">
              <span className="font-heading text-3xl font-extralight tabular-nums text-white">
                01
              </span>
              <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                Você visita esta página, escolhe um arquiteto cuja linguagem
                converse com seu projeto.
              </p>
            </div>
            <div className="flex items-baseline gap-6 border-l border-white/20 pl-6">
              <span className="font-heading text-3xl font-extralight tabular-nums text-white">
                02
              </span>
              <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                Conversamos sobre terreno, orçamento e prazos — alinhamento
                inicial sem compromisso.
              </p>
            </div>
            <div className="flex items-baseline gap-6 border-l border-white/20 pl-6">
              <span className="font-heading text-3xl font-extralight tabular-nums text-white">
                03
              </span>
              <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                Você decide: contato direto com o arquiteto ou intermediação
                completa pela Berkahn.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
