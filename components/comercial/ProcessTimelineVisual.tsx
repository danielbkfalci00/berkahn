"use client";

import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";

interface ProcessStep {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Diagnóstico",
    description:
      "Entendemos a operação, o espaço necessário, o prazo e os requisitos técnicos. Avaliamos o terreno ou a estrutura existente e definimos a viabilidade do projeto.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Reunião de diagnóstico e planejamento",
  },
  {
    title: "Projeto",
    description:
      "Projeto estrutural e arquitetônico integrado às necessidades operacionais. Cronograma, orçamento e especificações técnicas definidos antes de qualquer fabricação.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Projeto executivo em desenvolvimento",
  },
  {
    title: "Fabricação",
    description:
      "Componentes fabricados sob medida em ambiente industrial. Paralelamente, o canteiro avança com fundação e preparações.",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Fabricação de componentes em ambiente industrial",
  },
  {
    title: "Execução",
    description:
      "Montagem industrializada com equipe especializada. Acompanhamento rigoroso de cronograma e qualidade.",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Execução de obra em steel frame",
  },
  {
    title: "Entrega",
    description:
      "Inspeção final, documentação técnica completa e entrega no prazo. Espaço pronto para a operação começar.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Edifício corporativo finalizado",
  },
];

export function ProcessTimelineVisual() {
  const timelineData = PROCESS_STEPS.map((step) => ({
    title: step.title,
    content: (
      <div className="pb-8">
        <p className="body-md text-black-70 mb-6 max-w-lg">{step.description}</p>
        <div className="relative aspect-[16/10] overflow-hidden bg-black-5 max-w-lg">
          <Image
            src={step.image}
            alt={step.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    ),
  }));

  return <Timeline data={timelineData} />;
}
