import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { COMPARISON_DATA } from "@/lib/lsf-data";

const FEATURED_CATEGORIES = [
  "Tempo de Obra",
  "Desperdício de Material",
  "Precisão Dimensional",
  "Peso Estrutural",
];

/** Introdução institucional do LSF seguida pelo comparativo técnico compacto. */
export function ComparisonCompact() {
  const rows = FEATURED_CATEGORIES.map((category) =>
    COMPARISON_DATA.find((item) => item.category === category)
  ).filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <section className="bg-off-white py-2xl md:py-3xl">
      <div className="container">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-black-50 mb-4">
            04 · sistema construtivo industrializado
          </p>
          <h2 className="headline-md max-w-3xl">
            Light Steel Frame:
            <br />
            Precisão para qualquer projeto
          </h2>
        </RevealOnScroll>

        <div className="mt-10 md:mt-14 grid gap-8 md:grid-cols-12 md:gap-12 md:items-center">
          {/* Imagem sustenta a coluna esquerda, que antes ficava vazia no desktop.
              Monocromática por CSS para não brigar com a paleta da home. */}
          <figure className="md:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-black-5">
              <Image
                src="/images/Home/lsf-estrutura.webp"
                alt="Estrutura em perfis de aço galvanizado montada em obra, formando piso, paredes e cobertura"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover grayscale"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="h-[3px] w-10 bg-black" aria-hidden="true" />
              <span className="font-tech text-xs lowercase tracking-wide text-black-50">
                perfis de aço galvanizado, montagem a seco
              </span>
            </figcaption>
          </figure>

          <div className="md:col-span-6 md:col-start-7 space-y-6 text-base md:text-lg leading-relaxed text-black-70">
            <p>
              O Light Steel Frame (LSF) é um sistema versátil de alta
              performance. Utilizamos perfis de aço galvanizado, gesso
              acartonado e placas cimentícias para criar estruturas precisas e
              duráveis para projetos residenciais, comerciais e industriais.
            </p>
            <p>
              A Berkahn trabalha com LSF tanto como sistema completo quanto
              integrado a outras estruturas. Podemos atuar com LSF puro ou
              combiná-lo com concreto armado e aço laminado, ampliando
              possibilidades arquitetônicas sem comprometer eficiência.
            </p>
            <Link
              href="/lsf"
              className="group inline-flex items-center gap-4 pt-3 text-sm uppercase tracking-wider font-medium text-black"
            >
              <span className="h-[3px] w-10 bg-black transition-all duration-500 ease-expo group-hover:w-16" />
              Saiba mais
            </Link>
          </div>
        </div>

        <RevealOnScroll>
          <div className="mt-20 md:mt-28 pt-10 border-t-[3px] border-black">
            <p className="font-tech text-xs lowercase tracking-wide text-black-50 mb-4">
              comparativo técnico
            </p>
            <h3 className="headline-md max-w-2xl mb-16">
              Light Steel Frame contra o método convencional.
            </h3>
          </div>
        </RevealOnScroll>

        <div className="border-t border-black-10">
          {rows.map((row, index) => (
            <RevealOnScroll key={row.category} delay={index * 0.08}>
              <div className="grid md:grid-cols-12 gap-4 md:gap-8 items-baseline py-9 border-b border-black-10">
                <p className="md:col-span-4 font-tech text-xs lowercase tracking-wide text-black-50">
                  {row.category.toLowerCase()}
                </p>

                <div className="md:col-span-4">
                  <p className="font-display font-semibold tracking-tight text-3xl md:text-4xl text-black">
                    {row.lsf}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="h-[3px] w-8 bg-black" aria-hidden="true" />
                    <p className="text-xs uppercase tracking-wider text-black-70 font-medium">
                      Light Steel Frame
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <p className="font-display tracking-tight text-2xl md:text-3xl text-black-30">
                    {row.traditional}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-black-30 font-medium">
                    Convencional
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <Link
            href="/lsf"
            className="group mt-12 inline-flex items-center gap-4 text-sm uppercase tracking-wider font-medium text-black"
          >
            <span className="h-[3px] w-10 bg-black transition-all duration-500 ease-expo group-hover:w-16" />
            Comparação completa do sistema
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
