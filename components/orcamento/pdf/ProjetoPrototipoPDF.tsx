import Image from "next/image";
import { CHALE_PROJETO } from "@/lib/orcamento-data";

/**
 * ProjetoPrototipoPDF - Slide com 4 fotos (info overlay na 4ª)
 * Layout compacto: header + grid 2x2 com metragens na última foto
 */
export function ProjetoPrototipoPDF() {
  const { titulo, metragem, imagens, comodos } = CHALE_PROJETO;
  const totalComodos = comodos.reduce((acc, c) => acc + c.area, 0);

  return (
    <section className="py-4 bg-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
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

        {/* Grid 2x2 — 3 fotos + 1 foto com overlay de metragens */}
        <div className="grid grid-cols-2 gap-4">
          {/* Fotos 1-3 */}
          {imagens.prototipo.slice(0, 3).map((src, index) => (
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
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/70 text-white text-sm font-bold flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          ))}

          {/* Foto 4 com overlay de distribuição de áreas */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/10">
            {imagens.prototipo[3] && (
              <Image
                src={imagens.prototipo[3]}
                alt="Protótipo do Chalé - Vista 4"
                fill
                className="object-cover"
                sizes="50vw"
              />
            )}
            {/* Overlay escuro com metragens */}
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-4">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                Distribuição de Áreas
              </h3>
              <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
                {comodos.map((comodo) => (
                  <div
                    key={comodo.nome}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center"
                  >
                    <p className="text-lg font-bold text-white">{comodo.area}m²</p>
                    <p className="text-[10px] text-white/60">{comodo.nome}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 bg-white rounded-lg px-4 py-2 text-center">
                <p className="text-lg font-bold text-black">{totalComodos}m²</p>
                <p className="text-[10px] text-black/60">Áreas Internas</p>
              </div>
              <p className="text-[9px] text-white/30 mt-2 italic">
                * Área total de {metragem}m² inclui paredes e circulação
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
