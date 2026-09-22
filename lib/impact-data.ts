// Dados da seção de impacto da home. Regra deste arquivo: nenhum número
// entra sem `source`. As fontes não vão para a tela (decisão do Bruno em
// 2026-09-02); ficam aqui como procedência de cada valor.
//
// Procedência de cada valor está documentada em
// Berkahn-Vault/20-context/home-redesign-direcao.md (seção "05 · impacto").
//
// Sem argumento de carbono (decisão do Bruno em 2026-09-22): a página de
// sustentabilidade não o usa, porque o único ACV brasileiro revisado por pares
// dá vantagem à alvenaria no ciclo completo. Saíram a abertura com "34% das
// emissões globais de CO2" e o "1,5 t de CO2 evitada por tonelada reciclada".

export interface DataSource {
  id: string;
  name: string;
  year?: number;
  url?: string;
  /** Como o número foi derivado ou a ressalva que o acompanha. */
  note?: string;
}

/**
 * Número-herói de uma batida, mostrado já no valor final. Não há contador:
 * no meio da conta ele exibia números que não eram de nada ("0 dB", "19%").
 */
export interface ImpactHero {
  to: number;
  /** Ex.: "< ". */
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
  /** Placa de fundo da batida. Nunca uma obra que não seja nossa. */
  image: { src: string; alt: string };
  /** Label técnica minúscula, ex.: "para quem vai morar". */
  audience: string;
  /** Uma linha, até 12 palavras. É todo o texto da batida. */
  claim: string;
  hero: ImpactHero;
  aside?: ImpactFigure;
}

export interface ImpactSection {
  eyebrow: string;
  headline: string;
  lede: string;
  blocks: [ImpactBlock, ImpactBlock, ImpactBlock];
}

export const SOURCES = {
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
    note: "Aço 100% reciclável sem perda de propriedades.",
  },
  abrecon: {
    id: "abrecon",
    name: "ABRECON",
    url: "https://abrecon.org.br",
    note: "Taxa de reciclagem de resíduos de construção e demolição no Brasil, cerca de 16%.",
  },
} as const satisfies Record<string, DataSource>;

export const IMPACT_SECTION: ImpactSection = {
  eyebrow: "Impacto",
  headline: "Construir a seco muda três contas.",
  lede: "Um sistema a seco muda a conta para quem mora, para quem paga e para a cidade.",
  blocks: [
    {
      id: "morar",
      audience: "para quem vai morar",
      image: {
        src: "/images/Services/Execução-de-obras/Acabamentos/acabamentos_1.webp",
        alt: "Pintor aplicando a última demão em parede interna lisa",
      },
      claim: "Parede que segura barulho de rua e calor de tarde.",
      hero: {
        to: 50,
        unit: " dB",
        label: "de isolamento acústico na parede",
        compare: "faixa de 45 a 50 dB na parede especificada",
        source: SOURCES.berkahnSpec,
      },
      aside: {
        value: "4×",
        label: "menos calor atravessa a parede que no tijolo",
        source: SOURCES.nbr15220,
      },
    },
    {
      id: "pagar",
      audience: "para quem paga a obra",
      image: {
        src: "/images/Services/Execução-de-obras/Estrutura/estrutura-2.webp",
        alt: "Interior de casa em Light Steel Frame na fase de fechamento, com montantes, lã de vidro e placas cimentícias",
      },
      claim: "Quase tudo que entra no canteiro vira casa.",
      hero: {
        to: 5,
        prefix: "< ",
        unit: "%",
        label: "de material desperdiçado",
        compare: "a obra convencional perde até 30%",
        source: SOURCES.sinduscon,
      },
      aside: {
        value: "2022",
        label: "norma própria na ABNT (NBR 16970)",
        source: SOURCES.nbr16970,
      },
    },
    {
      id: "cidade",
      audience: "para o terreno e a cidade",
      image: {
        src: "/images/Home/lsf-estrutura.webp",
        alt: "Esqueleto de Light Steel Frame de uma casa montado sobre o radier, com montantes e tesouras de aço galvanizado",
      },
      claim: "O aço volta para a siderúrgica, não para o entulho.",
      hero: {
        to: 100,
        unit: "%",
        label: "do aço reciclável sem perder qualidade",
        compare: "o Brasil recicla 16% do entulho de obra",
        source: SOURCES.worldsteel,
        compareSource: SOURCES.abrecon,
      },
    },
  ],
};


