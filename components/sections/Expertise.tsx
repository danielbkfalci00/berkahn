import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export function Expertise() {
  return (
    <section className="py-xl">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <RevealOnScroll>
            <h2 className="headline-lg">
              NOSSA EXPERTISE
            </h2>
          </RevealOnScroll>

          {/* Right Column */}
          <RevealOnScroll delay={0.2}>
            <p className="body-lg mb-6">
              A <strong className="text-black font-medium">Berkahn</strong> é especialista em Light Steel Frame no Brasil. Priorizamos esta tecnologia por sua eficiência, precisão e sustentabilidade, mas nossa expertise vai além. Dominamos múltiplos sistemas construtivos e adaptamos cada projeto ao método ideal.
            </p>
            <p className="body-md mb-8 text-black-70">
              Residências, edifícios comerciais ou projetos industriais: cada projeto recebe engenharia de precisão e acompanhamento técnico dedicado. Do projeto completo à execução especializada, nos adaptamos à sua necessidade com rigor técnico em cada etapa.
            </p>
            <Link
              href="/empresa"
              className="inline-flex items-center gap-2 text-black hover:gap-4 transition-all duration-300 font-medium group"
            >
              Saber mais
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
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
