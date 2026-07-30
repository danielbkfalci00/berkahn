/**
 * Artigos publicados cujo corpo tem menos de 55 palavras.
 *
 * Foram criados no lançamento do blog (set/2024 a jan/2025) como stubs, e
 * nunca receberam conteúdo. São 9 de 38 artigos — 24% do acervo — e valiam
 * 1.509 impressões com 15 cliques em 90 dias (CTR 0,99%, contra 3,95% do
 * site).
 *
 * Enquanto estiverem nesta lista, cada uma:
 *   - recebe `robots: noindex, follow` (sai do índice, mas o Google segue os
 *     links internos, então a autoridade não fica presa);
 *   - fica fora do sitemap, porque anunciar no sitemap uma página que pede
 *     noindex é sinal contraditório;
 *   - continua acessível por URL e por link interno, então nada quebra.
 *
 * Três delas são hubs de link interno (`guia-definitivo` recebe 14 links,
 * `isolamento-termico` 10, `passo-passo` 8). É justamente por isso que a
 * escolha foi noindex e não 404 nem 301: remover quebraria 32 links dentro
 * de artigos bons.
 *
 * COMO SAIR DAQUI: reescrever o artigo e apagar a linha correspondente. O
 * plano de republicação, com prioridade e ângulo de cada um, está em
 * `Berkahn-Vault/40-content/estrategia/2026-07-thin-content-mapa.md`.
 */
export const THIN_CONTENT_SLUGS: readonly string[] = [
  "5-vantagens-decisivas-light-steel-frame",
  "certificacoes-steel-frame",
  "financiamento-construcao-steel-frame",
  "guia-definitivo-steel-frame-brasil",
  "isolamento-termico-acustico-steel-frame",
  "passo-passo-construcao-steel-frame",
  "steel-frame-futuro-construcao",
  "sustentabilidade-construcao-industrializada",
  "tendencias-construcao-modular-2025",
] as const;

const THIN_CONTENT_SET = new Set(THIN_CONTENT_SLUGS);

/** Se o artigo está fora do índice por falta de conteúdo. */
export function isThinContent(slug: string): boolean {
  return THIN_CONTENT_SET.has(slug);
}

/**
 * Diretiva de robots para a página do artigo.
 * `follow: true` é deliberado: queremos que o Google percorra os links
 * internos mesmo sem indexar a página.
 */
export function robotsForArticle(slug: string) {
  if (!isThinContent(slug)) return undefined;
  return {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  };
}
