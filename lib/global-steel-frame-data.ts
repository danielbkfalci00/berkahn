// Dados para slides "Steel Frame no Mundo" na apresentação executiva
// Fonte principal: Docs/steel-frame-no-mundo_apresentacao.md
// Fontes secundárias: Grand View Research, Fortune Business Insights, IMARC,
// IBGE (2025), CBCA (2024), Sinduscon-SP, McKinsey, ABCEM, BCSA, AISI, BlueScope.

// Tipo de métrica usada para cada país — explicita a diferença entre "% estrutural",
// "% residencial", "% total", etc. Evita comparações enganosas no bar chart.
export type MetricType =
  | "estrutural"   // % do mercado estrutural (UK)
  | "total"        // % da construção total (Japão, Argentina)
  | "comercial"    // % dos edifícios comerciais (EUA)
  | "residencial"  // % da construção residencial (Austrália, NZ)
  | "pré-fab"      // % de casas pré-fabricadas (Suécia)
  | "global"       // % do mercado global LGSF (Canadá, Brasil)
  | "proxy";       // proxy (Chile — m² drywall/hab/ano)

export interface CountryData {
  id: string;
  name: string;
  flag: string;
  metric: string;
  metricValue: number;
  metricType: MetricType;
  metricLabel: string;   // label curto para badge no bar chart
  detail: string;
  /** Posição no mapa SVG (percentual) */
  mapPosition: { x: number; y: number };
}

export interface RegionalShare {
  name: string;
  value: number;
  color: string;
}

export interface SpeedRecord {
  stat: number;
  suffix: string;
  prefix?: string;
  label: string;
  detail: string;
  image?: string;       // path para imagem de fundo do card (F2)
  imageCredit?: string; // atribuição CC/autor da imagem
}

export interface SustainabilityStat {
  icon: string;
  stat: number;
  suffix: string;
  label: string;
}

export interface BrazilMarketYear {
  year: number;
  revenue: number; // R$ bilhões
}

export interface TopCompany {
  name: string;
  country: string;
  flag: string;
  share?: string;       // "~8% market share" quando disponível
  note?: string;        // contexto adicional
  logo?: string;        // path para logo WebP (F2)
}

export interface StrikingFact {
  stat: string;         // "81%" ou "170+ mph"
  title: string;        // título curto
  detail: string;       // descrição
  source: string;       // fonte curta
}

export interface BrazilFact {
  value: string;        // "2020", "107.600", "30%"
  label: string;        // descrição curta
  detail: string;       // contexto
}

export interface BrazilCompany {
  name: string;
  highlight: string;    // ex: "40+ lojas, 2M m² projetados"
  detail: string;
  image?: string;       // path para imagem opcional
}

// ─── Dados dos países (com metricType para Solução B) ──────────

export const COUNTRY_DATA: CountryData[] = [
  {
    id: "se",
    name: "Suécia",
    flag: "🇸🇪",
    metric: "84% casas pré-fabricadas",
    metricValue: 84,
    metricType: "pré-fab",
    metricLabel: "pré-fabricado",
    detail: "Referência mundial em industrialização",
    mapPosition: { x: 52, y: 18 },
  },
  {
    id: "uk",
    name: "Reino Unido",
    flag: "🇬🇧",
    metric: "46,7% do mercado estrutural",
    metricValue: 46.7,
    metricType: "estrutural",
    metricLabel: "estrutural",
    detail: "65-70% em edifícios multi-pavimentos",
    mapPosition: { x: 47, y: 22 },
  },
  {
    id: "jp",
    name: "Japão",
    flag: "🇯🇵",
    metric: "35% de toda construção",
    metricValue: 35,
    metricType: "total",
    metricLabel: "total",
    detail: "Material nº 1 por valor de construção",
    mapPosition: { x: 85, y: 35 },
  },
  {
    id: "us",
    name: "Estados Unidos",
    flag: "🇺🇸",
    metric: "30-35% edifícios comerciais",
    metricValue: 32.5,
    metricType: "comercial",
    metricLabel: "comercial",
    detail: "US$ 10,9B projetado para 2030",
    mapPosition: { x: 20, y: 35 },
  },
  {
    id: "au",
    name: "Austrália",
    flag: "🇦🇺",
    metric: "13-15% residencial nacional",
    metricValue: 14,
    metricType: "residencial",
    metricLabel: "residencial",
    detail: "Até 30% em algumas regiões",
    mapPosition: { x: 85, y: 72 },
  },
  {
    id: "ar",
    name: "Argentina",
    flag: "🇦🇷",
    metric: "~10% da construção total",
    metricValue: 10,
    metricType: "total",
    metricLabel: "total",
    detail: "Crescimento de 91% entre 2005-2023",
    mapPosition: { x: 30, y: 75 },
  },
  {
    id: "cl",
    name: "Chile",
    flag: "🇨🇱",
    metric: "3,0 m²/hab/ano drywall",
    metricValue: 8,
    metricType: "proxy",
    metricLabel: "proxy drywall",
    detail: "Líder LatAm em construção industrializada",
    mapPosition: { x: 27, y: 72 },
  },
  {
    id: "nz",
    name: "Nova Zelândia",
    flag: "🇳🇿",
    metric: "6-7% do mercado habitacional",
    metricValue: 6.5,
    metricType: "residencial",
    metricLabel: "residencial",
    detail: "Norma NASH Part 2:2019 reconhecida",
    mapPosition: { x: 92, y: 78 },
  },
  {
    id: "ca",
    name: "Canadá",
    flag: "🇨🇦",
    metric: "4,1% do mercado global",
    metricValue: 4.1,
    metricType: "global",
    metricLabel: "share global",
    detail: "US$ 1,96B projetado para 2030",
    mapPosition: { x: 18, y: 22 },
  },
  {
    id: "br",
    name: "Brasil",
    flag: "🇧🇷",
    metric: "2,2% do mercado global",
    metricValue: 2.2,
    metricType: "global",
    metricLabel: "share global",
    detail: "27,7% de crescimento LSF em 2023",
    mapPosition: { x: 33, y: 65 },
  },
];

