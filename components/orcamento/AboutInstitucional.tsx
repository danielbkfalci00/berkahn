"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const valores = [
  {
    titulo: "EXCELÊNCIA",
    descricao:
      "Compromisso inabalável com qualidade e precisão em cada etapa da construção",
  },
  {
    titulo: "INOVAÇÃO",
    descricao:
      "Tecnologia Steel Frame de ponta com metodologias internacionais certificadas",
  },
  {
    titulo: "SUSTENTABILIDADE",
    descricao:
      "Construção consciente com redução de resíduos e eficiência energética",
  },
];

const diferenciais = [
  "Equipe especializada certificada internacionalmente",
  "50% de redução no tempo de obra garantida",
  "Certificações técnicas ABNT NBR 16970 e ISO 9001",
  "Acompanhamento completo do projeto à entrega",
];

const compromissos = [
  { valor: "50%", label: "Redução em Prazo" },
  { valor: "100%", label: "Satisfação" },
  { valor: "100%", label: "Cumprimento" },
];

export function AboutInstitucional() {
  return (
    <section className="relative min-h-screen bg-[#F4F2EC] flex items-center overflow-hidden">
      {/* Grid de fundo técnico */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #000000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Corner Brackets - Top Left */}
      <div className="absolute top-8 left-8 w-16 h-16 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-black" />
        <div className="absolute top-0 left-0 w-[2px] h-full bg-black" />
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-black/20" />
      </div>

      {/* Corner Brackets - Top Right */}
      <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-black" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-black" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-black/20" />
      </div>

      {/* Corner Brackets - Bottom Left */}
      <div className="absolute bottom-8 left-8 w-16 h-16 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-black" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-black/20" />
      </div>

      {/* Corner Brackets - Bottom Right */}
      <div className="absolute bottom-8 right-8 w-16 h-16 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-black" />
        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-black" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-black/20" />
      </div>

      {/* Número de seção gigante */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-12 left-12 text-[280px] font-black text-black/[0.015] leading-none select-none font-heading"
        style={{ fontVariantNumeric: "lining-nums" }}
      >
        01
      </motion.span>

      {/* Linha vertical divisória */}
      <div className="absolute left-[45%] top-0 bottom-0 w-[1px] bg-black/5" />

      <div className="container max-w-7xl mx-auto px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Lado Esquerdo - Headline + Navegação */}
          <div className="lg:col-span-5 space-y-12">
            <RevealOnScroll>
              {/* Label superior */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-black/20" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-black/40">
                  Institucional
                </span>
              </div>

              {/* Headline principal */}
              <h2 className="font-heading text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight text-black">
                EXCELÊNCIA
                <br />
                EM CADA
                <br />
                DETALHE
              </h2>

              {/* Subtítulo técnico */}
              <p className="text-sm lg:text-base text-black/60 leading-relaxed max-w-md tracking-wide">
                Duas décadas construindo obras de alto padrão com tecnologia
                Steel Frame e metodologia internacional certificada.
              </p>
            </RevealOnScroll>

            {/* Navegação de tópicos */}
            <RevealOnScroll delay={0.2}>
              <div className="space-y-4 border-l-[1px] border-black/10 pl-6">
                {["Valores", "Diferenciais", "Compromissos"].map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-3 h-3 bg-black/80 rotate-45 transition-transform group-hover:rotate-[225deg]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/70">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* Lado Direito - Conteúdo */}
          <div className="lg:col-span-7 space-y-16">
            {/* Valores */}
            <RevealOnScroll delay={0.3}>
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-1 bg-black rotate-45" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                    Nossos Valores
                  </h3>
                  <div className="flex-1 h-[1px] bg-black/10" />
                </div>

                <div className="space-y-6">
                  {valores.map((valor, idx) => (
                    <motion.div
                      key={valor.titulo}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-[11px] font-black tracking-[0.2em] text-black">
                          {valor.titulo}
                        </span>
                        <div className="flex-1 h-[1px] bg-black/5" />
                      </div>
                      <p className="text-sm leading-relaxed text-black/70 pl-0">
                        {valor.descricao}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Diferenciais */}
            <RevealOnScroll delay={0.5}>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-1 bg-black rotate-45" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                    Diferenciais Técnicos
                  </h3>
                  <div className="flex-1 h-[1px] bg-black/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {diferenciais.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-start gap-3 p-4 bg-black/[0.02] border border-black/5 rounded"
                    >
                      <div className="w-1 h-1 bg-black/60 rotate-45 mt-2 flex-shrink-0" />
                      <span className="text-xs leading-relaxed text-black/80">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Números de compromisso */}
            <RevealOnScroll delay={0.7}>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-1 bg-black rotate-45" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                    Compromissos Mensuráveis
                  </h3>
                  <div className="flex-1 h-[1px] bg-black/10" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {compromissos.map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-center p-4 border border-black/10 bg-white/50"
                    >
                      <div className="text-3xl font-black text-black mb-1">
                        {stat.valor}
                      </div>
                      <div className="text-[8px] font-semibold uppercase tracking-[0.25em] text-black/40">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* Marcador de continuação */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-[1px] h-12 bg-black/20" />
          <div className="w-2 h-2 rotate-45 bg-black/30" />
        </div>
      </motion.div>
    </section>
  );
}
