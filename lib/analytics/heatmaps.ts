// Derivações das duas matrizes de calor do dashboard.
//
// Módulo puro, sem I/O, no molde de post-performance.ts e health-score.ts —
// exercitado por scripts/analytics/testar-heatmaps.mjs.

import type { Ga4ArticleProgress, PostMeta } from "@/types/analytics";

/** Buckets de profundidade emitidos por components/article/ReadingProgress.tsx:37. */
export const BUCKETS_PROFUNDIDADE = [25, 50, 75, 90] as const;
export type BucketProfundidade = (typeof BUCKETS_PROFUNDIDADE)[number];

/**
 * Piso de amostra para uma linha receber leitura.
 *
 * Mesmo número que conteudo_performance_snapshots.amostra_suficiente já
 * formaliza para o loop de aprendizado. Abaixo disso a linha sai cinza e sem
 * recomendação, em vez de colorida com ruído: com 8 leitores, um abandono a
 * mais move a barra em 12 pontos.
 */
export const MIN_AMOSTRA = 30;

/** Quantas linhas a matriz mostra antes de cortar. */
export const MAX_LINHAS = 25;

/**
 * Intensidade 0..1 para pintar a célula.
 *
 * Logarítmica, não linear nem raiz. O acervo segue lei de potência: medido nas
 * fixtures de fev a ago de 2026, os totais por artigo são 2766, 727, 102, 92,
 * ... até 11 no vigésimo quinto — razão de 250:1, com máximo de célula em 1314.
 *
 * Numa escala linear o 25º sai em 0,008 de alpha; na raiz, em 0,09. Os dois
 * pintam a cauda inteira de branco, e a cauda é justamente o que se quer ver
 * crescer (a meta declarada é baixar a concentração do #1 de 78% para 55%). O
 * log põe esse mesmo artigo em 0,35 sem tirar o topo do preto, e preserva a
 * ordem porque é monotônico.
 */
export function intensidade(valor: number, maximo: number): number {
  if (!Number.isFinite(valor) || valor <= 0) return 0;
  if (!Number.isFinite(maximo) || maximo <= 0) return 0;
  if (valor >= maximo) return 1;
  return Math.min(1, Math.log1p(valor) / Math.log1p(maximo));
}

// ---------------------------------------------------------------------------
// 1B — matriz artigo × mês
// ---------------------------------------------------------------------------

export interface CelulaMes {
  monthSlug: string;
  pageviews: number;
  intensidade: number;
}

export interface LinhaArtigoMes {
  slug: string;
  title: string;
  celulas: CelulaMes[];
  total: number;
  /** Fração do total do mês mais recente que esta linha representa (0..1). */
  concentracaoUltimoMes: number;
}

export interface MatrizArtigoMes {
  meses: string[];
  linhas: LinhaArtigoMes[];
  /** Quantos artigos ficaram de fora do corte de MAX_LINHAS. */
  ocultos: number;
  /** Concentração do artigo #1 no mês mais recente (0..1) — KPI de dezembro. */
  concentracaoTopo: number;
}

/**
 * @param historicoPorSlug mapa { "YYYY-MM" → Map<slug, pageviews> }
 * @param posts mapa slug → metadados, para descartar página não-blog e ter título
 */
export function construirMatrizArtigoMes(
  historicoPorSlug: Map<string, Map<string, number>>,
  posts: Map<string, PostMeta>
): MatrizArtigoMes {
  const meses = Array.from(historicoPorSlug.keys()).sort();
  if (meses.length === 0) {
    return { meses: [], linhas: [], ocultos: 0, concentracaoTopo: 0 };
  }

  // Só slug que é artigo publicado. Mesma regra de post-performance.ts:90 —
  // home, pillar e institucionais não pertencem a uma matriz de acervo.
  const totaisPorSlug = new Map<string, number>();
  for (const porSlug of historicoPorSlug.values()) {
    for (const [slug, pageviews] of porSlug) {
      if (!posts.has(slug)) continue;
      totaisPorSlug.set(slug, (totaisPorSlug.get(slug) ?? 0) + pageviews);
    }
  }

  const ordenados = Array.from(totaisPorSlug.entries()).sort((a, b) => b[1] - a[1]);
  const visiveis = ordenados.slice(0, MAX_LINHAS);

  // Máximo global, não por coluna: normalizar por mês esconderia crescimento,
  // que é exatamente o que a matriz existe para mostrar.
  let maximo = 0;
  for (const porSlug of historicoPorSlug.values()) {
    for (const [slug, pageviews] of porSlug) {
      if (posts.has(slug) && pageviews > maximo) maximo = pageviews;
    }
  }

  const ultimoMes = meses[meses.length - 1];
  const doUltimoMes = historicoPorSlug.get(ultimoMes);
  let totalUltimoMes = 0;
  if (doUltimoMes) {
    for (const [slug, pageviews] of doUltimoMes) {
      if (posts.has(slug)) totalUltimoMes += pageviews;
    }
  }

  const linhas: LinhaArtigoMes[] = visiveis.map(([slug, total]) => {
    const noUltimoMes = doUltimoMes?.get(slug) ?? 0;
    return {
      slug,
      title: posts.get(slug)?.title ?? slug,
      total,
      concentracaoUltimoMes: totalUltimoMes > 0 ? noUltimoMes / totalUltimoMes : 0,
      celulas: meses.map((monthSlug) => {
        const pageviews = historicoPorSlug.get(monthSlug)?.get(slug) ?? 0;
        return { monthSlug, pageviews, intensidade: intensidade(pageviews, maximo) };
      }),
    };
  });

  return {
    meses,
    linhas,
    ocultos: Math.max(0, ordenados.length - visiveis.length),
    concentracaoTopo: linhas[0]?.concentracaoUltimoMes ?? 0,
  };
}

