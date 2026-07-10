import Image from "next/image";
import { FUNDADORES, PARCEIROS } from "@/lib/institucional-data";

export function FundadoresParceirosPDF() {
  return (
    <div className="h-full bg-white flex flex-col justify-center px-12 py-8">
      <p className="text-sm uppercase tracking-[0.3em] text-black/50 mb-3">
        07 — Quem faz
      </p>
      <h2 className="font-heading text-4xl font-bold tracking-tight mb-8">
        Experiência que constrói confiança
      </h2>

      {/* Fundadores */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {FUNDADORES.map((fundador) => (
          <div key={fundador.name}>
            <div className="relative h-52 rounded-2xl overflow-hidden mb-3">
              <Image
                src={fundador.image}
                alt={fundador.name}
                fill
                priority
                className="object-cover object-top"
                sizes="224px"
              />
            </div>
            <h3 className="font-heading text-lg font-semibold tracking-tight">
              {fundador.name}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">
              {fundador.role}
            </p>
            <p className="text-xs text-black/60 leading-relaxed">{fundador.bio}</p>
          </div>
        ))}
      </div>

      {/* Marcas parceiras (faixa escura: logos são claros) */}
      <div className="bg-black rounded-2xl px-8 py-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4 text-center">
          Marcas parceiras
        </p>
        <div className="grid grid-cols-4 gap-6 items-center">
          {PARCEIROS.map((parceiro) => (
            <div key={parceiro.name} className="relative h-14">
              <Image
                src={parceiro.logo}
                alt={`Logo ${parceiro.name}`}
                fill
                priority
                className="object-contain"
                sizes="160px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