// ─── Top 5 empresas do mercado global (~28% combined) ──────────

export const TOP_COMPANIES: TopCompany[] = [
  {
    name: "BlueScope Steel",
    country: "Austrália",
    flag: "🇦🇺",
    share: "~8%",
    note: "Líder global; marca TRUECORE®",
    logo: "/images/apresentacao/empresas-globais/bluescope.webp",
  },
  {
    name: "Nakayama Steel Works",
    country: "Japão",
    flag: "🇯🇵",
    note: "Referência no mercado japonês",
  },
  {
    name: "ClarkDietrich",
    country: "Estados Unidos",
    flag: "🇺🇸",
    note: "Maior fabricante CFS dos EUA",
    logo: "/images/apresentacao/empresas-globais/clarkdietrich.webp",
  },
  {
    name: "Jinggong Steel",
    country: "China",
    flag: "🇨🇳",
    note: "Estruturas em aço de grande porte",
  },
  {
    name: "Honglu Steel",
    country: "China",
    flag: "🇨🇳",
    note: "Fabricante líder na Ásia",
  },
];

// ─── Shares regionais (donut chart) ─────────────────────────────

export const REGIONAL_SHARES: RegionalShare[] = [
  { name: "Ásia-Pacífico", value: 45, color: "#FFFFFF" },
  { name: "América do Norte", value: 25.1, color: "#AAAAAA" },
  { name: "Europa", value: 19, color: "#666666" },
  { name: "Outros", value: 10.9, color: "#444444" },
];

// ─── Mercado global ─────────────────────────────────────────────

export const MARKET_SIZE = {
  current: 37.27,
  projected: 52.7,
  cagr: 5.1,
  yearCurrent: 2023,
  yearProjected: 2030,
};

// ─── Recordes de velocidade ─────────────────────────────────────

// Ordenados narrativa e visualmente (com imagens primeiro, sem imagem depois)
export const SPEED_RECORDS: SpeedRecord[] = [
  {
    stat: 13,
    suffix: " meses",
    label: "Empire State Building",
    detail: "102 andares, 57.000t de aço (1931) — Nova York",
    image: "/images/apresentacao/recordes-globais/empire-state.webp",
    imageCredit: "dllu / Wikimedia Commons (CC BY-SA 4.0)",
  },
  {
    stat: 442,
    suffix: " m",
    label: "Willis Tower",
    detail: "Edifício em aço mais alto — 108 andares, 78.000t (Chicago, 1974)",
    image: "/images/apresentacao/recordes-globais/willis-tower.webp",
    imageCredit: "Wikimedia Commons (CC BY-SA 3.0)",
  },
  {
    stat: 42,
    suffix: " mil t",
    label: "Bird's Nest",
    detail: "Maior estrutura em aço do mundo — Pequim 2008",
    image: "/images/apresentacao/recordes-globais/birds-nest.webp",
    imageCredit: "Wikimedia Commons (CC BY-SA 3.0)",
  },
  {
    stat: 10,
    suffix: " andares",
    label: "em 28h45min",
    detail: "Broad Group, China (2021)",
  },
  {
    stat: 57,
    suffix: " andares",
    label: "em 19 dias",
    detail: "Mini Sky City, China (2015)",
  },
];

// ─── Fatos Marcantes (cards de credibilidade no Slide B) ──────

