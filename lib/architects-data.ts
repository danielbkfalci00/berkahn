/**
 * Dados mockados dos arquitetos parceiros da Berkahn.
 *
 * Imagens reaproveitadas de pastas existentes em /public/images/ (galeria, apresentacao,
 * Services/projetos-prontos) — substituir pelas imagens reais quando os arquitetos enviarem material.
 *
 * Todos os perfis (nome do escritório, fundadores, projetos, datas, métricas) são fictícios.
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
  // ───────────────────────────────────────────────────────────────────────
  // 1. ATELIER MATA NORTE — São Paulo · zigzag
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "atelier-mata-norte",
    studioName: "Atelier Mata Norte",
    city: "São Paulo",
    state: "SP",
    styleTags: ["Brutalismo Tropical", "Concreto + Madeira", "Residencial"],
    shortPitch:
      "Casas que escapam da artificialidade urbana e dialogam com a mata atlântica.",
    bio: "Fundado em 2015 por Marina Tavares (FAU-USP), o Atelier Mata Norte projeta residências que recusam o vocabulário genérico da casa de condomínio. Cada projeto começa com uma caminhada lenta pelo terreno antes do primeiro traço — orientação solar, ventos predominantes, vegetação nativa preservada.\n\nO repertório do escritório combina o concreto aparente da escola paulista com madeira de demolição e steel frame onde a leveza estrutural é necessária. O resultado: casas térreas e amplas que envelhecem visivelmente bem.",
    yearFounded: 2015,
    metrics: {
      yearsActive: 10,
      completedProjects: 35,
      areaBuilt: 12000,
    },
    history: [
      { year: 2015, milestone: "Marina Tavares funda o atelier após sete anos no Studio MK27" },
      { year: 2018, milestone: "Primeira parceria com Berkahn na Casa do Mirante" },
      { year: 2021, milestone: "Casa do Vale recebe menção honrosa no Prêmio APCA" },
      { year: 2023, milestone: "Inauguração do escritório-sede em Pinheiros" },
    ],
    contact: {
      website: "https://www.ateliermatanorte.com.br",
      instagram: "@ateliermatanorte",
      phone: "+55 11 98765-4321",
      email: "contato@ateliermatanorte.com.br",
    },
    studioPhoto: "/images/galeria/projeto-01.webp",
    architectPhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=80",
    architectName: "Marina Tavares",
    hubLayoutVariant: "zigzag",
    projects: [
      {
        id: "casa-do-vale",
        name: "Casa do Vale",
        area: 480,
        year: 2023,
        city: "Cotia, SP",
        program: "Residencial · 4 dorms · Pavilhão único",
        concept:
          "Implantada num platô natural cercado por mata atlântica, a Casa do Vale dissolve a fronteira entre dentro e fora com um pavilhão único de 38 metros. Concreto bruto, madeira freijó e steel frame nas alvenarias internas viabilizaram vãos longos sem pilares intermediários.",
        isAnchor: true,
        images: [
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-cover.webp",
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-01.webp",
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-02.webp",
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-03.webp",
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-04.webp",
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-05.webp",
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-06.webp",
          "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-07.webp",
        ],
      },
      {
        id: "refugio-mantiqueira",
        name: "Refúgio Mantiqueira",
        area: 220,
        year: 2022,
        city: "Campos do Jordão, SP",
        program: "Residencial · 3 dorms",
        images: ["/images/galeria/projeto-02.webp", "/images/galeria/projeto-03.webp"],
      },
      {
        id: "estudio-caboclo",
        name: "Estúdio Caboclo",
        area: 95,
        year: 2024,
        city: "Ubatuba, SP",
        program: "Estúdio · 1 dorm",
        images: ["/images/galeria/projeto-04.webp", "/images/galeria/projeto-05.webp"],
      },
      {
        id: "casa-suspensa",
        name: "Casa Suspensa",
        area: 310,
        year: 2021,
        city: "Atibaia, SP",
        program: "Residencial · 3 dorms · Steel frame elevado",
        images: ["/images/galeria/projeto-06.webp", "/images/galeria/projeto-07.webp"],
      },
      {
        id: "pavilhao-cabreuva",
        name: "Pavilhão Cabreúva",
        area: 180,
        year: 2023,
        city: "Cabreúva, SP",
        program: "Lazer · Pavilhão único",
        images: ["/images/galeria/projeto-08.webp", "/images/galeria/projeto-09.webp"],
      },
      {
        id: "casa-do-mirante",
        name: "Casa do Mirante",
        area: 390,
        year: 2018,
        city: "Joanópolis, SP",
        program: "Residencial · 4 dorms",
        images: ["/images/galeria/projeto-10.webp", "/images/galeria/projeto-11.webp"],
      },
      {
        id: "casa-do-lago",
        name: "Casa do Lago",
        area: 260,
        year: 2020,
        city: "Bragança Paulista, SP",
        program: "Residencial · 3 dorms",
        images: ["/images/galeria/projeto-12.webp", "/images/galeria/projeto-13.webp"],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // 2. STUDIO LINHA RETA — Curitiba · carrossel
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "studio-linha-reta",
    studioName: "Studio Linha Reta",
    city: "Curitiba",
    state: "PR",
    styleTags: ["Minimalismo", "Compacto", "Performance Térmica"],
    shortPitch:
      "Casas pequenas que parecem grandes — cada metro quadrado com propósito.",
    bio: "Pedro Wagner abriu o Studio Linha Reta em 2018, inquieto com o excesso. A premissa: projetar casas que façam sentido em 60 a 130 metros quadrados — sem perder generosidade espacial nem comprometer conforto térmico no inverno curitibano.\n\nO escritório é referência em soluções de envelope térmico para steel frame: paredes com camadas calculadas, esquadrias de alta performance e ventilação cruzada projetada com simulação computacional. Cada material é escolhido para envelhecer bem e pedir pouca manutenção.",
    yearFounded: 2018,
    metrics: {
      yearsActive: 7,
      completedProjects: 28,
      areaBuilt: 3500,
    },
    history: [
      { year: 2018, milestone: "Pedro Wagner abre o studio em uma sala de 30m² no Batel" },
      { year: 2020, milestone: "Cabana 60 viraliza no Archdaily Brasil" },
      { year: 2022, milestone: "Primeiro projeto certificado com selo PBE Edifica nível A" },
      { year: 2024, milestone: "Lançamento da linha modular Cabana 60" },
    ],
    contact: {
      website: "https://www.studiolinhareta.arq.br",
      instagram: "@studiolinhareta",
      phone: "+55 41 98765-4321",
      email: "ola@studiolinhareta.arq.br",
    },
    studioPhoto: "/images/galeria/projeto-14.webp",
    architectPhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    architectName: "Pedro Wagner",
    hubLayoutVariant: "carousel",
    projects: [
      {
        id: "cabana-60",
        name: "Cabana 60",
        area: 60,
        year: 2024,
        city: "Piraquara, PR",
        program: "Residencial · 1 dorm · Modular",
        concept:
          "Protótipo de casa compacta de 60m² em steel frame com envelope térmico calculado para o inverno do Sul. Estrutura modular permite produção em galpão e montagem em 14 dias no terreno. Hoje é a base de uma linha replicável do studio.",
        isAnchor: true,
        images: [
          "/images/Services/projetos-prontos/vila-serrana/vila-serrana-exterior-completo.webp",
          "/images/Services/projetos-prontos/vila-serrana/vila-serrana-fachada-detalhe.webp",
          "/images/Services/projetos-prontos/vila-serrana/vila-serrana-interior-suite.webp",
          "/images/Services/projetos-prontos/vila-serrana/vila-serrana-construcao.webp",
        ],
      },
      {
        id: "casa-pinhal",
        name: "Casa Pinhal",
        area: 110,
        year: 2023,
        city: "Curitiba, PR",
        program: "Residencial · 2 dorms",
        images: ["/images/galeria/projeto-15.webp", "/images/galeria/projeto-16.webp"],
      },
      {
        id: "refugio-lapa",
        name: "Refúgio Lapa",
        area: 85,
        year: 2022,
        city: "Lapa, PR",
        program: "Casa de campo · 2 dorms",
        images: ["/images/galeria/projeto-17.webp", "/images/galeria/projeto-18.webp"],
      },
      {
        id: "cabana-inverno",
        name: "Cabana Inverno",
        area: 70,
        year: 2024,
        city: "Quatro Barras, PR",
        program: "Residencial · 1 dorm",
        images: ["/images/galeria/projeto-19.webp", "/images/galeria/projeto-20.webp"],
      },
      {
        id: "casa-bigorrilho",
        name: "Casa Compacta Bigorrilho",
        area: 130,
        year: 2021,
        city: "Curitiba, PR",
        program: "Residencial urbano · 3 dorms",
        images: ["/images/galeria/projeto-21.webp", "/images/galeria/projeto-22.webp"],
      },
      {
        id: "estudio-ahu",
        name: "Estúdio Ahú",
        area: 45,
        year: 2023,
        city: "Curitiba, PR",
        program: "Estúdio profissional",
        images: ["/images/galeria/projeto-23.webp", "/images/galeria/projeto-24.webp"],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // 3. OBRA ARQUITETURA — Belo Horizonte · zigzag
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "obra-arquitetura",
    studioName: "OBRA Arquitetura",
    city: "Belo Horizonte",
    state: "MG",
    styleTags: ["Contemporâneo", "Pátio Interno", "Mineiro"],
    shortPitch:
      "Arquitetura mineira é antes de tudo sobre como o sol entra na casa.",
    bio: "OBRA é o escritório de Camila Reis e Tiago Drumond, fundado em 2012 após uma temporada juntos no Arquipélago Arquitetos. Acreditam que arquitetura mineira é antes de tudo sobre como o sol entra na casa: pátios internos abertos ao céu, beirais profundos para o calor seco do Cerrado, materiais que envelhecem bem sob chuva e poeira vermelha.\n\nO escritório trabalha bem com steel frame em projetos de complementação — quando a obra principal é em alvenaria estrutural mas precisa de áreas íntimas leves, ampliações rápidas ou volumes suspensos sobre topografia íngreme.",
    yearFounded: 2012,
    metrics: {
      yearsActive: 13,
      completedProjects: 52,
      areaBuilt: 18000,
    },
    history: [
      { year: 2012, milestone: "Camila e Tiago abrem a OBRA num apartamento em Lourdes" },
      { year: 2016, milestone: "Casa Pátio Sabará vira capa da revista AU" },
      { year: 2019, milestone: "Primeira obra híbrida alvenaria + steel frame com Berkahn" },
      { year: 2022, milestone: "Pavilhão Inhotim recebe Selo Casa Azul Caixa" },
      { year: 2024, milestone: "OBRA expande para um time de 12 arquitetos" },
    ],
    contact: {
      website: "https://www.obraarquitetura.com.br",
      instagram: "@obra.arq",
      phone: "+55 31 98765-4321",
      email: "contato@obraarquitetura.com.br",
    },
    studioPhoto: "/images/galeria/projeto-25.webp",
    architectPhoto:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80",
    architectName: "Camila Reis",
    hubLayoutVariant: "zigzag",
    projects: [
      {
        id: "casa-patio-sabara",
        name: "Casa Pátio Sabará",
        area: 320,
        year: 2022,
        city: "Sabará, MG",
        program: "Residencial · 4 dorms · Pátio central",
        concept:
          "A Casa Pátio Sabará organiza-se em U ao redor de um pátio aberto de 80m² — coração térmico e social da casa. Estrutura mista: alvenaria estrutural nas alas frias e steel frame nas circulações suspensas, viabilizando vãos amplos sem pilares.",
        isAnchor: true,
        images: [
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-entrada-principal.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-lateral.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-living.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-jantar.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-pergola.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-piscina.webp",
          "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-lateral-piscina.webp",
        ],
      },
      {
        id: "residencia-nova-lima",
        name: "Residência Nova Lima",
        area: 450,
        year: 2023,
        city: "Nova Lima, MG",
        program: "Residencial · 5 dorms",
        images: ["/images/galeria/projeto-26.webp", "/images/galeria/projeto-27.webp"],
      },
      {
        id: "casa-do-poente",
        name: "Casa do Poente",
        area: 290,
        year: 2021,
        city: "Belo Horizonte, MG",
        program: "Residencial · 3 dorms",
        images: ["/images/galeria/projeto-28.webp", "/images/galeria/projeto-29.webp"],
      },
      {
        id: "casa-lourdes",
        name: "Casa Lourdes",
        area: 380,
        year: 2022,
        city: "Belo Horizonte, MG",
        program: "Residencial urbano · 4 dorms",
        images: ["/images/galeria/projeto-30.webp", "/images/galeria/projeto-31.webp"],
      },
      {
        id: "casa-aberta-pampulha",
        name: "Casa Aberta Pampulha",
        area: 510,
        year: 2024,
        city: "Belo Horizonte, MG",
        program: "Residencial · 4 dorms · Pátio + piscina",
        images: ["/images/galeria/projeto-32.webp", "/images/galeria/projeto-33.webp"],
      },
      {
        id: "pavilhao-inhotim",
        name: "Pavilhão Inhotim",
        area: 240,
        year: 2020,
        city: "Brumadinho, MG",
        program: "Pavilhão cultural",
        images: ["/images/galeria/projeto-34.webp"],
      },
      {
        id: "casa-mineira",
        name: "Casa Mineira",
        area: 340,
        year: 2023,
        city: "Belo Horizonte, MG",
        program: "Residencial · 4 dorms",
        images: ["/images/galeria/projeto-35.webp", "/images/galeria/projeto-36.webp"],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // 4. NÚCLEO LITORAL — Florianópolis · carrossel
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "nucleo-litoral",
    studioName: "Núcleo Litoral",
    city: "Florianópolis",
    state: "SC",
    styleTags: ["Praiano", "Litoral", "Resistente"],
    shortPitch:
      "Casas de praia que duram décadas no clima salino — para conviver com o mar, não para resisti-lo.",
    bio: "Núcleo Litoral é dirigido por Fernanda Hahn e Lucas Steiner desde 2017. Especialistas em casas de praia que duram décadas no clima salino do Sul, projetam para conviver com o mar — não para resisti-lo. Steel frame galvanizado com tratamento anti-salino, esquadrias de alumínio com pintura eletrostática, madeiras nativas estabilizadas.\n\nA marca registrada do escritório é a ventilação cruzada projetada caso a caso, baseada na orientação de cada terreno em relação à brisa marítima. Resultado: casas que dispensam ar-condicionado boa parte do ano e exigem manutenção mínima.",
    yearFounded: 2017,
    metrics: {
      yearsActive: 8,
      completedProjects: 40,
      areaBuilt: 14500,
    },
    history: [
      { year: 2017, milestone: "Fernanda e Lucas fundam o Núcleo após Mestrado em Arquitetura Litorânea" },
      { year: 2019, milestone: "Casa Praia Mole vira referência em projeto resistente à salinidade" },
      { year: 2021, milestone: "Parceria oficial com Berkahn para steel frame galvanizado" },
      { year: 2024, milestone: "Lançamento do método NL-Salt para envelope marítimo" },
    ],
    contact: {
      website: "https://www.nucleolitoral.arq.br",
      instagram: "@nucleolitoral.arq",
      phone: "+55 48 98765-4321",
      email: "ola@nucleolitoral.arq.br",
    },
    studioPhoto: "/images/galeria/projeto-37.webp",
    architectPhoto:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=80",
    architectName: "Fernanda Hahn",
    hubLayoutVariant: "carousel",
    projects: [
      {
        id: "casa-praia-mole",
        name: "Casa Praia Mole",
        area: 280,
        year: 2023,
        city: "Florianópolis, SC",
        program: "Residencial · 4 dorms · Frente para o mar",
        concept:
          "Implantada a 80 metros da arrebentação, a Casa Praia Mole responde ao desafio do envelope salino com steel frame galvanizado por imersão e fachada ventilada em madeira tratada. Ventilação cruzada dispensa ar-condicionado por 9 meses do ano.",
        isAnchor: true,
        images: [
          "/images/apresentacao/Vila-da-mata/vila-da-mata-1.webp",
          "/images/apresentacao/Vila-da-mata/vila-da-mata-2.webp",
          "/images/apresentacao/Vila-da-mata/vila-da-mata-3.webp",
        ],
      },
      {
        id: "refugio-lagoinha",
        name: "Refúgio Lagoinha",
        area: 180,
        year: 2022,
        city: "Florianópolis, SC",
        program: "Residencial · 3 dorms",
        images: ["/images/galeria/projeto-38.webp", "/images/galeria/projeto-39.webp"],
      },
      {
        id: "casa-jurere",
        name: "Casa Jurerê",
        area: 520,
        year: 2024,
        city: "Florianópolis, SC",
        program: "Residencial · 5 dorms · Piscina + deck",
        images: ["/images/galeria/projeto-40.webp", "/images/galeria/projeto-41.webp"],
      },
      {
        id: "mirante-campeche",
        name: "Mirante Campeche",
        area: 240,
        year: 2021,
        city: "Florianópolis, SC",
        program: "Residencial · 3 dorms",
        images: ["/images/galeria/projeto-42.webp"],
      },
      {
        id: "casa-pantano-sul",
        name: "Casa Pântano do Sul",
        area: 160,
        year: 2023,
        city: "Florianópolis, SC",
        program: "Residencial · 2 dorms",
        images: [
          "/images/Services/projetos-prontos/Loft/loft-01.webp",
          "/images/Services/projetos-prontos/Loft/loft-02.webp",
        ],
      },
      {
        id: "cabana-galheta",
        name: "Cabana Galheta",
        area: 90,
        year: 2022,
        city: "Florianópolis, SC",
        program: "Casa de praia · 2 dorms",
        images: [
          "/images/Services/projetos-prontos/Chalé/chale_interior_1.webp",
          "/images/Services/projetos-prontos/Chalé/chale_interior_2.webp",
        ],
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
