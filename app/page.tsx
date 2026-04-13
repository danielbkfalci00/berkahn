import type { Metadata } from "next";
import { preload } from "react-dom";
import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { Expertise } from "@/components/sections/Expertise";

import { LSFIntro } from "@/components/sections/LSFIntro";
import { BenefitsGridCompact } from "@/components/sections/BenefitsGridCompact";
import { ComparisonTableHome } from "@/components/sections/ComparisonTableHome";
import { Partners } from "@/components/sections/Partners";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Berkahn | Construtora Steel Frame em SP",
  description:
    "Construtora especializada em Light Steel Frame em São Paulo. Projetos residenciais e comerciais com agilidade, sustentabilidade e acabamento premium.",
  alternates: {
    canonical: "/",
    languages: { "pt-BR": "https://www.berkahn.com.br/" },
  },
};

export default function Home() {
  // Preload LCP image with high priority — React 19 / Next.js 15 API
  preload("/images/hero/hero-home-1.webp", { as: "image", fetchPriority: "high" });

  return (
    <>
      <Hero />
      <Categories />
      <Expertise />

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
