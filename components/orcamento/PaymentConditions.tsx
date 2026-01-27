"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { motion } from "framer-motion";
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { CondicaoPagamento } from "@/types/orcamento";

interface PaymentConditionsProps {
  condicoes: CondicaoPagamento[];
  valorTotal?: number;
}

export function PaymentConditions({
  condicoes,
}: PaymentConditionsProps) {
  const condicaoPrincipal = condicoes.find((c) => c.destaque) || condicoes[0];

  if (!condicaoPrincipal) return null;

  return (
    <section className="py-xl bg-gradient-to-b from-white to-black/[0.02]">
      <div className="container max-w-5xl">
        <RevealOnScroll>
          <div className="text-center mb-12">
            {/* Decoração superior */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-black/20" />
              <div className="w-2 h-2 rotate-45 bg-black/20" />
              <div className="w-12 h-px bg-black/20" />
            </div>

            <span className="inline-block text-xs uppercase tracking-[0.3em] text-black/40 mb-4">
              Investimento
            </span>
            <h2 className="headline-md text-black mb-4">
              Condições de Pagamento
            </h2>
            <p className="body-md text-black/60 max-w-2xl mx-auto">
              {condicaoPrincipal.descricao}
            </p>
          </div>
        </RevealOnScroll>

        {condicaoPrincipal.estruturaPagamento && (
          <div className="space-y-6">
            {/* Estrutura de Pagamento - 3 Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Sinal */}
              {condicaoPrincipal.estruturaPagamento.sinal && (
                <RevealOnScroll delay={0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl p-6 border border-black/10 hover:border-black/20 transition-all duration-300 shadow-sm hover:shadow-md text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-lg font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Sinal
                    </h3>
                    <p className="text-3xl font-bold text-black mb-2">
                      {condicaoPrincipal.estruturaPagamento.sinal.percentual}%
                    </p>
                    <p className="text-sm text-black/60">
                      {condicaoPrincipal.estruturaPagamento.sinal.descricao}
                    </p>
                  </motion.div>
                </RevealOnScroll>
              )}

              {/* Parcelas */}
              {condicaoPrincipal.estruturaPagamento.parcelas?.map((parcela, index) => (
                <RevealOnScroll key={parcela.numero} delay={0.15 + index * 0.05}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl p-6 border border-black/10 hover:border-black/20 transition-all duration-300 shadow-sm hover:shadow-md text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-black/10 text-black flex items-center justify-center mx-auto mb-4">
                      <span className="text-lg font-bold">{parcela.numero + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {parcela.descricao || `${parcela.numero}ª Parcela`}
                    </h3>
                    <p className="text-3xl font-bold text-black mb-2">
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
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <div className="flex gap-4">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-amber-900 mb-3">
                          Informações de Faturamento
                        </h4>
                        <ul className="space-y-2">
                          {condicaoPrincipal.observacoesPagamento.map((obs, i) => (
                            <li
                              key={i}
                              className="text-sm text-amber-800 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
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
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm">
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
