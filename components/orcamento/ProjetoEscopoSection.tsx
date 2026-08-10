"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { motion } from "motion/react";
import { Layers, Shield, Thermometer } from "lucide-react";
import type { OrcamentoProjeto } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface ProjetoEscopoSectionProps {
  projeto: OrcamentoProjeto;
}

export function ProjetoEscopoSection({ projeto }: ProjetoEscopoSectionProps) {
  if (!projeto.metodologia) return null;

  const { metodologia } = projeto;

  return (
    <section className="py-xl bg-gradient-to-b from-black/[0.02] to-white">
      <div className="container max-w-5xl">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-black/60 mb-4">
              Sobre o Projeto
            </span>
            <h2 className="headline-md text-black mb-4">Escopo da Proposta</h2>
            <p className="body-md text-black/60 max-w-2xl mx-auto">
              Conheça a metodologia construtiva e os detalhes técnicos do seu
              projeto
            </p>
          </div>
        </RevealOnScroll>

        {/* Descrição Geral */}
        {metodologia.descricaoGeral && (
          <RevealOnScroll delay={0.1}>
            <div className="bg-white rounded-xl p-6 lg:p-8 border border-black/5 shadow-sm mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-6 h-6 text-black/80" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {metodologia.estruturacao}
                  </h3>
                  <p className="text-black/70 leading-relaxed">
                    {metodologia.descricaoGeral}
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* Grid de Vedações */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vedação Externa */}
          {metodologia.vedacaoExterna && (
            <RevealOnScroll delay={0.2}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-6 border border-black/5 shadow-sm h-full"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black">
                      Vedação Externa
                    </h4>
                    {metodologia.vedacaoExterna.espessuraTotal && (
                      <p className="text-xs text-black/50">
                        Espessura total: {metodologia.vedacaoExterna.espessuraTotal}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {metodologia.vedacaoExterna.camadas.map((camada, index) => (
                    <motion.div
                      key={camada.numero}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold",
                          camada.funcao === "impermeabilizacao" &&
                            "bg-blue-100 text-blue-700",
                          camada.funcao === "estrutural" &&
                            "bg-black/5 text-black/90",
                          camada.funcao === "acabamento" &&
                            "bg-amber-100 text-amber-700",
                          camada.funcao === "isolamento" &&
                            "bg-purple-100 text-purple-700"
                        )}
                      >
                        {camada.numero}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-black">
                          {camada.material}
                        </p>
                        <p className="text-sm text-black/60">
                          {camada.especificacao}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </RevealOnScroll>
          )}

          {/* Vedação Interna + Isolamento */}
          <RevealOnScroll delay={0.3}>
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-black/5 shadow-sm h-full"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold text-black">
                  Vedação Interna e Isolamento
                </h4>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/[0.02] rounded-lg">
                  <p className="font-medium text-black mb-1">Vedação Interna</p>
                  <p className="text-sm text-black/70">
                    {metodologia.vedacaoInterna}
                  </p>
                </div>

                {metodologia.isolamentoTermico && (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="font-medium text-orange-900 mb-1">
                      Isolamento Térmico
                    </p>
                    <p className="text-sm text-orange-800">
                      {metodologia.isolamentoTermico}
                    </p>
                  </div>
                )}
              </div>

              {/* Benefícios do Isolamento */}
              <div className="mt-6 pt-4 border-t border-black/5">
                <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-3">
                  Benefícios
                </p>
                <ul className="space-y-2">
                  {[
                    "Conforto térmico superior",
                    "Redução do consumo de energia",
                    "Isolamento acústico integrado",
                  ].map((beneficio, i) => (
                    <li
                      key={i}
                      className="text-sm text-black/60 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black" />
                      {beneficio}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
