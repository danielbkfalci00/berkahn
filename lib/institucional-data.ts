// Dados do documento institucional (/institucional/pdf) — "O que fazemos".
// Copy consolidada de: app/empresa/page.tsx, lib/servicos-data.ts, lib/residencial-data.ts,
// lib/faq-data.ts, lib/lsf-data.ts, lib/orcamento-data.ts, components/presentation/slides/*
// e Berkahn-Vault/70-knowledge/{lsf-normas-nbr,lsf-fundacao}.md.

export { EXECUTION_PHASES } from "@/lib/servicos-data";
export { presentationProjects } from "@/lib/presentation-data";

// Roteia imagens pelo otimizador do Next (/_next/image) para o PDF: serve versões
// reduzidas/re-encodadas (webp/jpeg) em vez do source cheio, evitando que o
// page.pdf() do Puppeteer embuta bitmaps enormes (v1 dpr=2 com <img> cru = 31 MB).
// encodeURIComponent também resolve acentos e espaços nos paths (Execução/, Apresentação/).
// q DEVE estar em next.config.ts images.qualities: [65,70,75,78,80,85,90].
export function optImg(path: string, w = 1200, q = 65): string {
  return `/_next/image?url=${encodeURIComponent(path)}&w=${w}&q=${q}`;
}

export const INSTITUCIONAL_CAPA = {
  label: "Apresentação Institucional",
  headline: "Do conceito à entrega das chaves",
  subtitle:
    "Construtora especialista em Light Steel Frame. Projetamos, gerenciamos e executamos obras completas, em todos os sistemas construtivos.",
  tagline: "Erguendo o amanhã",
  heroImage: "/images/hero/hero-home-2.webp",
  logoBranco: "/images/orcamento/logo-berkahn-construtora-branco.webp",
};

export const QUEM_SOMOS = {
  label: "Quem somos",
  headline: "Construtora, não empreiteira",
  intro:
    "Somos uma construtora especializada em Light Steel Frame (LSF), responsável pelo ciclo completo da obra, do estudo de viabilidade à entrega das chaves.",
  historia:
    "A Berkahn nasce da união de anos de experiência em projetos, gerenciamento e execução de obras. Nosso diferencial está na capacidade de integrar o LSF, um sistema leve e eficiente, com outras estruturas, incluindo concreto armado e aço laminado, para otimizar cada projeto.",
  stats: [
    { value: "+20", label: "anos de experiência combinada" },
    { value: "+23", label: "projetos" },
    { value: "+85 mil m²", label: "de área construída" },
  ],
  pilares: [
    {
      title: "Leveza",
      description:
        "Estruturas mais leves e processos mais ágeis, com fundações simplificadas e menos peso na obra.",
    },
    {
      title: "Previsibilidade",
      description:
        "Cronograma e orçamento definidos no planejamento e cumpridos na execução. O orçamento apresentado é o orçamento entregue.",
    },
    {
      title: "Limpeza",
      description:
        "Obra a seco, com desperdício abaixo de 5% e canteiro organizado do início ao fim.",
    },
  ],
  comparativo: {
    subtitulo:
      "Empreiteira executa uma parte da obra. Construtora é responsável pelo todo.",
    construtora: [
      "Um contrato, uma equipe",
      "Responsável da terraplanagem ao acabamento",
      "Gestão integrada de prazo e qualidade",
      "Certificação técnica completa (NBR 16970, NBR 15575)",
    ],
    empreiteira: [
      "Múltiplos contratos com fornecedores diferentes",
      "Cliente contrata empresas separadas para cada fase",
      "Coordenação de prazo e qualidade fica com o cliente",
      "Certificação técnica variável conforme o fornecedor",
    ],
  },
};

export interface ServicoInstitucional {
  numero: string;
  title: string;
  description: string;
}

export const O_QUE_FAZEMOS = {
  label: "O que fazemos",
  headline: "Da prancheta ao canteiro",
  intro:
    "Cuidamos da obra inteira ou da etapa em que você precisa da gente. Quatro frentes sustentam esse escopo.",
  servicos: [
    {
      numero: "01",
      title: "Projetos e arquitetura",
      description:
        "Oferecemos projetistas e arquitetos parceiros para desenvolver e conduzir todos os projetos da obra, do arquitetônico ao estrutural e complementares, com modelagem BIM para precisão e otimização de materiais.",
    },
    {
      numero: "02",
      title: "Gerenciamento de projetos e obras",
      description:
        "Coordenamos prazo, custo e qualidade da aprovação do projeto à entrega das chaves. Orçamento detalhado, cronograma executivo, registro fotográfico da obra e comunicação direta com quem executa.",
    },
    {
      numero: "03",
      title: "Compatibilização de projetos",
      description:
        "Cruzamos os projetos arquitetônico, estrutural e complementares antes de a obra começar. Interferências são identificadas e resolvidas no papel, onde a correção custa pouco, e não no canteiro.",
    },
    {
      numero: "04",
      title: "Execução de obras",
      description:
        "Fazemos a obra inteira como construtora: terraplanagem, fundação, estrutura, vedações, instalações elétricas e hidrossanitárias, acabamentos e entrega das chaves. Um contrato, uma equipe.",
    },
  ] satisfies ServicoInstitucional[],
};

