// Portfólio - Galeria de Projetos Berkahn
import { Metadata } from "next";
import { HeroPage } from "@/components/sections/HeroPage";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { CTA } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export const metadata: Metadata = {
  title: "Portfólio | Berkahn Steel Frame",
  description:
    "Conheça nossos projetos em Light Steel Frame: casas, chalés e construções modulares com design exclusivo e tecnologia de ponta.",
  keywords: [
    "projetos steel frame",
    "portfólio berkahn",
    "casas steel frame",
    "chalés modulares",
    "construção modular",
  ],
};

export default function PortfolioPage() {
  return (
    <main>
      {/* Hero */}
      <HeroPage
        title="Portfólio"
        subtitle="Nossos Projetos"
        imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
        imageAlt="Portfólio Berkahn"
      />

      {/* Introduction */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <div className="text-center">
              <p className="label-text mb-4">PROJETOS PRONTOS</p>
              <h2 className="headline-lg mb-6">
                Design e tecnologia em cada projeto
              </h2>
              <p className="body-lg text-black-70">
                Conheça nossos projetos exclusivos em Light Steel Frame,
                desenvolvidos para oferecer conforto, eficiência e design
                contemporâneo em cada detalhe.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Projects Grid */}
      <ProjectsGrid showHeader={false} showCTA={false} />

      {/* CTA */}
      <CTA />
    </main>
  );
}
