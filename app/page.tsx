import type { Metadata } from "next";
import { preload } from "react-dom";
import { SmoothScroll } from "@/components/sections/home/SmoothScroll";
import { HeroCinematic } from "@/components/sections/home/HeroCinematic";
import { EditorialStatement } from "@/components/sections/home/EditorialStatement";
import { Segments } from "@/components/sections/home/Segments";
import { ProcessPinned } from "@/components/sections/home/ProcessPinned";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { ComparisonCompact } from "@/components/sections/home/ComparisonCompact";
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

// Medições de engenharia do sistema LSF (fonte: lib/lsf-data.ts COMPARISON_DATA)
const HOME_STATS = [
  { value: 6, prefix: "até ", suffix: " meses", label: "do terreno à entrega" },
  { value: 5, prefix: "< ", suffix: "%", label: "de desperdício de material" },
  { value: 2, prefix: "± ", suffix: " mm", label: "de tolerância na estrutura" },
  { value: 8, prefix: "até ", suffix: " m", label: "de vãos livres" },
];

export default function Home() {
  preload("/videos/hero/hero-poster.webp", { as: "image", fetchPriority: "high" });

  return (
    <>
      <SmoothScroll />
      <HeroCinematic />
      <EditorialStatement />
      <Segments />
      <ProcessPinned />
      <StatsCounter stats={HOME_STATS} />
      <ComparisonCompact />
      <Partners
        label="PARCERIAS QUE SUSTENTAM A QUALIDADE"
        title="Marcas que Garantem o Padrão Berkahn"
        marquee
      />
      <CTA />
    </>
  );
}
