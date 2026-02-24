import Image from "next/image";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const defaultPartners = [
  { name: "Brand 01", logo: "/images/Apresentação/Marcas Parceiras/brand-01.webp" },
  { name: "Lumen", logo: "/images/Apresentação/Marcas Parceiras/lumen.webp" },
  { name: "Knauf", logo: "/images/Apresentação/Marcas Parceiras/knauf.webp" },
  { name: "Aquapanel", logo: "/images/Apresentação/Marcas Parceiras/aquapanel.webp" },
];

interface PartnersProps {
  partners?: { name: string; logo: string }[];
  title?: string;
  label?: string;
  className?: string;
  inline?: boolean;
  marquee?: boolean;
}

/* ─── Marquee (infinite scroll) ─── */

function LogoMarquee({ partners }: { partners: { name: string; logo: string }[] }) {
  // Duplicate list for seamless loop
  const doubled = [...partners, ...partners];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex gap-3 md:gap-16 lg:gap-24 animate-marquee-fast md:animate-marquee hover:[animation-play-state:paused]">
        {doubled.map((partner, i) => (
          <div
            key={`${partner.name}-${i}`}
            className="flex items-center justify-center shrink-0 h-32 md:h-28 w-40 md:w-48"
          >
            <div className="relative w-full h-full md:grayscale md:opacity-50 md:hover:grayscale-0 md:hover:opacity-100 transition-all duration-500">
              <Image
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Component ─── */

export function Partners({
  partners,
  title,
  label,
  className,
  inline = false,
  marquee = false,
}: PartnersProps = {}) {
  const partnerList = partners || defaultPartners;
  const displayLabel = label ?? "MARCAS PARCEIRAS";
  const displayTitle = title ?? "Marcas que Utilizamos";

  const content = (
    <>
      <RevealOnScroll>
        <p className="label-text text-black-50 text-center mb-3 tracking-widest">
          {displayLabel}
        </p>
        <h2 className="headline-md text-center mb-16">
          {displayTitle}
        </h2>
      </RevealOnScroll>

      <RevealOnScroll delay={0.2}>
        {marquee ? (
          <LogoMarquee partners={partnerList} />
        ) : (
          <div className={`grid grid-cols-2 ${partnerList.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-4"} gap-6 md:gap-10 lg:gap-16 items-center max-w-5xl mx-auto`}>
            {partnerList.map((partner) => (
              <div key={partner.name} className="flex items-center justify-center h-28 md:h-24 lg:h-32 px-4">
                <div className="relative w-full h-full md:grayscale md:opacity-60 md:hover:grayscale-0 md:hover:opacity-100 transition-all duration-500">
                  <Image
                    src={partner.logo}
                    alt={`Logo ${partner.name}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 40vw, 20vw"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </RevealOnScroll>
    </>
  );

  if (inline) {
    return <div className={className}>{content}</div>;
  }

  return (
    <section className={`py-xl bg-black-5 ${className || ""}`}>
      <div className="container">
        {content}
      </div>
    </section>
  );
}
