export interface ExecutionPhase {
  id: string;
  number: number;
  title: string;
  shortTitle: string; // Título curto para tabs mobile
  description: string;
  summary?: string; // Resumo curto (1-2 linhas)
  keyPoints?: string[]; // Principais atividades (3-5 bullets)
  deliverables?: string[]; // Entregáveis da fase (2-4 items)
  duration: string;
  images: {
    primary: string;
    secondary: string;
    primaryAlt: string;
    secondaryAlt: string;
  };
}

export const EXECUTION_PHASES: ExecutionPhase[] = [
  {
    id: 'pre-obra',
    number: 1,
    title: 'Pré Obra',
    shortTitle: 'Pré Obra',
    description: 'A etapa de pré-obra é onde o empreendimento é estruturado técnica e financeiramente. Nessa fase, realizamos o entendimento das necessidades do cliente, a análise crítica dos projetos, a definição do escopo, o orçamento detalhado e o planejamento da obra. O objetivo é eliminar incertezas, reduzir riscos e garantir previsibilidade de custo, prazo e qualidade antes do início da execução.',
    summary: 'Estruturação técnica e financeira do empreendimento antes do início da construção.',
    keyPoints: [
      'Análise crítica de projetos arquitetônicos e complementares',
      'Orçamento detalhado com especificações técnicas e quantitativos',
      'Planejamento de cronograma executivo e definição de marcos',
      'Estudo de viabilidade técnica e aprovações necessárias',
      'Compatibilização de projetos e identificação de interferências'
    ],
    deliverables: [
      'Cronograma executivo detalhado da obra',
      'Orçamento consolidado e memorial descritivo',
      'Plano de gestão de qualidade e segurança'
    ],
    duration: '2-3 semanas',
    images: {
      primary: '/images/Services/Execução-de-obras/Pre-obra/pre-obra-1.webp',
      secondary: '/images/Services/Execução-de-obras/Pre-obra/pre-obra-2.webp',
      primaryAlt: 'Planejamento e análise de projetos de construção',
      secondaryAlt: 'Reunião de equipe para orçamento e definição de escopo'
    }
  },
  {
    id: 'terraplanagem',
    number: 2,
    title: 'Terraplanagem, Fundação e Superestrutura',
    shortTitle: 'Estrutura',
    description: 'Nesta fase, iniciamos a implantação física da obra, com a organização do canteiro, os serviços de terraplanagem e a execução das fundações e da superestrutura. Todo o trabalho é conduzido com rigor técnico, controle de qualidade e acompanhamento constante, garantindo a estabilidade, a segurança e a durabilidade da edificação.',
    summary: 'Implantação física do empreendimento com preparação do terreno, fundações e estrutura principal.',
    keyPoints: [
      'Implantação e organização do canteiro de obras',
      'Serviços de terraplanagem, corte e aterro controlado',
      'Execução de fundações profundas ou rasas conforme projeto',
      'Montagem da superestrutura em steel frame ou concreto',
      'Controle topográfico e ensaios de qualidade'
    ],
    deliverables: [
      'Estrutura principal completa e nivelada',
      'Relatórios de ensaios de fundação e concreto',
      'Verificação de prumo, nível e esquadro'
    ],
    duration: '4-6 semanas',
    images: {
      primary: '/images/Services/Execução-de-obras/Terraplanagem/terraplanagem_1.webp',
      secondary: '/images/Services/Execução-de-obras/Terraplanagem/terraplanagem_2.webp',
      primaryAlt: 'Terraplanagem e preparação do terreno para construção',
      secondaryAlt: 'Execução de fundações e estrutura de concreto'
    }
  },
  {
    id: 'estrutura-vedacao',
    number: 3,
    title: 'Estrutura, Vedação e Instalações',
    shortTitle: 'Instalações',
    description: 'Com a estrutura concluída, avançamos para a execução das vedações, fachadas, coberturas e sistemas prediais. Nessa etapa, realizamos as instalações elétricas, hidráulicas, sanitárias, de gás e climatização, sempre com atenção à compatibilização dos projetos e à qualidade da execução, assegurando desempenho, conforto e eficiência ao empreendimento.',
    summary: 'Fechamento da edificação com vedações, cobertura e execução completa de sistemas prediais.',
    keyPoints: [
      'Montagem de paredes de vedação em steel frame ou alvenaria',
      'Execução de fachadas, esquadrias e sistemas de cobertura',
      'Instalações elétricas: quadros, distribuição e automação',
      'Instalações hidrossanitárias e sistemas de drenagem',
      'Climatização, gás, SPDA e demais sistemas complementares'
    ],
    deliverables: [
      'Edificação completamente fechada e protegida',
      'Sistemas elétricos e hidráulicos testados',
      'As-built de instalações prediais'
    ],
    duration: '6-8 semanas',
    images: {
      primary: '/images/Services/Execução-de-obras/Estrutura/estrutura-1.webp',
      secondary: '/images/Services/Execução-de-obras/Estrutura/estrutura-2.webp',
      primaryAlt: 'Montagem de estrutura em steel frame e vedações',
      secondaryAlt: 'Instalação de sistemas prediais elétricos e hidráulicos'
    }
  },
  {
    id: 'acabamentos',
    number: 4,
    title: 'Acabamentos',
    shortTitle: 'Acabamentos',
    description: 'A fase de acabamentos é onde a obra ganha vida e personalidade. Realizamos os revestimentos internos e externos, pinturas, instalação de louças, metais, esquadrias e demais elementos de finalização. Cada detalhe é executado com precisão e cuidado, garantindo um resultado final impecável, que atende às expectativas de qualidade, estética e funcionalidade do cliente.',
    summary: 'Finalização da obra com revestimentos, pinturas e instalação de todos os elementos de acabamento.',
    keyPoints: [
      'Revestimentos cerâmicos, porcelanatos e pedras naturais',
      'Pinturas internas e externas com especificações técnicas',
      'Instalação de louças sanitárias, metais e acessórios',
      'Colocação de pisos laminados, vinílicos e carpetes',
      'Limpeza final, ajustes e entrega técnica'
    ],
    deliverables: [
      'Obra 100% finalizada e pronta para uso',
      'Manual do proprietário e documentação técnica',
      'Termo de entrega e garantias'
    ],
    duration: '3-4 semanas',
    images: {
      primary: '/images/Services/Execução-de-obras/Acabamentos/acabamentos_1.webp',
      secondary: '/images/Services/Execução-de-obras/Acabamentos/acabamentos_2.webp',
      primaryAlt: 'Aplicação de revestimentos e acabamentos finais',
      secondaryAlt: 'Obra finalizada com detalhes de acabamento'
    }
  }
];

