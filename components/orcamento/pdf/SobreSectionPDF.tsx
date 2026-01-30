import Image from "next/image";
import { BENEFITS } from "@/lib/lsf-data";

const SETORES = [
  {
    label: "RESIDENCIAL",
    description: "Projetos residenciais com qualidade técnica e acabamento de alto nível.",
    image: "/images/Services/residencial.webp",
  },
  {
    label: "CORPORATIVO / COMERCIAL",
    description: "Ambientes corporativos com identidade e eficiência.",
    image: "/images/Services/comercial.webp",
  },
  {
    label: "INDUSTRIAL",
    description: "Estruturas industriais para máxima eficiência e durabilidade.",
    image: "/images/Services/industrial.webp",
  },
];

/**
 * SobreSectionPDF - Versão PDF alinhada à web
 * Left-aligned header + Expertise box + Setores + 8 Benefits grid
 */
export function SobreSectionPDF() {
  return (
    <section className="py-8 bg-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Section Label */}
        <p className="text-sm uppercase tracking-[0.3em] font-mono text-black/60 mb-6">
          01 — Apresentação Construtora
        </p>

        {/* Hero Header - Left aligned (matching web) */}
        <div className="mb-6">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-black mb-4">
            BERKAHN
          </h1>
          <p className="text-lg text-black/60 max-w-2xl leading-relaxed">
            Especialistas em construção com Light Steel Frame, oferecemos soluções construtivas de alta precisão e qualidade técnica. Com metodologia própria e equipe especializada, transformamos projetos em realidade com agilidade, eficiência e compromisso com prazos.
          </p>
        </div>

        {/* Nossa Expertise */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-black/5 shadow-sm">
          <h3 className="font-heading text-xl font-bold text-black mb-3">
            NOSSA EXPERTISE
          </h3>
          <p className="text-base text-black/80 leading-relaxed">
            Somos uma construtora especializada em Light Steel Frame.
            Priorizamos esta tecnologia por sua eficiência, precisão e sustentabilidade
            — mas nossa expertise vai além: <strong className="text-black">Dominamos múltiplos sistemas construtivos</strong> para entregar sempre a melhor solução.
          </p>
        </div>

        {/* Setores */}
        <div className="mb-6">
          <p className="text-sm text-black/60 mb-4 uppercase tracking-widest">
            Construímos para todos os setores
          </p>
          <div className="grid grid-cols-3 gap-4">
            {SETORES.map((setor) => (
              <div
                key={setor.label}
                className="relative h-[130px] rounded-xl overflow-hidden"
              >
                <Image
                  src={setor.image}
                  alt={setor.label}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center text-white">
                  <h4 className="text-xs font-bold tracking-wider mb-1">
                    {setor.label}
                  </h4>
                  <div className="w-8 h-px bg-white/40 mb-1" />
                  <p className="text-[10px] text-white/70 leading-tight">
                    {setor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vantagens LSF - 8 Benefits Grid (matching web) */}
        <div>
          <h3 className="font-heading text-lg font-semibold text-black text-center mb-4">
            E quais são as Vantagens do Light Steel Frame?
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-xl p-3 border border-black/5 shadow-sm text-center"
              >
                <span className="font-heading text-2xl font-bold text-black">
                  {benefit.stat}{benefit.suffix}
                </span>
                <p className="text-[10px] text-black/50 mt-0.5 uppercase tracking-wider">
                  {benefit.description.split(" ").slice(0, 3).join(" ")}
                </p>
                <p className="text-xs text-black/70 mt-0.5 font-medium">
                  {benefit.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
