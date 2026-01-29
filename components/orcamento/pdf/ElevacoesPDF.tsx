import Image from "next/image";
import { CHALE_PROJETO } from "@/lib/orcamento-data";

/**
 * ElevacoesPDF - Slide com 4 elevações (estilo blueprint)
 * Layout: Grid 2x2 com as 4 fachadas
 */
export function ElevacoesPDF() {
  const { imagens } = CHALE_PROJETO;

  return (
    <section className="py-12 bg-black w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] font-mono text-white/60 mb-2">
            02 — Premissas adotadas para o orçamento
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            ELEVAÇÕES TÉCNICAS
          </h2>
          <p className="text-sm text-white/50">
            Fachadas do projeto vistas em todas as orientações
          </p>
        </div>

        {/* Grid 2x2 Elevações */}
        <div className="grid grid-cols-2 gap-6">
          {imagens.elevacoes.map((elevacao) => (
            <div key={elevacao.label} className="relative">
              {/* Frame arquitetônico */}
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden border-2 border-white/20 bg-white">
                <Image
                  src={elevacao.src}
                  alt={elevacao.label}
                  fill
                  className="object-contain p-2"
                  sizes="50vw"
                />
              </div>
              {/* Label com ícone de orientação */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white/60">
                    {elevacao.label.split(" ")[1].charAt(0)}
                  </span>
                </div>
                <p className="text-sm font-mono text-white/80 uppercase tracking-wider">
                  {elevacao.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bússola de orientação */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-6">
            <div className="relative w-16 h-16">
              {/* Bússola simplificada */}
              <div className="absolute inset-0 rounded-full border border-white/20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[10px] font-bold text-white/60">
                N
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[10px] font-bold text-white/40">
                S
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 text-[10px] font-bold text-white/40">
                O
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[10px] font-bold text-white/40">
                L
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/50" />
            </div>
            <div className="text-xs text-white/40">
              <p>Orientação solar considerada no projeto</p>
              <p className="mt-1">para melhor aproveitamento de luz natural</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
