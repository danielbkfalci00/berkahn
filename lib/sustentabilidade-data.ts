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
    note: "Quase 50% da extração global de materiais vai para edificações e construção.",
  },
  worldsteel: {
    id: "worldsteel",
    name: "World Steel Association, Steel Facts",
    year: 2025,
    url: "https://worldsteel.org/about-steel/steel-facts/",
    note: "A taxa global de recuperação do aço no fim da vida em construção é de aproximadamente 85%.",
  },
  caldas2017: {
    id: "caldas2017",
    name: "Caldas, Lira, Melo e Sposto, Ambiente Construído",
    year: 2017,
    url: "https://www.scielo.br/j/ac/a/Vvx3PRfpMjqdbdCM35NMgXv/?lang=en",
    note: "A operação responde por 50% a 70% do ciclo completo no estudo brasileiro e a alvenaria apresenta vantagem no resultado total.",
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
  headline: "O sistema da sua casa também decide o que a obra deixa para trás.",
  lede: "No Light Steel Frame, parte desse impacto muda antes de a obra começar. A diferença aparece no projeto, na compra e na forma de montar cada parede.",
  // Provisória, de https://unsplash.com/photos/0dtLWM5ycGc
  image: {
    src: "https://images.unsplash.com/photo-1713700741779-fb0237967302?auto=format&fit=crop&w=2400&q=82",
    alt: "Vista aérea da copa de uma floresta brasileira",
    focus: "object-center",
  } satisfies EditorialImage,
};

export const EXTRACTION_SECTION = {
  headline: "Toda parede começa muito antes do canteiro.",
  lede: "Quando os materiais chegam à obra, eles já atravessaram uma cadeia de extração, processamento e transporte.",
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
    src: "https://images.unsplash.com/photo-1571223641822-b82408a0e705?auto=format&fit=crop&w=2400&q=82",
    alt: "Vista aérea de uma pedreira e das marcas da extração no terreno",
    focus: "object-center",
  } satisfies EditorialImage,
};

export const WALL_SECTION = {
  headline: "No Light Steel Frame, a parede começa no projeto.",
  copy: "A modulação define onde cada perfil e placa entra. Isso organiza a compra e transforma o fechamento em uma sequência de montagem.",
  consequence: "Depois da fundação, a parede dispensa argamassa de assentamento, cura e a lavagem ligada a essas etapas.",
  note: "As camadas do fechamento, da face externa para a interna.",
  sceneAlt: "Recorte visual de seis componentes usados em uma parede de Light Steel Frame",
};

export const WALL_LAYER_COPY = [
  { name: "Base coat" },
  { name: "Placa cimentícia" },
  { name: "Manta hidrófuga" },
  { name: "Lã mineral" },
  { name: "Montantes de aço galvanizado" },
  { name: "Placa de gesso" },
];

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

export const LIFECYCLE_SECTION = {
  headline: "Depois da obra, a parede continua trabalhando.",
  lede: "O uso diário costuma pesar mais no ciclo de vida de uma casa do que o momento da construção.",
  operation: {
    title: "Desempenho durante o uso",
    copy: "Conforto e consumo dependem do conjunto. Orientação solar, aberturas, vedação e isolamento precisam funcionar como um só projeto.",
    figure: {
      value: "50 a 70%",
      label: "do impacto total veio da operação da edificação no estudo brasileiro",
      source: SOURCES.caldas2017,
    } satisfies SourcedFigure,
    image: {
      src: "/images/Residencial/hero-01.webp",
      alt: "Residência contemporânea cercada por árvores e jardins",
      focus: "object-center",
    } satisfies EditorialImage,
  },
  steel: {
    title: "Material que continua em circulação",
    copy: "O aço pode voltar à cadeia produtiva sem perder suas propriedades. Para isso acontecer, a desmontagem e a separação correta continuam essenciais.",
    figure: {
      value: "85%",
      label: "é a taxa global de recuperação do aço no fim da vida em construção",
      source: SOURCES.worldsteel,
    } satisfies SourcedFigure,
    // Provisória, de https://unsplash.com/photos/lp6CBQSr1Ek
    image: {
      src: "https://images.unsplash.com/photo-1722695694560-f452b0919d3a?auto=format&fit=crop&w=2000&q=82",
      alt: "Garra de pátio de sucata recolhendo aço para reciclagem",
      focus: "object-center",
    } satisfies EditorialImage,
  },
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
  honesty: {
    title: "O que a gente não afirma",
    // Exibida riscada. É a frase que o mercado repete e que a Berkahn não
    // assina; ver caldas2017 e o cabeçalho deste arquivo.
    claim: "Uma casa em Light Steel Frame emite menos carbono ao longo de toda a vida.",
    body: "A gente não afirma que uma casa em Light Steel Frame emite menos carbono ao longo de todo o ciclo de vida. No estudo brasileiro que comparou os sistemas, a alvenaria apresentou vantagem no resultado completo.",
    conclusion: "O compromisso que conseguimos demonstrar está no projeto, no uso consciente dos materiais e no destino do que sobra.",
  },
};