// ---------------------------------------------------------------------------
// 1A — mapa de calor de leitura
// ---------------------------------------------------------------------------

export interface CelulaProfundidade {
  bucket: BucketProfundidade;
  /** Fração dos que começaram a rolar e chegaram até aqui (0..1). */
  retencao: number;
  eventos: number;
}

export interface LinhaLeitura {
  slug: string;
  title: string;
  celulas: CelulaProfundidade[];
  /** Base da retenção: quantos cruzaram o primeiro bucket. */
  base: number;
  amostraSuficiente: boolean;
  /** Transição com a maior perda relativa, ex. "50→75". Null se sem amostra. */
  maiorQueda: string | null;
  maiorQuedaPct: number;
}

export interface MapaLeitura {
  linhas: LinhaLeitura[];
  /** Eventos sem dimensão personalizada populada — anteriores ao registro no GA4. */
  semDimensao: number;
  disponivel: boolean;
  motivoIndisponivel?: string;
}

/**
 * O GA4 devolve "(not set)" para evento anterior ao registro da dimensão
 * personalizada. Dimensão não é retroativa, então esse balde encolhe sozinho
 * com o tempo — mas contá-lo como slug produziria uma linha fantasma que
 * dominaria a matriz.
 */
const SLUG_NAO_POPULADO = "(not set)";

export function construirMapaLeitura(
  progresso: Ga4ArticleProgress | undefined,
  posts: Map<string, PostMeta>
): MapaLeitura {
  if (!progresso || !progresso.available) {
    return {
      linhas: [],
      semDimensao: 0,
      disponivel: false,
      motivoIndisponivel: progresso?.reason,
    };
  }

  const porSlug = new Map<string, Map<number, number>>();
  let semDimensao = 0;

  for (const linha of progresso.rows ?? []) {
    if (!linha.slug || linha.slug === SLUG_NAO_POPULADO) {
      semDimensao += linha.count;
      continue;
    }
    const percent = Number(linha.percent);
    if (!BUCKETS_PROFUNDIDADE.includes(percent as BucketProfundidade)) continue;
    const balde = porSlug.get(linha.slug) ?? new Map<number, number>();
    balde.set(percent, (balde.get(percent) ?? 0) + linha.count);
    porSlug.set(linha.slug, balde);
  }

  const linhas: LinhaLeitura[] = [];
  for (const [slug, baldes] of porSlug) {
    // Base é o primeiro bucket: todo mundo que rolou cruzou os 25% antes de
    // chegar a 50%. Usar o total de eventos inflaria a base e faria a retenção
    // parecer pior do que é.
    const base = baldes.get(25) ?? 0;
    const celulas: CelulaProfundidade[] = BUCKETS_PROFUNDIDADE.map((bucket) => {
      const eventos = baldes.get(bucket) ?? 0;
      return { bucket, eventos, retencao: base > 0 ? Math.min(1, eventos / base) : 0 };
    });

    const amostraSuficiente = base >= MIN_AMOSTRA;
    let maiorQueda: string | null = null;
    let maiorQuedaPct = 0;
    if (amostraSuficiente) {
      for (let i = 1; i < celulas.length; i++) {
        const perda = celulas[i - 1].retencao - celulas[i].retencao;
        if (perda > maiorQuedaPct) {
          maiorQuedaPct = perda;
          maiorQueda = `${celulas[i - 1].bucket}→${celulas[i].bucket}`;
        }
      }
    }

    linhas.push({
      slug,
      title: posts.get(slug)?.title ?? slug,
      celulas,
      base,
      amostraSuficiente,
      maiorQueda,
      maiorQuedaPct,
    });
  }

  // Amostra suficiente primeiro: são as únicas linhas sobre as quais se decide
  // alguma coisa. Dentro de cada grupo, maior base antes.
  linhas.sort((a, b) => {
    if (a.amostraSuficiente !== b.amostraSuficiente) return a.amostraSuficiente ? -1 : 1;
    return b.base - a.base;
  });

  return { linhas: linhas.slice(0, MAX_LINHAS), semDimensao, disponivel: true };
}
