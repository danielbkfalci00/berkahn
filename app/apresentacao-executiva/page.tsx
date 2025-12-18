import type { Metadata } from "next";
import { PresentationLayout } from "@/components/presentation/PresentationLayout";
import { SlideCover } from "@/components/presentation/slides/SlideCover";
import { SlideAbout } from "@/components/presentation/slides/SlideAbout";
import { SlideDiferenciais } from "@/components/presentation/slides/SlideDiferenciais";
import { SlideFounders } from "@/components/presentation/slides/SlideFounders";
import { SlideProject1 } from "@/components/presentation/slides/SlideProject1";
import { SlideProject2 } from "@/components/presentation/slides/SlideProject2";
import { SlideProject3 } from "@/components/presentation/slides/SlideProject3";
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

      {/* Slide 3: Diferenciais - Light Steel Frame (dark) */}
      <SlideDiferenciais />

      {/* Slide 4: Fundadores */}
      <SlideFounders />

      {/* Slide 5: Projeto 1 - Casa de Campo (dark) */}
      <SlideProject1 />

      {/* Slide 6: Projeto 2 - Loft Urbano (light, reversed) */}
      <SlideProject2 />

      {/* Slide 7: Projeto 3 - Chalé Rústico (dark) */}
      <SlideProject3 />

      {/* Slide 8: Metodologia */}
      <SlideMethodology />

      {/* Slide 9: Contato */}
      <SlideContact />
    </PresentationLayout>
  );
}
