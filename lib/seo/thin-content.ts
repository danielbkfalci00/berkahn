/**
 * Artigos publicados cujo corpo tem menos de 55 palavras.
 *
 * Foram criados no lançamento do blog (set/2024 a jan/2025) como stubs, e
 * nunca receberam conteúdo. Eram 9 de 38 artigos — 24% do acervo — valendo
 * 1.509 impressões com 15 cliques em 90 dias (CTR 0,99%, contra 3,95% do
 * site).
 *
 * Foram divididos em dois destinos, conforme já existisse ou não outro
 * artigo cobrindo o mesmo tema:
 *
 *   - THIN_CONTENT_SLUGS: sem substituto. Ficam no ar com noindex até serem
 *     reescritos.
 *   - REDIRECTED_SLUGS: têm substituto melhor publicado. Redirecionam com
 *     301 (declarado em next.config.ts), consolidando sinal em vez de
 *     dispersá-lo. Reescrevê-los criaria canibalização nova.
 *
 * Os dois conjuntos saem do sitemap: anunciar uma URL que responde noindex
 * ou 301 é sinal contraditório.
 *
 * O plano de republicação está em
 * `Berkahn-Vault/40-content/estrategia/2026-07-thin-content-mapa.md`.
 */

/**
 * Sem substituto: `noindex, follow` mantém a URL viva e o Google seguindo os
 * links internos, sem indexar a página. Três destes são hubs de link interno
 * (guia-definitivo recebe 14 links, isolamento-termico 10, passo-passo 8),
 * então remover quebraria 32 links dentro de artigos bons.
 *
 * COMO SAIR DAQUI: reescrever o artigo e apagar a linha.
 */
export const THIN_CONTENT_SLUGS: readonly string[] = [
  "guia-definitivo-steel-frame-brasil",
  "isolamento-termico-acustico-steel-frame",
  "passo-passo-construcao-steel-frame",
  "tendencias-construcao-modular-2025",
] as const;

/**
 * Com substituto: 301 para o artigo que já cobre o tema. Os destinos foram
 * verificados um a um pela URL Inspection API — todos estão `Submitted and
 * indexed`. Redirecionar para página fora do índice não consolidaria nada.
 *
 * Dois alvos mudaram por causa dessa verificação:
 *   - 5-vantagens-decisivas ia para steel-frame-vantagens-desvantagens, que
 *     está "Crawled, currently not indexed" desde 13/04. Foi para
 *     steel-frame-vs-alvenaria.
 *   - steel-frame-futuro-construcao ia para guia-definitivo, que está em
 *     noindex nesta mesma mudança. Foi para o artigo de construção
 *     industrializada, que cobre o mesmo ângulo de transformação do setor.
 *
 * A fonte da verdade dos redirects é `next.config.ts`; esta lista existe
 * para o sitemap saber o que excluir.
 */
export const REDIRECTED_SLUGS: readonly string[] = [
  "5-vantagens-decisivas-light-steel-frame",
  "certificacoes-steel-frame",
  "financiamento-construcao-steel-frame",
  "steel-frame-futuro-construcao",
  "sustentabilidade-construcao-industrializada",
] as const;

const THIN_CONTENT_SET = new Set(THIN_CONTENT_SLUGS);
const REDIRECTED_SET = new Set(REDIRECTED_SLUGS);

/** Se o artigo está fora do índice por falta de conteúdo. */
export function isThinContent(slug: string): boolean {
  return THIN_CONTENT_SET.has(slug);
}

/** Se o artigo foi consolidado em outro por 301. */
export function isRedirected(slug: string): boolean {
  return REDIRECTED_SET.has(slug);
}

/** Se o artigo não deve aparecer no sitemap, por qualquer um dos motivos. */
export function isExcludedFromSitemap(slug: string): boolean {
  return isThinContent(slug) || isRedirected(slug);
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
