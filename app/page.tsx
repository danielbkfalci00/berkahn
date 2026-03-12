import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { Expertise } from "@/components/sections/Expertise";
import { Gallery } from "@/components/sections/Gallery";
import { LSFIntro } from "@/components/sections/LSFIntro";
import { BenefitsGridCompact } from "@/components/sections/BenefitsGridCompact";
import { ComparisonTableHome } from "@/components/sections/ComparisonTableHome";
import { Partners } from "@/components/sections/Partners";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Berkahn | Construtora Steel Frame em BH",
  description:
    "Construtora especializada em Light Steel Frame em Belo Horizonte. Projetos residenciais e comerciais com agilidade, sustentabilidade e acabamento premium.",
};

export default function Home() {
  return (
    <>
      {/* Preload LCP image — priority prop on Next.js Image doesn't emit fetchpriority in carousel context */}
      <link
        rel="preload"
        as="image"
        href="/images/hero/hero-home-1.webp"
        // @ts-ignore — fetchPriority is valid HTML but may not be typed in @types/react 18
        fetchPriority="high"
      />
      <Hero />
      <Categories />
      <Expertise />
      <Gallery />
      <LSFIntro />
      <BenefitsGridCompact />
      <ComparisonTableHome />
      <Partners
        label="PARCERIAS QUE SUSTENTAM A QUALIDADE"
        title="Marcas que Garantem o Padrão Berkahn"
        marquee
      />
      <CTA />
    </>
  );
}
