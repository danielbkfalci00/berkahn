import Image from "next/image";
import { METODOLOGIA_LSF } from "@/lib/orcamento-data";

/**
 * MetodologiaPDF - Slide com corte técnico LSF + lista de metodologia
 * Alinhado com MetodologiaSubsection da web
 */
export function MetodologiaPDF() {
  return (
    <section className="py-8 bg-[#F4F2EC] w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Section Label - matching web SectionLabel pattern */}
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] font-mono text-black/60">
            02 — Premissas Adotadas para o Orçamento
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-black/40 font-mono mt-1">
            2.1 Metodologia Construtiva
          </p>
        </div>

        {/* Grid: Imagem + Lista */}
        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Imagem Técnica */}
          <div className="relative w-full">
            <div className="relative aspect-auto overflow-hidden border border-black">
              <Image
                src={METODOLOGIA_LSF.imagemTecnica}
                alt="Corte Técnico - Sistema de Vedação LSF"
                width={600}
                height={800}
                className="w-full h-auto object-contain"
              />
            </div>
            {/* Caption */}
            <p className="mt-2 font-mono text-xs tracking-wider uppercase text-black/70">
              CORTE TÉCNICO - SISTEMA DE VEDAÇÃO LSF
            </p>
          </div>

          {/* Lista Metodologia A-D - sem título extra */}
          <div className="space-y-5">
            {METODOLOGIA_LSF.itens.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white font-mono text-sm font-bold text-black">
                    {item.letra}
                  </div>
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="font-semibold text-base text-black uppercase tracking-tight">
                    {item.titulo}
                  </p>
                  <p className="text-sm leading-relaxed text-black/70 mt-0.5">
                    {item.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
