// Dados da página /sustentabilidade. Regra herdada de lib/impact-data.ts:
// nenhum número entra sem `source`, e nenhuma fonte fica declarada sem estar
// amarrada a um número. As fontes não vão para a tela (decisão do Bruno em
// 2026-09-02), ficam aqui como procedência auditável.
//
// Decisões de apuração que moldaram esta página, registradas em
// Berkahn-Vault/20-context/home-redesign-direcao.md:
//
// 1. NENHUM kgCO₂/m². Os três valores que o site já publicou (180,41 · 15,39 ·
//    119-142) são incompatíveis entre si e nenhum resiste a checagem. Pior: o
//    único ACV brasileiro revisado por pares que compara os dois sistemas de
//    berço ao túmulo (Caldas et al., 2017) conclui a favor da ALVENARIA, porque
//    a fase de operação domina. A seção 07 declara isso em vez de esconder.
// 2. ÁGUA entra, mas como água de canteiro medida, com a faixa na tela e a
//    fundação ressalvada. O par "5 L/m² contra 500 L/m²" que circula no site
//    vem de compilação comercial e continua fora.
// 3. NADA DE PUBLICAR SÓ O TOPO DA FAIXA. Onde a fonte descreve faixa, a tela
//    mostra faixa (7% a 8% do cimento, 107 a 594 L/m² de água). O leitor que
//    percebe o viés em um número deixa de acreditar nos outros sete.
// 4. NÚMEROS COMPARTILHADOS COM A HOME vêm do registro da home, importado
//    abaixo, para o site não publicar dois valores para a mesma coisa.

import type { DataSource } from "@/lib/impact-data";
import { SOURCES as HOME_SOURCES } from "@/lib/impact-data";

