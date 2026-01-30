import Image from "next/image";
import { CHALE_PROJETO } from "@/lib/orcamento-data";

/**
 * PlantasPDF - Slide com 2 plantas baixas (estilo blueprint)
 * Layout: 2 plantas lado a lado com labels
 */
export function PlantasPDF() {
  const { imagens } = CHALE_PROJETO;

  return (
    <section className="py-4 bg-black w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.3em] font-mono text-white/60 mb-2">
            02 — Premissas adotadas para o orçamento
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            PLANTAS BAIXAS
          </h2>
          <p className="text-sm text-white/50">
            Layouts técnicos do projeto com distribuição de ambientes
          </p>
        </div>

        {/* Grid 2 Plantas */}
        <div className="grid grid-cols-2 gap-4">
          {imagens.plantasBaixas.map((planta) => (
            <div key={planta.label} className="relative">
              {/* Frame arquitetônico */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-white/20 bg-white">
                <Image
                  src={planta.src}
                  alt={planta.label}
                  fill
                  className="object-contain p-2"
                  sizes="50vw"
                />
              </div>
              {/* Label */}
              <div className="mt-3 text-center">
                <p className="text-sm font-mono text-white/80 uppercase tracking-wider">
                  {planta.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legenda técnica */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-center gap-8 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-white/40" />
              <span>Paredes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-white/40 border-dashed border-t" />
              <span>Projeção</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <span>Pontos elétricos</span>
            </div>
          </div>
          <p className="text-center text-xs text-white/30 mt-4 italic">
            Escala: Sem escala definida - Plantas ilustrativas para referência
          </p>
        </div>
      </div>
    </section>
  );
}