// Interface para a timeline "Como Trabalhamos"
export interface HowWeWorkStep {
  step: number;
  title: string;
  description: string;
  images: string[]; // Array com 2 imagens para carousel
  highlights: string[];
}

// Timeline "Como Trabalhamos" - 4 Passos da Metodologia Berkahn
export const HOW_WE_WORK_TIMELINE: HowWeWorkStep[] = [
  {
    step: 1,
    title: "Consulta Inicial",
    description: "Reunião para entender suas necessidades, objetivos e expectativas. Analisamos o terreno, discutimos ideias e apresentamos as melhores soluções em Steel Frame para seu projeto.",
    images: [
      "/images/Services/Como-trabalhamos/consulta-inicial-1.webp",
      "/images/Services/Como-trabalhamos/consulta-inicial-2.webp"
    ],
    highlights: [
      "Entendimento das necessidades do cliente",
      "Análise preliminar do terreno",
      "Apresentação do sistema Steel Frame",
      "Estudo de viabilidade técnica",
      "Alinhamento de expectativas e prazos"
    ]
  },
  {
    step: 2,
    title: "Desenvolvimento do Projeto",
    description: "Elaboração completa do projeto arquitetônico, estrutural e complementares. Utilizamos softwares BIM para precisão milimétrica e otimização de materiais.",
    images: [
      "/images/Services/Como-trabalhamos/desenvolvimento-de-projetos-1.webp",
      "/images/Services/Como-trabalhamos/desenvolvimento-de-projetos-2.webp"
    ],
    highlights: [
      "Projeto arquitetônico personalizado",
      "Projeto estrutural em Steel Frame",
      "Projetos complementares (elétrico, hidráulico)",
      "Modelagem BIM 3D",
      "Orçamento detalhado e cronograma"
    ]
  },
  {
    step: 3,
    title: "Execução da Obra",
    description: "Construção com qualidade, acompanhamento constante e prazo definido. Sistema industrializado que garante até 50% de redução no tempo de obra comparado à construção convencional.",
    images: [
      "/images/Lsf/lsf-fase-3.webp",
      "/images/Services/Como-trabalhamos/execucao-da-obra-2.webp"
    ],
    highlights: [
      "Fundação e preparação do terreno",
      "Montagem da estrutura metálica",
      "Fechamento e isolamento térmico",
      "Instalações elétricas e hidráulicas",
      "Acompanhamento constante do cliente"
    ]
  },
  {
    step: 4,
    title: "Entrega e Garantia",
    description: "Entregamos sua obra pronta para uso, com manual de manutenção, garantias e suporte técnico. Acompanhamento pós-obra para sua total satisfação.",
    images: [
      "/images/Services/Como-trabalhamos/entrega-e-garantia-1.webp",
      "/images/Services/Como-trabalhamos/entrega-e-garantia-2.webp"
    ],
    highlights: [
      "Vistoria final completa",
      "Manual do proprietário",
      "Garantia estrutural de 5 anos",
      "Suporte técnico pós-entrega",
      "Assistência para manutenção preventiva"
    ]
  }
];