export const SOURCES = {
  unepGsr2026: {
    id: "unep2026",
    name: "UNEP e GlobalABC, Global Status Report for Buildings and Construction 2025-2026",
    year: 2026,
    url: "https://zenodo.org/records/20316373",
    note: "Quase 50% da extração global de materiais vai para edificações e construção. O relatório também registra 37% das emissões globais de CO₂, número que a página NÃO usa: o escopo inclui a operação do edifício, que a seção 07 admite dominar, e a home já publica os 34% da edição anterior.",
  },
  gcca: {
    id: "gcca",
    name: "Global Cement and Concrete Association; Chatham House, Making Concrete Change (Lehne e Preston)",
    year: 2025,
    url: "https://gccassociation.org/",
    note: "A indústria declara cerca de 7%; o estudo mais citado (Chatham House, 2018) fala em 8%. A faixa de 7% a 8% é a leitura honesta e é ela que vai para a tela.",
  },
  unepSand: {
    id: "unepsand",
    name: "UNEP, Sand and Sustainability",
    year: 2022,
    url: "https://www.unep.org/resources/report/sand-and-sustainability-10-strategic-recommendations-avert-crisis",
    note: "50 bilhões de toneladas de areia E CASCALHO por ano, não de areia sozinha. Segundo material mais extraído depois da água. Segunda edição de 2022, mantida na terceira.",
  },
  aguaCanteiro: {
    id: "agua-canteiro",
    name: "Mergener, Kalbusch, Henning e Ravizza, Ambiente Construído (ANTAC/UFRGS), v. 25",
    year: 2025,
    url: "https://www.scielo.br/j/ac/a/4RzgT64CJp3gK79p9XXVfxN/?lang=pt",
    note: "Canteiros convencionais medidos em Joinville: média de 0,2633 m³/m² (263 L/m²), faixa de 107 a 594 L/m². É água DE CANTEIRO (cura, argamassa, limpeza, uso humano), não água embutida na fabricação dos materiais. A cidade e a faixa vão para a tela junto com a média.",
  },
  abreconPesquisa: {
    id: "abrecon-usp",
    name: "ABRECON; Angulo, Oliveira e Machado, Pesquisa Setorial ABRECON (EDUSP)",
    year: 2022,
    url: "https://www.livrosabertos.abcd.usp.br/portaldelivrosUSP/catalog/book/839",
    note: "A pesquisa setorial mede de 15% a 20% de reciclagem de resíduo de construção e demolição ao longo de oito anos, com as usinas operando a 50% da capacidade instalada. A tela publica os 16% que a home já usa (SOURCES.abrecon de lib/impact-data.ts), valor dentro dessa faixa, para o site não ter dois números.",
  },
  madeiraFormas: {
    id: "madeira-formas",
    name: "Oliveira, Moraes, Orlandini, Possan e Punhagui, Mix Sustentável (UFSC), v. 8 n. 4",
    year: 2022,
    url: "https://ojs.sites.ufsc.br/index.php/mixsustentavel/article/download/5173/4724",
    note: "4,2 a 7,6 m³ de madeira por 100 m² em fôrma e escoramento de concreto armado moldado in loco, em obras térreas de Foz do Iguaçu. Nos casos medidos, toda a madeira foi para aterro. Os autores dizem que o número é subestimado.",
  },
  madeiraEntac: {
    id: "madeira-entac",
    name: "Oliveira, Pinto, Moraes e Punhagui (UNILA), ENTAC 2022",
    year: 2022,
    url: "https://eventos.antac.org.br/index.php/entac/article/view/1977",
    note: "Nas obras estudadas, os jogos de fôrma serviram de 2 a 3 vezes antes do descarte. Estudo diferente do da UFSC; a página atribui cada frase ao seu, sem fundir os dois numa apuração só.",
  },
  osbPinus: {
    id: "osb-pinus",
    name: "Catálogo técnico de fabricante de OSB no Brasil (LP Brasil, Ponta Grossa)",
    year: 2024,
    url: "https://lpbrasil.com.br/",
    note: "OSB produzido com tiras de pinus de floresta plantada. Declaração de fabricante. NÃO confirmada certificação FSC nem CERFLOR; enquanto o certificado do nosso fornecedor não estiver em mãos, a tela diz 'floresta plantada' e nunca nomeia selo.",
  },
  worldsteel: {
    id: "worldsteel",
    name: "World Steel Association; SteelConstruction.info",
    year: 2025,
    url: "https://worldsteel.org/about-steel/raw-materials/",
    note: "Aço reciclável sem perda de propriedades. Cada tonelada de sucata evita cerca de 1,5 t de CO₂, 1,4 t de minério, 740 kg de carvão e 120 kg de calcário. Taxa mundial de reciclagem de fim de vida na ordem de 85%; é média global do material, e a tela diz isso em vez de prometer o número para uma casa específica.",
  },
  caldas2017: {
    id: "caldas2017",
    name: "Caldas, Lira, Melo e Sposto, Ambiente Construído",
    year: 2017,
    url: "https://www.scielo.br/j/ac/a/Vvx3PRfpMjqdbdCM35NMgXv/?lang=en",
    note: "ACV de 50 anos de habitação em Brasília. Na fase de construção o Light Steel Frame leva vantagem (0,32 contra 0,38 tCO₂eq/m²), mas no ciclo completo a alvenaria sai na frente (1,16-1,76 contra 1,17-1,91), porque a operação responde por 50% a 70% do total. É a fonte da ressalva da seção 07, que declara a conclusão desfavorável.",
  },
} as const satisfies Record<string, DataSource>;

/** Número grande da página. `from`/`to` ligam o numeral ao scroll. */
export interface BigNumber {
  value: string;
  from?: number;
  to?: number;
  prefix?: string;
  unit?: string;
  /** Rótulo curto, até ~48 caracteres. */
  label: string;
  source: DataSource;
}

/* ------------------------------------------------------------------ */
/* 00 · abertura                                                       */
/* ------------------------------------------------------------------ */

