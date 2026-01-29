import Image from "next/image";
import { CHALE_PROJETO } from "@/lib/orcamento-data";

/**
 * ProjetoPrototipoPDF - Slide com 4 fotos do protótipo + metragens
 * Layout: Grid 2x2 de imagens + card de metragens
 */
export function ProjetoPrototipoPDF() {
  const { titulo, metragem, imagens, comodos } = CHALE_PROJETO;
  const totalComodos = comodos.reduce((acc, c) => acc + c.area, 0);

  return (
    <section className="py-12 bg-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] font-mono text-black/60 mb-2">
              02 — Premissas adotadas para o orçamento
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-black">
              {titulo}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-black">{metragem}m²</p>
            <p className="text-sm text-black/50">Área Total</p>
          </div>
        </div>

        {/* Grid 2x2 de Fotos */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {imagens.prototipo.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/10"
            >
              <Image
                src={src}
                alt={`Protótipo do Chalé - Vista ${index + 1}`}
                fill
                className="object-cover"
                sizes="50vw"
              />
              {/* Badge de número */}
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/70 text-white text-sm font-bold flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Card de Metragens */}
        <div className="bg-[#F4F2EC] rounded-xl p-6">
          <h3 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
            Distribuição de Áreas
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {comodos.map((comodo) => (
              <div
                key={comodo.nome}
                className="bg-white rounded-lg p-4 text-center border border-black/10"
              >
                <p className="text-2xl font-bold text-black">{comodo.area}m²</p>
                <p className="text-sm text-black/60">{comodo.nome}</p>
              </div>
            ))}
            <div className="bg-black rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{totalComodos}m²</p>
              <p className="text-sm text-white/70">Áreas Internas</p>
            </div>
          </div>
          <p className="text-xs text-black/40 mt-4 text-center italic">
            * Área total de {metragem}m² inclui paredes e circulação
          </p>
        </div>
      </div>
    </section>
  );
}
