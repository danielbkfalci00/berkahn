// Conteúdo e procedência da página /sustentabilidade.
//
// Regras do registro:
// - nenhum número exibido entra sem `source`;
// - nenhuma fonte fica declarada sem sustentar um número exibido;
// - faixas permanecem faixas;
// - nenhuma intensidade de carbono por área é publicada nesta página.

import type { DataSource } from "@/lib/impact-data";

export const SOURCES = {
  unepGsr2026: {
    id: "unep2026",
    name: "UNEP e GlobalABC, Global Status Report for Buildings and Construction 2025-2026",
    year: 2026,
    url: "https://zenodo.org/records/20316373",
    note: "Quase 50% da extração global de materiais vai para edificações e construção, e o setor responde por quase 37% das emissões globais.",
  },
  // Prazo: estudos de caso de graduação/pós, não pesquisa revisada por pares.
  // Por isso o número vai como faixa e a legenda diz "estudos de caso".
  univates2023: {
    id: "univates2023",
    name: "Univates, estudo de caso de residência unifamiliar em Lajeado (RS)",
    year: 2023,
    url: "https://www.univates.br/bdu/items/48e2c37c-e308-4140-a85e-63b80bfd7004",
    note: "Redução de 30% a 39% no tempo de execução com Light Steel Frame.",
  },
  unipar: {
    id: "unipar",
    name: "UNIPAR, análise orçamentária de sistemas construtivos",
    url: "https://www.unipar.br/documentos/259/ANALISE_COMPARATIVA_ORCAMENTARIA_DOS_SISTEMAS_CONSTRUTIVOS_CONVENCIONAL.pdf",
    note: "Agilidade cerca de 50% maior com Light Steel Frame, com custo maior no mesmo estudo.",
  },
  // Perda de material: fonte secundária (entidade citada pela imprensa).
  cbcsTupi: {
    id: "cbcs-tupi",
    name: "CBCS, citado pela Super Rádio Tupi",
    url: "https://www.tupi.fm/?p=1999030",
    note: "Alvenaria convencional pode chegar a 20% de perdas; no Light Steel Frame, cerca de 5% ou menos. Sem metodologia publicada.",
  },
} as const satisfies Record<string, DataSource>;

export interface SourcedFigure {
  value: string;
  label: string;
  source: DataSource;
}

// Sem campo de crédito: a página não assina foto na tela. As três imagens
// externas são provisórias e o link de origem fica em comentário, ao lado de
// cada uma, para identificar qual arquivo substituir.
export interface EditorialImage {
  src: string;
  alt: string;
  focus?: string;
}

export const HERO = {
  headline: "O mundo que construímos hoje é o legado que deixamos amanhã.",
  lede: "A transição climática muda o que se espera de uma casa. Desempenho e responsabilidade ambiental passam a valer no longo prazo, para quem constrói e para quem mora.",
  // Provisória, de https://unsplash.com/photos/0dtLWM5ycGc
  image: {
    src: "https://images.unsplash.com/photo-1713700741779-fb0237967302?auto=format&fit=crop&w=3840&q=90",
    alt: "Vista aérea da copa de uma floresta brasileira",
    focus: "object-center",
  } satisfies EditorialImage,
};

export const EXTRACTION_SECTION = {
  headline: "Toda parede começa muito antes do canteiro.",
  lede: "O ambiente construído responde por mais de um terço das emissões globais. A Berkahn assume o compromisso de incorporar práticas que reduzam o impacto das obras e usem os recursos naturais com consciência.",
  figure: {
    value: "~50%",
    label: "da extração global de materiais vai para edificações e construção",
    source: SOURCES.unepGsr2026,
  } satisfies SourcedFigure,
  beats: [
    {
      title: "A paisagem entra na conta",
      body: "Cimento, areia, cascalho e madeira temporária começam fora do terreno. Construir sempre exige matéria e transforma paisagens antes de transformar o lote.",
    },
    {
      title: "O projeto define quanto chega",
      body: "Quanto mais cedo a parede é definida, mais precisa pode ser a compra. Essa decisão reduz improviso e evita que excesso de material vire sobra no canteiro.",
    },
    {
      title: "A escolha do sistema muda o processo",
      body: "A construção a seco leva parte dessas decisões para o projeto e substitui etapas de produção no local por uma sequência planejada de montagem.",
    },
  ],
  // Provisória, de https://unsplash.com/photos/oF7hh97lVqA
  image: {
    src: "https://images.unsplash.com/photo-1571223641822-b82408a0e705?auto=format&fit=crop&w=3840&q=90",
    alt: "Vista aérea de uma pedreira e das marcas da extração no terreno",
    focus: "object-center",
  } satisfies EditorialImage,
};

