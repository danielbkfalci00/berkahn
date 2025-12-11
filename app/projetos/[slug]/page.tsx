import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroPage } from "@/components/sections/HeroPage";
import { CTA } from "@/components/sections/CTA";
import { ProjectSpecs } from "@/components/project/ProjectSpecs";
import { ProjectFeatures } from "@/components/project/ProjectFeatures";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectFloorPlans } from "@/components/project/ProjectFloorPlans";
import { ProjectModels } from "@/components/project/ProjectModels";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { getProjectBySlug, getAllProjectSlugs, getCategoryInfo } from "@/data/projects";
import { getCategoryLabel } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

// Gerar paths estáticos para todos os projetos
export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Gerar metadata dinâmico
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projeto não encontrado | Berkahn",
    };
  }

  return {
    title: `${project.name} | Berkahn Steel Frame`,
    description: project.tagline,
    openGraph: {
      title: project.name,
      description: project.tagline,
      images: [project.heroImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const categoryInfo = getCategoryInfo(project.category);

  // Separar parágrafos da descrição
  const descriptionParagraphs = project.description.split("\n\n");

  return (
    <main>
      {/* Hero */}
      <HeroPage
        title={project.name}
        subtitle={getCategoryLabel(project.category)}
        imageSrc={project.heroImage}
        imageAlt={project.name}
      />

      {/* Visão Geral */}
      <section className="py-xl">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Coluna Esquerda: Descrição */}
            <RevealOnScroll>
              <div>
                <Badge
                  variant="outline"
                  className="mb-4 text-xs uppercase tracking-wider"
                >
                  {getCategoryLabel(project.category)}
                </Badge>
                <h2 className="headline-md mb-6">Sobre o Projeto</h2>

                <div className="space-y-4 mb-8">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className="body-lg text-black-70">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Highlights */}
                {project.highlights.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold mb-4">Diferenciais</h3>
                    {project.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-black-70"
                      >
                        <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Info adicional */}
                <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-black/10">
                  {project.constructionTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-black-50" />
                      <span className="text-black-70">Prazo:</span>
                      <span className="font-medium">{project.constructionTime}</span>
                    </div>
                  )}
                  {project.warranty && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-black-50" />
                      <span className="text-black-70">Garantia:</span>
                      <span className="font-medium">{project.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            </RevealOnScroll>

            {/* Coluna Direita: Specs Card */}
            <RevealOnScroll delay={0.2}>
              <ProjectSpecs project={project} />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-xl bg-black-5">
        <div className="container">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <p className="label-text mb-4">Características do Imóvel</p>
              <h2 className="headline-md">O que você vai encontrar</h2>
            </div>
          </RevealOnScroll>

          <ProjectFeatures project={project} />
        </div>
      </section>

      {/* Galeria */}
      {project.gallery.length > 0 && (
        <section className="py-xl">
          <div className="container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <p className="label-text mb-4">Galeria do Projeto</p>
                <h2 className="headline-md">Conheça cada detalhe</h2>
              </div>
            </RevealOnScroll>

            <ProjectGallery images={project.gallery} projectName={project.name} />
          </div>
        </section>
      )}

      {/* Plantas Baixas */}
      {project.floorPlans.length > 0 && (
        <section className="py-xl bg-black-5">
          <div className="container max-w-5xl">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <p className="label-text mb-4">Plantas Baixas</p>
                <h2 className="headline-md">Visualize o espaço</h2>
              </div>
            </RevealOnScroll>

            <ProjectFloorPlans plans={project.floorPlans} projectName={project.name} />
          </div>
        </section>
      )}

      {/* Tabela de Modelos */}
      {project.models.length > 0 && (
        <section className="py-2xl">
          <div className="container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <p className="label-text mb-4">Modelos Disponíveis</p>
                <h2 className="headline-md mb-6">Compare os Modelos</h2>
                <p className="body-lg text-black-70 max-w-3xl mx-auto">
                  Escolha o nível de acabamento que melhor atende às suas
                  necessidades. Desde a estrutura básica até a solução completa
                  chave na mão.
                </p>
              </div>
            </RevealOnScroll>

            <ProjectModels project={project} />
          </div>
        </section>
      )}

      {/* CTA */}
      <CTA />
    </main>
  );
}
