// Dados da seção "05 · impacto" da home. Regra deste arquivo: nenhum número
// entra sem `source`. O rodapé de fontes da seção é derivado daqui por
// `impactSources()`, nunca digitado à mão, para não desviar do dado.
//
// Procedência de cada valor está documentada em
// Berkahn-Vault/20-context/home-redesign-direcao.md (seção "05 · impacto").

export interface DataSource {
  id: string;
  name: string;
  year?: number;
  url?: string;
  /** Como o número foi derivado ou a ressalva que o acompanha. */
  note?: string;
}

export interface ImpactFigure {
  /** Texto do número grande. Até 6 caracteres visíveis. */
  value: string;
  /** Unidade renderizada menor, inline. */
  unit?: string;
  /** Rótulo em caixa alta. Até ~32 caracteres. */
  label: string;
  /** Referência convencional exibida abaixo do rótulo. */
  compare?: string;
  source: DataSource;
  /** Fonte do `compare`, quando é outra. */
  compareSource?: DataSource;
}

export interface ImpactBlock {
  id: "morar" | "pagar" | "cidade";
  index: "01" | "02" | "03";
  /** Label técnica minúscula, ex.: "para quem vai morar". */
  audience: string;
  headline: string;
  body: string;
  figures: [ImpactFigure, ImpactFigure];
}

export interface ImpactSection {
  eyebrow: string;
  headline: string;
  lede: string;
  ledeSource: DataSource;
  image: { src: string; alt: string; caption: string };
  blocks: [ImpactBlock, ImpactBlock, ImpactBlock];
  cta: { label: string; href: string };
}

export const SOURCES = {
  unepGsr2025: {
    id: "unep",
    name: "UNEP, Global Status Report for Buildings and Construction 2024/25",
    year: 2025,
    url: "https://www.unep.org/resources/report/global-status-report-buildings-and-construction-20242025",
    note: "34% das emissões globais de CO₂ do setor de edificações e construção. A edição 2025/26 já registra 37%.",
  },
  berkahnSpec: {
    id: "berkahn",
    name: "Especificação técnica Berkahn (lã mineral 90 mm), ref. ABNT NBR 15575",
    note: "Rw 45–50 dB da parede especificada. A NBR 15575 fixa 45 dB como mínimo entre unidades em parte dos casos.",
  },
  nbr15220: {
    id: "nbr15220",
    name: "ABNT NBR 15220-3 e catálogos de lã de vidro",
    note: "U do LSF 0,38–0,5 W/m²·K derivado de R 2,0–2,6; tijolo rebocado 2,0–2,5. Razão conservadora 2,0/0,5 = 4.",
  },
  sinduscon: {
    id: "sinduscon",
    name: "SINDUSCON-SP e Engenharia Compartilhada",
    note: "2–5% no LSF contra 8–30% na obra convencional, até 40% com retrabalho.",
  },
  nbr16970: {
    id: "nbr16970",
    name: "ABNT NBR 16970",
    year: 2022,
    note: "Norma própria do Light Steel Frame; dispensa avaliação técnica especial (DATec).",
  },
  worldsteel: {
    id: "worldsteel",
    name: "World Steel Association; Instituto Aço Brasil",
    url: "https://worldsteel.org/about-steel/steel-facts/",
    note: "Aço 100% reciclável sem perda de propriedades; cada tonelada de sucata usada evita cerca de 1,5 t de CO₂.",
  },
  abrecon: {
    id: "abrecon",
    name: "ABRECON",
    url: "https://abrecon.org.br",
    note: "Taxa de reciclagem de resíduos de construção e demolição no Brasil, cerca de 16%.",
  },
} as const satisfies Record<string, DataSource>;

export const IMPACT_SECTION: ImpactSection = {
  eyebrow: "05 · impacto",
  headline: "Construir a seco muda três contas.",
  lede: "Edificações e construção respondem por 34% das emissões globais de CO₂. Um sistema a seco muda essa conta para quem mora, quem paga e a cidade.",
  ledeSource: SOURCES.unepGsr2025,
  image: {
    src: "/images/Home/impacto-casa-santa-cristina.webp",
    alt: "Fachada da Casa Santa Cristina, projeto Berkahn em Light Steel Frame",
    caption: "casa santa cristina · jardim paulistano, 2024",
  },
  blocks: [
    {
      id: "morar",
      index: "01",
      audience: "para quem vai morar",
      headline: "O conforto está dentro da parede.",
      body: "Lã mineral no miolo da parede segura barulho de rua e calor de tarde. Sem argamassa nem reboco, a parede sobe seca e a casa fica pronta para morar.",
      figures: [
        {
          value: "45–50",
          unit: "dB",
          label: "de isolamento acústico na parede",
          compare: "a NBR 15575 pede 45 dB entre unidades",
          source: SOURCES.berkahnSpec,
        },
        {
          value: "4×",
          label: "menos calor atravessa a parede",
          compare: "tijolo rebocado, 2,0 a 2,5 W/m²·K",
          source: SOURCES.nbr15220,
        },
      ],
    },
    {
      id: "pagar",
      index: "02",
      audience: "para quem paga a obra",
      headline: "O que você compra vira parede.",
      body: "Perfis chegam cortados de fábrica e quase tudo que entra no canteiro vira casa. Com a NBR 16970, o Light Steel Frame tem norma própria e entra na avaliação dos bancos sem laudo especial.",
      figures: [
        {
          value: "< 5%",
          label: "de material desperdiçado",
          compare: "até 30% na obra convencional",
          source: SOURCES.sinduscon,
        },
        {
          value: "2022",
          label: "norma própria na ABNT",
          compare: "NBR 16970",
          source: SOURCES.nbr16970,
        },
      ],
    },
    {
      id: "cidade",
      index: "03",
      audience: "para o terreno e a cidade",
      headline: "Menos carbono hoje, aço de novo amanhã.",
      body: "Leve, pede menos concreto na fundação. No fim da vida, desmonta com parafuso e volta para a siderúrgica em vez de virar entulho, do qual o Brasil recicla só 16%.",
      figures: [
        {
          value: "100%",
          label: "do aço reciclável sem perder qualidade",
          compare: "entulho reciclado no Brasil, 16%",
          source: SOURCES.worldsteel,
          compareSource: SOURCES.abrecon,
        },
        {
          value: "1,5",
          unit: "t",
          label: "de CO₂ evitada por tonelada de aço reciclado",
          compare: "a estrutura inteira volta para esse ciclo",
          source: SOURCES.worldsteel,
        },
      ],
    },
  ],
  cta: { label: "Por que construção a seco", href: "/lsf" },
};

/**
 * Fontes da seção na ordem em que aparecem (lede, depois cada número e seu
 * compare), sem repetição. O índice na lista (1-based) é o marcador que a
 * interface mostra ao lado de cada número.
 */
export function impactSources(section: ImpactSection): DataSource[] {
  const seen = new Set<string>();
  const ordered: DataSource[] = [];
  const push = (source?: DataSource) => {
    if (!source || seen.has(source.id)) return;
    seen.add(source.id);
    ordered.push(source);
  };

  push(section.ledeSource);
  for (const block of section.blocks) {
    for (const figure of block.figures) {
      push(figure.source);
      push(figure.compareSource);
    }
  }
  return ordered;
}
