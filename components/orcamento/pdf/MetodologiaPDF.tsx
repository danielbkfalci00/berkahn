import Image from "next/image";
import { METODOLOGIA_LSF } from "@/lib/orcamento-data";

/**
 * MetodologiaPDF - Slide com corte técnico LSF + lista de metodologia
 * Layout: 2 colunas (imagem 50% + texto 50%)
 */
export function MetodologiaPDF() {
  return (
    <section className="py-8 bg-[#F4F2EC] w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Section Label */}
        <p className="text-sm uppercase tracking-[0.3em] font-mono text-black/60 mb-4">
          02 — Premissas adotadas para o orçamento
        </p>
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-black/50 font-mono mb-2">
            Metodologia Construtiva
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-2">
            METODOLOGIA CONSTRUTIVA
          </h2>
          <p className="text-sm text-black/60">
            Sistema Light Steel Frame - Corte técnico e especificações
          </p>
        </div>

        {/* Grid: Imagem + Lista */}
        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Imagem Técnica */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-black/10">
            <Image
              src={METODOLOGIA_LSF.imagemTecnica}
              alt="Corte Técnico - Sistema de Vedação LSF"
              fill
              className="object-cover"
              sizes="50vw"
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-4 py-2">
              <p className="text-xs text-white/80 font-mono uppercase tracking-wider text-center">
                Corte Técnico - Sistema de Vedação LSF
              </p>
            </div>
          </div>

          {/* Lista Metodologia A-D */}
          <div className="bg-white rounded-xl p-6 border border-black/10">
            <h3 className="text-lg font-bold text-black mb-6 uppercase tracking-wide">
              Especificações do Sistema
            </h3>
            <div className="space-y-5">
              {METODOLOGIA_LSF.itens.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {item.letra}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-black mb-1">
                      {item.titulo}
                    </p>
                    <p className="text-sm text-black/60">
                      {item.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-black/40 mt-6 text-center italic">
          Sistema construtivo industrializado com tolerância de ±1mm
        </p>
      </div>
    </section>
  );
}
