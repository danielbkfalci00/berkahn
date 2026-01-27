"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Award,
  CheckCircle2,
} from "lucide-react";
import type { OrcamentoProjeto } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface CTAFinalProps {
  projeto: OrcamentoProjeto;
  validoAte: string;
  numeroOrcamento: string;
  contatos: {
    whatsapp: string;
    telefone: string;
    email: string;
    endereco: string;
    cnpj: string;
  };
}

export function CTAFinal({
  projeto,
  validoAte,
  numeroOrcamento,
  contatos,
}: CTAFinalProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black text-white overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>
      </motion.div>

      <div className="relative container max-w-6xl py-xl">
        {/* Informações de Contato (sem botões - proposta comercial) */}
        <RevealOnScroll delay={0.4}>
          <div className="mb-16">
            {/* Linha decorativa com label */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-white/20" />
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                Entre em Contato
              </span>
              <div className="w-16 h-px bg-white/20" />
            </div>

            {/* Cards de contato estáticos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Telefone
                </p>
                <p className="text-white font-medium">{contatos.telefone}</p>
              </div>

              <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                  E-mail
                </p>
                <p className="text-white font-medium">{contatos.email}</p>
              </div>

              <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Endereço
                </p>
                <p className="text-white font-medium text-center">{contatos.endereco}</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Guarantees */}
        <RevealOnScroll delay={0.5}>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { icon: Shield, text: "10 Anos de Garantia" },
              { icon: Award, text: "Certificação ABNT" },
              { icon: CheckCircle2, text: "Qualidade Garantida" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full"
              >
                <item.icon className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Footer da Proposta */}
        <RevealOnScroll delay={0.6}>
          <div className="pt-12 border-t border-white/10">
            {/* Linha decorativa */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex-1 h-px bg-white/10" />
              <div className="w-2 h-2 rotate-45 bg-white/20" />
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Logo e assinatura */}
            <div className="text-center">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-heading text-3xl font-extrabold tracking-[0.15em] text-white mb-2"
              >
                BERKAHN
              </motion.h3>
              <p className="text-xs text-white/40 mb-6">
                Especialistas em Light Steel Frame
              </p>

              {/* Dados da empresa */}
              <div className="flex flex-wrap justify-center gap-6 text-xs text-white/30 mb-4">
                <span>CNPJ: {contatos.cnpj}</span>
                <span className="hidden sm:block">•</span>
                <span>{contatos.endereco}</span>
              </div>

              {/* Número do orçamento */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <span className="text-xs uppercase tracking-widest text-white/40">
                  Revisão 01
                </span>
                <span className="text-sm font-medium text-white">
                  #{numeroOrcamento}
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
