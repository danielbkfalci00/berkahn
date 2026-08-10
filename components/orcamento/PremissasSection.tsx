"use client";

import { motion } from "motion/react";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Home,
  Ruler,
  Mountain,
  LayoutGrid,
} from "lucide-react";
import type { OrcamentoProjeto, PremissasProposta } from "@/types/orcamento";
import { RoomMetricsTable } from "./RoomMetricsTable";
import { cn } from "@/lib/utils";

interface PremissasSectionProps {
  projeto: OrcamentoProjeto;
  premissas: PremissasProposta;
}

// Componente de título de seção com decoração
function SectionTitle({ icon: Icon, title, color }: {
  icon: React.ElementType;
  title: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-px bg-black/20" />
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        color
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-xs uppercase tracking-[0.3em] text-black/60 font-semibold">
        {title}
      </h3>
      <div className="flex-1 h-px bg-black/20" />
    </div>
  );
}

export function PremissasSection({
  projeto,
  premissas,
}: PremissasSectionProps) {
  return (
    <section className="py-xl bg-gradient-to-b from-black/[0.02] to-white">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center mb-16">
            {/* Decoração superior */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-black/20" />
              <div className="w-2 h-2 rotate-45 bg-black/20" />
              <div className="w-12 h-px bg-black/20" />
            </div>

            <span className="inline-block text-xs uppercase tracking-[0.3em] text-black/60 mb-4">
              Detalhes da Proposta
            </span>
            <h2 className="headline-md text-black mb-4">
              Premissas e Especificações
            </h2>
            <p className="body-md text-black/60 max-w-2xl mx-auto">
              Confira todas as especificações, itens inclusos e condições que
              fundamentam esta proposta de investimento.
            </p>
          </div>
        </RevealOnScroll>

        {/* Conteúdo em layout stacked */}
        <div className="space-y-12">

          {/* Seção 1: Dados do Projeto */}
          <RevealOnScroll delay={0.1}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-black/5 shadow-luxury-sm">
              <SectionTitle
                icon={Home}
                title="Dados do Projeto"
                color="bg-black/10 text-black"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-black/[0.02] rounded-xl p-4 border border-black/5">
                  <p className="text-xs text-black/60 uppercase tracking-wider mb-2">
                    Projeto
                  </p>
                  <p className="font-semibold text-black">{projeto.titulo}</p>
                </div>
                <div className="bg-black/[0.02] rounded-xl p-4 border border-black/5">
                  <p className="text-xs text-black/60 uppercase tracking-wider mb-2">
                    Tipo
                  </p>
                  <p className="font-semibold text-black capitalize">
                    {projeto.tipo} - {projeto.subtipo}
                  </p>
                </div>
                <div className="bg-black/[0.02] rounded-xl p-4 border border-black/5">
                  <p className="text-xs text-black/60 uppercase tracking-wider mb-2">
                    Localização
                  </p>
                  <p className="font-semibold text-black flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-black/80" />
                    {projeto.localizacao}
                  </p>
                </div>
                <div className="bg-black/[0.02] rounded-xl p-4 border border-black/5">
                  <p className="text-xs text-black/60 uppercase tracking-wider mb-2">
                    Área Construída
                  </p>
                  <p className="font-semibold text-black flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-black/80" />
                    {projeto.metragem}m²
                  </p>
                </div>
                {projeto.terreno && (
                  <>
                    <div className="bg-black/[0.02] rounded-xl p-4 border border-black/5">
                      <p className="text-xs text-black/60 uppercase tracking-wider mb-2">
                        Dimensões do Terreno
                      </p>
                      <p className="font-semibold text-black">
                        {projeto.terreno.largura}m x {projeto.terreno.comprimento}m
                      </p>
                    </div>
                    <div className="bg-black/[0.02] rounded-xl p-4 border border-black/5">
                      <p className="text-xs text-black/60 uppercase tracking-wider mb-2">
                        Topografia
                      </p>
                      <p className="font-semibold text-black capitalize flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-black/80" />
                        {projeto.terreno.declive}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </RevealOnScroll>

          {/* Seção 2: Metragens */}
          {projeto.projetoPreliminar?.metragemComodos && (
            <RevealOnScroll delay={0.15}>
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-black/5 shadow-luxury-sm">
                <SectionTitle
                  icon={LayoutGrid}
                  title="Distribuição de Áreas"
                  color="bg-blue-500/10 text-blue-600"
                />
                <RoomMetricsTable
                  comodos={projeto.projetoPreliminar.metragemComodos}
                  metragemTotal={projeto.projetoPreliminar.metragemTotal}
                />
                {projeto.projetoPreliminar.observacoes && (
                  <p className="text-sm text-black/50 text-center mt-4">
                    {projeto.projetoPreliminar.observacoes}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          )}

          {/* Seção 3: Itens Inclusos */}
          <RevealOnScroll delay={0.2}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-black/5 shadow-luxury-sm">
              <SectionTitle
                icon={CheckCircle2}
                title="O que Inclui"
                color="bg-black/5 text-black/80"
              />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {premissas.itensInclusos.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-start gap-3 p-3 bg-black/[0.02] rounded-lg border border-black/10"
                  >
                    <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-black/80" />
                    </div>
                    <span className="text-sm text-black/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          {/* Seção 4: Itens Não Inclusos */}
          <RevealOnScroll delay={0.25}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-black/5 shadow-luxury-sm">
              <SectionTitle
                icon={XCircle}
                title="Não Inclui"
                color="bg-black/10 text-black/50"
              />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {premissas.itensExclusos.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-start gap-3 p-3 bg-black/[0.02] rounded-lg border border-black/5"
                  >
                    <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <XCircle className="w-3 h-3 text-black/60" />
                    </div>
                    <span className="text-sm text-black/60">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          {/* Seção 5: Observações */}
          {premissas.observacoes && premissas.observacoes.length > 0 && (
            <RevealOnScroll delay={0.3}>
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-black/5 shadow-luxury-sm">
                <SectionTitle
                  icon={AlertCircle}
                  title="Observações Importantes"
                  color="bg-amber-500/10 text-amber-600"
                />
                <ul className="space-y-3">
                  {premissas.observacoes.map((obs, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 bg-amber-50/50 rounded-lg border border-amber-100"
                    >
                      <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm text-black/70 pt-1">{obs}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          )}
        </div>

        {/* Condições do Terreno */}
        <RevealOnScroll delay={0.35}>
          <div className="mt-12 p-6 lg:p-8 bg-white border border-black/5 rounded-2xl shadow-luxury-sm">
            {/* Decoração */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-black/20" />
              <span className="text-xs uppercase tracking-[0.3em] text-black/60 font-semibold">
                Condições do Terreno Consideradas
              </span>
              <div className="flex-1 h-px bg-black/20" />
            </div>

            <div className="flex flex-wrap gap-2">
              {premissas.condicoesTerreno.map((cond, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/5 text-black/90 text-xs font-medium rounded-full border border-black/15"
                >
                  <div className="w-1.5 h-1.5 rotate-45 bg-black" />
                  {cond}
                </motion.span>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Validade */}
        <RevealOnScroll delay={0.4}>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-black/[0.02] border border-black/5 rounded-full">
              <div className="w-2 h-2 rotate-45 bg-black/20" />
              <p className="text-sm text-black/50">
                Proposta válida por{" "}
                <span className="font-medium text-black/70">
                  {premissas.dataValidade}
                </span>{" "}
                a partir da data de emissão
              </p>
              <div className="w-2 h-2 rotate-45 bg-black/20" />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
