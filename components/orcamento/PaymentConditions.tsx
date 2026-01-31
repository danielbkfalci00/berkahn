"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { motion } from "framer-motion";
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { CondicaoPagamento } from "@/types/orcamento";
import { OrcamentoWatermark } from "./OrcamentoWatermark";
import { SectionLabel } from "./SectionLabel";

interface PaymentConditionsProps {
  condicoes: CondicaoPagamento[];
  valorTotal?: number;
  isPDFMode?: boolean;
}

export function PaymentConditions({
  condicoes,
  isPDFMode = false,
}: PaymentConditionsProps) {
  const condicaoPrincipal = condicoes.find((c) => c.destaque) || condicoes[0];

  if (!condicaoPrincipal) return null;

  return (
    <section className={`relative ${isPDFMode ? "py-4" : "py-xl"} bg-[#F4F2EC]`}>
      <OrcamentoWatermark variant="light" logoPosition="top-right" />
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionLabel number="06" title="Pagamento" variant="light" />
        <RevealOnScroll>
          <div className={`${isPDFMode ? "mb-2" : "mb-16"}`}>
            <h2 className="headline-lg text-black mb-4">
              Condições de Pagamento
            </h2>
            <p className="body-lg text-black/60 max-w-2xl">
              {condicaoPrincipal.descricao}
            </p>
          </div>
        </RevealOnScroll>
      </div>
      <div className="container max-w-6xl relative z-10">

        {condicaoPrincipal.estruturaPagamento && (
          <div className={isPDFMode ? "space-y-4" : "space-y-6"}>
            {/* Estrutura de Pagamento - 3 Cards */}
            <div className={`grid md:grid-cols-3 ${isPDFMode ? "gap-3" : "gap-6"}`}>
              {/* Sinal */}
              {condicaoPrincipal.estruturaPagamento.sinal && (
                <RevealOnScroll delay={0.1}>
                  <motion.div
                    whileHover={isPDFMode ? {} : { y: -4 }}
                    className={`h-full flex flex-col bg-white rounded-xl ${isPDFMode ? "p-4" : "p-8 lg:p-10"} border border-black/10 hover:border-black/20 transition-all duration-300 shadow-sm hover:shadow-md text-center`}
                  >
                    <div className={`${isPDFMode ? "w-10 h-10 mb-3" : "w-14 h-14 mb-4"} rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-lg`}>
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h3 className={`${isPDFMode ? "text-base" : "text-xl"} font-semibold text-black mb-2`}>
                      Sinal
                    </h3>
                    <p className={`${isPDFMode ? "text-2xl" : "text-4xl lg:text-5xl"} font-bold text-black mb-2`}>
                      {condicaoPrincipal.estruturaPagamento.sinal.percentual}%
                    </p>
                    <p className="text-base text-black/60 flex-1">
                      {condicaoPrincipal.estruturaPagamento.sinal.descricao}
                    </p>
                  </motion.div>
                </RevealOnScroll>
              )}

              {/* Parcelas */}
              {condicaoPrincipal.estruturaPagamento.parcelas?.map((parcela, index) => (
                <RevealOnScroll key={parcela.numero} delay={0.15 + index * 0.05}>
                  <motion.div
                    whileHover={isPDFMode ? {} : { y: -4 }}
                    className={`h-full flex flex-col bg-white rounded-xl ${isPDFMode ? "p-4" : "p-8 lg:p-10"} border border-black/10 hover:border-black/20 transition-all duration-300 shadow-sm hover:shadow-md text-center`}
                  >
                    <div className={`${isPDFMode ? "w-10 h-10 mb-3" : "w-14 h-14 mb-4"} rounded-full bg-black/10 text-black flex items-center justify-center mx-auto`}>
                      <span className="text-xl font-bold">{parcela.numero + 1}</span>
                    </div>
                    <h3 className={`${isPDFMode ? "text-base" : "text-xl"} font-semibold text-black mb-2`}>
                      {parcela.descricao || `${parcela.numero}ª Parcela`}
                    </h3>
                    <p className={`${isPDFMode ? "text-2xl" : "text-4xl lg:text-5xl"} font-bold text-black mb-2`}>
                      {parcela.percentual}%
                    </p>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>

            {/* Informações de Pagamento */}
            {condicaoPrincipal.observacoesPagamento &&
              condicaoPrincipal.observacoesPagamento.length > 0 && (
                <RevealOnScroll delay={0.3}>
                  <div className="bg-white rounded-xl p-8 border border-black/10 shadow-sm">
                    <div className="flex gap-4">
                      <AlertCircle className="w-5 h-5 text-black/60 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-black mb-3">
                          Informações de Faturamento
                        </h4>
                        <ul className="space-y-2">
                          {condicaoPrincipal.observacoesPagamento.map((obs, i) => (
                            <li
                              key={i}
                              className="text-base text-black/70 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-black/60 flex-shrink-0 mt-0.5" />
                              <span>{obs}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              )}

            {/* Tipo de Faturamento Badge */}
            {condicaoPrincipal.tipoFaturamento && (
              <RevealOnScroll delay={0.35}>
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-base">
                    <CreditCard className="w-4 h-4" />
                    <span>
                      Faturamento:{" "}
                      <span className="font-semibold capitalize">
                        {condicaoPrincipal.tipoFaturamento === "direto"
                          ? "Direto (Nota Fiscal)"
                          : condicaoPrincipal.tipoFaturamento}
                      </span>
                    </span>
                  </div>
                </div>
              </RevealOnScroll>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
