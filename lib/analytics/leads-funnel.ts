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
 * `desqualificado` existe no CHECK mas fica FORA da soma do funil.
 *
 * Não é uma etapa posterior a `convertido` — é uma saída lateral que pode
 * acontecer a partir de qualquer ponto. Empilhá-la no funil faria a base
 * parecer maior e a conversão, menor.
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
  /** Leads que alcançaram esta etapa ou qualquer posterior. */
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
  desqualificados: number;
  /** Convertidos ÷ total, ignorando desqualificados no denominador. */
  taxaConversao: number;
  porCtaLocation: FatiaOrigem[];
  porPagina: FatiaOrigem[];
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
    if (lead.status === "convertido") atual.convertidos++;
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

  // Funil é cumulativo: quem converteu passou por qualificado. O status guarda
  // só o ponto atual, então cada degrau conta quem está nele ou adiante.
  const degraus: DegrauFunil[] = ETAPAS_FUNIL.map((etapa, i) => {
    const alcancaram = noFunil.filter((l) => indiceEtapa(l.status) >= i).length;
    return { etapa, rotulo: ROTULOS[etapa], alcancaram, fracaoDoTopo: 0, perda: 0 };
  });

  const topo = degraus[0]?.alcancaram ?? 0;
  for (let i = 0; i < degraus.length; i++) {
    degraus[i].fracaoDoTopo = topo > 0 ? degraus[i].alcancaram / topo : 0;
    const anterior = i > 0 ? degraus[i - 1].alcancaram : degraus[i].alcancaram;
    degraus[i].perda = anterior > 0 ? (anterior - degraus[i].alcancaram) / anterior : 0;
  }

  let maiorPerda: FunilLeads["maiorPerda"] = null;
  for (let i = 1; i < degraus.length; i++) {
    if (degraus[i].perda > (maiorPerda?.pct ?? 0)) {
      maiorPerda = {
        de: degraus[i - 1].rotulo,
        para: degraus[i].rotulo,
        pct: degraus[i].perda,
      };
    }
  }

  const convertidos = degraus[degraus.length - 1]?.alcancaram ?? 0;

  return {
    degraus,
    total: todos.length,
    desqualificados,
    taxaConversao: topo > 0 ? convertidos / topo : 0,
    porCtaLocation: agrupar(todos, (l) => l.cta_location),
    porPagina: agrupar(todos, (l) => l.pagina_origem),
    comUtm: todos.filter((l) => l.utm && Object.keys(l.utm).length > 0).length,
    maiorPerda,
  };
}
