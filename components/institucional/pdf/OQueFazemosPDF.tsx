import { PenTool, ClipboardCheck, Layers, HardHat, type LucideIcon } from "lucide-react";
import { O_QUE_FAZEMOS } from "@/lib/institucional-data";

const ICONES: Record<string, LucideIcon> = {
  "01": PenTool,
  "02": ClipboardCheck,
  "03": Layers,
  "04": HardHat,
};

export function OQueFazemosPDF() {
  const dados = O_QUE_FAZEMOS;

  return (
    <div className="h-full bg-[#F4F2EC] flex flex-col justify-center px-12 py-8">
      <p className="text-sm uppercase tracking-[0.3em] text-black/50 mb-3">
        02 — {dados.label}
      </p>
      <h2 className="font-heading text-4xl font-bold tracking-tight mb-4">
        {dados.headline}
      </h2>
      <p className="text-base text-black/70 leading-relaxed max-w-xl mb-8">
        {dados.intro}
      </p>

      <div className="grid grid-cols-2 gap-5">
        {dados.servicos.map((servico) => {
          const Icone = ICONES[servico.numero] ?? PenTool;
          return (
            <div
              key={servico.numero}
              className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center">
                  <Icone className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <span className="font-heading text-2xl font-light text-black/20">
                  {servico.numero}
                </span>
              </div>
              <h3 className="font-heading text-xl font-semibold tracking-tight mb-2">
                {servico.title}
              </h3>
              <p className="text-sm text-black/60 leading-relaxed">
                {servico.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