export const SITE_SECTION = {
  headline: "O impacto aparece na obra que você acompanha.",
  lede: "Para quem decide construir, sustentabilidade precisa aparecer no cotidiano do canteiro.",
  steps: [
    {
      title: "Comprar com o projeto na mão",
      body: "A lista de materiais acompanha a modulação da parede. A equipe compra para uma solução definida, com menos espaço para excesso e improviso.",
      image: {
        src: "/images/Services/Como-trabalhamos/execucao-da-obra-2.webp",
        alt: "Projeto aberto no canteiro enquanto a equipe executa a obra",
        focus: "object-center",
      },
    },
    {
      title: "Montar com menos etapas úmidas",
      body: "Depois da fundação, o fechamento avança sem argamassa de assentamento e sem o ciclo de mistura, cura e lavagem associado a ela.",
      image: {
        src: "/images/Lsf/lsf-fase-2.webp",
        alt: "Estrutura de Light Steel Frame montada e organizada no terreno",
        focus: "object-center",
      },
    },
    {
      title: "Separar antes de descartar",
      body: "Retalhos metálicos saem separados do entulho misto. Assim, preservam valor e encontram uma cadeia preparada para recebê-los.",
      image: {
        src: "/images/Home/lsf-estrutura.webp",
        alt: "Perfis de aço galvanizado formando a estrutura de uma residência",
        focus: "object-center",
      },
    },
  ],
};

// Três áreas de foco do plano climático. Cada cartão abre um detalhe com o
// texto de apoio. As frentes 01 e 03 usam imagens geradas e aprovadas em
// public/images/Sustentabilidade/. A 02 ainda usa foto do acervo, provisória.
export interface FocusArea {
  id: string;
  label: string;
  title: string;
  summary: string;
  detail: string[];
  image: EditorialImage;
}

export const FOCUS_SECTION = {
  headline: "Três frentes para construir com menos impacto.",
  lede: "Escolher e planejar bem reduz desperdício, retrabalho e consumo, antes e depois da obra.",
  areas: [
    {
      id: "projeto",
      label: "01",
      title: "Projetar para a eficiência",
      summary: "Planejamento inteligente reduz desperdício e retrabalho.",
      detail: [
        "Um projeto mais eficiente e um planejamento mais inteligente reduzem o desperdício, diminuem o retrabalho e aumentam a produtividade. As emissões menores vêm como consequência.",
        "Trabalhar com o cliente desde as primeiras etapas permite aprimorar a concepção e o planejamento ao longo de toda a obra, com uso mais preciso de materiais e energia.",
      ],
      image: {
        src: "/images/Sustentabilidade/frente-projeto.webp",
        alt: "Planta impressa sobre uma mesa de cavalete no canteiro, com capacete, trena e perfis de aço ao fundo",
        focus: "object-center",
      },
    },
    {
      id: "materiais",
      label: "02",
      title: "Materiais de baixo carbono, na prática",
      summary: "Soluções industrializadas e materiais de menor pegada.",
      detail: [
        "A escolha dos materiais e do sistema construtivo é onde a construção mais pode contribuir. Priorizamos soluções industrializadas, como o Light Steel Frame, que favorecem o uso eficiente de material, menos desperdício e mais controle da execução.",
        "Também avaliamos alternativas de menor impacto, como materiais reciclados e soluções de menor pegada de carbono, sempre conciliando desempenho, qualidade e responsabilidade ambiental.",
      ],
      image: {
        src: "/images/Lsf/lsf-fase-2.webp",
        alt: "Estrutura de Light Steel Frame montada e organizada no terreno",
        focus: "object-center",
      },
    },
    {
      id: "energia",
      label: "03",
      title: "Melhoria do desempenho energético",
      summary: "Conforto térmico com menos necessidade de climatização.",
      detail: [
        "A eficiência energética importa durante a obra e ao longo da vida útil da casa. Ela entra no projeto desde o início.",
        "O Light Steel Frame, o isolamento térmico bem especificado, a luz natural, a ventilação e a orientação solar trabalham juntos para dar conforto e reduzir a climatização artificial, além de equipamentos eficientes que baixam consumo e custo de operação.",
      ],
      image: {
        src: "/images/Sustentabilidade/frente-energia.webp",
        alt: "Casa contemporânea de dois pavimentos com beiral profundo e brise de madeira",
        focus: "object-center",
      },
    },
  ] satisfies FocusArea[],
};

