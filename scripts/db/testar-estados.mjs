// Testa o estado geral derivado contra a implementação real em types/conteudo.ts.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

console.log("\nORQUESTRAÇÃO E PUBLICAÇÃO LOCAL");
const {
  compararPautas, corpoPublicavelDoMarkdown, gapsDaPauta, prepararArquivoPublicado,
  prepararMovimentoPublicado,
  proximaAcaoPauta, urlLinkedinParametrizada,
} = await import(new URL("../conteudo/pauta.mjs", import.meta.url));
const base = {
  id: "b", data_alvo: "2026-08-20", prioridade: 2,
  ordem_blog: 2, ordem_linkedin: 2, status_blog: "planejada",
  status_linkedin: "planejada", job_status: null,
};
const ordenadas = [
  base,
  { ...base, id: "curso", status_blog: "draft" },
  { ...base, id: "fila", job_status: "na-fila" },
  { ...base, id: "aprovar", job_status: "aguardando-aprovacao" },
].sort(compararPautas);
checar("WIP limita pautas novas", ordenadas.map((p) => p.id).join(","), "aprovar,fila,curso,b");
checar(
  "URL do LinkedIn recebe UTMs canônicas",
  urlLinkedinParametrizada("slug-teste"),
  "https://www.berkahn.com.br/atualidades/slug-teste?utm_source=linkedin&utm_medium=social&utm_campaign=post-organico"
);
const corpo = corpoPublicavelDoMarkdown(
  "Berkahn-Vault/40-content/blog/publicados/quanto-custa-construir-steel-frame-precos-m2-2026.md"
);
checar("corpo deriva do markdown sem frontmatter", corpo.startsWith("Para planejar uma casa"), true);
checar("especificações internas não vazam no post", corpo.includes("ESPECIFICAÇÕES TÉCNICAS"), false);
const revisaoStaged = {
  status_blog: "produzido", status_linkedin: null, pesquisa_conteudo: "ok",
  draft_path: "draft.md", post_id: "post", capa_blog_url: "cover",
  post_draft_payload: { title: "novo" }, posts: { status: "published" },
};
checar("revisão staged volta para revisão", proximaAcaoPauta(revisaoStaged), "revisar");
checar(
  "revisão staged expõe aprovação pendente",
  gapsDaPauta(revisaoStaged).includes("revisao_blog_aguarda_aprovacao"),
  true
);

const origem = join(dir, "draft.md");
const destino = join(dir, "publicado.md");
writeFileSync(origem, "draft novo", "utf8");
writeFileSync(destino, "publicado antigo", "utf8");
const rollback = prepararMovimentoPublicado(origem, destino, "publicado novo");
checar("substituição prepara a versão nova", readFileSync(destino, "utf8"), "publicado novo");
checar("draft sai do caminho durante a transação", existsSync(origem), false);
rollback.desfazer();
checar("rollback restaura o draft", readFileSync(origem, "utf8"), "draft novo");
checar("rollback restaura o publicado anterior", readFileSync(destino, "utf8"), "publicado antigo");
const commit = prepararMovimentoPublicado(origem, destino, "publicado novo");
checar("commit limpa backups", commit.confirmar().length, 0);
checar("commit remove o draft", existsSync(origem), false);
checar("commit preserva somente o novo publicado", readFileSync(destino, "utf8"), "publicado novo");

const capaDestino = join(dir, "cover.webp");
writeFileSync(capaDestino, "capa antiga", "utf8");
const capaRollback = prepararArquivoPublicado(capaDestino, Buffer.from("capa nova"));
checar("capa gerada substitui a versão anterior", readFileSync(capaDestino, "utf8"), "capa nova");
capaRollback.desfazer();
checar("rollback restaura a capa anterior", readFileSync(capaDestino, "utf8"), "capa antiga");
const capaCommit = prepararArquivoPublicado(capaDestino, Buffer.from("capa final"));
checar("commit da capa limpa backup", capaCommit.confirmar().length, 0);
checar("commit preserva a capa final", readFileSync(capaDestino, "utf8"), "capa final");

rmSync(dir, { recursive: true, force: true });
console.log(falhas === 0 ? "\n✅ tudo passou" : `\n❌ ${falhas} falha(s)`);
process.exit(falhas === 0 ? 0 : 1);
