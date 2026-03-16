"use client";

import { motion } from "motion/react";
import { Receipt } from "lucide-react";
import { MATERIAIS_DETALHADOS, IMPOSTO_INFO } from "@/lib/orcamento-data";
import { OrcamentoWatermark } from "./OrcamentoWatermark";
import { SectionLabel } from "./SectionLabel";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * MateriaisSection - Composição Técnica do Projeto
 * Tabela com 7 colunas + mini seção de impostos
 * 3 níveis visuais: categoria, subcategoria, item
 */
export function MateriaisSection() {
  return (
    <section className="relative py-xl bg-[#F4F2EC]">
      <OrcamentoWatermark variant="light" logoPosition="top-right" />
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <SectionLabel number="03" title="Descrição Analítica dos Materiais" variant="light" />
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-black mb-3">
            COMPOSIÇÃO TÉCNICA DO PROJETO
          </h2>
          <p className="text-base text-black/60 max-w-2xl">
            Relação detalhada de materiais, componentes, quantidades e valores previstos para a execução.
          </p>
        </motion.div>

        {/* Tabela de Materiais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-luxury-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-4 text-left w-20 font-semibold tracking-wide">
                    ITEM
                  </th>
                  <th className="px-4 py-4 text-left font-semibold tracking-wide">
                    DESCRIÇÃO
                  </th>
                  <th className="px-4 py-4 text-center w-16 font-semibold tracking-wide">
                    UNID.
                  </th>
                  <th className="px-4 py-4 text-right w-20 font-semibold tracking-wide">
                    QNTD.
                  </th>
                  <th className="px-4 py-4 text-right w-32 font-semibold tracking-wide text-[11px] leading-tight">
                    CUSTO UNIT.<br />MAT. (R$)
                  </th>
                  <th className="px-4 py-4 text-right w-32 font-semibold tracking-wide text-[11px] leading-tight">
                    CUSTO UNIT.<br />M.O. (R$)
                  </th>
                  <th className="px-4 py-4 text-right w-36 font-semibold tracking-wide">
                    VALOR TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATERIAIS_DETALHADOS.map((material, index) => {
                  const isCategoria = material.isCategoria;
                  const isSubcategoria = material.isSubcategoria;
                  const isItem = !isCategoria && !isSubcategoria;

                  return (
                    <motion.tr
                      key={material.item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.03 * index }}
                      className={`
                        border-b border-black/5 transition-colors
                        ${isCategoria
                          ? "bg-black/[0.04]"
                          : isSubcategoria
                            ? "bg-black/[0.015]"
                            : index % 2 === 0
                              ? "bg-white hover:bg-black/[0.02]"
                              : "bg-black/[0.01] hover:bg-black/[0.03]"
                        }
                      `}
                    >
                      {/* ITEM */}
                      <td className={`px-4 py-3.5 ${isCategoria ? "font-bold" : ""}`}>
                        {isCategoria ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
                            {material.item.replace(".", "")}
                          </span>
                        ) : isSubcategoria ? (
                          <span className="text-black/50 pl-2 font-mono text-xs font-semibold">
                            {material.item}
                          </span>
                        ) : (
                          <span className="text-black/50 pl-4 font-mono text-xs">
                            {material.item}
                          </span>
                        )}
                      </td>

                      {/* DESCRIÇÃO */}
                      <td className={`px-4 py-3.5 ${
                        isCategoria
                          ? "font-bold text-black"
                          : isSubcategoria
                            ? "font-semibold text-black/70 pl-6"
                            : "text-black/80 pl-8"
                      }`}>
                        {material.descricao}
                      </td>

                      {/* UNIDADE */}
                      <td className="px-4 py-3.5 text-center text-black/50 font-mono text-xs">
                        {isCategoria || isSubcategoria ? "" : (material.unidade || "—")}
                      </td>

                      {/* QUANTIDADE */}
                      <td className="px-4 py-3.5 text-right font-mono text-sm text-black/70">
                        {isCategoria || isSubcategoria ? "" : (material.quantidade || "—")}
                      </td>

                      {/* CUSTO UNIT. MAT. */}
                      <td className="px-4 py-3.5 text-right font-mono text-sm text-black/70">
                        {isItem && material.custoUnitarioMat !== undefined
                          ? formatCurrency(material.custoUnitarioMat)
                          : isItem ? "—" : ""}
                      </td>

                      {/* CUSTO UNIT. M.O. */}
                      <td className="px-4 py-3.5 text-right font-mono text-sm text-black/70">
                        {isItem && material.custoUnitarioMO !== undefined
                          ? formatCurrency(material.custoUnitarioMO)
                          : isItem ? "—" : ""}
                      </td>

                      {/* VALOR TOTAL */}
                      <td className={`px-4 py-3.5 text-right font-mono text-sm ${
                        material.valorTotal === "INCLUSO"
                          ? "text-emerald-600 font-medium"
                          : isCategoria
                            ? "font-bold text-black"
                            : isSubcategoria
                              ? "font-semibold text-black/70"
                              : "text-black/70"
                      }`}>
                        {material.valorTotal === "INCLUSO"
                          ? "INCLUSO"
                          : typeof material.valorTotal === "number"
                            ? formatCurrency(material.valorTotal)
                            : "—"}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Notas */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="px-6 py-4 border-t border-black/10 bg-black/[0.02]"
          >
            <p className="text-xs text-black/50 italic">
              * Especificações sujeitas a alterações conforme projeto executivo final
            </p>
            <p className="text-xs text-black/40 mt-1">
              Todos os materiais seguem normas ABNT e possuem certificação de qualidade
            </p>
          </motion.div>
        </motion.div>

        {/* Mini Seção: Tributação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl border border-black/10 shadow-luxury-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-black/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
              <Receipt className="w-4.5 h-4.5 text-black/50" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black">Tributação</h3>
              <p className="text-xs text-black/50">Impostos incidentes sobre o serviço</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-black/40 uppercase tracking-wider mb-1">CNAE do CNPJ</p>
                <p className="text-sm text-black/80 font-medium">{IMPOSTO_INFO.cnae}</p>
              </div>
              <div>
                <p className="text-xs text-black/40 uppercase tracking-wider mb-1">Enquadramento</p>
                <p className="text-sm text-black/80 font-medium">{IMPOSTO_INFO.anexo}</p>
              </div>
              <div>
                <p className="text-xs text-black/40 uppercase tracking-wider mb-1">Faixa</p>
                <p className="text-sm text-black/80 font-medium">{IMPOSTO_INFO.faixaDescricao}</p>
              </div>
              <div>
                <p className="text-xs text-black/40 uppercase tracking-wider mb-1">Alíquota Nominal</p>
                <p className="text-sm text-black/80 font-medium">{IMPOSTO_INFO.aliquotaNominal}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-black/10">
              <div>
                <p className="text-xs text-black/40 uppercase tracking-wider">Alíquota Efetiva</p>
                <p className="text-lg font-bold text-black">{IMPOSTO_INFO.aliquotaEfetiva}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-black/40 uppercase tracking-wider">Valor Total Imposto</p>
                <p className="text-lg font-bold text-black">R$ {formatCurrency(IMPOSTO_INFO.valorTotal)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
