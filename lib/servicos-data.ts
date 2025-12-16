export interface ExecutionPhase {
  id: string;
  number: number;
  title: string;
  description: string;
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
    description: 'A etapa de pré-obra é onde o empreendimento é estruturado técnica e financeiramente. Nessa fase, realizamos o entendimento das necessidades do cliente, a análise crítica dos projetos, a definição do escopo, o orçamento detalhado e o planejamento da obra. O objetivo é eliminar incertezas, reduzir riscos e garantir previsibilidade de custo, prazo e qualidade antes do início da execução.',
    duration: '2-3 semanas',
    images: {
      primary: 'https://images.unsplash.com/photo-1503594384566-461fe158e797?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      primaryAlt: 'Planejamento e análise de projetos de construção',
      secondaryAlt: 'Reunião de equipe para orçamento e definição de escopo'
    }
  },
  {
    id: 'terraplanagem',
    number: 2,
    title: 'Terraplanagem, Fundação e Superestrutura',
    description: 'Nesta fase, iniciamos a implantação física da obra, com a organização do canteiro, os serviços de terraplanagem e a execução das fundações e da superestrutura. Todo o trabalho é conduzido com rigor técnico, controle de qualidade e acompanhamento constante, garantindo a estabilidade, a segurança e a durabilidade da edificação.',
    duration: '4-6 semanas',
    images: {
      primary: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      primaryAlt: 'Terraplanagem e preparação do terreno para construção',
      secondaryAlt: 'Execução de fundações e estrutura de concreto'
    }
  },
  {
    id: 'estrutura-vedacao',
    number: 3,
    title: 'Estrutura, Vedação e Instalações',
    description: 'Com a estrutura concluída, avançamos para a execução das vedações, fachadas, coberturas e sistemas prediais. Nessa etapa, realizamos as instalações elétricas, hidráulicas, sanitárias, de gás e climatização, sempre com atenção à compatibilização dos projetos e à qualidade da execução, assegurando desempenho, conforto e eficiência ao empreendimento.',
    duration: '6-8 semanas',
    images: {
      primary: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      primaryAlt: 'Montagem de estrutura em steel frame e vedações',
      secondaryAlt: 'Instalação de sistemas prediais elétricos e hidráulicos'
    }
  },
  {
    id: 'acabamentos',
    number: 4,
    title: 'Acabamentos',
    description: 'A fase de acabamentos é onde a obra ganha vida e personalidade. Realizamos os revestimentos internos e externos, pinturas, instalação de louças, metais, esquadrias e demais elementos de finalização. Cada detalhe é executado com precisão e cuidado, garantindo um resultado final impecável, que atende às expectativas de qualidade, estética e funcionalidade do cliente.',
    duration: '3-4 semanas',
    images: {
      primary: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      primaryAlt: 'Aplicação de revestimentos e acabamentos finais',
      secondaryAlt: 'Obra finalizada com detalhes de acabamento'
    }
  }
];
