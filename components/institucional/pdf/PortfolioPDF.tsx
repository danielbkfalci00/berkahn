import Image from "next/image";
import { PORTFOLIO_INSTITUCIONAL, presentationProjects } from "@/lib/institucional-data";

export function PortfolioPDF() {
  const dados = PORTFOLIO_INSTITUCIONAL;

  return (
    <div className="h-full bg-black text-white flex flex-col justify-center px-12 py-8">
      <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-3">
        06 — {dados.label}
      </p>
      <h2 className="font-heading text-4xl font-bold tracking-tight mb-8">
        {dados.headline}
      </h2>

      <div className="space-y-5">
        {presentationProjects.map((projeto) => (
          <div key={projeto.number} className="flex gap-6 items-center">
            <div className="relative w-56 h-36 rounded-xl overflow-hidden shrink-0">
              <Image
                src={projeto.images[0]}
                alt={`Projeto ${projeto.title}`}
                fill
                priority
                className="object-cover"
                sizes="224px"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-heading text-2xl font-light text-white/30">
                  {projeto.number}
                </span>
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  {projeto.title}
                </h3>
              </div>
              <p className="text-xs text-white/50 mb-2.5">
                {projeto.location} · {projeto.year}
              </p>
              <div className="flex flex-wrap gap-2 mb-2.5">
                <span className="text-[10px] uppercase tracking-wider text-white/70 border border-white/20 rounded-full px-2.5 py-0.5">
                  {projeto.area}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/70 border border-white/20 rounded-full px-2.5 py-0.5">
                  {projeto.system}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                {projeto.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
