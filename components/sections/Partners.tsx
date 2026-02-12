import Image from "next/image";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const partners = [
  { name: "Brand 01", logo: "/images/Apresentação/Marcas Parceiras/brand-01.webp" },
  { name: "Lumen", logo: "/images/Apresentação/Marcas Parceiras/lumen.webp" },
  { name: "Knauf", logo: "/images/Apresentação/Marcas Parceiras/knauf.webp" },
  { name: "Aquapanel", logo: "/images/Apresentação/Marcas Parceiras/aquapanel.webp" },
];

export function Partners() {
  return (
    <section className="py-lg bg-black-5">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text text-black-50 text-center mb-3 tracking-widest">
            MARCAS PARCEIRAS
          </p>
          <h2 className="headline-sm text-center mb-12">
            Trabalhamos com as Melhores
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 items-center max-w-4xl mx-auto">
            {partners.map((partner) => (
              <div key={partner.name} className="flex items-center justify-center h-16 md:h-20 px-4">
                <div className="relative w-full h-full grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
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
        </RevealOnScroll>
      </div>
    </section>
  );
}
