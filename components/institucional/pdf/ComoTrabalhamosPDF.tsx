import Image from "next/image";
import { COMO_TRABALHAMOS, EXECUTION_PHASES } from "@/lib/institucional-data";

export function ComoTrabalhamosPDF() {
  const dados = COMO_TRABALHAMOS;

  return (
    <div className="h-full bg-[#F4F2EC] flex flex-col justify-center px-12 py-8">
      <p className="text-sm uppercase tracking-[0.3em] text-black/50 mb-3">
        05 — {dados.label}
      </p>
      <h2 className="font-heading text-4xl font-bold tracking-tight mb-4">
        {dados.headline}
      </h2>
      <p className="text-base text-black/70 leading-relaxed max-w-xl mb-7">
        {dados.intro}
      </p>

      <div className="space-y-4">
        {EXECUTION_PHASES.map((fase) => (
          <div
            key={fase.id}
            className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm flex gap-5 items-center"
          >
            <div className="relative w-36 h-28 rounded-xl overflow-hidden shrink-0">
              <Image
                src={fase.images.primary}
                alt={fase.images.primaryAlt}
                fill
                priority
                className="object-cover"
                sizes="144px"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-heading text-2xl font-light text-black/25">
                  0{fase.number}
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-tight">
                  {fase.title}
                </h3>
                <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wider text-black/50 border border-black/15 rounded-full px-2.5 py-0.5">
                  {fase.duration}
                </span>
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                {fase.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
