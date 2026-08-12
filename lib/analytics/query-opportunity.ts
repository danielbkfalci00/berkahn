// Quadrante de oportunidade de query: onde o Google já entrega audiência e o
// clique não vem.
//
// Módulo puro, sem I/O — exercitado por scripts/analytics/testar-oportunidade.mjs.

import type { GscQuery } from "@/types/analytics";

/**
 * Faixa de posição que caracteriza "quase lá".
 *
 * Acima de 5 o título já ganha o clique quando é bom. Abaixo de 15 o usuário
 * raramente chega. Entre os dois está o que se corrige reescrevendo title e
 * meta description, sem escrever artigo novo.
 */
export const POSICAO_MIN = 5;
export const POSICAO_MAX = 15;

/** Impressões mínimas para a query valer uma decisão. */
export const IMPRESSOES_MIN = 10;

/** CTR (0-100) abaixo do qual a query está deixando clique na mesa. */
export const CTR_ALVO = 2;

export interface QueryOportunidade extends GscQuery {
  /** Cliques/mês estimados se o CTR subisse para CTR_ALVO. */
  ganhoEstimado: number;
}

export interface MapaOportunidade {
  /** Queries no quadrante, da maior impressão para a menor. */
  oportunidades: QueryOportunidade[];
  /** Todas as queries elegíveis a plotagem (impressões >= IMPRESSOES_MIN). */
  plotaveis: GscQuery[];
  /** Soma dos ganhos estimados — o tamanho da mesa. */
  ganhoTotal: number;
  /**
   * True quando a lista parece truncada no limite antigo de 20. O dado só
   * engorda depois do próximo run do pipeline, e sem este aviso a tela pareceria
   * dizer "quase não há oportunidade" quando na verdade não há *dado*.
   */
  provavelmenteTruncado: boolean;
}

export function construirMapaOportunidade(queries: GscQuery[] | undefined): MapaOportunidade {
  const todas = queries ?? [];
  const plotaveis = todas.filter((q) => q.impressions >= IMPRESSOES_MIN);

  const oportunidades: QueryOportunidade[] = plotaveis
    .filter((q) => q.position >= POSICAO_MIN && q.position <= POSICAO_MAX && q.ctr < CTR_ALVO)
    .map((q) => ({
      ...q,
      ganhoEstimado: Math.max(0, Math.round((q.impressions * CTR_ALVO) / 100) - q.clicks),
    }))
    .sort((a, b) => b.impressions - a.impressions);

  return {
    oportunidades,
    plotaveis,
    ganhoTotal: oportunidades.reduce((soma, q) => soma + q.ganhoEstimado, 0),
    // 20 e 15 eram os tetos antigos de fetch-gsc.mjs. Bater exatamente neles é
    // assinatura de truncamento, não de distribuição.
    provavelmenteTruncado: todas.length === 20 || todas.length === 15,
  };
}
