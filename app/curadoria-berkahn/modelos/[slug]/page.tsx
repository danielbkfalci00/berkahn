import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { getProjectBySlug, PROJECTS } from "@/data/projects";
import { ModelPageHeader } from "@/components/architects/ModelPageHeader";
import { ModelIndividualHero } from "@/components/architects/ModelIndividualHero";
import { ScrollProgress } from "@/components/architects/ScrollProgress";
import { UnifiedCTA } from "@/components/architects/UnifiedCTA";
import { ProjectSpecs } from "@/components/project/ProjectSpecs";
import { ProjectFeatures } from "@/components/project/ProjectFeatures";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const ProjectGallery = dynamic(() =>
  import("@/components/project/ProjectGallery").then((m) => ({ default: m.ProjectGallery })),
);
const ProjectFloorPlans = dynamic(() =>
  import("@/components/project/ProjectFloorPlans").then((m) => ({ default: m.ProjectFloorPlans })),
);
const ProjectModels = dynamic(() =>
  import("@/components/project/ProjectModels").then((m) => ({ default: m.ProjectModels })),
);
const ProjectTechnicalTable = dynamic(() =>
  import("@/components/project/ProjectTechnicalTable").then((m) => ({ default: m.ProjectTechnicalTable })),
);
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Clock,
  Shield,
  Zap,
  Leaf,
  Timer,
  ThumbsUp,
  Award,
  Wrench,
  ArrowUpRight,
} from "lucide-react";

const FEATURED_MODEL_SLUGS = ["casa-de-campo", "chale", "loft"] as const;

export function generateStaticParams() {
  return FEATURED_MODEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Modelo não encontrado | BERKAHN" };
  }

  return {
    title: `${project.name} · Modelo Berkahn | Curadoria`,
    description: project.tagline,
    robots: "noindex, nofollow",
  };
}

const highlightIcons = [Zap, Leaf, Timer, ThumbsUp, Award, Wrench];

const highlightDescriptions: Record<string, string> = {
  "Construção 50% mais rápida que alvenaria":
    "O sistema Light Steel Frame permite uma execução até 50% mais rápida comparado à construção tradicional, reduzindo o tempo de obra.",
  "Seis vezes mais leve que construção convencional":
    "A estrutura em aço galvanizado é extremamente leve, reduzindo a carga sobre a fundação.",
  "Resistente a cupins e pragas":
    "Diferente da madeira, o aço não é atacado por cupins, fungos ou outras pragas, garantindo durabilidade.",
  "Excelente isolamento termoacústico":
    "Os painéis preenchidos com lã de vidro ou lã de rocha proporcionam conforto térmico e acústico superior.",
  "100% reciclável e sustentável":
    "O aço é totalmente reciclável e a construção gera menos resíduos.",
  "Precisão milimétrica na execução":
    "A fabricação industrial dos perfis garante precisão dimensional, resultando em acabamentos perfeitos.",
};

