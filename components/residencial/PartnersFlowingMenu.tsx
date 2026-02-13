"use client";

import { FlowingMenu } from "@/components/ui/flowing-menu";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const PARTNERS = [
  { text: "Eternit", image: "/images/parceiros/eternit.webp", link: "#" },
  { text: "Knauf", image: "/images/parceiros/knauf.webp", link: "#" },
  { text: "Aquapanel", image: "/images/parceiros/aquapanel.webp", link: "#" },
  { text: "Sicla", image: "/images/parceiros/sicla.webp", link: "#" },
];

export function PartnersFlowingMenu() {
  return (
    <section className="py-xl bg-black-5">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text text-black-50 text-center mb-3 tracking-widest">
            PARCERIAS QUE SUSTENTAM A QUALIDADE
          </p>
          <h2 className="headline-md text-center mb-16">
            Marcas que Garantem o Padrão Berkahn
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <FlowingMenu items={PARTNERS} />
        </RevealOnScroll>
      </div>
    </section>
  );
}
