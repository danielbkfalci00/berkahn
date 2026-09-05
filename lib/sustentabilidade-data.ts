// Dados da página /sustentabilidade. Regra herdada de lib/impact-data.ts:
// nenhum número entra sem `source`. As fontes não vão para a tela (decisão do
// Bruno em 2026-09-02), ficam aqui como procedência auditável.
//
// Três decisões de apuração que moldaram esta página, registradas em
// Berkahn-Vault/20-context/home-redesign-direcao.md:
//
// 1. NENHUM kgCO₂/m². Os três valores que o site já publicou (180,41 · 15,39 ·
//    119-142) são incompatíveis entre si e nenhum resiste a checagem. Pior: o
//    único ACV brasileiro revisado por pares que compara os dois sistemas de
//    berço ao túmulo (Caldas et al., 2017) conclui a favor da ALVENARIA, porque
//    a fase de operação domina. A página trata isso de frente na seção 07 em
//    vez de esconder.
// 2. ÁGUA entra, mas como água de canteiro medida, não como "99% menos". O par
//    "5 L/m² contra 500 L/m²" que circula no site vem de compilação comercial.
//    O número desta página é medição de campo publicada em periódico.
// 3. DESPERDÍCIO repete o par da home ("< 5%" contra "até 30%") de propósito,
//    para não criar um terceiro par conflitante. O que a página acrescenta é o
//    destino desse material, que a home não conta.

import type { DataSource } from "@/lib/impact-data";

