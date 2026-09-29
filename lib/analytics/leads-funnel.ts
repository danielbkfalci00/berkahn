// Derivação do funil de leads e da atribuição por origem.
//
// Módulo puro, sem I/O — exercitado por scripts/analytics/testar-heatmaps.mjs.

/** Estados do CHECK em supabase/migrations/024_leads_crm_supabase.sql:43. */
export const ETAPAS_FUNIL = [
  "novo",
  "em_contato",
  "qualificado",
  "proposta_enviada",
  "convertido",
] as const;
export type EtapaFunil = (typeof ETAPAS_FUNIL)[number];

/**
 * Desqualificação é uma saída lateral. Continua no denominador de recebidos;
 * status atual não prova que o lead passou por todas as etapas anteriores.
 */
export const ETAPA_SAIDA = "desqualificado";

export interface LeadParaFunil {
  status: string;
  canal: string | null;
  segmento: string | null;
  cta_location: string | null;
  pagina_origem: string | null;
  post_id: string | null;
  utm: Record<string, unknown> | null;
  criado_em: string | null;
  qualificado_em: string | null;
  convertido_em: string | null;
}

export interface DegrauFunil {
  etapa: EtapaFunil;
  rotulo: string;
  /** Recebidos no primeiro degrau; estoque atual em cada estado nos demais. */
  alcancaram: number;
  /** Fração sobre o topo do funil (0..1). */
  fracaoDoTopo: number;
  /** Perda relativa em relação ao degrau anterior (0..1). */
  perda: number;
}

export interface FatiaOrigem {
  rotulo: string;
  total: number;
  convertidos: number;
}

export interface FunilLeads {
  degraus: DegrauFunil[];
  total: number;
  novos: number;
  qualificados: number;
  convertidos: number;
  desqualificados: number;
  /** Leads com conversão registrada ÷ total recebido elegível. */
  taxaConversao: number;
  porCtaLocation: FatiaOrigem[];
  porPagina: FatiaOrigem[];
  porCanal: FatiaOrigem[];
  /** Quantos leads têm UTM — só existe para quem aceitou todos os cookies. */
  comUtm: number;
  /** Maior degrau de perda, para o resumo em texto. */
  maiorPerda: { de: string; para: string; pct: number } | null;
}

const ROTULOS: Record<EtapaFunil, string> = {
  novo: "Recebidos",
  em_contato: "Em contato",
  qualificado: "Qualificados",
  proposta_enviada: "Proposta enviada",
  convertido: "Convertidos",
};

/** Índice da etapa; -1 para status desconhecido ou de saída. */
function indiceEtapa(status: string): number {
  return (ETAPAS_FUNIL as readonly string[]).indexOf(status);
}

function agrupar(
  leads: LeadParaFunil[],
  chave: (l: LeadParaFunil) => string | null,
  limite = 8
): FatiaOrigem[] {
  const mapa = new Map<string, { total: number; convertidos: number }>();
  for (const lead of leads) {
    const bruto = chave(lead);
    if (!bruto) continue;
    const atual = mapa.get(bruto) ?? { total: 0, convertidos: 0 };
    atual.total++;
    if (lead.convertido_em || lead.status === "convertido") atual.convertidos++;
    mapa.set(bruto, atual);
  }
  return Array.from(mapa.entries())
    .map(([rotulo, v]) => ({ rotulo, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limite);
}

export function construirFunilLeads(leads: LeadParaFunil[] | undefined): FunilLeads {
  const todos = leads ?? [];
  const desqualificados = todos.filter((l) => l.status === ETAPA_SAIDA).length;
  const noFunil = todos.filter((l) => indiceEtapa(l.status) >= 0);

  // Sem eventos de transição não inferimos progressão. Os demais degraus
  // mostram a distribuição atual da coorte, não etapas obrigatórias percorridas.
  const degraus: DegrauFunil[] = ETAPAS_FUNIL.map((etapa, i) => {
    const alcancaram = i === 0 ? todos.length : noFunil.filter((l) => l.status === etapa).length;
    return { etapa, rotulo: ROTULOS[etapa], alcancaram, fracaoDoTopo: 0, perda: 0 };
  });

  const topo = degraus[0]?.alcancaram ?? 0;
  for (let i = 0; i < degraus.length; i++) {
    degraus[i].fracaoDoTopo = topo > 0 ? degraus[i].alcancaram / topo : 0;
    degraus[i].perda = 0;
  }

  const convertidos = todos.filter((lead) => lead.convertido_em || lead.status === "convertido").length;

  return {
    degraus,
    total: todos.length,
    novos: todos.filter((lead) => lead.status === "novo").length,
    qualificados: todos.filter((lead) => lead.qualificado_em).length,
    convertidos,
    desqualificados,
    taxaConversao: topo > 0 ? convertidos / topo : 0,
    porCtaLocation: agrupar(todos, (l) => l.cta_location),
    porPagina: agrupar(todos, (l) => l.pagina_origem),
    porCanal: agrupar(todos, (l) => l.canal),
    comUtm: todos.filter((l) => l.utm && Object.keys(l.utm).length > 0).length,
    maiorPerda: null,
  };
}