export const SISTEMAS_CONSTRUTIVOS = {
  label: "Sistemas construtivos",
  headline: "Dominamos todos os sistemas. Somos especialistas em construção a seco.",
  intro:
    "Priorizamos o Light Steel Frame porque é o sistema com mais benefícios para a obra: até 50% menos tempo de execução, precisão milimétrica e canteiro limpo. E dominamos os demais sistemas para aplicar o certo em cada parte do projeto.",
  blocos: [
    {
      title: "Construção a seco",
      subtitle: "Nossa especialidade",
      description:
        "Estrutura e vedações em LSF com equipe própria, treinada e certificada. Aplicamos o sistema completo ou integrado a uma estrutura principal de concreto ou aço laminado.",
    },
    {
      title: "Construção convencional",
      subtitle: "Quando a norma exige",
      description:
        "Fundações, muros de arrimo e piscinas continuam sendo estruturas de concreto armado, como pedem as normas brasileiras. Executamos essa parte da obra com o mesmo rigor técnico, sem terceirizar a responsabilidade.",
    },
    {
      title: "Sistemas híbridos",
      subtitle: "O melhor de cada um",
      description:
        "Para vãos grandes ou cargas pesadas, combinamos LSF com concreto armado, aço laminado e madeira. O melhor de cada sistema para o melhor resultado.",
    },
  ],
  normas: [
    {
      norma: "NBR 16970",
      descricao: "Classifica o LSF como sistema construtivo convencional desde 2022",
    },
    {
      norma: "NBR 6122",
      descricao: "Projeto e execução de fundações",
    },
    {
      norma: "NBR 15575",
      descricao: "Desempenho térmico, acústico e estrutural de edificações",
    },
  ],
  image: "/images/Lsf/lsf-wall-layers-diagram.webp",
  imageAlt: "Diagrama das camadas de uma parede em Light Steel Frame",
};

export const MODELOS_CONTRATACAO = {
  label: "Modelos de contratação",
  headline: "Dois jeitos de trabalhar com a gente",
  intro:
    "Nosso cenário ideal é acompanhar o projeto do início ao fim, da concepção à entrega. Mas nos adaptamos à necessidade de cada obra.",
  modelos: [
    {
      badge: "Modelo 01",
      title: "Obra completa",
      description:
        "Assumimos o ciclo inteiro: projetos, gerenciamento, execução e entrega das chaves. Você contrata uma única empresa, com um único contrato e equipe técnica coordenada.",
      items: [
        "Projetos e aprovações",
        "Terraplanagem e fundação",
        "Estrutura, vedações e instalações",
        "Acabamentos e entrega das chaves",
      ],
      destaque: true,
    },
    {
      badge: "Modelo 02",
      title: "Time especialista em LSF",
      description:
        "Você já tem projeto e gestão definidos? Entramos somente com a nossa equipe especializada em Light Steel Frame para executar estrutura e fechamentos, validando antes os projetos existentes.",
      items: [
        "Mão de obra 100% especializada e certificada",
        "Execução de estrutura e vedações em LSF",
        "Consultoria para validar projetos existentes",
        "Integração com a equipe da sua obra",
      ],
      destaque: false,
    },
  ],
};

export const COMO_TRABALHAMOS = {
  label: "Como trabalhamos",
  headline: "Do conceito à entrega das chaves",
  intro:
    "Quatro fases coordenadas pela mesma equipe, com prazos definidos e entregáveis claros em cada uma.",
};

export const PORTFOLIO_INSTITUCIONAL = {
  label: "Portfólio",
  headline: "Obras gerenciadas pelos sócios",
};

// Fonte: components/presentation/slides/SlideFounders.tsx
export const FUNDADORES = [
  {
    name: "Daniel Falci",
    role: "Co-Fundador",
    bio: "Engenheiro civil com sólida experiência em planejamento, gerenciamento e execução de obras. Atuou em projetos residenciais, comerciais e logísticos de alto padrão em São Paulo.",
    image: "/images/founders/daniel-falci.webp",
  },
  {
    name: "Matheus Bertevello",
    role: "Co-Fundador",
    bio: "Engenheiro de Produção pela FEI com mais de 7 anos de experiência em melhoria de processos. Especialista em Lean Construction e melhorias em obras civis.",
    image: "/images/founders/matheus-bertevello.webp",
  },
  {
    name: "Gabriel Vidal",
    role: "Co-Fundador",
    bio: "Engenheiro civil formado pelo UniCEUB, MBA em gerenciamento de projetos (IBMEC) e de empreendimentos na construção civil (Mackenzie). Especialista em orçamentos e viabilidades.",
    image: "/images/founders/gabriel-vidal.webp",
  },
];

// Fonte: components/presentation/slides/SlidePartners.tsx
export const PARCEIROS = [
  { name: "Brand 01", logo: "/images/Apresentação/Marcas Parceiras/brand-01.webp" },
  { name: "Lumen", logo: "/images/Apresentação/Marcas Parceiras/lumen.webp" },
  { name: "Knauf", logo: "/images/Apresentação/Marcas Parceiras/knauf.webp" },
  { name: "Aquapanel", logo: "/images/Apresentação/Marcas Parceiras/aquapanel.webp" },
];

export const CONTATO_INSTITUCIONAL = {
  headline: "Vamos construir juntos?",
  subtitle: "Fale com a gente para conversar sobre o seu projeto.",
  email: "contato.berkahn@gmail.com",
  phone: "+55 (11) 96641-5742",
  website: "www.berkahn.com.br",
  linkedin: "linkedin.com/company/construtora-berkahn",
  cnpj: "39.455.932/0001-64",
  local: "São Paulo, SP - Brasil",
  logoBranco: "/images/orcamento/logo-berkahn-construtora-branco.webp",
};
