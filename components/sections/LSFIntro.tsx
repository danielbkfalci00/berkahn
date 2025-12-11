import Link from "next/link";
import Image from "next/image";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export function LSFIntro() {
  return (
    <section className="py-xl">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <RevealOnScroll>
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Estrutura Light Steel Frame"
              width={1200}
              height={900}
              className="w-full h-auto object-cover"
            />
          </RevealOnScroll>

          {/* Right Column - Content */}
          <RevealOnScroll delay={0.2}>
            <p className="label-text mb-4">Sistema construtivo industrializado</p>
            <h2 className="headline-lg mb-6">
              Casas inovadoras em
              <br />
              Light Steel Frame
            </h2>
            <p className="body-md mb-6 text-black-70">
              O Light Steel Frame (LSF) é um sistema versátil que permite
              executar paredes, pilares e lajes com precisão milimétrica, usando
              perfis de aço galvanizado e camadas técnicas de gesso acartonado e
              placas cimentícias para entregar conforto, desempenho e acabamento
              superior.
            </p>
            <p className="body-md mb-8 text-black-70">
              No centro dessa versatilidade está a Berkahn, que domina o LSF
              tanto como sistema completo quanto integrado a outros métodos
              construtivos. O LSF pode atuar isoladamente ou funcionar como
              vedação combinada com estruturas de aço laminado ou concreto
              armado, ampliando possibilidades arquitetônicas e garantindo
              eficiência em qualquer solução adotada.
            </p>
            <Link
              href="/lsf"
              className="inline-flex items-center gap-2 text-black hover:gap-4 transition-all duration-300 font-medium group"
            >
              Saiba mais
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
