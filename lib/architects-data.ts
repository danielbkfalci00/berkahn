/**
 * Dados dos arquitetos parceiros da Berkahn (curadoria).
 *
 * Parceiros REAIS. Imagens otimizadas em /public/images/arquitetos/{slug}/
 * (capturadas via scripts/scrape-architects.mjs + optimize-architect-images.mjs).
 *
 * Posicionamento: o arquiteto assina o projeto; a Berkahn constrói em Light Steel Frame.
 * Campos marcados PROVISÓRIO aguardam confirmação — ver Berkahn-Vault/40-content/curadoria/*-revisao.md.
 */

export type ArchitectProject = {
  id: string;
  name: string;
  area: number; // m²
  year: number;
  city: string;
  program: string;
  concept?: string; // narrativa curta — usado quando isAnchor = true
  isAnchor?: boolean;
  images: string[];
};

export type Architect = {
  slug: string;
  studioName: string;
  city: string;
  state: string;
  styleTags: string[];
  shortPitch: string; // 1 frase usada nos cards do hub
  bio: string; // 1-2 parágrafos para a página individual
  yearFounded: number;
  metrics: {
    yearsActive: number;
    completedProjects: number;
    areaBuilt: number; // m² total
  };
  /** Override opcional do bloco "Em números" (ex: arquiteto emergente). Se presente, substitui `metrics` na UI. */
  customMetrics?: { label: string; value: string }[];
  history: { year: number; milestone: string }[]; // 3-5 marcos
  contact: {
    website: string;
    instagram: string; // handle (@studio)
    phone: string;
    email?: string;
  };
  studioPhoto: string;
  /** Portrait do(a) arquiteto(a) titular — usado na seção bio */
  architectPhoto: string;
  /** Nome legível para alt text do portrait */
  architectName: string;
  hubLayoutVariant: "zigzag" | "carousel";
  projects: ArchitectProject[]; // primeiro com isAnchor:true vira projeto-âncora
};

