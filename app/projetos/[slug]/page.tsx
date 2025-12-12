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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, Shield, CheckCircle2, Zap, Leaf, Timer, ThumbsUp, Award, Wrench } from "lucide-react";

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

// Ícones para os diferenciais (cicla entre os ícones disponíveis)
const highlightIcons = [Zap, Leaf, Timer, ThumbsUp, Award, Wrench];

// Descrições expandidas para os diferenciais
const highlightDescriptions: Record<string, string> = {
  "Construção 50% mais rápida que alvenaria": "O sistema Light Steel Frame permite uma execução até 50% mais rápida comparado à construção tradicional, reduzindo o tempo de obra e permitindo que você desfrute do seu imóvel mais cedo.",
  "Seis vezes mais leve que construção convencional": "A estrutura em aço galvanizado é extremamente leve, reduzindo a carga sobre a fundação e permitindo construções em terrenos com menor capacidade de suporte.",
  "Resistente a cupins e pragas": "Diferente da madeira, o aço não é atacado por cupins, fungos ou outras pragas, garantindo durabilidade e eliminando custos com tratamentos preventivos.",
  "Excelente isolamento termoacústico": "Os painéis preenchidos com lã de vidro ou lã de rocha proporcionam conforto térmico e acústico superior, mantendo a temperatura agradável e reduzindo ruídos externos.",
  "100% reciclável e sustentável": "O aço é totalmente reciclável e a construção gera menos resíduos. Uma escolha consciente para quem se preocupa com o meio ambiente.",
  "Precisão milimétrica na execução": "A fabricação industrial dos perfis garante precisão dimensional, resultando em acabamentos perfeitos e menor desperdício de materiais.",
};

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
      {/* 1. Hero */}
      <HeroPage
        title={project.name}
        subtitle={getCategoryLabel(project.category)}
        imageSrc={project.heroImage}
        imageAlt={project.name}
      />

      {/* 2. Galeria Bento - NOVA POSIÇÃO (logo após hero) */}
      {project.gallery.length > 0 && (
        <section className="py-lg">
          <div className="container">
            <ProjectGallery images={project.gallery} projectName={project.name} />
          </div>
        </section>
      )}

      {/* 3. Visão Geral - SEM diferenciais */}
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

                {/* Info adicional (prazo + garantia) */}
                <div className="flex flex-wrap gap-6 pt-6 border-t border-black/10">
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

      {/* 4. Diferenciais - NOVA SEÇÃO com Accordion */}
      {project.highlights.length > 0 && (
        <section className="py-lg bg-black-5">
          <div className="container max-w-4xl">
            <RevealOnScroll>
              <div className="text-center mb-10">
                <p className="label-text mb-4">Por que escolher</p>
                <h2 className="headline-md">Diferenciais do Projeto</h2>
                <p className="body-md text-black-70 mt-4 max-w-2xl mx-auto">
                  Conheça os benefícios exclusivos da construção em Steel Frame
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <Accordion type="multiple" className="space-y-3">
                {project.highlights.map((highlight, index) => {
                  const IconComponent = highlightIcons[index % highlightIcons.length];
                  const description = highlightDescriptions[highlight] ||
                    "Este diferencial contribui para a qualidade, durabilidade e conforto da sua construção em Steel Frame.";

                  return (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-white rounded-lg shadow-luxury-sm border-0 overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-black-5/50 transition-colors [&[data-state=open]]:bg-black-5/30">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium text-left pr-4">{highlight}</span>
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

      {/* 5. Características */}
      <section className="py-xl">
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

      {/* 6. Plantas Baixas */}
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

      {/* 7. Tabela de Modelos */}
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

      {/* 8. CTA */}
      <CTA />
    </main>
  );
}
