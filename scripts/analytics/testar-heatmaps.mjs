// Testa as derivacoes puras das duas matrizes de calor.
//
// Nao ha test runner no projeto. Compila o TS na hora com o tsc do proprio
// projeto, para exercitar o codigo real e nao uma copia — uma copia nao
// provaria nada. Mesmo molde de scripts/db/testar-ordem.mjs.
//
// O modo de falha que isto existe para pegar e o silencioso: divisao por zero
// virando NaN, "(not set)" virando linha fantasma, escala achatando a cauda.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dir = mkdtempSync(join(tmpdir(), "heatmaps-"));

// Unico import do arquivo e `import type`, entao remover deixa TS valido.
const fonte = readFileSync("lib/analytics/heatmaps.ts", "utf8")
  .replace(/^import type[\s\S]*?from\s+["'][^"']+["'];?$/gm, "")
  .replace(/:\s*Ga4ArticleProgress\s*\|\s*undefined/g, ": any")
  .replace(/Map<string,\s*PostMeta>/g, "Map<string, any>");

writeFileSync(join(dir, "puro.ts"), fonte);

execFileSync(
  process.execPath,
  [
    fileURLToPath(import.meta.resolve("typescript/lib/tsc.js")),
    join(dir, "puro.ts"),
    "--module", "esnext", "--target", "es2022",
    "--moduleResolution", "bundler", "--outDir", dir,
  ],
  { stdio: "pipe" }
);

const m = await import(pathToFileURL(join(dir, "puro.js")).href);

