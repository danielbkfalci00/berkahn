import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ParallaxImage } from "@/components/animations/ParallaxImage";

type Segment = {
  index: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

const SEGMENTS: Segment[] = [
  {
    index: "01",
    title: "Residencial",
    description:
      "Casas de alto padrão com qualidade técnica, acabamento criterioso e soluções integradas do projeto à entrega.",
    href: "/residencial",
    image: "/images/Services/residencial.webp",
    imageAlt: "Residência de alto padrão construída em Light Steel Frame",
  },
  {
    index: "02",
    title: "Comercial & Industrial",
    description:
      "Ambientes corporativos e estruturas industriais com gestão de obra precisa e soluções técnicas sob medida.",
    href: "/comercial-industrial",
    image: "/images/Services/comercial.webp",
    imageAlt: "Edifício comercial construído em Light Steel Frame",
  },
];

/**
 * Segmentos de atuação — grid editorial assimétrico: cards com parallax,
 * numerais-índice em mono e offset vertical no desktop.
 */
export function Segments() {
  return (
    <section className="bg-white py-2xl md:py-3xl overflow-hidden">
      <div className="container">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-black-50 mb-4">
            02 · segmentos
          </p>
          <h2 className="headline-md max-w-2xl mb-16 md:mb-20">
            Construímos para morar e para operar.
          </h2>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {SEGMENTS.map((segment, index) => (
            <RevealOnScroll
              key={segment.index}
              delay={index * 0.15}
              className={index === 1 ? "md:mt-24" : undefined}
            >
              <Link href={segment.href} className="group block">
                <div className="relative">
                  <ParallaxImage
                    src={segment.image}
                    alt={segment.imageAlt}
                    speed={0.12}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    containerClassName="aspect-[4/5] md:aspect-[3/4]"
                    className="transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
                  />
                  <span
                    className="absolute top-5 left-5 font-tech text-xs lowercase tracking-wide text-white bg-black/35 backdrop-blur-sm px-3 py-1.5"
                    aria-hidden="true"
                  >
                    {segment.index}
                  </span>
                </div>

                <div className="mt-7 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display font-semibold text-2xl md:text-3xl tracking-tight mb-3">
                      {segment.title}
                    </h3>
                    <p className="text-black-70 leading-relaxed max-w-md">
                      {segment.description}
                    </p>
                  </div>
                  <span
                    className="mt-2 h-[3px] w-10 shrink-0 bg-bronze transition-all duration-500 ease-expo group-hover:w-16"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
