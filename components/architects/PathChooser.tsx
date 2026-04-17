"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";

interface PathProps {
  index: "01" | "02";
  kicker: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  href: string;
  delay: number;
}

function PathCard({
  index,
  kicker,
  title,
  description,
  cta,
  image,
  href,
  delay,
}: PathProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -6 }}
      className="group relative block bg-white border border-black-5 hover:border-black-20 hover:shadow-luxury-lg transition-[border-color,box-shadow] duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[5/3] overflow-hidden bg-black-5">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 ease-expo group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-8 lg:p-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-heading text-sm tracking-[0.3em] text-black-30 tabular-nums">
            {index}
          </span>
          <div className="w-6 h-px bg-black-20" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-black-70">
            {kicker}
          </span>
        </div>

        <h3 className="font-heading text-2xl md:text-3xl font-light leading-[1.15] tracking-tight text-black mb-4">
          {title}
        </h3>

        <p className="text-base text-black-70 font-light leading-relaxed mb-8">
          {description}
        </p>

        <div className="inline-flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] border-b border-black/30 pb-1 group-hover:border-black transition-colors duration-300">
            {cta}
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
        </div>
      </div>
    </motion.a>
  );
}

export function PathChooser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <section
      ref={ref}
      className="relative w-full bg-off-white px-6 lg:px-12 py-24 lg:py-32"
    >
      <div className="max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-6">
            Dois caminhos
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-black">
            Como você prefere começar
            <span className="italic font-extralight text-black-70"> sua obra?</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          <PathCard
            index="01"
            kicker="Autoral"
            title="Trabalhar com um arquiteto parceiro"
            description="Briefing personalizado e projeto sob medida assinado por um dos quatro escritórios autorais selecionados pela Berkahn."
            cta="Ver arquitetos"
            image="/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp"
            href="#arquitetos"
            delay={0.15}
          />
          <PathCard
            index="02"
            kicker="Curado"
            title="Escolher um modelo engenheirado"
            description="Linha própria Berkahn com projeto, especificações e prazo já resolvidos. Construção em 30 a 90 dias."
            cta="Ver modelos"
            image="/images/Services/projetos-prontos/Loft/loft-hero.webp"
            href="#modelos"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