let falhas = 0;
let total = 0;
function ok(nome, condicao, detalhe) {
  total++;
  if (!condicao) {
    falhas++;
    console.error(`  ✗ ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  }
}
const perto = (a, b, tol = 0.005) => Math.abs(a - b) <= tol;

// posts: so o que estiver aqui conta como artigo
const posts = new Map([
  ["custo", { slug: "custo", title: "Custo do Steel Frame" }],
  ["fundacao", { slug: "fundacao", title: "Fundacao" }],
  ["drywall", { slug: "drywall", title: "Drywall" }],
]);

// --- construirMatrizArtigoMes -------------------------------------------
console.log("construirMatrizArtigoMes");

{
  const vazio = m.construirMatrizArtigoMes(new Map(), posts);
  ok("historico vazio nao quebra", vazio.linhas.length === 0 && vazio.meses.length === 0);
  ok("concentracaoTopo 0 sem dado", vazio.concentracaoTopo === 0);
}

{
  const hist = new Map([
    ["2026-06", new Map([["custo", 900], ["fundacao", 50], ["/", 400]])],
    ["2026-07", new Map([["custo", 1314], ["fundacao", 100], ["drywall", 20], ["/", 500]])],
  ]);
  const r = m.construirMatrizArtigoMes(hist, posts);

  ok("descarta slug que nao e artigo", !r.linhas.some((l) => l.slug === "/"), "home entrou na matriz");
  ok("ordena por total desc", r.linhas[0].slug === "custo");
  ok("meses em ordem", r.meses.join() === "2026-06,2026-07");
  ok("total soma os meses", r.linhas[0].total === 2214, `veio ${r.linhas[0].total}`);

  // Escala log: o acervo e lei de potencia (2766 : 11 medido nas fixtures), e
  // linear ou raiz apagam a cauda inteira.
  const fund = r.linhas.find((l) => l.slug === "fundacao");
  const cel = fund.celulas.find((c) => c.monthSlug === "2026-07");
  ok("intensidade e logaritmica", perto(cel.intensidade, Math.log1p(100) / Math.log1p(1314)),
    `veio ${cel.intensidade.toFixed(3)}`);
  ok("cauda fica visivel", cel.intensidade > 0.6, `veio ${cel.intensidade.toFixed(3)}`);

  // O caso que motivou a troca: 11 pageviews contra maximo 1314. Linear daria
  // 0,008 e raiz 0,09 — os dois invisiveis.
  ok("cauda extrema ainda aparece", m.intensidade(11, 1314) > 0.3,
    `veio ${m.intensidade(11, 1314).toFixed(3)}`);
  ok("monotonica", m.intensidade(50, 1314) > m.intensidade(11, 1314));
  ok("maximo satura em 1", m.intensidade(1314, 1314) === 1);

  // Maximo global, nao por coluna: se fosse por coluna, custo/2026-06 (900,
  // maximo do proprio mes) sairia em 1 e o crescimento sumiria.
  const custoJun = r.linhas[0].celulas.find((c) => c.monthSlug === "2026-06");
  ok("maximo e global, nao por coluna", custoJun.intensidade < 1,
    `veio ${custoJun.intensidade.toFixed(3)}`);

  // mes sem o artigo -> celula zerada, nao ausente
  const dry = r.linhas.find((l) => l.slug === "drywall");
  ok("mes sem dado vira celula 0", dry.celulas.length === 2 && dry.celulas[0].pageviews === 0);

  // concentracao do topo no ultimo mes: 1314 / (1314+100+20)
  ok("concentracaoTopo sobre o ultimo mes", perto(r.concentracaoTopo, 1314 / 1434),
    `veio ${r.concentracaoTopo.toFixed(3)}`);
}

{
  // corte em MAX_LINHAS e contagem de ocultos
  const muitos = new Map();
  const grandes = new Map();
  const postsMuitos = new Map();
  for (let i = 0; i < m.MAX_LINHAS + 7; i++) {
    postsMuitos.set(`p${i}`, { slug: `p${i}`, title: `P${i}` });
    grandes.set(`p${i}`, 100 - i);
  }
  muitos.set("2026-07", grandes);
  const r = m.construirMatrizArtigoMes(muitos, postsMuitos);
  ok("corta em MAX_LINHAS", r.linhas.length === m.MAX_LINHAS, `veio ${r.linhas.length}`);
  ok("conta os ocultos", r.ocultos === 7, `veio ${r.ocultos}`);
}

{
  // todos os pageviews zerados: nao pode virar NaN nem dividir por zero
  const zerado = new Map([["2026-07", new Map([["custo", 0]])]]);
  const r = m.construirMatrizArtigoMes(zerado, posts);
  ok("tudo zero nao vira NaN", Number.isFinite(r.concentracaoTopo) && r.concentracaoTopo === 0);
  ok("intensidade de zero e zero", r.linhas[0].celulas[0].intensidade === 0);
}

// --- construirMapaLeitura ------------------------------------------------
console.log("construirMapaLeitura");

{
  ok("progresso ausente => indisponivel", m.construirMapaLeitura(undefined, posts).disponivel === false);
  const off = m.construirMapaLeitura({ available: false, reason: "dimensao ausente", rows: [] }, posts);
  ok("available:false => indisponivel", off.disponivel === false);
  ok("preserva o motivo", off.motivoIndisponivel === "dimensao ausente");
}

{
  const prog = {
    available: true,
    rows: [
      // "(not set)": evento anterior ao registro da dimensao no GA4
      { slug: "(not set)", percent: 25, count: 54 },
      // custo: base 40 (>= MIN_AMOSTRA), queda forte entre 50 e 75
      { slug: "custo", percent: 25, count: 40 },
      { slug: "custo", percent: 50, count: 36 },
      { slug: "custo", percent: 75, count: 10 },
      { slug: "custo", percent: 90, count: 8 },
      // fundacao: base 8, abaixo do piso
      { slug: "fundacao", percent: 25, count: 8 },
      { slug: "fundacao", percent: 50, count: 4 },
      // bucket invalido tem que ser ignorado
      { slug: "drywall", percent: 33, count: 99 },
    ],
  };
  const r = m.construirMapaLeitura(prog, posts);

  ok('"(not set)" nao vira linha', !r.linhas.some((l) => l.slug === "(not set)"));
  ok('"(not set)" e contado a parte', r.semDimensao === 54, `veio ${r.semDimensao}`);
  ok("bucket invalido ignorado", !r.linhas.some((l) => l.slug === "drywall"));

  const custo = r.linhas.find((l) => l.slug === "custo");
  ok("base vem do bucket 25", custo.base === 40, `veio ${custo.base}`);
  ok("retencao relativa a base", perto(custo.celulas[1].retencao, 36 / 40));
  ok("amostra suficiente acima do piso", custo.amostraSuficiente === true);
  ok("acha a maior queda", custo.maiorQueda === "50→75", `veio ${custo.maiorQueda}`);
  ok("quantifica a queda", perto(custo.maiorQuedaPct, 36 / 40 - 10 / 40));
  ok("usa o titulo do post", custo.title === "Custo do Steel Frame");

  const fund = r.linhas.find((l) => l.slug === "fundacao");
  ok("amostra insuficiente marcada", fund.amostraSuficiente === false);
  ok("sem amostra nao recomenda queda", fund.maiorQueda === null);

  ok("ordena amostra suficiente primeiro", r.linhas[0].slug === "custo");
}

{
  // base zero: bucket 25 ausente. Nao pode virar NaN nem Infinity.
  const semBase = { available: true, rows: [{ slug: "custo", percent: 90, count: 5 }] };
  const r = m.construirMapaLeitura(semBase, posts);
  const linha = r.linhas[0];
  ok("base zero nao vira NaN", linha.celulas.every((c) => Number.isFinite(c.retencao)));
  ok("base zero => retencao 0", linha.celulas.every((c) => c.retencao === 0));
  ok("base zero => amostra insuficiente", linha.amostraSuficiente === false);
}

{
  // bucket posterior maior que a base (amostragem do GA4 pode produzir isso):
  // retencao tem que ficar em 1, nao passar de 100%.
  const estranho = {
    available: true,
    rows: [
      { slug: "custo", percent: 25, count: 30 },
      { slug: "custo", percent: 50, count: 35 },
    ],
  };
  const r = m.construirMapaLeitura(estranho, posts);
  ok("retencao nao passa de 1", r.linhas[0].celulas[1].retencao === 1,
    `veio ${r.linhas[0].celulas[1].retencao}`);
}

// --- construirMapaOportunidade -------------------------------------------
console.log("construirMapaOportunidade");

const fonteOp = readFileSync("lib/analytics/query-opportunity.ts", "utf8")
  .replace(/^import type[\s\S]*?from\s+["'][^"']+["'];?$/gm, "")
  .replace(/extends GscQuery\s*/g, "")
  .replace(/:\s*GscQuery\[\]\s*\|\s*undefined/g, ": any[]")
  .replace(/:\s*GscQuery\[\]/g, ": any[]");
writeFileSync(join(dir, "op.ts"), fonteOp);
execFileSync(
  process.execPath,
  [
    fileURLToPath(import.meta.resolve("typescript/lib/tsc.js")),
    join(dir, "op.ts"),
    "--module", "esnext", "--target", "es2022",
    "--moduleResolution", "bundler", "--outDir", dir,
  ],
  { stdio: "pipe" }
);
const op = await import(pathToFileURL(join(dir, "op.js")).href);

{
  ok("undefined nao quebra", op.construirMapaOportunidade(undefined).oportunidades.length === 0);
  ok("lista vazia nao quebra", op.construirMapaOportunidade([]).ganhoTotal === 0);
}

{
  const q = (query, impressions, clicks, ctr, position) => ({ query, impressions, clicks, ctr, position });
  const r = op.construirMapaOportunidade([
    q("alvo", 100, 0, 0, 6.0),          // entra: impr ok, pos na faixa, CTR baixo
    q("poucaimpr", 5, 0, 0, 6.0),        // fora: abaixo de IMPRESSOES_MIN
    q("posboa", 100, 8, 8, 1.5),         // fora: ja ranqueia e converte
    q("posruim", 100, 0, 0, 40),         // fora: longe demais
    q("ctrok", 100, 5, 5, 7),            // fora: CTR acima do alvo
    q("borda_inf", 100, 0, 0, 5),        // entra: borda inclusiva
    q("borda_sup", 100, 0, 0, 15),       // entra: borda inclusiva
  ]);

  const nomes = r.oportunidades.map((o) => o.query).sort().join(",");
  ok("filtra o quadrante certo", nomes === "alvo,borda_inf,borda_sup", `veio ${nomes}`);
  ok("bordas sao inclusivas", r.oportunidades.length === 3);
  ok("plotaveis exclui baixa impressao", !r.plotaveis.some((p) => p.query === "poucaimpr"));
  ok("plotaveis inclui quem ja converte", r.plotaveis.some((p) => p.query === "posboa"));
  ok("ordena por impressao desc", r.oportunidades[0].impressions >= r.oportunidades[1].impressions);
  ok("ganho estimado nunca negativo", r.oportunidades.every((o) => o.ganhoEstimado >= 0));
  ok("soma o ganho", r.ganhoTotal === r.oportunidades.reduce((s, o) => s + o.ganhoEstimado, 0));
}

{
  // Query que ja supera o alvo nao pode gerar ganho negativo.
  const jaBoa = [{ query: "x", impressions: 100, clicks: 9, ctr: 1.9, position: 6 }];
  const r = op.construirMapaOportunidade(jaBoa);
  ok("ganho piso em zero", r.oportunidades[0].ganhoEstimado === 0,
    `veio ${r.oportunidades[0].ganhoEstimado}`);
}

{
  // Deteccao do teto antigo: exatamente 20 ou 15 e assinatura de truncamento.
  const vinte = Array.from({ length: 20 }, (_, i) => ({ query: `q${i}`, impressions: 50, clicks: 0, ctr: 0, position: 8 }));
  ok("detecta truncamento em 20", op.construirMapaOportunidade(vinte).provavelmenteTruncado === true);
  const vinteUm = [...vinte, { query: "q20", impressions: 50, clicks: 0, ctr: 0, position: 8 }];
  ok("21 nao e truncamento", op.construirMapaOportunidade(vinteUm).provavelmenteTruncado === false);
}

rmSync(dir, { recursive: true, force: true });

if (falhas === 0) {
  console.log(`\n✓ mapas de calor: ${total} assercoes passaram`);
} else {
  console.error(`\n✗ ${falhas} de ${total} assercoes falharam`);
  process.exit(1);
}