export const architects: Architect[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // 1. ROSMARI CALEFE — Cerquilho/SP · residencial · carrossel
  // REAL: bio, formação, áreas, contatos (fonte IMB + Google Sites).
  // PROVISÓRIO (confirmar): métricas, nomes/anos dos projetos, headshot, timeline.
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "rosmari-calefe",
    studioName: "Rosmari Calefe Arquitetura",
    city: "Cerquilho",
    state: "SP",
    styleTags: ["Residencial", "Comercial · Industrial", "Paisagismo"],
    shortPitch:
      "Projetos residenciais, comerciais e paisagismo no interior paulista, com a identidade de cada cliente no centro.",
    bio: "Rosmari Calefe comanda seu escritório de arquitetura em Cerquilho, no interior de São Paulo, atendendo toda a região com projetos residenciais, comerciais e industriais. Formada em Arquitetura e Urbanismo pelo CEUNSP em 2005 e com especialização em Paisagismo pela Escola Paulista de Paisagismo e pelo SECOVI, soma cerca de duas décadas desenhando a identidade de cada projeto junto com o cliente.\n\nO trabalho dela une um conhecimento forte em especificação de materiais de acabamento com a administração da obra do começo ao fim. O atendimento acontece de forma presencial ou virtual, o que mantém cada etapa próxima da rotina de quem vai morar ou trabalhar no espaço.",
    yearFounded: 2005,
    metrics: {
      yearsActive: 20, // atua desde 2005
      completedProjects: 80,
      areaBuilt: 16000,
    },
    history: [
      { year: 2005, milestone: "Forma-se em Arquitetura e Urbanismo pelo CEUNSP" },
      { year: 2007, milestone: "Especialização em Paisagismo (Escola Paulista de Paisagismo e SECOVI)" }, // ano PROVISÓRIO
      { year: 2010, milestone: "Consolida o escritório em Cerquilho atendendo toda a região" }, // PROVISÓRIO
      { year: 2026, milestone: "Entra para a curadoria de arquitetos parceiros da Berkahn" }, // confirmar
    ],
    contact: {
      website: "https://sites.google.com/view/rosmari-calefe", // .com.br retornou 503; usando o microsite dela (Google Sites) que está no ar
      instagram: "@arq.rosmaricalefe",
      phone: "+55 15 99141-2006",
      email: "rosmaricalefe@terra.com.br",
    },
    studioPhoto: "/images/arquitetos/rosmari-calefe/rosmari-calefe-25.webp",
    architectPhoto: "/images/arquitetos/rosmari-calefe/rosmari-calefe-01.webp", // PROVISÓRIO: trocar por headshot real
    architectName: "Rosmari Calefe",
    hubLayoutVariant: "carousel",
    projects: [
      {
        id: "residencia-contemporanea-cerquilho",
        name: "Residência Contemporânea", // nome descritivo — confirmar
        area: 383, // REAL (383,33 m² construído)
        year: 2022, // PROVISÓRIO
        city: "Cerquilho, SP",
        program: "Residencial · 3 suítes · 2 pavimentos · Piscina",
        concept:
          "Residência de dois pavimentos que combina concreto aparente, painéis de madeira ripada e grandes panos de vidro nas áreas sociais. O térreo abre para um deck de madeira com piscina e estar ao ar livre, enquanto o pavimento superior recolhe os dormitórios atrás dos brises de madeira. À noite, a iluminação embutida no paisagismo desenha o volume da casa.",
        isAnchor: true,
        images: [
          "/images/arquitetos/rosmari-calefe/rosmari-calefe-25.webp",
          "/images/arquitetos/rosmari-calefe/rosmari-calefe-21.webp",
          "/images/arquitetos/rosmari-calefe/rosmari-calefe-28.webp",
          "/images/arquitetos/rosmari-calefe/rosmari-calefe-04.webp",
        ],
      },
      {
        id: "residencia-terrea-premium",
        name: "Residência Térrea",
        area: 232, // REAL (232,68 m²)
        year: 2021, // PROVISÓRIO
        city: "Cerquilho, SP",
        program: "Residencial · 3 suítes",
        images: ["/images/arquitetos/rosmari-calefe/rosmari-calefe-01.webp"],
      },
      {
        id: "residencia-dois-pavimentos",
        name: "Residência Dois Pavimentos",
        area: 216, // REAL (216,18 m²)
        year: 2020, // PROVISÓRIO
        city: "Cerquilho, SP",
        program: "Residencial · 3 dorms (1 suíte) · 2 pavimentos",
        images: ["/images/arquitetos/rosmari-calefe/rosmari-calefe-03.webp"],
      },
      {
        id: "residencia-familia",
        name: "Residência Família",
        area: 186, // REAL (186,49 m²)
        year: 2019, // PROVISÓRIO
        city: "Cerquilho, SP",
        program: "Residencial · 2 suítes",
        images: ["/images/arquitetos/rosmari-calefe/rosmari-calefe-20.webp"],
      },
      {
        id: "residencia-compacta",
        name: "Residência Compacta",
        area: 145, // REAL (145 m²)
        year: 2023, // PROVISÓRIO
        city: "Cerquilho, SP",
        program: "Residencial · 3 dorms (1 suíte)",
        images: ["/images/arquitetos/rosmari-calefe/rosmari-calefe-14.webp"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 2. MARIA ISABEL BIANCHI — São Paulo/SP · técnica/sustentável · zigzag
  // REAL: formação, skills, experiência, contato (currículo Wix). Projetos =
  // obras da Are Arquitetura (equipe), apresentadas como portfólio dela COM
  // crédito à Are. customMetrics (emergente). PROVISÓRIO: IG, anos exatos.
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "maria-isabel-bianchi",
    studioName: "Maria Isabel Bianchi",
    city: "São Paulo",
    state: "SP",
    styleTags: ["Sustentabilidade", "Racionalização construtiva", "BIM"],
    shortPitch:
      "Arquiteta com foco técnico em construção sustentável e industrializada, com passagem por grandes projetos na Are Arquitetura.",
    bio: "Maria Isabel Bianchi é arquiteta e urbanista formada pela Universidade Presbiteriana Mackenzie, hoje cursando pós-graduação em Sustentabilidade nas Construções na mesma instituição. O foco dela está no desenvolvimento técnico de projetos, na compatibilização e na racionalização construtiva, sempre com atenção a metodologias mais eficientes e à construção sustentável.\n\nDesde 2019 acumula experiência em escritórios paulistanos e hoje integra a equipe da Are Arquitetura, atuando em grandes projetos logísticos e institucionais. Trabalha com Revit, ArchiCad, SketchUp e Enscape, e transita entre português, inglês, alemão e espanhol.",
    yearFounded: 2019, // PROVISÓRIO: início de carreira (não tem escritório próprio)
    metrics: {
      // Não exibido — customMetrics abaixo substitui. Valores apenas para satisfazer o tipo.
      yearsActive: 7,
      completedProjects: 5,
      areaBuilt: 500,
    },
    customMetrics: [
      { label: "Atuando desde", value: "2019" },
      { label: "Foco", value: "Sustentabilidade + BIM" },
      { label: "Idiomas", value: "PT · EN · DE · ES" },
    ],
    history: [
      { year: 2019, milestone: "Inicia na arquitetura com assessoria em racionalização construtiva (ARCO)" },
      { year: 2022, milestone: "Integra a equipe da S Brasil Arquitetura" },
      { year: 2023, milestone: "Passa a desenvolver projetos na Are Arquitetura" },
      { year: 2024, milestone: "Forma-se em Arquitetura e Urbanismo pela Mackenzie" },
      { year: 2025, milestone: "Inicia pós-graduação em Sustentabilidade nas Construções (Mackenzie)" },
    ],
    contact: {
      website: "https://www.linkedin.com/in/maria-isabel-bianchi-kluge-65095b171/",
      instagram: "@misabel.arq", // PROVISÓRIO: confirmar handle real do Instagram
      phone: "+55 11 95651-1838",
      email: "misabelbk@gmail.com",
    },
    studioPhoto: "/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-58.webp",
    architectPhoto: "/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-75.webp",
    architectName: "Maria Isabel Bianchi",
    hubLayoutVariant: "zigzag",
    projects: [
      {
        id: "arena-pacaembu",
        name: "Mercado Livre Arena Pacaembu",
        area: 76000, // REAL (~76.000 m²)
        year: 2025,
        city: "São Paulo, SP",
        program: "Retrofit institucional · Arena multiuso · Patrimônio tombado",
        concept:
          "Retrofit do histórico complexo do Pacaembu, de 1940, transformado em arena multiuso com hotel, eventos, gastronomia e escritórios. Projeto desenvolvido na equipe da Are Arquitetura, onde Maria Isabel atua com modelagem BIM e compatibilização, respeitando o tombamento. Venceu o prêmio AR Future Projects, da revista The Architectural Review.",
        isAnchor: true,
        images: [
          // Re-curado (Fase 2): lidera com a arena de madeira (mais arquitetônico/quente),
          // tira os shots de construção (07/08/09) e o card de prêmio (15). Capa menos industrial.
          "/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-14.webp",
          "/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-02.webp",
          "/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-11.webp",
          "/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-13.webp",
          "/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-10.webp",
        ],
      },
      {
        id: "retrofit-reitoria-unesp",
        name: "Retrofit Reitoria UNESP",
        area: 10469, // REAL (10.469 m²)
        year: 2024,
        city: "São Paulo, SP",
        program: "Retrofit institucional · Edifício histórico (Are Arquitetura)",
        images: ["/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-58.webp"],
      },
      {
        id: "prologis-raposo-39",
        name: "Prologis Raposo 39",
        area: 80000, // REAL (~80.000 m² construídos)
        year: 2022,
        city: "São Paulo, SP",
        program: "Logística · 2 galpões · LEED Platinum (Are Arquitetura)",
        images: ["/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-51.webp"],
      },
      {
        id: "prologis-cajamar-3500",
        name: "Prologis Cajamar III",
        area: 111318, // REAL (111.318 m²)
        year: 2021,
        city: "Cajamar, SP",
        program: "Logística · Centro de distribuição (Are Arquitetura)",
        images: ["/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-27.webp"],
      },
      {
        id: "prologis-cajamar-31",
        name: "Prologis Cajamar 31",
        area: 42867, // REAL (42.866,98 m²)
        year: 2022,
        city: "Cajamar, SP",
        program: "Logística · Condomínio · LEED Platinum (Are Arquitetura)",
        images: ["/images/arquitetos/maria-isabel-bianchi/maria-isabel-bianchi-17.webp"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 3. AIROS ARQUITETURA — Bragança Paulista/SP · alto padrão residencial · carrossel
  // REAL: fundadores, bio, 6 projetos c/ specs, contato (site airos.arq.br).
  // PROVISÓRIO (confirmar): ano de fundação, métricas, anos dos projetos, foto dos fundadores.
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: "airos",
    studioName: "Airos Arquitetura",
    city: "Bragança Paulista",
    state: "SP",
    styleTags: ["Alto padrão", "Residencial", "Contemporâneo"],
    shortPitch:
      "Arquitetura residencial de alto padrão que traduz a história e o estilo de vida de cada cliente, do desenho à execução.",
    bio: "Airos Arquitetura é o escritório de Matheus Fischer e Gustavo Fernandes, dedicado a projetos residenciais de alto padrão. A visão do estúdio é somar talentos em torno de uma ideia coletiva e projetar para a experiência de morar, encontrando valor na simplicidade dos espaços.\n\nDe casas a apartamentos, o escritório acompanha o projeto do desenho à execução, com forte presença de materiais naturais como pedra e madeira. O trabalho do estúdio já foi selecionado pela Galeria da Arquitetura e pelo Archtrends Portobello.",
    yearFounded: 2018,
    metrics: {
      yearsActive: 8,
      completedProjects: 40,
      areaBuilt: 20000,
    },
    history: [
      { year: 2018, milestone: "Matheus Fischer e Gustavo Fernandes fundam o Airos Arquitetura" }, // PROVISÓRIO
      { year: 2022, milestone: "Projetos selecionados pela Galeria da Arquitetura e Archtrends Portobello" }, // confirmar ano
      { year: 2024, milestone: "Portfólio cresce com residências de alto padrão no interior e na capital" }, // PROVISÓRIO
    ],
    contact: {
      website: "https://airos.arq.br",
      instagram: "@airos.arq",
      phone: "+55 11 91871-1738",
    },
    studioPhoto: "/images/arquitetos/airos/airos-13.webp",
    architectPhoto: "/images/arquitetos/airos/airos-64.webp", // PROVISÓRIO: retrato de um dos fundadores — confirmar quem é quem (airos-64,65,66,67 = homens; 68,69 = Thays). Ideal: foto dupla Matheus + Gustavo
    architectName: "Matheus Fischer e Gustavo Fernandes",
    hubLayoutVariant: "carousel",
    projects: [
      {
        id: "casa-shark",
        name: "Casa Shark",
        area: 595, // REAL (595 m² construída; 1.200 m² terreno)
        year: 2024, // PROVISÓRIO
        city: "Campinas, SP",
        program: "Residencial · Alto padrão · Terreno 1.200 m²",
        concept:
          "Projeto atemporal pensado para uma família que retorna ao Brasil. O desafio foi unir funcionalidade, acolhimento e elegância em cada detalhe, criando espaços que traduzem inovação e exclusividade. Volumes marcantes, pedra e madeira em diálogo com a piscina e o paisagismo.",
        isAnchor: true,
        images: [
          "/images/arquitetos/airos/airos-52.webp",
          "/images/arquitetos/airos/airos-53.webp",
          "/images/arquitetos/airos/airos-55.webp",
          "/images/arquitetos/airos/airos-60.webp",
          "/images/arquitetos/airos/airos-54.webp",
        ],
      },
      {
        id: "casa-bravo",
        name: "Casa Bravo",
        area: 702, // REAL (702,59 m²)
        year: 2024, // PROVISÓRIO
        city: "Jundiaí, SP",
        program: "Residencial · Alto padrão · Pedra e madeira",
        images: ["/images/arquitetos/airos/airos-13.webp"],
      },
      {
        id: "casa-julieta",
        name: "Casa Julieta",
        area: 651, // REAL (651,48 m²)
        year: 2023, // PROVISÓRIO
        city: "Itapira, SP",
        program: "Residencial · Alto padrão · Terreno 2.001 m²",
        images: ["/images/arquitetos/airos/airos-19.webp"],
      },
      {
        id: "apartamento-niemeyer",
        name: "Apartamento Niemeyer",
        area: 320, // REAL (320 m²)
        year: 2023, // PROVISÓRIO
        city: "São Paulo, SP",
        program: "Apartamento · Alto padrão · Itaim Bibi",
        images: ["/images/arquitetos/airos/airos-01.webp"],
      },
      {
        id: "casa-jv",
        name: "Casa J.V",
        area: 506, // REAL (506,85 m²)
        year: 2024, // PROVISÓRIO
        city: "São Paulo, SP",
        program: "Residencial · Alto padrão · Alto de Pinheiros",
        images: ["/images/arquitetos/airos/airos-37.webp"],
      },
      {
        id: "casa-patio",
        name: "Casa Pátio",
        area: 412, // REAL (412,45 m²)
        year: 2024, // PROVISÓRIO
        city: "Jundiaí, SP",
        program: "Residencial · Alto padrão · Pátio e ventilação cruzada",
        images: ["/images/arquitetos/airos/airos-44.webp"],
      },
    ],
  },
];

export function getArchitectBySlug(slug: string): Architect | undefined {
  return architects.find((a) => a.slug === slug);
}

export function getAllArchitectSlugs(): string[] {
  return architects.map((a) => a.slug);
}
