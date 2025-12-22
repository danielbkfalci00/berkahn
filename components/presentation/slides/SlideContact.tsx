"use client";

import { motion } from "framer-motion";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CharReveal } from "@/components/animations/TextReveal";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const contactInfo = {
  email: "contato.berkahn@gmail.com",
  phone: "+55 (11) 96641-5742",
  phoneRaw: "5511966415742",
  website: "https://berkahn.com.br",
  cnpj: "39.455.932/0001-64",
};

export function SlideContact() {
  return (
    <SlideSection dark className="py-20 lg:py-32">
      <div className="container max-w-4xl mx-auto text-center">
        {/* Main Message */}
        <RevealOnScroll className="mb-8">
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-4">
            <CharReveal text="Obrigado." delay={0.2} />
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.3} className="mb-12">
          <p className="text-xl sm:text-2xl md:text-3xl text-white/70 font-light">
            Vamos construir juntos?
          </p>
        </RevealOnScroll>

        {/* CTA Button */}
        <RevealOnScroll delay={0.5} className="mb-16">
          <Link
            href={contactInfo.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold text-sm sm:text-base uppercase tracking-widest hover:bg-white/90 transition-all duration-300 hover:scale-105"
          >
            Acessar Nosso Site
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </RevealOnScroll>

        {/* Contact Info */}
        <RevealOnScroll delay={0.7}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-16">
            {/* Email */}
            <motion.a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300 group"
              whileHover={{ x: 5 }}
            >
              <Mail className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm sm:text-base">{contactInfo.email}</span>
            </motion.a>

            {/* Phone / WhatsApp */}
            <motion.a
              href={`https://wa.me/${contactInfo.phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300 group"
              whileHover={{ x: 5 }}
            >
              <Phone className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm sm:text-base">{contactInfo.phone}</span>
            </motion.a>
          </div>
        </RevealOnScroll>

        {/* Decorative Line */}
        <RevealOnScroll delay={0.9}>
          <div className="w-24 h-px bg-white/20 mx-auto mb-8" />
        </RevealOnScroll>

        {/* Footer Logo */}
        <RevealOnScroll delay={1}>
          <p className="font-heading text-2xl sm:text-3xl font-bold tracking-[0.3em] text-white/30">
            BERKAHN
          </p>
        </RevealOnScroll>

        {/* CNPJ */}
        <RevealOnScroll delay={1.1}>
          <p className="text-white/40 text-xs sm:text-sm mt-4">
            CNPJ: {contactInfo.cnpj}
          </p>
        </RevealOnScroll>
      </div>
    </SlideSection>
  );
}
