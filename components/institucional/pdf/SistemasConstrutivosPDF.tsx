import Image from "next/image";
import { SISTEMAS_CONSTRUTIVOS } from "@/lib/institucional-data";

export function SistemasConstrutivosPDF() {
  const dados = SISTEMAS_CONSTRUTIVOS;

  return (
    <div className="h-full bg-black text-white flex flex-col justify-center px-12 py-8">
      <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-3">
        03 — {dados.label}
      </p>
      <h2 className="font-heading text-4xl font-bold tracking-tight leading-tight mb-4 max-w-2xl">
        {dados.headline}
      </h2>
      <p className="text-base text-white/70 leading-relaxed max-w-2xl mb-8">
        {dados.intro}
      </p>

      <div className="grid grid-cols-[1.4fr,1fr] gap-8 mb-8">
        {/* Blocos de sistemas */}
        <div className="space-y-5">
          {dados.blocos.map((bloco) => (
            <div key={bloco.title} className="border-t border-white/15 pt-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
                {bloco.subtitle}
              </p>
              <h3 className="font-heading text-xl font-semibold mb-1">{bloco.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{bloco.description}</p>
            </div>
          ))}
        </div>

        {/* Diagrama de camadas LSF */}
        <div className="relative rounded-xl overflow-hidden bg-white">
          <Image
            src={dados.image}
            alt={dados.imageAlt}
            fill
            priority
            className="object-contain p-2"
            sizes="300px"
          />
        </div>
      </div>

      {/* Normas */}
      <div className="border border-white/15 rounded-2xl p-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">
          Referências normativas
        </p>
        <div className="grid grid-cols-3 gap-6">
          {dados.normas.map((item) => (
            <div key={item.norma}>
              <p className="font-heading text-lg font-semibold mb-1">{item.norma}</p>
              <p className="text-xs text-white/60 leading-relaxed">{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
