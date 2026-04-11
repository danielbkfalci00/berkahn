// Dados para slides "Steel Frame no Mundo" na apresentação executiva
// Fonte: Docs/steel-frame-no-mundo_apresentacao.md

export interface CountryData {
  id: string;
  name: string;
  flag: string;
  metric: string;
  metricValue: number;
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

// ─── Dados dos países ───────────────────────────────────────────

export const COUNTRY_DATA: CountryData[] = [
  {
    id: "uk",
    name: "Reino Unido",
    flag: "🇬🇧",
    metric: "46,7% do mercado estrutural",
    metricValue: 46.7,
    detail: "65-70% em edifícios multi-pavimentos",
    mapPosition: { x: 47, y: 22 },
  },
  {
    id: "jp",
    name: "Japão",
    flag: "🇯🇵",
    metric: "35% de toda construção",
    metricValue: 35,
    detail: "Material nº 1 por valor de construção",
    mapPosition: { x: 85, y: 35 },
  },
  {
    id: "us",
    name: "Estados Unidos",
    flag: "🇺🇸",
    metric: "30-35% edifícios comerciais",
    metricValue: 32.5,
    detail: "US$ 10,9B projetado para 2030",
    mapPosition: { x: 20, y: 35 },
  },
  {
    id: "au",
    name: "Austrália",
    flag: "🇦🇺",
    metric: "13-15% residencial nacional",
    metricValue: 14,
    detail: "Até 30% em algumas regiões",
    mapPosition: { x: 85, y: 72 },
  },
  {
    id: "ar",
    name: "Argentina",
    flag: "🇦🇷",
    metric: "~10% da construção total",
    metricValue: 10,
    detail: "Crescimento de 91% entre 2005-2023",
    mapPosition: { x: 30, y: 75 },
  },
  {
    id: "nz",
    name: "Nova Zelândia",
    flag: "🇳🇿",
    metric: "6-7% do mercado habitacional",
    metricValue: 6.5,
    detail: "Norma NASH Part 2:2019 reconhecida",
    mapPosition: { x: 92, y: 78 },
  },
  {
    id: "ca",
    name: "Canadá",
    flag: "🇨🇦",
    metric: "4,1% do mercado global",
    metricValue: 4.1,
    detail: "US$ 1,96B projetado para 2030",
    mapPosition: { x: 18, y: 22 },
  },
  {
    id: "se",
    name: "Suécia",
    flag: "🇸🇪",
    metric: "84% casas pré-fabricadas",
    metricValue: 84,
    detail: "Referência mundial em industrialização",
    mapPosition: { x: 52, y: 18 },
  },
  {
    id: "cl",
    name: "Chile",
    flag: "🇨🇱",
    metric: "3,0 m²/hab/ano drywall",
    metricValue: 8,
    detail: "Líder LatAm em construção industrializada",
    mapPosition: { x: 27, y: 72 },
  },
  {
    id: "br",
    name: "Brasil",
    flag: "🇧🇷",
    metric: "2,2% do mercado global",
    metricValue: 2.2,
    detail: "27,7% de crescimento LSF em 2023",
    mapPosition: { x: 33, y: 65 },
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

export const SPEED_RECORDS: SpeedRecord[] = [
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
  {
    stat: 13,
    suffix: " meses",
    label: "Empire State Building",
    detail: "102 andares, 57.000t de aço (1931)",
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

// ─── Países para bar chart (ranking por adoção) ────────────────

export const COUNTRY_RANKING = COUNTRY_DATA
  .filter((c) => c.id !== "se") // Suécia é pré-fab, não comparável diretamente
  .sort((a, b) => b.metricValue - a.metricValue);