export const HERO = {
  eyebrow: "sustentabilidade",
  headline: "Toda casa cobra alguma coisa do mundo antes de existir.",
  lede: "Essa conta corre fora do orçamento, no rio de onde saiu a areia e na caçamba que deixa o canteiro.",
  // Era mata com névoa: a imagem mais genérica que existe para sustentabilidade,
  // e a única não documental de uma página onde todo o resto é planta de
  // cimento, esteira, solo rachado, fôrma e pátio de sucata. A cava de areia
  // ainda casa com a lede, que fala do rio de onde saiu a areia.
  image: {
    src: "https://images.unsplash.com/photo-1785791516569-07a837fb07b7?auto=format&fit=crop&w=2400&q=80",
    alt: "Pilha de areia e correia transportadora num pátio de extração, ao fim da tarde",
  },
};

/* ------------------------------------------------------------------ */
/* 01 · o tamanho da conta                                             */
/* ------------------------------------------------------------------ */

export const SCALE_SECTION = {
  eyebrow: "01 · a escala",
  headline: "Edificações e construção consomem quase metade dos materiais que o mundo extrai.",
  /** Índice das contas. É a navegação da página, não enfeite. */
  index: [
    { href: "#extracao", label: "o que a obra arranca" },
    { href: "#madeira", label: "a conta da madeira" },
    { href: "#parede", label: "a parede" },
    { href: "#sobra", label: "o que sobra" },
    { href: "#ciclo", label: "o aço volta" },
    { href: "#pratica", label: "o que a gente não afirma" },
  ],
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
  ] as BigNumber[],
};

/* ------------------------------------------------------------------ */
/* 02 · o que a obra arranca (três batidas no track horizontal)        */
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
        // Sem from/to de propósito: a fonte descreve faixa, então o numeral é
        // a faixa e não conta. Publicar só o 8 seria escolher o topo.
        value: "7 a 8",
        unit: "%",
        label: "das emissões globais de CO₂ vêm do cimento",
        source: SOURCES.gcca,
      },
      claim: "Uma parte vem da queima do forno. A outra vem da calcinação do calcário, e essa não tem volta. Concreto endurecido nunca volta a ser cimento.",
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
        label: "de toneladas de areia e cascalho por ano, o material mais extraído depois da água",
        source: SOURCES.unepSand,
      },
      claim: "O grão do deserto é liso demais para travar no concreto. Por isso a extração cai sobre rios, e não sobre o Saara.",
      image: {
        src: "https://images.unsplash.com/photo-1750071443772-20299e110b42?auto=format&fit=crop&w=2400&q=80",
        alt: "Barrancos erodidos e terreno arenoso exposto pela extração",
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
        label: "de água por m², na média dos canteiros de Joinville",
        source: SOURCES.aguaCanteiro,
      },
      claim: "A faixa medida foi de 107 a 594 litros por m². A montagem a seco tira dali a argamassa, a cura e a lavagem. Não tira a fundação.",
      image: {
        src: "https://images.unsplash.com/photo-1761477066641-b66ba2c1148c?auto=format&fit=crop&w=2400&q=80",
        alt: "Leito de rio seco com o solo rachado",
      },
      focus: "object-[50%_50%]",
    },
  ] as ExtractionBeat[],
};

/* ------------------------------------------------------------------ */
/* 03 · a conta da madeira                                             */
/* ------------------------------------------------------------------ */

