import type { ContentBlock, ProcessStep } from "@/lib/types";

// ---------------------------------------------------------------------------
// Segment Solutions (Section 2)
// ---------------------------------------------------------------------------

export interface SegmentSolution {
  id: string;
  tabLabel: string;
  title: string;
  paragraphs: string[];
  description: string; // Condensed single paragraph for SegmentShowcase
  image: string;
  imageAlt: string;
}

export const SEGMENT_SOLUTIONS: SegmentSolution[] = [
  {
    id: "comercial-varejo",
    tabLabel: "Comercial",
    title: "Lojas, escritórios e showrooms",
    description:
      "Tempo é receita. O Steel Frame reduz o prazo em 50–70%, antecipando o retorno sobre o investimento. Paredes internas reposicionáveis sem quebra permitem que o layout acompanhe a vida do negócio. Construção silenciosa e limpa — viável em shoppings e centros comerciais ocupados.",
    paragraphs: [
      "Para o varejo e para operações comerciais, tempo é receita. Cada mês a mais de obra é um mês a menos de faturamento. O Steel Frame reduz o prazo de construção em 50% a 70% comparado à alvenaria tradicional, o que significa que a operação começa antes, o ponto comercial gera receita mais cedo e o retorno sobre o investimento se antecipa.",
      "Além da velocidade, o sistema oferece flexibilidade de layout que acompanha a vida do negócio. Paredes internas em LSF são reposicionáveis com intervenções mínimas, sem quebra e sem entulho. Para operações de varejo que mudam de configuração com frequência, para showrooms que se adaptam a cada temporada ou para escritórios que precisam crescer sem mudar de endereço, essa flexibilidade é um diferencial operacional real.",
      "A construção a seco também é silenciosa e limpa, o que permite executar obras em empreendimentos já ocupados, como shoppings e centros comerciais, sem comprometer o funcionamento das operações vizinhas.",
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Escritório moderno com design corporativo",
  },
  {
    id: "industrial",
    tabLabel: "Industrial",
    title: "Galpões, centros de distribuição e áreas técnicas",
    description:
      "Estrutura 12x mais leve que alvenaria (60–100 kg/m²), resultando em fundações mais simples e econômicas. Modularidade que permite expansão futura sem intervenções pesadas. Sistemas híbridos com aço laminado para vãos amplos e cargas pesadas.",
    paragraphs: [
      "No contexto industrial, a equação é direta: quanto mais rápido o galpão fica pronto, mais cedo ele opera. O LSF entrega essa velocidade com um benefício adicional significativo. O peso reduzido da estrutura, entre 60 e 100 kg/m² contra 1.200 a 1.500 kg/m² da construção convencional, resulta em fundações mais simples e mais econômicas.",
      "Para centros de distribuição e áreas logísticas, a modularidade do sistema é outro fator relevante. A estrutura pode ser projetada para expansão futura, permitindo que o espaço cresça junto com a operação sem a necessidade de intervenções pesadas na estrutura original. A previsibilidade do processo industrializado também importa em projetos industriais, onde atrasos no cronograma se traduzem diretamente em prejuízo operacional.",
      "Para projetos de maior porte ou com exigências estruturais específicas, como vãos livres amplos ou cargas pesadas, a Berkahn trabalha com sistemas híbridos que combinam LSF com aço laminado e concreto armado, mantendo a eficiência do processo industrializado onde ele é mais vantajoso.",
    ],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Galpão industrial moderno",
  },
  {
    id: "temporarias",
    tabLabel: "Temporárias",
    title: "Estandes, eventos e canteiros de obra",
    description:
      "Montagem rápida, desmontagem sem destruição, custo que faz sentido. Qualidade construtiva de edificação permanente em estrutura temporária. Perfis 100% recicláveis e reutilizáveis em outros projetos — custo-benefício superior a contêineres.",
    paragraphs: [
      "Construções temporárias precisam de três coisas: montagem rápida, desmontagem sem destruição e custo que faça sentido para o período de uso. O Steel Frame atende às três.",
      "A montagem de estruturas em LSF é significativamente mais rápida do que em alvenaria ou em sistemas de contêiner adaptado, e o resultado final tem qualidade construtiva de edificação permanente. Isso faz diferença para escritórios de canteiro de obra que precisam funcionar por meses, para estandes de eventos que representam a imagem de uma marca ou para estruturas temporárias em operações industriais.",
      "O reaproveitamento é outro diferencial. Os perfis de aço galvanizado podem ser desmontados e reutilizados em outras estruturas, e os componentes que eventualmente sobram são 100% recicláveis. Na conta final, o custo-benefício de uma estrutura temporária em LSF tende a ser superior ao de alternativas como contêineres ou construção convencional, especialmente quando se considera a possibilidade de reuso.",
    ],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Estrutura temporária para evento corporativo",
  },
  {
    id: "reformas-corporativas",
    tabLabel: "Reformas",
    title: "Ampliação de fábricas e retrofit comercial",
    description:
      "Leveza estrutural (60–100 kg/m²) que permite ampliações sem reforço de fundação. Construção a seco elimina poeira e entulho que paralisam operações. Cronograma integrado aos turnos e restrições operacionais do cliente.",
    paragraphs: [
      "Reformar ou ampliar uma operação em funcionamento é um desafio que vai além da engenharia. Envolve manter a produção rodando, minimizar o impacto nos funcionários e nos clientes, e cumprir prazos que geralmente são definidos por necessidades operacionais.",
      "O Steel Frame é particularmente vantajoso nesse cenário. A leveza da estrutura (60 a 100 kg/m²) permite ampliações sobre estruturas existentes sem reforço de fundação na maioria dos casos. A construção a seco elimina a poeira e o entulho que paralisam operações. E a velocidade de montagem reduz o período de transtorno ao mínimo.",
      "A Berkahn executa reformas e expansões corporativas com planejamento integrado à operação do cliente. O cronograma é construído levando em conta turnos, períodos de menor movimento e restrições operacionais, de modo que a obra cause o menor impacto possível no negócio.",
    ],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Edifício corporativo em renovação",
  },
];

// ---------------------------------------------------------------------------
// ESG Pillars (Section 3)
// ---------------------------------------------------------------------------

export interface ESGPillar {
  badge: string;
  badgeLabel: string;
  paragraphs: string[];
}

export const ESG_PILLARS: ESGPillar[] = [
  {
    badge: "E",
    badgeLabel: "Environmental",
    paragraphs: [
      "O aço utilizado na estrutura LSF é 100% reciclável e possui um conteúdo mínimo de 25% de material reciclado na sua composição. Pode ser reprocessado inúmeras vezes sem perder qualidade. Isso contribui diretamente para a economia circular e para a redução da demanda por matéria-prima virgem.",
      "A construção a seco consome água praticamente apenas na etapa de fundação, uma economia superior a 99% comparada à construção convencional. O desperdício de materiais fica abaixo de 5%, contra os 25% a 30% da alvenaria tradicional. E os resíduos que eventualmente são gerados são completamente recicláveis.",
      "Do ponto de vista de certificações, projetos em LSF possuem forte aderência aos critérios de sistemas como LEED, BREEAM e AQUA, que são cada vez mais exigidos em empreendimentos corporativos e imobiliários. O sistema também atende integralmente à NBR 15575 (Norma de Desempenho), à NBR 15220 (desempenho térmico) e à NBR 16970:2022, norma técnica específica para sistemas construtivos em LSF.",
      "O fechamento com placas cimentícias e isolamento termoacústico proporciona alto desempenho térmico à edificação, reduzindo o consumo de energia com climatização em até 40% durante toda a vida útil do imóvel. Na operação de uma empresa, isso se traduz em conta de energia menor e pegada de carbono reduzida.",
    ],
  },
  {
    badge: "S",
    badgeLabel: "Social",
    paragraphs: [
      "O canteiro de obra do Steel Frame é mais limpo e mais seguro do que o da construção convencional. A ausência de argamassa, grandes volumes de cimento e processos de quebra reduz significativamente a exposição dos trabalhadores a riscos de saúde ocupacional, poeira e ruído excessivo.",
      "Para as comunidades vizinhas ao canteiro, o impacto também é menor. Obras em LSF geram menos ruído, menos poeira, menos tráfego de caminhões de entulho e têm duração consideravelmente menor. Em projetos dentro de áreas urbanas consolidadas, como reformas de lojas em centros comerciais ou ampliações de fábricas em zonas mistas, essa diferença é relevante para a relação da empresa com o entorno.",
    ],
  },
  {
    badge: "G",
    badgeLabel: "Governance",
    paragraphs: [
      "O processo industrializado do LSF oferece rastreabilidade que a construção artesanal não consegue igualar. Cada perfil é fabricado sob especificação, cada componente tem origem documentada e cada etapa da obra segue um cronograma previamente definido e mensurável.",
      "Os materiais utilizados no sistema LSF são certificados por institutos como o IPT (Instituto de Pesquisas Tecnológicas) e o Falcão Bauer Centro Tecnológico de Controle de Qualidade, atendendo às Normas Brasileiras (NBR) e a padrões internacionais de controle de qualidade.",
      "A previsibilidade de custos e prazos inerente ao processo industrializado também contribui para a governança corporativa, permitindo que decisões de investimento em infraestrutura sejam tomadas com base em dados confiáveis.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Transparency Blocks (Section 4)
// ---------------------------------------------------------------------------

export const COMERCIAL_TRANSPARENCY_BLOCKS: ContentBlock[] = [
  {
    title: "Limitação de pavimentos.",
    description:
      "Em sua configuração pura, o LSF é mais indicado para edificações de até 5 pavimentos. Projetos acima desse porte são viabilizados com sistemas híbridos que combinam o Steel Frame com aço laminado ou concreto armado. A Berkahn projeta e executa essas soluções híbridas, utilizando o LSF onde ele é mais vantajoso e complementando com outros sistemas onde a demanda estrutural exige.",
  },
  {
    title: "Revestimentos pesados.",
    description:
      "Assim como no contexto residencial, acabamentos de alta densidade como pedras naturais ou cerâmicas pesadas requerem soluções específicas de distribuição de carga. No contexto corporativo, onde a fachada muitas vezes é parte da identidade da marca, esse planejamento é feito desde a concepção do projeto para garantir que a estética seja plenamente atendida pela especificação estrutural.",
  },
  {
    title: "Planejamento detalhado.",
    description:
      "O LSF exige que todas as decisões de projeto sejam tomadas antes da fabricação dos componentes. Cada definição entra no projeto antes de qualquer peça ser produzida. Para empresas acostumadas ao planejamento rigoroso, isso é natural. Para projetos onde o escopo muda constantemente, pode exigir uma disciplina de definição que resulta em obras sem estouros de orçamento e prazo.",
  },
  {
    title: "Custo inicial de materiais.",
    description:
      "Em algumas regiões e configurações, o custo unitário dos materiais do LSF pode ser superior ao da alvenaria convencional. Essa análise, no entanto, precisa considerar o custo total da obra: fundações mais simples, prazo reduzido, desperdício mínimo e menos retrabalho. Quando se olha para o custo total de propriedade, incluindo eficiência energética durante a operação, o LSF tende a ser mais econômico no médio e longo prazo.",
  },
];

// ---------------------------------------------------------------------------
// Metrics / ROI Cards (Section 5)
// ---------------------------------------------------------------------------

export interface MetricCard {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  isText?: boolean;
  textValue?: string;
  image?: string;
  imageAlt?: string;
}

export const COMERCIAL_METRICS: MetricCard[] = [
  {
    value: 70,
    prefix: "",
    suffix: "%",
    label: "50% a 70% mais rápido",
    description:
      "Comparado à construção convencional. Cada mês antecipado é receita que começa antes.",
    image: "/images/galeria/projeto-30.webp",
    imageAlt: "Estrutura Steel Frame em montagem — vista interna das treliças",
  },
  {
    value: 5,
    prefix: "<",
    suffix: "%",
    label: "Menos de 5% de desperdício",
    description:
      "Contra 25% a 30% da alvenaria. Processo industrializado com controle real de materiais.",
    image: "/images/galeria/projeto-12.webp",
    imageAlt: "Estrutura Steel Frame pré-fabricada com precisão industrial",
  },
  {
    value: 40,
    prefix: "",
    suffix: "%",
    label: "Até 40% de economia",
    description:
      "No consumo de energia para aquecimento e refrigeração durante a vida útil do imóvel.",
    image: "/images/galeria/projeto-20.webp",
    imageAlt: "Isolamento térmico com lã mineral em paredes Steel Frame",
  },
  {
    value: 0,
    isText: true,
    textValue: "Previsibilidade",
    label: "Previsibilidade industrial",
    description:
      "Peças fabricadas sob medida, desperdício mínimo e cronograma definido. O orçamento que se apresenta é o que se cumpre.",
    image: "/images/Others/comercial_steel_frame.webp",
    imageAlt: "Projeto comercial Steel Frame finalizado",
  },
];

// ---------------------------------------------------------------------------
// Process Steps (Section 6)
// ---------------------------------------------------------------------------

export const COMERCIAL_PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Diagnóstico",
    description:
      "Entendemos a operação, o espaço necessário, o prazo e os requisitos técnicos. Avaliamos o terreno ou a estrutura existente e definimos a viabilidade do projeto.",
  },
  {
    step: 2,
    title: "Projeto executivo",
    description:
      "Desenvolvemos o projeto estrutural e arquitetônico integrado às necessidades operacionais do negócio. Cronograma, orçamento e especificações técnicas são definidos antes de qualquer fabricação.",
  },
  {
    step: 3,
    title: "Fabricação e preparação",
    description:
      "Componentes fabricados sob medida em ambiente industrial. Paralelamente, o canteiro avança com fundação e preparações, otimizando o cronograma total.",
  },
  {
    step: 4,
    title: "Execução",
    description:
      "Montagem industrializada com equipe especializada. Acompanhamento rigoroso de cronograma e qualidade. Comunicação clara sobre andamento e eventuais ajustes.",
  },
  {
    step: 5,
    title: "Entrega e operação",
    description:
      "Inspeção final, documentação técnica completa e entrega no prazo. O espaço é entregue pronto para a operação começar.",
  },
];

// ---------------------------------------------------------------------------
// Contact form project types (Section 7)
// ---------------------------------------------------------------------------

export const COMERCIAL_FORM_PROJECT_TYPES = [
  { value: "comercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "temporaria", label: "Construção temporária" },
  { value: "reforma-expansao", label: "Reforma ou expansão" },
] as const;

// ---------------------------------------------------------------------------
// 3D Marquee — Residential Gallery Images (Section 9)
// ---------------------------------------------------------------------------

export const RESIDENTIAL_GALLERY_IMAGES: string[] = [
  // Fachadas modernas
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1602343168117-bb8bbe693b1c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  // Interiores
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600607687644-c7f34b5063c7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
  // Construção e estrutura
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?auto=format&fit=crop&w=600&q=80",
  // Paisagismo e exteriores
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=600&q=80",
  // Detalhes arquitetônicos
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80",
];
