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
      primary: '/images/Services/Execução-de-obras/Pre-obra/pre-obra-1.jpg',
      secondary: '/images/Services/Execução-de-obras/Pre-obra/pre-obra-2.jpg',
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
      primary: '/images/Services/Execução-de-obras/Terraplanagem/terraplanagem_1.JPG',
      secondary: '/images/Services/Execução-de-obras/Terraplanagem/terraplanagem_2.png',
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
      primary: '/images/Services/Execução-de-obras/Estrutura/estrutura-1.jpg',
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
      primary: '/images/Services/Execução-de-obras/Acabamentos/acabamentos_1.jpg',
      secondary: '/images/Services/Execução-de-obras/Acabamentos/acabamentos_2.jpg',
      primaryAlt: 'Aplicação de revestimentos e acabamentos finais',
      secondaryAlt: 'Obra finalizada com detalhes de acabamento'
    }
  }
];
