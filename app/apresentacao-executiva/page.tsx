import type { Metadata } from "next";
import { PresentationLayout } from "@/components/presentation/PresentationLayout";
import { SlideCover } from "@/components/presentation/slides/SlideCover";
import { SlideAbout } from "@/components/presentation/slides/SlideAbout";
import { SlideFounders } from "@/components/presentation/slides/SlideFounders";
import { SlidePortfolio } from "@/components/presentation/slides/SlidePortfolio";
import { SlideMethodology } from "@/components/presentation/slides/SlideMethodology";
import { SlideContact } from "@/components/presentation/slides/SlideContact";

export const metadata: Metadata = {
  title: "Apresentação Executiva | BERKAHN - Soluções em Steel Frame",
  description:
    "Conheça a BERKAHN: empresa especializada em Steel Frame com mais de 20 anos de experiência combinada dos fundadores. Projetos residenciais e comerciais de alto padrão.",
  robots: "noindex, nofollow", // Não indexar a apresentação
};

export default function ApresentacaoExecutivaPage() {
  return (
    <PresentationLayout>
      {/* Slide 1: Capa */}
      <SlideCover />

      {/* Slide 2: Quem Somos */}
      <SlideAbout />

      {/* Slide 3: Fundadores */}
      <SlideFounders />

      {/* Slide 4: Números + Portfolio */}
      <SlidePortfolio />

      {/* Slide 5: Metodologia */}
      <SlideMethodology />

      {/* Slide 6: Contato */}
      <SlideContact />
    </PresentationLayout>
  );
}
