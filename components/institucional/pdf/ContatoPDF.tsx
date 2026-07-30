import Image from "next/image";
import { Mail, Phone, Globe, Linkedin } from "lucide-react";
import { CONTATO_INSTITUCIONAL } from "@/lib/institucional-data";

export function ContatoPDF() {
  const contato = CONTATO_INSTITUCIONAL;

  const canais = [
    { icon: Mail, value: contato.email },
    { icon: Phone, value: contato.phone },
    { icon: Globe, value: contato.website },
    { icon: Linkedin, value: contato.linkedin },
  ];

  return (
    <div className="h-full bg-black text-white flex flex-col justify-between px-12 py-12">
      {/* Logo no topo */}
      <div className="flex justify-center">
        <Image
          src={contato.logoBranco}
          alt="Berkahn Construtora"
          width={180}
          height={54}
          priority
          className="h-11 w-auto"
        />
      </div>

      {/* Centro: CTA + canais */}
      <div className="text-center">
        <h2 className="font-heading text-6xl font-extrabold tracking-tight mb-4">
          Vamos construir
          <br />
          juntos?
        </h2>
        <p className="text-lg text-white/60 font-light mb-12">{contato.subtitle}</p>

        <div className="inline-flex flex-col items-start gap-4">
          {canais.map(({ icon: Icone, value }) => (
            <div key={value} className="flex items-center gap-4">
              <Icone className="w-5 h-5 text-white/50" strokeWidth={1.5} />
              <span className="text-base text-white/80">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé: dados da empresa */}
      <div className="text-center border-t border-white/15 pt-6">
        <p className="font-heading text-lg font-bold tracking-[0.3em] text-white/40 mb-2">
          BERKAHN
        </p>
        <p className="text-xs text-white/40">
          {contato.local} · CNPJ {contato.cnpj}
        </p>
      </div>
    </div>
  );
}
