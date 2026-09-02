import type { Metadata } from "next";
import { preload } from "react-dom";
import { SmoothScroll } from "@/components/sections/home/SmoothScroll";
import { HeroCinematic } from "@/components/sections/home/HeroCinematic";
import { EditorialStatement } from "@/components/sections/home/EditorialStatement";
import { Segments } from "@/components/sections/home/Segments";
import { ProcessPinned } from "@/components/sections/home/ProcessPinned";
import { ComparisonCompact } from "@/components/sections/home/ComparisonCompact";
import { ImpactLedger } from "@/components/sections/home/ImpactLedger";
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
  preload("/videos/hero/hero-poster.webp", { as: "image", fetchPriority: "high" });

  return (
    <div>
      <SmoothScroll />
      <HeroCinematic />
      <EditorialStatement />
      <Segments />
      <ProcessPinned />
      <ComparisonCompact />
      <ImpactLedger />
      <Partners
        label="PARCERIAS QUE SUSTENTAM A QUALIDADE"
        title="Marcas que Garantem o Padrão Berkahn"
        marquee
      />
      <CTA />
    </div>
  );
}