export const FOREST_SECTION = {
  eyebrow: "03 · a madeira",
  headline: "A fôrma é madeira que a obra compra para jogar fora.",
  copy: "E a fundação pede fôrma. Ela não vira parede nem laje, e não fica na casa. Nas obras medidas, toda ela terminou em aterro.",
  closing: "A madeira que a gente compra é OSB estrutural de pinus de floresta plantada, e ela fica na casa.",
  closingSource: SOURCES.osbPinus,
  figures: [
    {
      value: "7,6",
      unit: " m³",
      label: "de madeira por 100 m², só em fôrma",
      source: SOURCES.madeiraFormas,
    },
    {
      value: "2 a 3",
      label: "usos antes de a fôrma virar descarte",
      source: SOURCES.madeiraEntac,
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
  caption: "tudo nesta foto vira caçamba",
};

/* ------------------------------------------------------------------ */
/* 04 · a parede (corte em profundidade)                               */
/* ------------------------------------------------------------------ */

export const WALL_SECTION = {
  eyebrow: "04 · a parede",
  headline: "A parede sobe parafusada, camada por camada.",
  copy: "Cada camada de uma parede em Light Steel Frame chega cortada de fábrica. Só o acabamento externo ainda espera secar.",
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
  eyebrow: "05 · a perda",
  headline: "O entulho que a obra gera quase não volta.",
  copy: "As usinas de reciclagem de entulho no Brasil operam na metade da capacidade instalada. O que elas não recebem vai para aterro.",
  closing: "A sucata metálica tem comprador. O entulho misto não tem.",
  columns: [
    {
      id: "convencional",
      label: "obra convencional",
      value: 30,
      prefix: "até ",
      unit: "%",
      note: "do material comprado vira perda",
      source: HOME_SOURCES.sinduscon,
    },
    {
      id: "seco",
      label: "canteiro a seco",
      value: 5,
      prefix: "< ",
      unit: "%",
      note: "de perda, na maior parte sucata metálica",
      source: HOME_SOURCES.sinduscon,
    },
  ],
  recycling: {
    value: "16",
    from: 0,
    to: 16,
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

export interface LoopStation {
  id: string;
  label: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  dy: number;
}

export const LOOP_SECTION = {
  eyebrow: "06 · o aço",
  headline: "No fim da vida, a estrutura desmonta e volta para a siderúrgica.",
  copy: "O aço volta ao forno sem perder propriedade, quantas vezes for. O concreto demolido, no máximo, vira agregado de sub-base.",
  /**
   * Estações do circuito. A posição vem junto do rótulo de propósito: quando
   * coordenada e texto moram em arrays separados, quem edita o conteúdo aqui
   * quebra o desenho lá. `x`/`y` são coordenadas do viewBox do SteelLoop e
   * precisam cair sobre o traçado; `dy` afasta o rótulo do traço.
   */
  stations: [
    { id: "bobina", label: "bobina de aço", x: 60, y: 40, anchor: "start", dy: -18 },
    { id: "perfil", label: "perfil cortado", x: 400, y: 40, anchor: "middle", dy: -18 },
    // Ancorado para dentro: com o rótulo terminando na própria linha, a última
    // letra passava da borda do viewBox e saía cortada.
    { id: "casa", label: "casa em pé", x: 724, y: 140, anchor: "end", dy: -10 },
    { id: "desmonte", label: "desmonte por parafuso", x: 400, y: 240, anchor: "middle", dy: 30 },
    { id: "forno", label: "forno", x: 60, y: 240, anchor: "start", dy: 30 },
  ] as LoopStation[],
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
      label: "do aço no mundo volta ao ciclo no fim da vida",
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
  eyebrow: "07 · a prática",
  headline: "O que a gente faz no canteiro.",
  practices: [
    {
      title: "Projeto fechado antes de comprar",
      body: "Os perfis chegam cortados no comprimento do projeto. O que não projetamos não entra na nota.",
    },
    {
      title: "Canteiro sem betoneira",
      body: "Fora da fundação, não entra betoneira na obra. A água que some do canteiro é a que ia para argamassa, cura e lavagem.",
    },
    {
      title: "Sucata separada na saída",
      body: "Separamos a perda metálica na saída da obra e mandamos para reciclagem, em vez da caçamba comum.",
    },
  ],
  honesty: {
    title: "O que a gente não afirma",
    body: "A gente não diz que uma casa em Light Steel Frame emite menos carbono ao longo de 50 anos. O estudo brasileiro que comparou os dois sistemas de ponta a ponta encontrou vantagem da alvenaria no ciclo completo, porque a operação responde por 50% a 70% do total e depende do projeto e do envelope térmico tanto quanto do sistema. O que a obra a seco muda é o que ela extrai, desperdiça e deixa para trás.",
    source: SOURCES.caldas2017,
  },
};
