import { Check, X } from "lucide-react";
import { QUEM_SOMOS } from "@/lib/institucional-data";

export function QuemSomosPDF() {
  const dados = QUEM_SOMOS;

  return (
    <div className="h-full bg-white flex flex-col justify-center px-12 py-8">
      <p className="text-sm uppercase tracking-[0.3em] text-black/50 mb-3">
        01 — {dados.label}
      </p>
      <h2 className="font-heading text-4xl font-bold tracking-tight mb-4">
        {dados.headline}
      </h2>

      <p className="text-base text-black font-medium leading-relaxed mb-2">
        {dados.intro}
      </p>
      <p className="text-sm text-black/60 leading-relaxed mb-5">{dados.historia}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {dados.stats.map((stat) => (
          <div key={stat.label} className="border-t border-black/10 pt-3">
            <p className="font-heading text-3xl font-light">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-black/50 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Pilares */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {dados.pilares.map((pilar, index) => (
          <div key={pilar.title} className="bg-[#F4F2EC] rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-1">
              Pilar 0{index + 1}
            </p>
            <h3 className="font-heading text-lg font-semibold mb-1">{pilar.title}</h3>
            <p className="text-xs text-black/60 leading-relaxed">{pilar.description}</p>
          </div>
        ))}
      </div>

      {/* Construtora vs Empreiteira */}
      <p className="text-sm text-black/60 mb-3">{dados.comparativo.subtitulo}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black text-white rounded-2xl p-5">
          <p className="inline-block text-[10px] uppercase tracking-widest text-white border border-white/30 rounded-full px-3 py-1 mb-3">
            Berkahn
          </p>
          <h3 className="font-heading text-lg font-semibold mb-3">
            Construtora completa
          </h3>
          <ul className="space-y-2">
            {dados.comparativo.construtora.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-white" strokeWidth={1.5} />
                <span className="text-xs leading-relaxed text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-black/10 rounded-2xl p-5">
          <p className="inline-block text-[10px] uppercase tracking-widest text-black/50 border border-black/20 rounded-full px-3 py-1 mb-3">
            Empreiteira tradicional
          </p>
          <h3 className="font-heading text-lg font-semibold text-black/50 mb-3">
            Executa só uma etapa
          </h3>
          <ul className="space-y-2">
            {dados.comparativo.empreiteira.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <X className="w-4 h-4 mt-0.5 shrink-0 text-black/30" strokeWidth={1.5} />
                <span className="text-xs leading-relaxed text-black/70">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