export const SOURCES = {
  unepGsr2026: {
    id: "unep2026",
    name: "UNEP e GlobalABC, Global Status Report for Buildings and Construction 2025-2026",
    year: 2026,
    url: "https://zenodo.org/records/20316373",
    note: "37% das emissões globais de CO₂ e quase 50% da extração global de materiais. O escopo de 37% é mais amplo que os 34% de CO₂ ligado a energia da edição anterior; não é piora de 3 pontos.",
  },
  gcca: {
    id: "gcca",
    name: "Global Cement and Concrete Association; Chatham House, Making Concrete Change (Lehne e Preston)",
    year: 2025,
    url: "https://gccassociation.org/",
    note: "A indústria declara cerca de 7%; o estudo mais citado (Chatham House, 2018) fala em 8%. A faixa de 7% a 8% é a leitura honesta.",
  },
  unepSand: {
    id: "unepsand",
    name: "UNEP, Sand and Sustainability",
    year: 2026,
    url: "https://www.unep.org/resources/report/sand-and-sustainability-10-strategic-recommendations-avert-crisis",
    note: "50 bilhões de toneladas de areia e cascalho por ano; segundo recurso mais extraído depois da água; demanda para construção deve crescer até 45% até 2060.",
  },
  aguaCanteiro: {
    id: "agua-canteiro",
    name: "Mergener, Kalbusch, Henning e Ravizza, Ambiente Construído (ANTAC/UFRGS), v. 25",
    year: 2025,
    url: "https://www.scielo.br/j/ac/a/4RzgT64CJp3gK79p9XXVfxN/?lang=pt",
    note: "Média de 0,2633 m³/m² (263 L/m²) em canteiros convencionais de Joinville, com faixa de 107 a 594 L/m². É água DE CANTEIRO (cura, argamassa, limpeza, uso humano), não água embutida na fabricação dos materiais.",
  },
  sinduscon: {
    id: "sinduscon",
    name: "SINDUSCON-SP e Engenharia Compartilhada",
    note: "2% a 5% de perda no Light Steel Frame contra 8% a 30% na obra convencional, até 40% com retrabalho. Mesmo par usado na seção 05 da home.",
  },
  abreconPesquisa: {
    id: "abrecon-usp",
    name: "Angulo, Oliveira e Machado, Pesquisa Setorial ABRECON (EDUSP)",
    year: 2022,
    url: "https://www.livrosabertos.abcd.usp.br/portaldelivrosUSP/catalog/book/839",
    note: "Taxa de reciclagem de resíduo de construção e demolição no Brasil entre 15% e 20% ao longo de oito anos, com as usinas recicladoras operando a 50% da capacidade instalada.",
  },
  madeiraFormas: {
    id: "madeira-formas",
    name: "Oliveira, Moraes, Orlandini, Possan e Punhagui, Mix Sustentável (UFSC), v. 8 n. 4",
    year: 2022,
    url: "https://ojs.sites.ufsc.br/index.php/mixsustentavel/article/download/5173/4724",
    note: "4,2 a 7,6 m³ de madeira por 100 m² em fôrma e escoramento de estrutura de concreto armado moldado in loco, em obras térreas. Nos casos medidos, toda a madeira foi para aterro.",
  },
  madeiraEntac: {
    id: "madeira-entac",
    name: "Oliveira, Pinto, Moraes e Punhagui (UNILA), ENTAC 2022",
    year: 2022,
    url: "https://eventos.antac.org.br/index.php/entac/article/view/1977",
    note: "0,025 m³/m² de madeira descartada como fôrma contra 0,02 a 0,34 m³/m² de madeira permanente numa casa estruturada em madeira. Fôrmas reutilizadas de 2 a 3 vezes antes do descarte.",
  },
  amazonia2030: {
    id: "amazonia2030",
    name: "Amazônia 2030 e Imaflora, O manejo de florestas naturais e o setor madeireiro da Amazônia brasileira",
    year: 2025,
    url: "https://amazonia2030.org.br/",
    note: "Entre 2010 e 2023, cerca de 92% do volume de produtos madeireiros da Amazônia foi madeira serrada destinada à construção civil. O relatório defende mais uso de madeira, não menos; o número é de destino, não de condenação.",
  },
  iba: {
    id: "iba",
    name: "Ibá, Indústria Brasileira de Árvores, Setor Florestal Brasileiro pelo Clima",
    year: 2025,
    url: "https://iba.org/",
    note: "10,5 milhões de hectares de árvores plantadas no Brasil e 7,01 milhões de hectares de vegetação nativa conservada pelo setor. Associação setorial; parte da conservação é exigência do Código Florestal.",
  },
  osbPinus: {
    id: "osb-pinus",
    name: "Catálogo técnico de fabricante de OSB no Brasil (LP Brasil, Ponta Grossa)",
    year: 2024,
    url: "https://lpbrasil.com.br/",
    note: "OSB produzido com tiras de pinus de floresta plantada. Declaração de fabricante. NÃO confirmada certificação FSC ou CERFLOR; a página não afirma selo.",
  },
  worldsteel: {
    id: "worldsteel",
    name: "World Steel Association; SteelConstruction.info",
    year: 2025,
    url: "https://worldsteel.org/about-steel/raw-materials/",
    note: "Aço reciclável sem perda de propriedades. Cada tonelada de sucata evita cerca de 1,5 t de CO₂, 1,4 t de minério, 740 kg de carvão e 120 kg de calcário. Taxa de reciclagem de fim de vida na ordem de 85%.",
  },
  caldas2017: {
    id: "caldas2017",
    name: "Caldas, Lira, Melo e Sposto, Ambiente Construído",
    year: 2017,
    url: "https://www.scielo.br/j/ac/a/Vvx3PRfpMjqdbdCM35NMgXv/?lang=en",
    note: "ACV de 50 anos de habitação em Brasília. A fase de construção favorece o Light Steel Frame (0,32 contra 0,38 tCO₂eq/m²), mas no ciclo completo a alvenaria sai na frente porque a operação responde por 50% a 70% do total. É a fonte da ressalva da seção 07.",
  },
  nbr16970: {
    id: "nbr16970",
    name: "ABNT NBR 16970",
    year: 2022,
    note: "Norma brasileira própria do Light Steel Frame.",
  },
} as const satisfies Record<string, DataSource>;

/** Número grande da página. `from`/`to` ligam o numeral ao scroll. */
export interface BigNumber {
  value: string;
  from?: number;
  to?: number;
  prefix?: string;
  unit?: string;
  /** Rótulo curto, até ~44 caracteres. */
  label: string;
  source: DataSource;
}

/* ------------------------------------------------------------------ */
/* 00 · abertura                                                       */
/* ------------------------------------------------------------------ */

