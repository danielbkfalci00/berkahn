"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { TrackedWhatsAppLink } from "@/components/layout/WhatsAppButton";

const WHATSAPP_NUMBER = "5511966415742";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá Berkahn! Vi a página de curadoria e gostaria de conversar sobre o caminho ideal para minha obra em steel frame."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export function UnifiedCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <section
      ref={ref}
      className="relative w-full bg-white px-6 lg:px-12 py-32 lg:py-44 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-8"
        >
          Em dúvida sobre qual caminho seguir?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight"
        >
          Fale com a curadoria{" "}
          <span className="italic font-extralight text-black-70">Berkahn</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="mt-8 text-lg md:text-xl text-black-70 font-light leading-relaxed max-w-2xl mx-auto"
        >
          Conte seu projeto, prazo e terreno. Indicamos o arquiteto certo ou o
          modelo pronto que faz mais sentido para você.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.45, ease: [0.19, 1, 0.22, 1] }}
          className="mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton intensity={14}>
            <TrackedWhatsAppLink
              href={WHATSAPP_URL}
              ctaLocation="curadoria_cta"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 hover:bg-black-90 transition-colors duration-300"
            >
              <span className="text-xs uppercase tracking-[0.3em]">
                Falar no WhatsApp
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
            </TrackedWhatsAppLink>
          </MagneticButton>

          <a
            href="mailto:contato.berkahn@gmail.com"
            className="group inline-flex items-center gap-3 px-8 py-4"
          >
            <span className="text-xs uppercase tracking-[0.3em] border-b border-black/30 pb-1 group-hover:border-black transition-colors duration-300">
              Enviar e-mail
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