// Comparação a seco x convencional. Só faixas, só o que tem fonte, e a
// legenda diz o tipo de fonte. Nada de carbono nem de água em percentual.
export interface ComparisonItem {
  title: string;
  value: string | null;
  label: string;
  note: string;
  source?: DataSource;
}

export const COMPARISON_SECTION = {
  headline: "O que muda quando a parede é montada a seco.",
  lede: "Diferenças medidas em estudos brasileiros. Os números variam de projeto para projeto, por isso aparecem como faixas.",
  items: [
    {
      title: "Prazo",
      value: "30 a 50%",
      label: "menos tempo de obra em estudos de caso",
      note: "A variação depende do projeto e da equipe.",
      source: SOURCES.univates2023,
    },
    {
      title: "Perda de material",
      value: "~5% × até 20%",
      label: "de perdas no Light Steel Frame contra a alvenaria, segundo o CBCS",
      note: "Fonte secundária, sem metodologia publicada.",
      source: SOURCES.cbcsTupi,
    },
    {
      title: "Etapas úmidas",
      value: null,
      label: "Sem argamassa de assentamento nem reboco",
      note: "Menos mistura, cura e lavagem no canteiro. A fundação continua sendo de concreto.",
    },
  ] satisfies ComparisonItem[],
  footnote:
    "Não afirmamos que uma casa em Light Steel Frame emite menos carbono em todo o ciclo de vida: o resultado depende do projeto e do uso, e um estudo brasileiro apontou vantagem para a alvenaria no total.",
};

export const PRACTICE_SECTION = {
  headline: "O que a gente preserva em cada projeto.",
  lede: "A Berkahn transforma esse cuidado em decisões que acompanham a obra do detalhamento à saída do último material.",
  practices: [
    {
      title: "Decidir antes de comprar",
      body: "Projeto, modulação e quantitativos orientam a compra antes de o material chegar ao terreno.",
    },
    {
      title: "Executar o que foi definido",
      body: "A sequência de montagem mantém o canteiro alinhado ao projeto e deixa os desvios mais visíveis.",
    },
    {
      title: "Preservar o destino da sobra",
      body: "A separação no canteiro evita que materiais recuperáveis desapareçam dentro da caçamba de entulho misto.",
    },
  ],
};

// Artigos do blog no fim da página. Ordem = ordem de exibição.
export const READING_SECTION = {
  headline: "Para ir mais fundo.",
  lede: "Artigos da Berkahn sobre construção a seco, desempenho e materiais.",
  slugs: [
    "sustentabilidade-construcao-industrializada",
    "sustentabilidade-construcao-civil-economia-circular",
    "isolamento-termico-acustico-steel-frame",
    "steel-frame-vs-alvenaria",
    "steel-frame-esquenta-conforto-termico",
  ],
};
