"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { motion } from "framer-motion";
import {
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import type { CondicaoPagamento } from "@/types/orcamento";
import { formatarValor } from "@/lib/orcamento-data";
import { cn } from "@/lib/utils";

interface PaymentConditionsProps {
  condicoes: CondicaoPagamento[];
  valorTotal: number;
}

export function PaymentConditions({
  condicoes,
  valorTotal,
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
          <div className="space-y-4">
            {/* Valor Total */}
            <RevealOnScroll delay={0.05}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-black text-white rounded-xl p-6 lg:p-8 text-center"
              >
                <p className="text-sm text-white/60 mb-2">Valor Total do Pacote Selecionado</p>
                <p className="text-4xl lg:text-5xl font-bold">
                  {formatarValor(valorTotal)}
                </p>
              </motion.div>
            </RevealOnScroll>

            {/* Estrutura de Pagamento */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Sinal */}
              {condicaoPrincipal.estruturaPagamento.sinal && (
                <RevealOnScroll delay={0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl p-6 border border-black/10 hover:border-black/20 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-xl font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-black">
                            Sinal
                          </h3>
                          <span className="text-sm font-medium text-black/80 bg-black/5 px-2 py-1 rounded">
                            {condicaoPrincipal.estruturaPagamento.sinal.percentual}%
                          </span>
                        </div>
                        <p className="text-sm text-black/60 mb-3">
                          {condicaoPrincipal.estruturaPagamento.sinal.descricao}
                        </p>
                        <p className="text-2xl font-bold text-black/80">
                          {formatarValor(
                            valorTotal *
                              (condicaoPrincipal.estruturaPagamento.sinal.percentual / 100)
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </RevealOnScroll>
              )}

              {/* Saldo */}
              <RevealOnScroll delay={0.15}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl p-6 border border-black/10 hover:border-black/20 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-black/10 text-black flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-black">
                          Saldo por Medições
                        </h3>
                        <span className="text-sm font-medium text-black/60 bg-black/5 px-2 py-1 rounded">
                          50%
                        </span>
                      </div>
                      <p className="text-sm text-black/60 mb-3">
                        Pagamento conforme conclusão das etapas
                      </p>
                      <p className="text-2xl font-bold text-black">
                        {formatarValor(valorTotal * 0.5)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </RevealOnScroll>
            </div>

            {/* Parcelas/Medições Detalhadas */}
            {condicaoPrincipal.estruturaPagamento.parcelas &&
              condicaoPrincipal.estruturaPagamento.parcelas.length > 0 && (
                <RevealOnScroll delay={0.2}>
                  <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
                    <div className="bg-black/[0.02] px-6 py-4 border-b border-black/5">
                      <h4 className="text-sm font-semibold text-black uppercase tracking-wider">
                        Cronograma de Medições
                      </h4>
                    </div>
                    <div className="divide-y divide-black/5">
                      {condicaoPrincipal.estruturaPagamento.parcelas.map(
                        (parcela, index) => (
                          <motion.div
                            key={parcela.numero}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 hover:bg-black/[0.01] transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-black/5 text-black/80 flex items-center justify-center font-bold text-sm">
                                  M{parcela.numero}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-black">
                                    {parcela.vinculoEtapa}
                                  </p>
                                  {parcela.prazo && (
                                    <p className="text-sm text-black/50">
                                      {parcela.prazo}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 sm:text-right">
                                <span className="text-sm text-black/50">
                                  {parcela.percentual}%
                                </span>
                                <ArrowRight className="w-4 h-4 text-black/30 hidden sm:block" />
                                <span className="text-lg font-bold text-black/80">
                                  {formatarValor(
                                    valorTotal * (parcela.percentual / 100)
                                  )}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </RevealOnScroll>
              )}

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