export const HERO = {
  eyebrow: "sustentabilidade",
  headline: "Toda casa cobra alguma coisa do mundo antes de existir.",
  lede: "A conta não aparece no orçamento. Aparece no rio de onde veio a areia, no forno que queimou o calcário e na caçamba que sai do canteiro.",
  image: {
    src: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=2400&q=80",
    alt: "Rio correndo entre encostas cobertas de floresta, com névoa baixa",
  },
  cue: "role para ver a conta",
  /** Índice das contas. É a navegação da página, não enfeite. */
  index: [
    { href: "#extracao", label: "o que a obra arranca" },
    { href: "#madeira", label: "a madeira que ninguém conta" },
    { href: "#parede", label: "a parede" },
    { href: "#sobra", label: "o que sobra" },
    { href: "#ciclo", label: "o aço volta" },
  ],
};

/* ------------------------------------------------------------------ */
/* 01 · o tamanho da conta                                             */
/* ------------------------------------------------------------------ */

export const SCALE_SECTION = {
  eyebrow: "01 · o tamanho da conta",
  headline: "Construir consome quase metade de tudo que o mundo extrai.",
  copy: "Edificações e construção respondem por quase metade da extração global de materiais. Boa parte dessa conta fica definida antes de a obra começar, na escolha do sistema construtivo.",
  /**
   * Foto que preenche o primeiro numeral por dentro. Vai direto da CDN porque
   * background-clip não passa por next/image; o domínio já está liberado em
   * next.config.ts. É a mesma foto da batida "cimento", então o download é um só.
   */
  fillImage:
    "https://images.unsplash.com/photo-1621121013599-c94f85975cfd?auto=format&fit=crop&w=1600&q=80",
  figures: [
    {
      value: "50",
      from: 0,
      to: 50,
      prefix: "~",
      unit: "%",
      label: "da extração global de materiais",
      source: SOURCES.unepGsr2026,
    },
    {
      value: "37",
      from: 0,
      to: 37,
      unit: "%",
      label: "das emissões globais de CO₂",
      source: SOURCES.unepGsr2026,
    },
  ] as BigNumber[],
};

/* ------------------------------------------------------------------ */
/* 02 · o que a obra arranca (três batidas pinadas)                    */
/* ------------------------------------------------------------------ */

export interface ExtractionBeat {
  id: "cimento" | "areia" | "agua";
  index: "01" | "02" | "03";
  kicker: string;
  hero: BigNumber;
  claim: string;
  image: { src: string; alt: string };
  focus: string;
}

export const EXTRACTION_SECTION = {
  eyebrow: "02 · o que a obra arranca",
  headline: "Três coisas saem do mundo para uma parede subir.",
  beats: [
    {
      id: "cimento",
      index: "01",
      kicker: "cimento",
      hero: {
        value: "8",
        from: 0,
        to: 8,
        unit: "%",
        label: "das emissões globais de CO₂ vêm do cimento",
        source: SOURCES.gcca,
      },
      claim: "Boa parte dessa emissão sai da calcinação do calcário, que libera CO₂ e não tem volta. Concreto endurecido nunca volta a ser cimento.",
      image: {
        src: "https://images.unsplash.com/photo-1621121013599-c94f85975cfd?auto=format&fit=crop&w=2400&q=80",
        alt: "Planta industrial de cimento com silos e torres de estocagem",
      },
      focus: "object-[52%_50%]",
    },
    {
      id: "areia",
      index: "02",
      kicker: "areia",
      hero: {
        value: "50",
        from: 0,
        to: 50,
        unit: " bilhões",
        label: "de toneladas de areia extraídas por ano",
        source: SOURCES.unepSand,
      },
      claim: "Depois da água, é o recurso mais extraído do planeta. A do deserto tem grão liso demais para o cimento agarrar, então a conta cai sobre rios e leitos marinhos.",
      image: {
        src: "https://images.unsplash.com/photo-1785791516569-07a837fb07b7?auto=format&fit=crop&w=2400&q=80",
        alt: "Pilha de areia e correia transportadora em área de extração",
      },
      focus: "object-[50%_55%]",
    },
    {
      id: "agua",
      index: "03",
      kicker: "água",
      hero: {
        value: "263",
        from: 0,
        to: 263,
        unit: " L",
        label: "de água por m² medidos em canteiro",
        source: SOURCES.aguaCanteiro,
      },
      claim: "Entre obras do mesmo porte, o consumo medido variou cinco vezes. Montagem a seco tira do canteiro a argamassa, a cura e a lavagem.",
      image: {
        src: "https://images.unsplash.com/photo-1761477066641-b66ba2c1148c?auto=format&fit=crop&w=2400&q=80",
        alt: "Leito de rio seco com o solo rachado",
      },
      focus: "object-[50%_50%]",
    },
  ] as ExtractionBeat[],
};

