// Testa a lógica pura de reordenação do quadro (renumerar + diffOrdem).
//
// Não há test runner no projeto. Estas funções são a parte que eu escrevi do
// zero e a que erra silenciosamente: um diff largo demais custa dezenas de
// UPDATEs por arrasto, e um diff estreito demais deixa o banco fora de sincronia
// com a tela sem nenhum erro aparecer.
//
// Compila o TS na hora com o próprio tsc do projeto, para testar o código real
// e não uma cópia — uma cópia não provaria nada.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "ordem-"));
const fonte = readFileSync("hooks/use-arrastar-entre-colunas.ts", "utf8");

// Isola as funções puras: o resto do arquivo importa React e dnd-kit.
const corte = fonte.indexOf("export function useArrastarEntreColunas");
const puro = fonte
  .slice(0, corte)
  .replace(/^import[\s\S]*?from\s+["'][^"']+["'];?$/gm, "")
  .replace(/const SEM_SENSORES[^\n]*\n/, "")
  .replace(/:\s*ReturnType<typeof useSensors>/g, "");

writeFileSync(
  join(dir, "puro.ts"),
  puro
);

// Chama o tsc.js pelo próprio node, sem shell e sem .cmd: o Node 22 recusa
// spawn de .cmd com EINVAL, e sem shell espaço no caminho não vira argumento.
execFileSync(
  process.execPath,
  ["node_modules/typescript/lib/tsc.js", join(dir, "puro.ts"),
   "--module", "esnext", "--target", "es2022",
   "--moduleResolution", "bundler", "--outDir", dir],
  { stdio: "pipe" }
);

const { renumerar, diffOrdem, instantaneo } = await import(
  `file:///${join(dir, "puro.js").replace(/\\/g, "/")}`
);

let falhas = 0;
function checar(nome, condicao, detalhe = "") {
  if (!condicao) falhas++;
  console.log(`  ${condicao ? "PASSOU" : "FALHOU  <<<<"}  ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
}

const card = (id, coluna, ordem) => ({ id, coluna, ordem });

// Estado inicial parecido com o do seed: tudo numa coluna só.
const decisao66 = Array.from({ length: 66 }, (_, i) => card(`c${i + 1}`, "decisao", i + 1));

console.log("\nRENUMERAR");
{
  const bagunçado = [card("a", "decisao", 9), card("b", "decisao", 3), card("c", "pesquisa", 7)];
  const r = renumerar(bagunçado);
  checar("numera cada coluna de 1..n", r[0].ordem === 1 && r[1].ordem === 2 && r[2].ordem === 1,
    r.map((x) => `${x.coluna}:${x.ordem}`).join(" "));
  checar("preserva o objeto quando a ordem já bate",
    renumerar([card("a", "decisao", 1)])[0] === undefined ? false : true);
  const jaCerto = [card("a", "decisao", 1), card("b", "decisao", 2)];
  checar("não recria objeto sem necessidade", renumerar(jaCerto)[0] === jaCerto[0]);
}

console.log("\nDIFF — custo proporcional ao movimento");
{
  const antes = instantaneo(decisao66);

  // Mover o card 60 para a posição 55: só as posições 55..60 mudam.
  const movido = [...decisao66];
  const [x] = movido.splice(59, 1);
  movido.splice(54, 0, x);
  const d = diffOrdem(antes, renumerar(movido));
  checar("mover 5 posições muda 6 linhas, não 66", d.length === 6, `${d.length} linhas`);

  // Mover o último para o topo é o pior caso e realmente mexe em tudo.
  const paraTopo = [...decisao66];
  const [y] = paraTopo.splice(65, 1);
  paraTopo.unshift(y);
  checar("mover do fim para o topo mexe nas 66", diffOrdem(antes, renumerar(paraTopo)).length === 66);

  // Não mover nada não deve gerar UPDATE nenhum.
  checar("sem movimento, diff vazio", diffOrdem(antes, renumerar(decisao66)).length === 0);
}

console.log("\nDIFF — troca de coluna");
{
  const antes = instantaneo(decisao66);
  const proximo = decisao66.map((p) => (p.id === "c1" ? { ...p, coluna: "pesquisa" } : p));
  const d = diffOrdem(antes, renumerar(proximo));

  const movido = d.find((m) => m.id === "c1");
  checar("o card movido entra na lista", !!movido && movido.coluna === "pesquisa" && movido.ordem === 1,
    JSON.stringify(movido));
  checar("os 65 que sobraram são renumerados", d.length === 66, `${d.length} linhas`);
  checar("nenhum sobrou com ordem duplicada",
    new Set(d.filter((m) => m.coluna === "decisao").map((m) => m.ordem)).size === 65);
}

console.log("\nDIFF — card novo sem snapshot");
{
  const antes = instantaneo([card("a", "decisao", 1)]);
  const d = diffOrdem(antes, renumerar([card("a", "decisao", 1), card("novo", "decisao", 2)]));
  checar("card ausente do snapshot entra no diff", d.length === 1 && d[0].id === "novo");
}

rmSync(dir, { recursive: true, force: true });
console.log(falhas === 0 ? "\n✅ tudo passou" : `\n❌ ${falhas} falha(s)`);
process.exit(falhas === 0 ? 0 : 1);
