import Image from "next/image";
import { INSTITUCIONAL_CAPA } from "@/lib/institucional-data";

export function CapaPDF() {
  const capa = INSTITUCIONAL_CAPA;

  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden">
      <Image
        src={capa.heroImage}
        alt="Obra em Light Steel Frame executada pela Berkahn"
        fill
        priority
        className="object-cover opacity-50"
        sizes="794px"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90" />

      <div className="relative z-10 h-full flex flex-col justify-between px-12 py-10">
        {/* Topo: logo + label */}
        <div className="flex items-center justify-between">
          <Image
            src={capa.logoBranco}
            alt="Berkahn Construtora"
            width={160}
            height={48}
            priority
            className="h-10 w-auto"
          />
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
            {capa.label}
          </p>
        </div>

        {/* Centro: headline */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-5">
            O que fazemos
          </p>
          <h1 className="font-heading text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Do conceito à<br />
            entrega das chaves
          </h1>
          <p className="text-lg text-white/70 font-light max-w-md leading-relaxed">
            {capa.subtitle}
          </p>
        </div>

        {/* Rodapé: wordmark + tagline */}
        <div className="flex items-end justify-between border-t border-white/20 pt-6">
          <p className="font-heading text-xl font-bold tracking-[0.3em]">BERKAHN</p>
          <p className="text-sm text-white/50 font-light tracking-[0.2em]">
            {capa.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
