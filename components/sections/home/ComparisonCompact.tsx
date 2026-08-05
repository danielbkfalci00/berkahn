import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { COMPARISON_DATA } from "@/lib/lsf-data";

const FEATURED_CATEGORIES = [
  "Tempo de Obra",
  "Desperdício de Material",
  "Precisão Dimensional",
  "Peso Estrutural",
];

/**
 * Comparativo editorial enxuto (supersede a tabela completa na home):
 * quatro medições-chave LSF vs. construção convencional, valores em display.
 * A comparação completa continua em /lsf.
 */
export function ComparisonCompact() {
  const rows = FEATURED_CATEGORIES.map((category) =>
    COMPARISON_DATA.find((item) => item.category === category)
  ).filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <section className="bg-off-white py-2xl md:py-3xl">
      <div className="container">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-black-50 mb-4">
            04 · o sistema, medido
          </p>
          <h2 className="headline-md max-w-2xl mb-16">
            Light Steel Frame contra o método convencional.
          </h2>
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
