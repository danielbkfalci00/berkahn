import Link from "next/link";
import { EXECUTION_PHASES } from "@/lib/servicos-data";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Badge } from "@/components/ui/badge";

export function ScopeStrip() {
  return (
    <section className="py-xl bg-black-5">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text mb-4">CONSTRUTORA COMPLETA</p>
          <h2 className="headline-md mb-6 max-w-3xl">
            Como construtora, fazemos a obra inteira.
          </h2>
          <p className="body-lg text-black-70 max-w-3xl mb-12">
            Quatro fases coordenadas pela mesma equipe. Você não negocia com fornecedores soltos.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {EXECUTION_PHASES.map((phase, i) => (
            <RevealOnScroll key={phase.id} delay={i * 0.1}>
              <div className="bg-white border border-black-10 rounded-lg p-6 h-full flex flex-col gap-4 hover:shadow-luxury-md transition-shadow">
                <Badge
                  variant="outline"
                  className="self-start text-xs px-2 py-0.5 border-current"
                >
                  Fase {phase.number}
                </Badge>
                <h3 className="text-base lg:text-lg font-heading font-semibold leading-tight">
                  {phase.title}
                </h3>
                <p className="text-sm text-black-70 leading-relaxed flex-1">
                  {phase.summary}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 text-black hover:gap-4 transition-all duration-300 font-medium group"
          >
            Ver detalhes de cada fase
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