export default async function ModelIndividualPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !FEATURED_MODEL_SLUGS.includes(slug as (typeof FEATURED_MODEL_SLUGS)[number])) {
    notFound();
  }

  const descriptionParagraphs = project.description.split("\n\n");

  // Outros modelos da curadoria (excluindo o atual)
  const otherModels = FEATURED_MODEL_SLUGS
    .filter((s) => s !== slug)
    .map((s) => PROJECTS.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="min-h-screen w-full bg-white">
      <ScrollProgress />
      <ModelPageHeader modelName={project.name} />
      <ModelIndividualHero project={project} />

      {/* Galeria Bento — logo após o hero */}
      {project.gallery.length > 0 && (
        <section className="py-lg">
          <div className="container">
            <ProjectGallery
              images={project.gallery}
              projectName={project.name}
            />
          </div>
        </section>
      )}

      {/* Visão Geral + Specs */}
      <section className="py-xl">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <RevealOnScroll>
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-6">
                  Sobre o modelo
                </p>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-8">
                  {project.tagline}
                </h2>

                <div className="space-y-4 mb-8">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base lg:text-lg text-black-70 font-light leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-6 pt-6 border-t border-black/10">
                  {project.constructionTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-black-50" />
                      <span className="text-black-70">Prazo:</span>
                      <span className="font-medium">
                        {project.constructionTime}
                      </span>
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

            <RevealOnScroll delay={0.2}>
              <ProjectSpecs project={project} />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      {project.highlights.length > 0 && (
        <section className="py-lg bg-off-white">
          <div className="container max-w-4xl">
            <RevealOnScroll>
              <div className="text-center mb-10">
                <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-4">
                  Por que escolher
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-light tracking-tight">
                  Diferenciais do modelo
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <Accordion type="multiple" className="space-y-3">
                {project.highlights.map((highlight, index) => {
                  const IconComponent =
                    highlightIcons[index % highlightIcons.length];
                  const description =
                    highlightDescriptions[highlight] ||
                    "Este diferencial contribui para a qualidade, durabilidade e conforto da sua construção em Steel Frame.";

                  return (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-white rounded-lg shadow-luxury-sm border-0 overflow-hidden"
                    >
                      <AccordionTrigger className="group px-6 py-4 text-left hover:no-underline transition-all duration-300 [&[data-state=open]]:bg-black-5/30">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-black-70 transition-all duration-300">
                            <IconComponent className="w-5 h-5 text-black" />
                          </div>
                          <span className="font-medium text-left pr-4">
                            {highlight}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-5 pt-0">
                        <div className="pl-14 text-black-70 leading-relaxed">
                          {description}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* Características */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-4">
                Características do imóvel
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-light tracking-tight">
                O que você vai encontrar
              </h2>
            </div>
          </RevealOnScroll>

          <ProjectFeatures project={project} />
        </div>
      </section>

      {/* Especificações Técnicas */}
      {project.specifications && project.specifications.length > 0 && (
        <section className="py-xl bg-off-white">
          <div className="container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-4">
                  Detalhes técnicos
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-light tracking-tight">
                  Especificações do projeto
                </h2>
              </div>
            </RevealOnScroll>

            <ProjectTechnicalTable specifications={project.specifications} />
          </div>
        </section>
      )}

      {/* Plantas Baixas */}
      {project.floorPlans.length > 0 && (
        <section className="py-xl bg-off-white">
          <div className="container max-w-5xl">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-4">
                  Plantas baixas
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-light tracking-tight">
                  Visualize o espaço
                </h2>
              </div>
            </RevealOnScroll>

            <ProjectFloorPlans
              plans={project.floorPlans}
              projectName={project.name}
            />
          </div>
        </section>
      )}

      {/* Tabela de Modelos */}
      {project.models.length > 0 && (
        <section className="py-2xl">
          <div className="container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-4">
                  Modelos disponíveis
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-light tracking-tight">
                  Compare os modelos
                </h2>
              </div>
            </RevealOnScroll>

            <ProjectModels project={project} />
          </div>
        </section>
      )}

      {/* Outros modelos da curadoria */}
      {otherModels.length > 0 && (
        <section className="py-xl bg-off-white">
          <div className="container">
            <RevealOnScroll>
              <div className="text-center md:text-left mb-12">
                <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-4">
                  Continue explorando
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-light tracking-tight">
                  Outros modelos engenheirados
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {otherModels.map((other) => (
                    <CarouselItem
                      key={other.id}
                      className="pl-4 basis-full md:basis-1/2 lg:basis-1/2"
                    >
                      <Link
                        href={`/curadoria-berkahn/modelos/${other.slug}`}
                        className="group block bg-white overflow-hidden border border-black-5 hover:border-black-20 transition-all duration-500"
                      >
                        <div className="relative aspect-[5/3] overflow-hidden">
                          <Image
                            src={other.cardImage}
                            alt={other.name}
                            fill
                            quality={75}
                            className="object-cover transition-transform duration-1000 ease-expo group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <div className="p-8">
                          <p className="text-[11px] uppercase tracking-[0.35em] text-black-50 mb-3">
                            Linha Berkahn
                          </p>
                          <h3 className="font-heading text-2xl md:text-3xl font-light tracking-tight mb-3">
                            {other.name}
                          </h3>
                          <p className="text-base text-black-70 font-light leading-relaxed mb-6">
                            {other.tagline}
                          </p>
                          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] border-b border-black/30 pb-1 group-hover:border-black transition-colors duration-300">
                            Ver modelo
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <div className="flex items-center justify-center gap-4 mt-8">
                  <CarouselPrevious className="static translate-y-0 w-12 h-12 rounded-full bg-white border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-300" />
                  <CarouselNext className="static translate-y-0 w-12 h-12 rounded-full bg-white border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-300" />
                </div>
              </Carousel>
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* CTA unificado */}
      <UnifiedCTA />

      {/* Footer minimal */}
      <footer className="bg-white py-12 px-6 text-center border-t border-black-5">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black-50 mb-3">
          Berkahn
        </p>
        <p className="text-sm text-black-70 font-light">
          Curadoria · Linha Berkahn de modelos engenheirados
        </p>
      </footer>
    </main>
  );
}
