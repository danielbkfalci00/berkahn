// Dados da seção "05 · impacto" da home. Regra deste arquivo: nenhum número
// entra sem `source`. As fontes não vão para a tela (decisão do Bruno em
// 2026-09-02); ficam aqui como procedência de cada valor.
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

/**
 * Número-herói de uma batida. Conta de `from` até `to` conforme o scroll;
 * `from` é o valor do sistema convencional, para a diferença virar movimento.
 */
export interface ImpactHero {
  from: number;
  to: number;
  /** Só aparece no valor final, ex.: "< ". */
  prefix?: string;
  /** Unidade colada ao número, ex.: "%", " dB". */
  unit: string;
  /** Rótulo em caixa alta, até ~40 caracteres. */
  label: string;
  /** O que era antes, em uma linha curta. */
  compare?: string;
  source: DataSource;
  compareSource?: DataSource;
}

/** Número secundário, em legenda mono pequena. */
export interface ImpactFigure {
  value: string;
  label: string;
  source: DataSource;
}

export interface ImpactBlock {
  id: "morar" | "pagar" | "cidade";
  index: "01" | "02" | "03";
  /** Label técnica minúscula, ex.: "para quem vai morar". */
  audience: string;
  /** Uma linha, até 12 palavras. É todo o texto da batida. */
  claim: string;
  hero: ImpactHero;
  aside: ImpactFigure;
}

export interface ImpactSection {
  eyebrow: string;
  headline: string;
  lede: string;
  ledeSource: DataSource;
  /** Placa de fundo do track. Nunca uma obra que não seja nossa. */
  image: { src: string; alt: string };
  blocks: [ImpactBlock, ImpactBlock, ImpactBlock];
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
    src: "/images/Services/Execução-de-obras/Estrutura/estrutura-2.webp",
    alt: "Interior de casa em Light Steel Frame na fase de fechamento, com montantes, lã de vidro e placas cimentícias",
  },
  blocks: [
    {
      id: "morar",
      index: "01",
      audience: "para quem vai morar",
      claim: "Parede que segura barulho de rua e calor de tarde.",
      hero: {
        from: 0,
        to: 50,
        unit: " dB",
        label: "de isolamento acústico na parede",
        compare: "faixa de 45 a 50 dB; a NBR 15575 pede 45 entre unidades",
        source: SOURCES.berkahnSpec,
      },
      aside: {
        value: "4×",
        label: "menos calor atravessa a parede que no tijolo rebocado",
        source: SOURCES.nbr15220,
      },
    },
    {
      id: "pagar",
      index: "02",
      audience: "para quem paga a obra",
      claim: "Quase tudo que entra no canteiro vira casa.",
      hero: {
        from: 30,
        to: 5,
        prefix: "< ",
        unit: "%",
        label: "de material desperdiçado",
        compare: "a obra convencional perde até 30%",
        source: SOURCES.sinduscon,
      },
      aside: {
        value: "2022",
        label: "norma própria na ABNT, a NBR 16970",
        source: SOURCES.nbr16970,
      },
    },
    {
      id: "cidade",
      index: "03",
      audience: "para o terreno e a cidade",
      claim: "O aço volta para a siderúrgica, não para o entulho.",
      hero: {
        from: 16,
        to: 100,
        unit: "%",
        label: "do aço reciclável sem perder qualidade",
        compare: "do entulho de obra, o Brasil recicla 16%",
        source: SOURCES.worldsteel,
        compareSource: SOURCES.abrecon,
      },
      aside: {
        value: "1,5 t",
        label: "de CO₂ evitada por tonelada de aço reciclado",
        source: SOURCES.worldsteel,
      },
    },
  ],
};

/** Texto final do número-herói, como fica parado. */
export function heroText(hero: ImpactHero): string {
  return `${hero.prefix ?? ""}${hero.to}${hero.unit}`;
}

