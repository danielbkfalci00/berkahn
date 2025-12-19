import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PresentationLayout } from "@/components/presentation/PresentationLayout";

// Slide inicial (above-the-fold) - carrega eager
import { SlideCover } from "@/components/presentation/slides/SlideCover";

// Demais slides - carregam lazy para code-splitting
const SlideAbout = dynamic(() =>
  import("@/components/presentation/slides/SlideAbout").then((m) => m.SlideAbout)
);
const SlideDiferenciais = dynamic(() =>
  import("@/components/presentation/slides/SlideDiferenciais").then((m) => m.SlideDiferenciais)
);
const SlideFounders = dynamic(() =>
  import("@/components/presentation/slides/SlideFounders").then((m) => m.SlideFounders)
);
const SlideProject1 = dynamic(() =>
  import("@/components/presentation/slides/SlideProject1").then((m) => m.SlideProject1)
);
const SlideProject2 = dynamic(() =>
  import("@/components/presentation/slides/SlideProject2").then((m) => m.SlideProject2)
);
const SlideProject3 = dynamic(() =>
  import("@/components/presentation/slides/SlideProject3").then((m) => m.SlideProject3)
);
const SlideMethodology = dynamic(() =>
  import("@/components/presentation/slides/SlideMethodology").then((m) => m.SlideMethodology)
);
const SlidePartners = dynamic(() =>
  import("@/components/presentation/slides/SlidePartners").then((m) => m.SlidePartners)
);
const SlideContact = dynamic(() =>
  import("@/components/presentation/slides/SlideContact").then((m) => m.SlideContact)
);

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

      {/* Slide 9: Marcas Parceiras (dark) */}
      <SlidePartners />

      {/* Slide 10: Contato */}
      <SlideContact />
    </PresentationLayout>
  );
}
