// Harness de desenvolvimento da ponte de comentários (app/_harness).
//
// Por que não `public/_harness.html`: um arquivo estático em public/ depende de
// alguém lembrar de removê-lo antes do commit, e esquecer publicaria um
// documento interno numa rota pública. Aqui o desligamento é estrutural.
//
// O gate é `VERCEL`: a plataforma sempre define essa variável nos builds e no
// runtime, em qualquer ambiente (production, preview e development). Local,
// incluindo `npm run build && npm start`, ela não existe — que é exatamente o
// cenário onde o harness precisa funcionar, porque só o build de produção
// reproduz a minificação que pode quebrar a serialização da ponte.
export const HARNESS_HABILITADO = process.env.VERCEL !== "1";

/**
 * Documentos do vault liberados para o harness.
 *
 * O primeiro é o pior caso deliberado: relatório de performance, com tabelas
 * cheias de valores curtos e repetidos ("28", "Indexada") e sem nenhum id nos
 * <h2> — as duas coisas que mais estressam a desambiguação da âncora.
 */
export const DOCS_HARNESS = [
  "Berkahn-Vault/40-content/auditorias-seo/2026-07-performance-blog.html",
  "Berkahn-Vault/40-content/estrategia/2026-08-calendario-editorial.html",
] as const satisfies readonly string[];