/* ------------------------------------------------------------------ */
/* 03 · a madeira que ninguém conta                                    */
/* ------------------------------------------------------------------ */

export const FOREST_SECTION = {
  eyebrow: "03 · a madeira que ninguém conta",
  headline: "A obra descarta em fôrma a mesma madeira que uma casa de madeira usa para sempre.",
  copy: "Fôrma e escoramento consomem de 4,2 a 7,6 m³ de madeira a cada 100 m² de concreto armado. Num estudo brasileiro, essa madeira serviu duas ou três vezes e foi inteira para aterro.",
  closing: "Entre 2010 e 2023, 92% dos produtos madeireiros da Amazônia foram madeira serrada para construção. Na parede a seco, a madeira que entra é OSB de pinus de floresta plantada, e ela fica na casa.",
  figures: [
    {
      value: "7,6",
      unit: " m³",
      label: "de madeira por 100 m², só em fôrma",
      source: SOURCES.madeiraFormas,
    },
    {
      value: "92",
      unit: "%",
      label: "da madeira amazônica vai para a construção",
      source: SOURCES.amazonia2030,
    },
    {
      value: "10,5",
      unit: " mi ha",
      label: "de árvores plantadas no Brasil",
      source: SOURCES.iba,
    },
  ] as BigNumber[],
  planes: [
    {
      src: "https://images.unsplash.com/photo-1684438877998-ba56ec163f52?auto=format&fit=crop&w=1600&q=80",
      alt: "",
    },
    {
      src: "https://images.unsplash.com/photo-1533106348294-b9775840131b?auto=format&fit=crop&w=2000&q=80",
      alt: "",
    },
  ],
  photo: {
    src: "https://images.unsplash.com/photo-1784392087636-fb69865b4f96?auto=format&fit=crop&w=2000&q=80",
    alt: "Fôrmas de madeira e escoramento montados para a concretagem de uma estrutura",
  },
  caption: "fôrma de madeira · dois a três usos antes do aterro",
};

/* ------------------------------------------------------------------ */
/* 04 · a parede (corte em profundidade)                               */
/* ------------------------------------------------------------------ */

export const WALL_SECTION = {
  eyebrow: "04 · a parede",
  headline: "A parede sobe em camadas parafusadas, sem argamassa e sem cura.",
  copy: "Cada camada resolve uma coisa. A estrutura carrega, a lã isola, a manta veda, as placas fecham. Tudo chega cortado de fábrica e é parafusado no lugar.",
  sceneAlt: "Corte de parede em Light Steel Frame com as seis camadas separadas em profundidade",
};

/**
 * Os nomes que vão para a tela nesta página. LSF_LAYERS chama a camada 5 de
 * "Perfis de Steel Frame"; a regra da marca proíbe "Steel Frame" sozinho, e
 * mudar o dado compartilhado alteraria a /lsf. Então a página traz o próprio
 * rótulo, na mesma ordem de fora para dentro.
 */
export const WALL_LAYER_COPY = [
  { name: "Base coat" },
  { name: "Placa cimentícia" },
  { name: "Manta hidrófuga" },
  { name: "Lã mineral" },
  { name: "Montantes de aço galvanizado" },
  { name: "Placa de gesso" },
];

/* ------------------------------------------------------------------ */
/* 05 · o que sobra                                                    */
/* ------------------------------------------------------------------ */

