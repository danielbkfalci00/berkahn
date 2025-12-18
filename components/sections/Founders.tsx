"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, Linkedin } from "lucide-react";

interface TimelineEvent {
  year: string;
  role: string;
  company: string;
  description: string;
  achievements: string[];
}

interface Founder {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  timeline: TimelineEvent[];
}

const FOUNDERS: Founder[] = [
  {
    name: "Daniel Falci",
    role: "Co-Fundador",
    bio: "Engenheiro civil com sólida experiência em planejamento, gerenciamento e execução de obras. Atuou em projetos residenciais, comerciais e logísticos, com participação direta na coordenação de empreendimentos de alto padrão em São Paulo.",
    image: "/images/founders/daniel-falci.webp",
    linkedin: "https://www.linkedin.com/in/danielbkfalci/",
    timeline: [
      {
        year: "2024",
        role: "Co-Fundador",
        company: "BERKAHN",
        description: "Fundação da BERKAHN com foco em transformar a construção civil através de processos industrializados e gestão de excelência.",
        achievements: [
          "Liderança no planejamento estratégico da empresa",
          "Gestão de portfólio de projetos residenciais e comerciais",
          "Implementação de metodologias de gerenciamento de alto padrão",
          "Coordenação de obras complexas em São Paulo"
        ]
      },
      {
        year: "2018-2024",
        role: "Engenheiro Civil Sênior",
        company: "Projetos Alto Padrão - São Paulo",
        description: "Atuação em planejamento, gerenciamento e execução de obras residenciais, comerciais e logísticas de grande porte.",
        achievements: [
          "Coordenação de empreendimentos de alto padrão",
          "Gestão de cronogramas e orçamentos complexos",
          "Liderança de equipes multidisciplinares",
          "Melhorias em processos construtivos"
        ]
      },
      {
        year: "2015-2018",
        role: "Engenheiro de Planejamento",
        company: "Construtora Regional",
        description: "Responsável pelo planejamento e acompanhamento de obras residenciais e comerciais.",
        achievements: [
          "Desenvolvimento de cronogramas físico-financeiros",
          "Controle de qualidade e prazos",
          "Gestão de fornecedores e subcontratados"
        ]
      },
      {
        year: "2010-2015",
        role: "Graduação em Engenharia Civil",
        company: "Universidade",
        description: "Formação acadêmica com foco em gestão de projetos e processos construtivos.",
        achievements: [
          "Especialização em gerenciamento de obras",
          "Estágios em construtoras de médio e grande porte",
          "TCC sobre melhorias em processos construtivos"
        ]
      }
    ]
  },
  {
    name: "Matheus Bertevello",
    role: "Co-Fundador",
    bio: "Formado em Engenharia de Produção pelo Centro Universitário FEI, mais de 7 anos de experiência em Melhoria de Processos e atualmente trabalha com Consultoria de Processos implementando o Lean Construction em obras civis.",
    image: "/images/founders/matheus-bertevello.webp",
    linkedin: "https://www.linkedin.com/in/matheus-bertevello/",
    timeline: [
      {
        year: "2024",
        role: "Co-Fundador",
        company: "BERKAHN",
        description: "Fundação da BERKAHN trazendo expertise em Lean Construction e melhorias em processos para revolucionar a construção civil.",
        achievements: [
          "Implementação de metodologia Lean Construction",
          "Melhorias em fluxos de trabalho e redução de desperdícios",
          "Consultoria de processos para obras civis",
          "Desenvolvimento de sistema de gestão proprietário"
        ]
      },
      {
        year: "2017-2024",
        role: "Consultor de Processos",
        company: "Consultoria Lean Construction",
        description: "Especialista em implementação de Lean Construction em obras civis, com foco em melhoria contínua e eliminação de desperdícios.",
        achievements: [
          "7+ anos de experiência em melhoria de processos",
          "Implementação de Lean Construction em 50+ obras",
          "Redução média de 30% em desperdícios",
          "Treinamento de 200+ profissionais em Lean"
        ]
      },
      {
        year: "2015-2017",
        role: "Engenheiro de Processos",
        company: "Indústria de Construção",
        description: "Atuação em mapeamento e otimização de processos produtivos na construção civil.",
        achievements: [
          "Mapeamento de processos construtivos",
          "Implementação de indicadores de performance (KPIs)",
          "Redução de retrabalho em 25%"
        ]
      },
      {
        year: "2011-2015",
        role: "Graduação em Engenharia de Produção",
        company: "Centro Universitário FEI",
        description: "Formação com ênfase em gestão de processos, qualidade e melhoria contínua.",
        achievements: [
          "Especialização em Lean Manufacturing",
          "TCC sobre aplicação de Lean na construção civil",
          "Estágios em consultoria de processos"
        ]
      }
    ]
  },
  {
    name: "Gabriel Vidal",
    role: "Co-Fundador",
    bio: "Engenheiro civil formado pelo Centro Universitário de Brasília, MBA em gerenciamento de projetos (IBMEC) e gerenciamento de empreendimentos na construção civil (Mackenzie), 6 anos de experiência com licitações e gestão de contratos de prestação de serviços públicos e privados e 4 anos de experiência com orçamentos, viabilidades e desenvolvimento de empreendimentos imobiliários.",
    image: "/images/founders/gabriel-vidal.webp",
    timeline: [
      {
        year: "2024",
        role: "Co-Fundador",
        company: "BERKAHN",
        description: "Fundação da BERKAHN trazendo expertise em gestão de contratos, orçamentos e viabilidade de empreendimentos imobiliários.",
        achievements: [
          "Estruturação comercial e financeira da empresa",
          "Gestão de contratos e licitações",
          "Análise de viabilidade de empreendimentos",
          "Desenvolvimento de portfólio imobiliário"
        ]
      },
      {
        year: "2020-2024",
        role: "Gerente de Desenvolvimento",
        company: "Incorporadora Imobiliária",
        description: "Responsável por orçamentos, viabilidades e desenvolvimento de empreendimentos imobiliários.",
        achievements: [
          "4 anos de experiência em orçamentos e viabilidades",
          "Análise de viabilidade de 30+ empreendimentos",
          "Desenvolvimento de metodologia própria de análise",
          "Captação de R$ 50M para projetos imobiliários"
        ]
      },
      {
        year: "2018-2020",
        role: "MBA Gerenciamento de Empreendimentos",
        company: "Universidade Presbiteriana Mackenzie",
        description: "Especialização em gestão de empreendimentos na construção civil.",
        achievements: [
          "MBA em Gerenciamento de Empreendimentos",
          "Certificação em gestão de riscos",
          "Networking com líderes do mercado imobiliário"
        ]
      },
      {
        year: "2014-2020",
        role: "Coordenador de Licitações",
        company: "Setor Público e Privado",
        description: "Gestão de licitações e contratos de prestação de serviços em órgãos públicos e empresas privadas.",
        achievements: [
          "6 anos de experiência em licitações",
          "Gestão de contratos de R$ 100M+",
          "Participação em 150+ processos licitatórios",
          "Especialização em Lei 8.666 e Lei 14.133"
        ]
      },
      {
        year: "2016-2018",
        role: "MBA Gerenciamento de Projetos",
        company: "IBMEC",
        description: "Especialização em metodologias de gerenciamento de projetos.",
        achievements: [
          "MBA em Gerenciamento de Projetos",
          "Certificação em PMI/PMP",
          "Especialização em MS Project e Primavera"
        ]
      },
      {
        year: "2010-2014",
        role: "Graduação em Engenharia Civil",
        company: "Centro Universitário de Brasília - UniCEUB",
        description: "Formação em Engenharia Civil com foco em gestão e planejamento.",
        achievements: [
          "Graduação em Engenharia Civil",
          "Estágios em órgãos públicos e construtoras",
          "TCC sobre gerenciamento de obras públicas"
        ]
      }
    ]
  }
];

