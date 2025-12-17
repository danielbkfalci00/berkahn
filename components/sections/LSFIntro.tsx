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
              src="/images/Home/hero-3.webp"
              alt="Estrutura Light Steel Frame"
              width={1200}
              height={900}
              className="w-full h-auto object-cover"
            />
          </RevealOnScroll>

          {/* Right Column - Content */}
          <RevealOnScroll delay={0.2}>
            <p className="label-text mb-4">SISTEMA CONSTRUTIVO INDUSTRIALIZADO</p>
            <h2 className="headline-lg mb-6">
              Light Steel Frame:
              <br />
              Precisão para qualquer projeto
            </h2>
            <p className="body-md mb-6 text-black-70">
              O Light Steel Frame (LSF) é um sistema versátil de alta performance. Utilizamos perfis de aço galvanizado, gesso acartonado e placas cimentícias para criar estruturas precisas e duráveis — residenciais, comerciais ou industriais.
            </p>
            <p className="body-md mb-8 text-black-70">
              A Berkahn domina o LSF tanto como sistema completo quanto integrado a outras estruturas. Podemos atuar com LSF puro ou combiná-lo com concreto armado e aço laminado, ampliando possibilidades arquitetônicas sem comprometer eficiência.
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
