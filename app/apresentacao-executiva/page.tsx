import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PresentationLayout } from "@/components/presentation/PresentationLayout";
import { presentationProjects } from "@/lib/presentation-data";

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
const SlideProjectsIntro = dynamic(() =>
  import("@/components/presentation/slides/SlideProjectsIntro").then((m) => m.SlideProjectsIntro)
);
const SlideProject = dynamic(() =>
  import("@/components/presentation/slides/SlideProject").then((m) => m.SlideProject)
);
const SlideMethodology = dynamic(() =>
  import("@/components/presentation/slides/SlideMethodology").then((m) => m.SlideMethodology)
);
const SlideGallery = dynamic(() =>
  import("@/components/presentation/slides/SlideGallery").then((m) => m.SlideGallery)
);
const SlidePartners = dynamic(() =>
  import("@/components/presentation/slides/SlidePartners").then((m) => m.SlidePartners)
);
const SlideServices = dynamic(() =>
  import("@/components/presentation/slides/SlideServices").then((m) => m.SlideServices)
);
const SlideContact = dynamic(() =>
  import("@/components/presentation/slides/SlideContact").then((m) => m.SlideContact)
);
const SlideGlobalOverview = dynamic(() =>
  import("@/components/presentation/slides/SlideGlobalOverview").then((m) => m.SlideGlobalOverview)
);
const SlideGlobalLeaders = dynamic(() =>
  import("@/components/presentation/slides/SlideGlobalLeaders").then((m) => m.SlideGlobalLeaders)
);
const SlideBrazilOpportunity = dynamic(() =>
  import("@/components/presentation/slides/SlideBrazilOpportunity").then((m) => m.SlideBrazilOpportunity)
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

      {/* Slide 3: Como Trabalhamos */}
      <SlideMethodology />

      {/* Slide 4: Diferenciais - Light Steel Frame (dark) */}
      <SlideDiferenciais />

      {/* Slide 5: Steel Frame no Mundo - Panorama Global (dark) */}
      <SlideGlobalOverview />

      {/* Slide 6: Líderes Globais - Comparativo (dark) */}
      <SlideGlobalLeaders />

      {/* Slide 7: A Oportunidade Brasil (dark) */}
      <SlideBrazilOpportunity />

      {/* Slide 8: Fundadores */}
      <SlideFounders />

      {/* Slide 6: Soluções - O que Fazemos por Você */}
      <SlideServices />

      {/* Slide 7: Introdução Projetos */}
      <SlideProjectsIntro />

      {/* Slides 7-9: Projetos (dados centralizados em lib/presentation-data.ts) */}
      {presentationProjects.map((project) => (
        <SlideProject key={project.number} {...project} />
      ))}

      {/* Slide 9: Marcas Parceiras (dark) */}
      <SlidePartners />

      {/* Slide 10: Galeria de Projetos (dark) */}
      <SlideGallery />

      {/* Slide 11: Contato */}
      <SlideContact />
    </PresentationLayout>
  );
}