export const STRIKING_FACTS: StrikingFact[] = [
  {
    stat: "81%",
    title: "Paredes interiores comerciais nos EUA",
    detail: "das paredes internas em edifícios comerciais americanos usam cold-formed steel",
    source: "AISI / SFIA",
  },
  {
    stat: "94-98%",
    title: "Galpões industriais no Reino Unido",
    detail: "dominância absoluta do aço estrutural em construções industriais",
    source: "BCSA",
  },
  {
    stat: "18",
    title: "Países europeus",
    detail: "com códigos de construção que contemplam ou favorecem estruturas em aço",
    source: "Eurocode / CEN",
  },
  {
    stat: "170+ mph",
    title: "Resistência a furacões",
    detail: "casas em steel frame sobrevivem a ventos de furacões categoria 5 nos EUA",
    source: "IBHS / pós-Ian 2022",
  },
  {
    stat: "10-25%",
    title: "Desconto em seguros",
    detail: "seguradoras americanas oferecem descontos para casas steel frame não combustíveis",
    source: "III / State Farm",
  },
];

// ─── Sustentabilidade ───────────────────────────────────────────

export const SUSTAINABILITY_STATS: SustainabilityStat[] = [
  { icon: "recycle", stat: 100, suffix: "%", label: "Aço reciclável infinitamente" },
  { icon: "droplets", stat: 90, suffix: "%", label: "Menos água na obra" },
  { icon: "trash-2", stat: 90, suffix: "%", label: "Menos resíduos" },
];

// ─── Brasil: mix de construção (donut gap) ──────────────────────

export const BRAZIL_CONSTRUCTION_MIX = [
  { name: "Alvenaria Tradicional", value: 88.2, color: "#333333" },
  { name: "Steel Frame (LSF)", value: 2.2, color: "#10B981" },
  { name: "Outros Sistemas", value: 9.6, color: "#666666" },
];

// ─── Brasil: crescimento do mercado ─────────────────────────────

export const BRAZIL_MARKET_GROWTH: BrazilMarketYear[] = [
  { year: 2019, revenue: 7.1 },
  { year: 2020, revenue: 8.5 },
  { year: 2021, revenue: 11.2 },
  { year: 2022, revenue: 14.0 },
  { year: 2023, revenue: 17.2 },
];

// ─── Brasil: fatos e marcos ─────────────────────────────────────

export const BRAZIL_FACTS: BrazilFact[] = [
  {
    value: "2020",
    label: "NBR 15253 reconhecida",
    detail: "Norma técnica ABNT que finalmente legitimou o LSF para financiamento bancário",
  },
  {
    value: "107.600 t",
    label: "Produção LSF em 2023",
    detail: "+27,7% vs 2022 — dado CBCA (base 2023)",
  },
  {
    value: "30%",
    label: "Desperdício em obras artesanais",
    detail: "método tradicional desperdiça pelo menos 30% dos materiais",
  },
  {
    value: "~60%",
    label: "Crescimento LSF últimos anos",
    detail: "uso de steel frame no Brasil segundo a ABCEM",
  },
];

// ─── Brasil: empresas referência nacionais ─────────────────────

export const BRAZIL_COMPANIES: BrazilCompany[] = [
  {
    name: "Espaço Smart",
    highlight: "40+ lojas, 2M m² projetados",
    detail: "Rede nacional de construção industrializada em steel frame",
  },
  {
    name: "Innova Steel",
    highlight: "570.000+ m² executados, +117% em 2023-2024",
    detail: "Crescimento mais que dobrou — sinal de inflexão do mercado",
  },
];

// ─── Produtividade: comparação chocante McKinsey ───────────────

export const MCKINSEY_INSIGHT = {
  quote: "A produtividade da construção brasileira está abaixo de Zâmbia e Argentina",
  source: "McKinsey & Company",
};

// ─── Países para bar chart (ranking por adoção) ────────────────
// IMPORTANTE: As métricas NÃO são homogêneas (Solução B — tags de contexto).
// Cada barra mostra seu metricLabel para explicitar o tipo de medição.

export const COUNTRY_RANKING = [...COUNTRY_DATA].sort((a, b) => b.metricValue - a.metricValue);

// ─── Fontes/atribuição por slide ───────────────────────────────

export const SLIDE_SOURCES = {
  overview: "Fontes: Grand View Research, Fortune Business Insights, IMARC Group, MarketsandMarkets",
  leaders: "Fontes: BCSA, AISI, MBIE, HIA, BlueScope Steel, ABCEM, Eurocode",
  brazil: "Fontes: IBGE (2025), CBCA (2024), Sinduscon-SP, McKinsey & Company, ABCEM, ABNT",
};
