import Image from "next/image";

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
 * Hero BERKAHN + Expertise + Setores + Stats
 */
export function SobreSectionPDF() {
  return (
    <section className="py-8 bg-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Section Label */}
        <p className="text-sm uppercase tracking-[0.3em] font-mono text-black/60 mb-6">
          01 — Apresentação Construtora
        </p>

        {/* Hero Header */}
        <div className="text-center mb-6">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-black mb-2">
            BERKAHN
          </h1>
          <h2 className="font-heading text-2xl font-light text-black/70 mb-3">
            Mestres em construir
          </h2>
          <p className="text-sm text-black/50 uppercase tracking-[0.2em]">
            Líderes em Light Steel Frame
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-16 h-px bg-black/20" />
            <div className="w-1.5 h-1.5 rotate-45 bg-black/30" />
            <div className="w-16 h-px bg-black/20" />
          </div>
        </div>

        {/* Nossa Expertise */}
        <div className="bg-[#F4F2EC] rounded-xl p-6 mb-6">
          <h3 className="font-heading text-xl font-bold text-black mb-3">
            NOSSA EXPERTISE
          </h3>
          <p className="text-base text-black/80 leading-relaxed">
            Somos uma construtora especializada em Light Steel Frame no Brasil.
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
                className="relative h-[160px] rounded-xl overflow-hidden"
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black text-white rounded-xl p-5 flex items-center justify-center gap-4">
            <span className="text-4xl font-bold">20+</span>
            <p className="text-sm text-white/70">
              anos de experiência<br />combinada
            </p>
          </div>
          <div className="bg-black text-white rounded-xl p-5">
            <p className="text-sm text-white/60 mb-1">Tempo de obra</p>
            <p className="text-2xl font-bold">50% mais rápido</p>
          </div>
        </div>
      </div>
    </section>
  );
}
