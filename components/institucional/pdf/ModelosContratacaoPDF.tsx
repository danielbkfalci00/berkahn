import { Check } from "lucide-react";
import { MODELOS_CONTRATACAO } from "@/lib/institucional-data";

export function ModelosContratacaoPDF() {
  const dados = MODELOS_CONTRATACAO;

  return (
    <div className="h-full bg-white flex flex-col justify-center px-12 py-8">
      <p className="text-sm uppercase tracking-[0.3em] text-black/50 mb-3">
        04 — {dados.label}
      </p>
      <h2 className="font-heading text-4xl font-bold tracking-tight mb-4">
        {dados.headline}
      </h2>
      <p className="text-base text-black/70 leading-relaxed max-w-xl mb-8">
        {dados.intro}
      </p>

      <div className="grid grid-cols-2 gap-5">
        {dados.modelos.map((modelo) => {
          const isDestaque = modelo.destaque;
          return (
            <div
              key={modelo.badge}
              className={
                isDestaque
                  ? "bg-black text-white rounded-2xl p-7"
                  : "bg-white border border-black/10 rounded-2xl p-7"
              }
            >
              <p
                className={`inline-block text-[10px] uppercase tracking-widest rounded-full px-3 py-1 mb-4 border ${
                  isDestaque
                    ? "text-white border-white/30"
                    : "text-black/60 border-black/20"
                }`}
              >
                {modelo.badge}
              </p>
              <h3 className="font-heading text-2xl font-semibold tracking-tight mb-3">
                {modelo.title}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-5 ${
                  isDestaque ? "text-white/70" : "text-black/60"
                }`}
              >
                {modelo.description}
              </p>
              <ul className="space-y-2.5">
                {modelo.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isDestaque ? "text-white" : "text-black"
                      }`}
                      strokeWidth={1.5}
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        isDestaque ? "text-white/90" : "text-black/80"
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
