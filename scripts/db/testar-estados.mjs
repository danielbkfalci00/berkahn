// Testa o estado geral derivado contra a implementação real em types/conteudo.ts.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = mkdtempSync(join(tmpdir(), "estados-conteudo-"));
execFileSync(
  process.execPath,
  [
    fileURLToPath(import.meta.resolve("typescript/lib/tsc.js")),
    "types/conteudo.ts",
    "types/admin.ts",
    "--module", "esnext",
    "--target", "es2022",
    "--moduleResolution", "bundler",
    "--outDir", dir,
  ],
  { stdio: "pipe" }
);
const { estadoDoQuadro, estadoGeral, gapsConteudo, proximaAcao, publicacaoReal } = await import(
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
function pauta(statusBlog, statusLinkedin, extras = {}) {
  return {
    statusBlog,
    statusLinkedin,
    pesquisaConteudo: null,
    draftPath: null,
    artigo: null,
    capaBlogUrl: null,
    linkedinTexto: null,
    capaLinkedinUrl: null,
    linkedinUrl: null,
    linkedinPublicadoEm: null,
    ...extras,
  };
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
checar("Blog vem antes quando aplicável", proximaAcao(pauta("pesquisa", "planejada", { pesquisaConteudo: "ok" })), "Criar draft do Blog");
checar("LinkedIn assume após Blog publicado", proximaAcao(pauta("publicado", "aprovado", { pesquisaConteudo: "ok", draftPath: "draft.md", artigo: { status: "published" }, capaBlogUrl: "cover", linkedinTexto: "ok", capaLinkedinUrl: "cover" })), "Revisar, publicar e registrar URL");

console.log("\nPUBLICAÇÃO REAL E GAPS");
const statusSemArtefatos = pauta("publicado", "publicado");
checar("status Publicado não prova publicação real", publicacaoReal(statusSemArtefatos).blog, "sem-artigo");
checar("LinkedIn Publicado sem URL/data continua irreal", publicacaoReal(statusSemArtefatos).linkedin, "sem-registro");
checar("gaps continuam visíveis após mover status", gapsConteudo(statusSemArtefatos).length > 0, true);
checar("visão Geral não conclui só pelo status", estadoDoQuadro(statusSemArtefatos), "pronta-publicar");
const real = pauta("publicado", "publicado", {
  artigo: { status: "published" }, linkedinUrl: "https://linkedin.com/posts/teste",
  linkedinPublicadoEm: "2026-08-07",
});
checar("artefatos comprovam publicação real do Blog", publicacaoReal(real).blog, "publicado");
checar("URL e data comprovam LinkedIn real", publicacaoReal(real).linkedin, "publicado");
checar("visão Geral conclui com publicação real", estadoDoQuadro(real), "concluida");

console.log("\nTAXONOMIA");
const vault = readFileSync("Berkahn-Vault/CLAUDE.md", "utf8");
const migration = readFileSync("supabase/migrations/015_conteudo_tags.sql", "utf8");
const vaultTags = [...new Set(vault.match(new RegExp("domain/[a-z0-9-]+", "g")) ?? [])].sort();
const dbTags = [...new Set(migration.match(new RegExp("domain/[a-z0-9-]+", "g")) ?? [])].sort();
checar("vault e catálogo operacional têm os mesmos domínios", vaultTags.join(","), dbTags.join(","));
rmSync(dir, { recursive: true, force: true });
console.log(falhas === 0 ? "\n✅ tudo passou" : `\n❌ ${falhas} falha(s)`);
process.exit(falhas === 0 ? 0 : 1);
