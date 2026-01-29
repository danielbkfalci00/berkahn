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
import { OrcamentoWatermark } from "./OrcamentoWatermark";
import { cn } from "@/lib/utils";
import { FOOTER_SOCIAL } from "@/lib/constants";

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
  isPDFMode?: boolean;
}

// Helper function for social icons
function getSocialIcon(type: string) {
  switch (type) {
    case "linkedin":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "instagram":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    default:
      return null;
  }
}

export function CTAFinal({
  projeto,
  validoAte,
  numeroOrcamento,
  contatos,
  isPDFMode = false,
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
      className={cn("relative bg-black text-white overflow-hidden", isPDFMode ? "h-full" : "min-h-screen")}
    >
      {/* Background with parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>

      <OrcamentoWatermark variant="dark" logoPosition="center" />

      <div className={cn("relative container max-w-6xl", isPDFMode ? "py-8" : "py-xl")}>
        {/* Informações de Contato (sem botões - proposta comercial) */}
        <RevealOnScroll delay={0.4}>
          <div className={isPDFMode ? "mb-8" : "mb-16"}>
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
          <div className={cn("flex flex-wrap justify-center gap-4", isPDFMode ? "mb-8" : "mb-16")}>
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

              {/* Número de revisão */}
              <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <span className="text-xs uppercase tracking-widest text-white/60 font-medium">
                  Revisão 00
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Footer - Direitos Reservados e Redes Sociais */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            © 2026 Berkahn. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            {FOOTER_SOCIAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="text-white/70 hover:text-white transition-colors duration-300"
              >
                <span className="w-5 h-5 block">{getSocialIcon(item.type)}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