export const WASTE_SECTION = {
  eyebrow: "05 · o que sobra",
  headline: "O entulho que a obra gera quase não volta.",
  copy: "A obra convencional perde até 30% do material que comprou. Esse entulho encontra um sistema que recicla de 15% a 20% do total, com as usinas na metade da capacidade. O resto vai para aterro.",
  closing: "No canteiro a seco a perda fica abaixo de 5%, e o que sobra é sucata metálica, que tem comprador.",
  columns: [
    {
      id: "convencional",
      label: "obra convencional",
      value: 30,
      prefix: "até ",
      unit: "%",
      note: "do material comprado vira perda",
      source: SOURCES.sinduscon,
    },
    {
      id: "seco",
      label: "canteiro a seco",
      value: 5,
      prefix: "< ",
      unit: "%",
      note: "de perda, quase toda sucata metálica",
      source: SOURCES.sinduscon,
    },
  ],
  recycling: {
    value: "20",
    from: 0,
    to: 20,
    unit: "%",
    label: "do entulho brasileiro é reciclado",
    source: SOURCES.abreconPesquisa,
  } as BigNumber,
  image: {
    src: "https://images.unsplash.com/photo-1777793919746-d1bc5cac1367?auto=format&fit=crop&w=2000&q=80",
    alt: "Montanha de entulho de construção depositada a céu aberto",
  },
};

/* ------------------------------------------------------------------ */
/* 06 · o aço volta                                                    */
/* ------------------------------------------------------------------ */

export const LOOP_SECTION = {
  eyebrow: "06 · o aço volta",
  headline: "No fim da vida, a estrutura desmonta e volta para a siderúrgica.",
  copy: "O aço é reciclável sem perder propriedades e é o material mais reciclado do mundo. Cada tonelada de sucata que volta ao forno evita cerca de 1,5 tonelada de CO₂. O concreto não tem esse caminho.",
  stations: [
    { id: "bobina", label: "bobina de aço" },
    { id: "perfil", label: "perfil cortado" },
    { id: "casa", label: "casa em pé" },
    { id: "desmonte", label: "desmonte por parafuso" },
    { id: "forno", label: "forno" },
  ],
  figures: [
    {
      value: "1,5",
      unit: " t",
      label: "de CO₂ evitada por tonelada de sucata",
      source: SOURCES.worldsteel,
    },
    {
      value: "85",
      unit: "%",
      label: "do aço em fim de vida volta ao ciclo",
      source: SOURCES.worldsteel,
    },
  ] as BigNumber[],
  image: {
    src: "https://images.unsplash.com/photo-1722695694560-f452b0919d3a?auto=format&fit=crop&w=2000&q=80",
    alt: "Garra de pátio de sucata recolhendo aço para reciclagem",
  },
};

/* ------------------------------------------------------------------ */
/* 07 · o que fica com a gente                                         */
/* ------------------------------------------------------------------ */

export const PRACTICE_SECTION = {
  eyebrow: "07 · o que fica com a gente",
  headline: "O que a gente faz e o que a gente não afirma.",
  practices: [
    {
      title: "Projeto fechado antes da primeira entrega",
      body: "Os perfis chegam cortados no comprimento do projeto. O que não foi projetado não é comprado.",
    },
    {
      title: "Canteiro sem betoneira",
      body: "Fora da fundação, a obra não mistura argamassa nem espera cura. A água que some do canteiro é a que ia para esses usos.",
    },
    {
      title: "Sucata separada na saída",
      body: "A perda do canteiro é metálica e sai separada para reciclagem, em vez de entrar na caçamba comum.",
    },
    {
      title: "Madeira de floresta plantada",
      body: "O OSB estrutural das paredes externas é feito de pinus de floresta plantada e fica na casa, em vez de virar descarte de fôrma.",
    },
  ],
  honesty: {
    title: "O que a gente não afirma",
    body: "A gente não diz que uma casa em Light Steel Frame emite menos carbono ao longo de 50 anos. O estudo brasileiro que comparou os dois sistemas de ponta a ponta mostra que a operação responde por 50% a 70% do total, e ela depende do projeto. O que a obra a seco muda com número na mão é o que ela extrai, desperdiça e deixa para trás.",
    source: SOURCES.caldas2017,
  },
};
