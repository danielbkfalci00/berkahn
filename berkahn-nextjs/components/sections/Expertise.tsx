import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export function Expertise() {
  return (
    <section className="py-xl">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <RevealOnScroll>
            <p className="label-text mb-4">
              Expertise em construção em Light Steel Frame
            </p>
            <h2 className="headline-lg">
              Casas inovadoras em
              <br />
              Light Steel Frame —
              <br />
              <span className="text-black-50">engineered by Berkahn</span>
            </h2>
          </RevealOnScroll>

          {/* Right Column */}
          <RevealOnScroll delay={0.2}>
            <p className="body-lg mb-6">
              <strong className="text-black font-medium">Berkahn</strong> é
              referência em tecnologia e construção em Light Steel Frame. Criar
              soluções para residências de alta performance, confortáveis e
              duráveis é o compromisso da nossa equipe especializada.
            </p>
            <p className="body-md mb-8 text-black-70">
              Da concepção inteligente à execução precisa, a Berkahn fornece
              tudo o que é necessário para realizar projetos residenciais
              modernos, eficientes e alinhados fielmente ao design original.
              Nossa missão é transformar ideias em casas que combinam leveza
              estrutural, engenharia avançada e excelência construtiva.
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
