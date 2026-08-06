// Testa o estado geral derivado contra a implementação real em types/conteudo.ts.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "estados-conteudo-"));
execFileSync(
  process.execPath,
  [
    "node_modules/typescript/lib/tsc.js",
    "types/conteudo.ts",
    "types/admin.ts",
    "--module", "esnext",
    "--target", "es2022",
    "--moduleResolution", "bundler",
    "--outDir", dir,
  ],
  { stdio: "pipe" }
);
const { estadoGeral, proximaAcao } = await import(
  `file:///${join(dir, "conteudo.js").replace(/\\/g, "/")}`
);

let falhas = 0;
function checar(nome, recebido, esperado) {
  const passou = recebido === esperado;
  if (!passou) falhas++;
  console.log(
    `  ${passou ? "PASSOU" : "FALHOU  <<<<"}  ${nome} — ${recebido}`
  );
}
function pauta(statusBlog, statusLinkedin) {
  return { statusBlog, statusLinkedin };
}

console.log("\nESTADOS DERIVADOS");
checar("duas trilhas planejadas", estadoGeral(pauta("planejada", "planejada")), "planejada");
checar("pesquisa iniciada", estadoGeral(pauta("pesquisa", "planejada")), "em-producao");
checar("duas entregas produzidas", estadoGeral(pauta("produzido", "produzido")), "aguardando-aprovacao");
checar("blog publicado + LinkedIn aprovado", estadoGeral(pauta("publicado", "aprovado")), "pronta-publicar");
checar("duas trilhas publicadas", estadoGeral(pauta("publicado", "publicado")), "concluida");
checar("blog publicado + LinkedIn planejado", estadoGeral(pauta("publicado", "planejada")), "em-producao");
checar("pauta somente Blog publicada", estadoGeral(pauta("publicado", null)), "concluida");
checar("pauta somente LinkedIn produzida", estadoGeral(pauta(null, "produzido")), "aguardando-aprovacao");

console.log("\nPRÓXIMA AÇÃO");
checar("Blog vem antes quando aplicável", proximaAcao(pauta("pesquisa", "planejada")), "Criar draft do Blog");
checar("LinkedIn assume após Blog publicado", proximaAcao(pauta("publicado", "aprovado")), "Publicar e informar URL");

rmSync(dir, { recursive: true, force: true });
console.log(falhas === 0 ? "\n✅ tudo passou" : `\n❌ ${falhas} falha(s)`);
process.exit(falhas === 0 ? 0 : 1);