export function Founders() {
  return (
    <section className="py-xl">
      <div className="container">
        {/* Headline */}
        <RevealOnScroll>
          <h2 className="headline-md mb-6 text-center">Quem Lidera a Berkahn</h2>
          <p className="body-md text-black-70 text-center max-w-3xl mx-auto mb-12">
            A BERKAHN é guiada por fundadores com décadas de experiência em
            construção civil, engenharia e gestão de projetos. Unidos pela visão
            de transformar a construção no Brasil através da inovação e excelência.
          </p>
        </RevealOnScroll>

        {/* Grid de Founders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {FOUNDERS.map((founder, index) => (
            <RevealOnScroll key={founder.name} delay={index * 0.15}>
              <Card className="overflow-hidden hover:shadow-luxury-xl transition-shadow duration-300 h-full group">
                {/* Foto */}
                <div className="relative aspect-square overflow-hidden bg-black-5">
                  <Image
                    src={founder.image}
                    alt={`${founder.name} - ${founder.role}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                  />

                  {/* LinkedIn Badge - aparece no hover do card */}
                  {founder.linkedin && (
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-luxury-md z-10"
                      aria-label={`LinkedIn de ${founder.name}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Conteúdo */}
                <CardContent className="p-6">
                  <h3 className="headline-sm mb-2">{founder.name}</h3>
                  <p className="text-sm text-black-50 mb-4 uppercase tracking-wider">
                    {founder.role}
                  </p>
                  <p className="body-md text-black-70 leading-relaxed mb-6">
                    {founder.bio}
                  </p>

                  {/* Dialog Trigger */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full group/btn border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                      >
                        <span className="text-sm uppercase tracking-wider font-medium">Ver Trajetória</span>
                        <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
                      <DialogHeader className="border-b border-black-10 pb-6 mb-8">
                        <div className="flex items-start gap-6">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-black-5 flex-shrink-0">
                            <Image
                              src={founder.image}
                              alt={founder.name}
                              fill
                              sizes="96px"
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="flex-1 pr-14">
                            <div className="flex items-center justify-between gap-4">
                              <DialogTitle className="text-3xl font-light text-black tracking-tight mb-2">
                                {founder.name}
                              </DialogTitle>
                              {founder.linkedin && (
                                <a
                                  href={founder.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 hover:shadow-luxury-lg transition-all duration-300 flex-shrink-0"
                                  aria-label={`Perfil do LinkedIn de ${founder.name}`}
                                >
                                  <Linkedin className="w-6 h-6" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-black-50 uppercase tracking-wider font-medium">
                              {founder.role}
                            </p>
                          </div>
                        </div>
                      </DialogHeader>

                      {/* Timeline Vertical */}
                      <div className="space-y-8 pb-8">
                        {founder.timeline.map((event, idx) => (
                          <div
                            key={idx}
                            className="relative pl-8 border-l-2 border-black-10 pb-8 last:pb-0 last:border-l-0"
                          >
                            {/* Year Badge */}
                            <div className="absolute left-[-13px] top-0 bg-black text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                              {event.year}
                            </div>

                            <div className="pt-10">
                              <h4 className="text-xl font-medium text-black mb-1">
                                {event.role}
                              </h4>
                              <p className="text-sm text-black-50 mb-3 font-medium">
                                {event.company}
                              </p>
                              <p className="text-base text-black-70 leading-relaxed mb-4">
                                {event.description}
                              </p>

                              {/* Achievements */}
                              <div className="bg-black-5 rounded-lg p-4">
                                <div className="text-xs font-medium text-black mb-3 uppercase tracking-wider">
                                  Conquistas
                                </div>
                                <ul className="space-y-2">
                                  {event.achievements.map((achievement, aidx) => (
                                    <li key={aidx} className="flex items-start gap-2 text-sm text-black-70">
                                      <div className="w-1 h-1 rounded-full bg-black mt-2 flex-shrink-0" />
                                      <span className="leading-relaxed">{achievement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
