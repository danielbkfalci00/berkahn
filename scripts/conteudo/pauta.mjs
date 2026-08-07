// CLI único do pipeline de conteúdo. Substitui scripts descartáveis por artigo.
//
// Buscar/ver são somente leitura. Toda escrita aceita --dry-run; overwrite exige
// --forcar e --confirmar-substituicao. Publicação é uma operação explícita.
import { createHash } from "node:crypto";
import {
  existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const ROOT = process.cwd();
const ENV = resolve(ROOT, ".env.local");
if (existsSync(ENV)) {
  for (const linha of readFileSync(ENV, "utf8").split(/\r?\n/)) {
    const match = linha.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL e a service key no .env.local");
  process.exit(2);
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const COLUNA_DO_BLOCO = {
  insights: "insights",
  pesquisa: "pesquisa_conteudo",
  linkedin: "linkedin_texto",
  "imagem-prompt": "linkedin_imagem_prompt",
  "imagem-briefing": "linkedin_imagem_briefing",
};
const MAX_CHARS = 60000;
const CACHE = resolve(ROOT, "scripts/.cache");
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CAMPOS =
  "id,titulo,tipo,status_blog,status_linkedin,ordem_blog,ordem_linkedin," +
  "draft_path,linkedin_url,linkedin_publicado_em,keyword,semana,data_alvo,trilha,insights," +
  "pesquisa_conteudo,linkedin_texto,linkedin_briefing,linkedin_imagem_prompt," +
  "linkedin_imagem_briefing,post_id,plataformas,capa_blog_url,capa_linkedin_url,atualizado_em";

function abortar(mensagem, codigo = 1) {
  console.error(`\n❌ ${mensagem}`);
  process.exit(codigo);
}
function garantirId(id) {
  if (!UUID.test(id ?? "")) abortar("id inválido — use o UUID da pauta");
}
function garantirVersao(pauta, expected) {
  if (expected && pauta.atualizado_em !== expected)
    abortar(`pauta alterada depois do handoff (esperado ${expected}; atual ${pauta.atualizado_em})`);
}
function hashTexto(valor) {
  return createHash("sha256").update(valor || "").digest("hex");
}
function caminhoRelativoSeguro(arquivo, pastaPermitida) {
  if (!arquivo) abortar("--arquivo é obrigatório");
  const absoluto = resolve(ROOT, arquivo);
  const base = resolve(ROOT, pastaPermitida);
  const relativo = relative(base, absoluto);
  if (relativo.startsWith("..") || resolve(base, relativo) !== absoluto)
    abortar(`arquivo precisa estar dentro de ${pastaPermitida}`);
  if (!existsSync(absoluto)) abortar(`arquivo não encontrado: ${arquivo}`);
  return {
    absoluto,
    relativoRaiz: relative(ROOT, absoluto).split(sep).join("/"),
  };
}
function preenchidos(pauta) {
  return Object.entries(COLUNA_DO_BLOCO)
    .filter(([, coluna]) => pauta[coluna])
    .map(([bloco]) => bloco);
}
function resumir(pauta, indice) {
  const prefixo = indice === undefined ? " " : ` ${indice + 1}.`;
  const meta = [
    pauta.status_blog ? `Blog: ${pauta.status_blog}` : null,
    pauta.status_linkedin ? `LinkedIn: ${pauta.status_linkedin}` : null,
    pauta.semana ? `S${pauta.semana}` : null,
    pauta.trilha,
    pauta.data_alvo,
    pauta.keyword ? `kw: ${pauta.keyword}` : null,
    pauta.post_id ? "artigo vinculado" : null,
  ].filter(Boolean);
  console.log(`${prefixo} ${pauta.titulo}\n    id: ${pauta.id}`);
  console.log(`    ${meta.join(" · ")}`);
  console.log(`    preenchidos: ${preenchidos(pauta).join(", ") || "(nenhum bloco)"}\n`);
}
async function logAutomacao(pauta, acao, details) {
  const { error } = await db.from("activity_logs").insert({
    user_id: null,
    user_name: "Automação de conteúdo",
    action: acao,
    entity_type: "pauta",
    entity_id: pauta.id,
    entity_name: pauta.titulo,
    details,
  });
  if (error) console.warn(`⚠️ Não foi possível registrar activity_log: ${error.message}`);
}

async function buscar(termo, slug) {
  if (slug) {
    const { data: post, error } = await db
      .from("posts").select("id,title").eq("slug", slug).maybeSingle();
    if (error) abortar(error.message);
    if (!post) abortar(`nenhum artigo com slug "${slug}"`);
    const { data } = await db.from("conteudo_pautas").select(CAMPOS).eq("post_id", post.id);
    if (!data?.length) {
      console.log(`\nO artigo "${post.title}" existe, mas nenhuma pauta o referencia.`);
      console.log("Nenhuma pauta foi criada — aponte o id ou aprove uma criação.\n");
      return;
    }
    data.forEach(resumir);
    return;
  }
  if (!termo) abortar('uso: pauta.mjs buscar "<termo>"');
  const alvo = `%${termo}%`;
  const { data, error } = await db
    .from("conteudo_pautas").select(CAMPOS)
    .or(`titulo.ilike.${alvo},keyword.ilike.${alvo}`)
    .order("data_alvo", { nullsFirst: false }).limit(8);
  if (error) abortar(error.message);
  if (!data?.length) {
    console.log(`\nNenhuma pauta casa com "${termo}". Não crie sem aprovação explícita.\n`);
    return;
  }
  data.forEach(resumir);
  if (data.length > 1) console.log("Mais de um resultado: confirme qual id usar antes de gravar.\n");
}

async function ver(id) {
  garantirId(id);
  const { data, error } = await db
    .from("conteudo_pautas")
    .select(`${CAMPOS},posts(slug,title,status,published_at)`)
    .eq("id", id).maybeSingle();
  if (error) abortar(error.message);
  if (!data) abortar(`nenhuma pauta com id ${id}`);
  resumir(data);
  if (data.posts)
    console.log(`    artigo: ${data.posts.title} (/${data.posts.slug}, ${data.posts.status})\n`);
  for (const [bloco, coluna] of Object.entries(COLUNA_DO_BLOCO)) {
    const texto = data[coluna];
    console.log(`--- ${bloco} ${texto ? `(${texto.length} chars)` : "(vazio)"} ---`);
    if (texto) console.log(texto.length > 600 ? `${texto.slice(0, 600)}\n[...]` : texto);
    console.log("");
  }
}

async function criar({ titulo, plataformas, confirmar, dryRun }) {
  const lista = [...new Set((plataformas || "blog,linkedin").split(",").map((p) => p.trim()))];
  if (!titulo?.trim()) abortar("--titulo é obrigatório");
  if (!lista.length || lista.some((p) => !["blog", "linkedin"].includes(p)))
    abortar("--plataformas aceita blog,linkedin");
  if (!confirmar)
    abortar("criação exige --confirmar-aprovacao; /brainstorm não cria card automaticamente");
  if (dryRun) {
    console.log(`\n🔍 --dry-run: criaria "${titulo.trim()}" para ${lista.join(" + ")}.\n`);
    return;
  }
  const { data, error } = await db.from("conteudo_pautas")
    .insert({ titulo: titulo.trim().slice(0, 300), plataformas: lista })
    .select(CAMPOS).single();
  if (error) abortar(error.message);
  await logAutomacao(data, "Pauta criada", {
    origem: "cli", aprovacao_explicita: true, plataformas: lista,
  });
  console.log(`\n✅ Pauta criada: ${data.id}\n`);
}

async function gravar(id, { bloco, arquivo, forcar, confirmar, expected, dryRun }) {
  garantirId(id);
  const coluna = COLUNA_DO_BLOCO[bloco];
  if (!coluna) abortar(`--bloco inválido: ${Object.keys(COLUNA_DO_BLOCO).join(", ")}`);
  if (!arquivo || !existsSync(arquivo)) abortar(`arquivo não encontrado: ${arquivo ?? "(vazio)"}`);
  const texto = readFileSync(arquivo, "utf8").trim();
  if (!texto) abortar("o arquivo está vazio");
  if (texto.length > MAX_CHARS) abortar(`o texto passa de ${MAX_CHARS} caracteres`);

  const { data: atual, error } = await db.from("conteudo_pautas")
    .select(`titulo,${coluna},status_blog,status_linkedin,capa_linkedin_url,atualizado_em`)
    .eq("id", id).maybeSingle();
  if (error) abortar(error.message);
  if (!atual) abortar(`nenhuma pauta com id ${id}`);
  garantirVersao(atual, expected);
  const anterior = atual[coluna];
  if (anterior && (!forcar || !confirmar)) {
    console.error(`\n❌ O bloco "${bloco}" já tem ${anterior.length} caracteres.`);
    console.error("Use --forcar --confirmar-substituicao somente após confirmação humana.\n");
    process.exit(1);
  }
  if (dryRun) {
    console.log(`\n🔍 --dry-run: ${bloco} → ${coluna}; ${texto.length} chars; nada gravado.\n`);
    return;
  }
  if (anterior) {
    mkdirSync(CACHE, { recursive: true });
    writeFileSync(join(CACHE, `pauta-${id}-${bloco}-${Date.now()}.txt`), anterior, "utf8");
  }

  const update = { [coluna]: texto };
  if (bloco === "pesquisa" && atual.status_blog === "planejada")
    update.status_blog = "pesquisa";
  if (["linkedin", "imagem-prompt", "imagem-briefing"].includes(bloco)) {
    if (atual.status_linkedin === "planejada") update.status_linkedin = "producao";
    if (bloco === "linkedin" && atual.capa_linkedin_url &&
        ["planejada", "producao"].includes(atual.status_linkedin))
      update.status_linkedin = "produzido";
  }
  const { data, error: erroUpdate } = await db.from("conteudo_pautas")
    .update(update).eq("id", id).select("id,titulo");
  if (erroUpdate) abortar(erroUpdate.message);
  if (!data?.length) abortar("nenhuma linha foi atualizada");
  await logAutomacao({ id, titulo: atual.titulo }, "Bloco da pauta atualizado", {
    origem: "cli", bloco, status_blog: update.status_blog,
    status_linkedin: update.status_linkedin,
  });
  console.log(`\n✅ ${bloco} gravado em "${atual.titulo}"\n`);
}

async function registrarDraft(id, { arquivo, forcar, confirmar, expected, dryRun }) {
  garantirId(id);
  const caminho = caminhoRelativoSeguro(
    arquivo, "Berkahn-Vault/40-content/blog/drafts"
  );
  if (!caminho.absoluto.endsWith(".md")) abortar("o draft precisa ser markdown (.md)");
  const { data: pauta, error } = await db.from("conteudo_pautas")
    .select(CAMPOS).eq("id", id).maybeSingle();
  if (error) abortar(error.message);
  if (!pauta?.status_blog) abortar("Blog não se aplica a esta pauta");
  garantirVersao(pauta, expected);
  if (
    pauta.draft_path && pauta.draft_path !== caminho.relativoRaiz &&
    (!forcar || !confirmar)
  ) abortar("já existe outro draft_path; use --forcar --confirmar-substituicao");
  if (dryRun) {
    console.log(`\n🔍 --dry-run: registraria ${caminho.relativoRaiz} e status draft.\n`);
    return;
  }
  const { error: erroUpdate } = await db.from("conteudo_pautas").update({
    draft_path: caminho.relativoRaiz, status_blog: "draft",
  }).eq("id", id);
  if (erroUpdate) abortar(erroUpdate.message);
  await logAutomacao(pauta, "Draft vinculado à pauta", {
    origem: "cli", canal: "blog", anterior: pauta.status_blog,
    novo: "draft", draft_path: caminho.relativoRaiz,
  });
  console.log(`\n✅ Draft registrado: ${caminho.relativoRaiz}\n`);
}

function dadosPost(arquivo) {
  if (!arquivo || !existsSync(arquivo)) abortar("--dados precisa apontar para um JSON");
  let bruto;
  try { bruto = JSON.parse(readFileSync(arquivo, "utf8")); }
  catch { abortar("JSON de --dados inválido"); }
  for (const campo of ["title", "slug", "excerpt", "content"]) {
    if (!bruto[campo] || typeof bruto[campo] !== "string")
      abortar(`campo obrigatório no JSON: ${campo}`);
  }
  if (!SLUG.test(bruto.slug)) abortar("slug inválido");
  const permitidos = [
    "title", "slug", "excerpt", "content", "category", "tags", "author",
    "read_time", "featured", "meta_title", "meta_description", "answer_summary",
    "components",
  ];
  return Object.fromEntries(permitidos.filter((k) => bruto[k] !== undefined).map((k) => [k, bruto[k]]));
}

async function produzir(id, { arquivo, dados, usarExistente, expected, dryRun }) {
  garantirId(id);
  const draft = caminhoRelativoSeguro(arquivo, "Berkahn-Vault/40-content/blog/drafts");
  const post = dadosPost(dados);
  const { data: pauta, error } = await db.from("conteudo_pautas")
    .select(CAMPOS).eq("id", id).maybeSingle();
  if (error) abortar(error.message);
  if (!pauta?.status_blog) abortar("Blog não se aplica a esta pauta");
  garantirVersao(pauta, expected);
  if (!pauta.capa_blog_url) abortar("defina a capa staging do Blog antes de produzir");

  const coverRel = `public/images/img_blog/${post.slug}/cover.webp`;
  const coverAbs = resolve(ROOT, coverRel);
  if (dryRun) {
    console.log(`\n🔍 --dry-run: post draft ${post.slug}, vínculo ${id}, capa ${coverRel}.\n`);
    return;
  }

  const coverAnterior = existsSync(coverAbs) ? readFileSync(coverAbs) : null;
  let postAnterior = null;
  let postId = pauta.post_id;
  let postCriado = false;
  try {
    const resposta = await fetch(pauta.capa_blog_url);
    if (!resposta.ok) throw new Error(`falha ao baixar capa staging: HTTP ${resposta.status}`);
    mkdirSync(dirname(coverAbs), { recursive: true });
    await sharp(Buffer.from(await resposta.arrayBuffer()))
      .rotate().resize(1200, 800, { fit: "cover" })
      .webp({ quality: 84 }).toFile(coverAbs);

    if (postId) {
      const { data: existente, error: erroLeitura } = await db
        .from("posts").select("*").eq("id", postId).single();
      if (erroLeitura) throw erroLeitura;
      postAnterior = existente;
      const { error: erroPost } = await db.from("posts")
        .update({ ...post, status: "draft", cover_image: `/images/img_blog/${post.slug}/cover.webp` })
        .eq("id", postId);
      if (erroPost) throw erroPost;
    } else {
      const { data: porSlug, error: erroSlug } = await db
        .from("posts").select("*").eq("slug", post.slug).maybeSingle();
      if (erroSlug) throw erroSlug;
      if (porSlug && !usarExistente)
        throw new Error("slug já existe; confirme vínculo com --usar-existente");
      if (porSlug) {
        postAnterior = porSlug;
        postId = porSlug.id;
        const { error: erroPost } = await db.from("posts")
          .update({ ...post, status: "draft", cover_image: `/images/img_blog/${post.slug}/cover.webp` })
          .eq("id", postId);
        if (erroPost) throw erroPost;
      } else {
        const { data: criado, error: erroPost } = await db.from("posts").insert({
          ...post, status: "draft", cover_image: `/images/img_blog/${post.slug}/cover.webp`,
        }).select("id").single();
        if (erroPost) throw erroPost;
        postId = criado.id;
        postCriado = true;
      }
    }

    const { error: erroPauta } = await db.from("conteudo_pautas").update({
      post_id: postId, draft_path: draft.relativoRaiz, status_blog: "produzido",
    }).eq("id", id);
    if (erroPauta) throw erroPauta;
  } catch (erro) {
    if (postCriado && postId) await db.from("posts").delete().eq("id", postId);
    else if (postAnterior) await db.from("posts").update(postAnterior).eq("id", postAnterior.id);
    if (coverAnterior) writeFileSync(coverAbs, coverAnterior);
    else if (existsSync(coverAbs)) unlinkSync(coverAbs);
    abortar(erro instanceof Error ? erro.message : String(erro));
  }

  await logAutomacao(pauta, "Artigo produzido como draft", {
    origem: "cli", canal: "blog", anterior: pauta.status_blog,
    novo: "produzido", post_id: postId, draft_path: draft.relativoRaiz,
  });
  console.log(`\n✅ Artigo produzido como draft e vinculado: ${postId}\n`);
}

function frontmatterPublicado(markdown, postId, slug) {
  if (!markdown.startsWith("---")) abortar("markdown sem frontmatter");
  const fim = markdown.indexOf("\n---", 3);
  if (fim === -1) abortar("frontmatter não fechado");
  const hoje = new Date().toISOString().slice(0, 10);
  const linhas = markdown.slice(4, fim).split(/\r?\n/);
  function definir(chave, valor) {
    const indice = linhas.findIndex((linha) => linha.startsWith(`${chave}:`));
    const linha = `${chave}: ${valor}`;
    if (indice >= 0) linhas[indice] = linha;
    else linhas.push(linha);
  }
  definir("atualizado", hoje);
  definir("status", "published");
  definir("data_publicacao", hoje);
  definir("supabase_id", postId);
  definir("url_final", `"https://www.berkahn.com.br/atualidades/${slug}"`);
  return `---\n${linhas.join("\n")}\n---${markdown.slice(fim + 4)}`;
}

async function publicar(id, { expected, dryRun }) {
  garantirId(id);
  const { data: pauta, error } = await db.from("conteudo_pautas")
    .select(`${CAMPOS},posts(id,slug,status)`).eq("id", id).maybeSingle();
  if (error) abortar(error.message);
  if (!pauta?.post_id || !pauta.posts) abortar("pauta sem artigo vinculado");
  garantirVersao(pauta, expected);
  if (!["aprovado", "publicado"].includes(pauta.status_blog))
    abortar("Blog precisa estar aprovado antes de publicar");
  if (!pauta.draft_path) abortar("pauta sem draft_path");

  const nome = basename(pauta.draft_path);
  const destinoRel = `Berkahn-Vault/40-content/blog/publicados/${nome}`;
  const origemAbs = resolve(ROOT, pauta.draft_path);
  const destinoAbs = resolve(ROOT, destinoRel);
  const jaPublicadoPath = resolve(origemAbs) === resolve(destinoAbs);
  const jaMovido =
    (jaPublicadoPath || !existsSync(origemAbs)) && existsSync(destinoAbs);
  if (!existsSync(origemAbs) && !jaMovido) abortar("markdown não existe no draft nem em publicados");
  if (existsSync(origemAbs) && existsSync(destinoAbs))
    abortar("destino já existe; resolva a duplicação antes de publicar");
  if (dryRun) {
    console.log(`\n🔍 --dry-run: moveria ${pauta.draft_path} → ${destinoRel} e publicaria post+pauta.\n`);
    return;
  }

  let original = null;
  if (!jaMovido) {
    original = readFileSync(origemAbs, "utf8");
    const publicado = frontmatterPublicado(
      original, pauta.post_id, pauta.posts.slug
    );
    mkdirSync(dirname(destinoAbs), { recursive: true });
    renameSync(origemAbs, destinoAbs);
    writeFileSync(destinoAbs, publicado, "utf8");
  }

  const { error: erroRpc } = await db.rpc("publicar_artigo_pauta", {
    p_pauta_id: id,
    p_publicado_path: destinoRel,
  });
  if (erroRpc) {
    if (!jaMovido && original !== null) {
      renameSync(destinoAbs, origemAbs);
      writeFileSync(origemAbs, original, "utf8");
    }
    abortar(`banco recusou publicação; markdown restaurado: ${erroRpc.message}`);
  }
  console.log(`\n✅ Publicação concluída: ${destinoRel}\n`);
}

function gapsDaPauta(pauta) {
  const gaps = [];
  if (pauta.status_blog) {
    if (!pauta.pesquisa_conteudo) gaps.push("pesquisa");
    if (!pauta.draft_path) gaps.push("draft");
    if (!pauta.post_id) gaps.push("artigo");
    if (!pauta.capa_blog_url) gaps.push("capa_blog");
    if (pauta.status_blog === "publicado" && pauta.posts?.status !== "published")
      gaps.push("publicacao_real_blog");
  }
  if (pauta.status_linkedin) {
    if (!pauta.linkedin_texto) gaps.push("texto_linkedin");
    if (!pauta.capa_linkedin_url) gaps.push("capa_linkedin");
    if (pauta.status_linkedin === "publicado" && (!pauta.linkedin_url || !pauta.linkedin_publicado_em))
      gaps.push("publicacao_real_linkedin");
  }
  return gaps;
}

function proximaAcaoPauta(pauta) {
  if (pauta.status_blog) {
    if (!pauta.pesquisa_conteudo) return "pesquisar";
    if (!pauta.draft_path) return "criar-draft";
    if (!pauta.post_id || !pauta.capa_blog_url) return "produzir-artigo";
    if (pauta.posts?.status !== "published") return "revisar";
  }
  if (pauta.status_linkedin) {
    if (!pauta.linkedin_texto || !pauta.capa_linkedin_url) return "produzir-linkedin";
    if (!pauta.linkedin_url || !pauta.linkedin_publicado_em) return "preparar-publicacao";
  }
  return "concluido-real";
}

async function contextoPauta(id, { include = "", json = false, silent = false } = {}) {
  garantirId(id);
  const { data: pauta, error } = await db.from("conteudo_pautas")
    .select(`${CAMPOS},posts(slug,title,status,published_at)`)
    .eq("id", id).maybeSingle();
  if (error) abortar(error.message);
  if (!pauta) abortar(`nenhuma pauta com id ${id}`);

  const { data: tagRows } = await db.from("conteudo_pauta_tags")
    .select("tag_slug").eq("pauta_id", id);
  const inclusoes = new Set(String(include || "").split(",").filter(Boolean));
  const blocos = {};
  if (inclusoes.has("pesquisa") && pauta.pesquisa_conteudo)
    blocos.pesquisa = pauta.pesquisa_conteudo;
  if (inclusoes.has("linkedin") && pauta.linkedin_texto)
    blocos.linkedin = pauta.linkedin_texto;
  if (inclusoes.has("draft") && pauta.draft_path) {
    const caminho = resolve(ROOT, pauta.draft_path);
    if (existsSync(caminho)) blocos.draft = readFileSync(caminho, "utf8");
  }

  const payload = {
    pauta_id: pauta.id,
    titulo: pauta.titulo,
    status_blog: pauta.status_blog,
    status_linkedin: pauta.status_linkedin,
    plataformas: pauta.plataformas,
    keyword: pauta.keyword,
    data_alvo: pauta.data_alvo,
    tags: (tagRows || []).map((row) => row.tag_slug),
    gaps: gapsDaPauta(pauta),
    proxima_acao: proximaAcaoPauta(pauta),
    atualizado_em: pauta.atualizado_em,
    hashes: {
      pesquisa: hashTexto(pauta.pesquisa_conteudo),
      linkedin: hashTexto(pauta.linkedin_texto),
      draft_path: hashTexto(pauta.draft_path),
    },
    blocos,
  };
  if (silent) return payload;
  if (json) console.log(JSON.stringify(payload, null, 2));
  else {
    console.log(`
${payload.titulo}
próxima: ${payload.proxima_acao}
gaps: ${payload.gaps.join(", ") || "nenhum"}`);
    console.log(`contexto: ${Object.keys(blocos).join(", ") || "somente metadados"}
`);
  }
  return payload;
}

async function validarPauta(id, json) {
  const payload = await contextoPauta(id, { silent: true });
  const resultado = { valido: true, gaps: payload.gaps, proxima_acao: payload.proxima_acao };
  console.log(json ? JSON.stringify(resultado, null, 2) : `válida; ${payload.gaps.length} gap(s)`);
}

async function claimJob(workerId, leaseSeconds, dryRun) {
  if (!workerId) abortar("--worker é obrigatório");
  if (dryRun) {
    console.log("🔍 --dry-run: consultaria o próximo job sem reservar.");
    return;
  }
  const { data, error } = await db.rpc("claim_conteudo_automation_job", {
    p_worker_id: workerId,
    p_lease_seconds: Number(leaseSeconds || 900),
  });
  if (error) abortar(error.message);
  console.log(JSON.stringify(data?.[0] || null, null, 2));
}

async function finalizarJob(id, workerId, status, flags) {
  garantirId(id);
  if (!workerId) abortar("--worker é obrigatório");
  if (!flags["run-id"]) abortar("--run-id is required");
  if (flags["dry-run"]) {
    console.log(`🔍 --dry-run: finalizaria ${id} como ${status}.`);
    return;
  }
  const { data, error } = await db.rpc("finalizar_conteudo_automation_job", {
    p_job_id: id,
    p_worker_id: workerId,
    p_run_id: flags["run-id"],
    p_status: status,
    p_context_hashes: flags.hashes ? JSON.parse(flags.hashes) : {},
    p_tokens_entrada: flags["tokens-entrada"] ? Number(flags["tokens-entrada"]) : null,
    p_tokens_saida: flags["tokens-saida"] ? Number(flags["tokens-saida"]) : null,
    p_custo_estimado: flags.custo ? Number(flags.custo) : null,
    p_erro: flags.erro || null,
  });
  if (error) abortar(error.message);
  console.log(JSON.stringify(data, null, 2));
}

const [comando, ...resto] = process.argv.slice(2);
const flags = Object.fromEntries(
  resto.filter((arg) => arg.startsWith("--")).map((arg) => {
    const [chave, ...valor] = arg.slice(2).split("=");
    return [chave, valor.length ? valor.join("=") : true];
  })
);
const posicional = resto.filter((arg) => !arg.startsWith("--"));
const dryRun = Boolean(flags["dry-run"]);

switch (comando) {
  case "buscar":
    await buscar(posicional[0], flags.slug);
    break;
  case "ver":
    await ver(posicional[0]);
    break;
  case "proxima":
    await contextoPauta(posicional[0], {
      include: flags.include,
      json: Boolean(flags.json),
    });
    break;
  case "validar":
    await validarPauta(posicional[0], Boolean(flags.json));
    break;
  case "job-claim":
    await claimJob(flags.worker, flags.lease, dryRun);
    break;
  case "job-complete":
    await finalizarJob(posicional[0], flags.worker, flags.status || "concluido", flags);
    break;
  case "job-fail":
    await finalizarJob(posicional[0], flags.worker, "falhou", flags);
    break;
  case "criar":
    await criar({
      titulo: flags.titulo,
      plataformas: flags.plataformas,
      confirmar: Boolean(flags["confirmar-aprovacao"]),
      dryRun,
    });
    break;
  case "gravar":
    await gravar(posicional[0], {
      bloco: flags.bloco,
      arquivo: flags.arquivo,
      forcar: Boolean(flags.forcar),
      confirmar: Boolean(flags["confirmar-substituicao"]),
      expected: flags["expected-updated-at"],
      dryRun,
    });
    break;
  case "registrar-draft":
    await registrarDraft(posicional[0], {
      arquivo: flags.arquivo,
      forcar: Boolean(flags.forcar),
      confirmar: Boolean(flags["confirmar-substituicao"]),
      expected: flags["expected-updated-at"],
      dryRun,
    });
    break;
  case "produzir":
    await produzir(posicional[0], {
      arquivo: flags.arquivo,
      dados: flags.dados,
      usarExistente: Boolean(flags["usar-existente"]),
      expected: flags["expected-updated-at"],
      dryRun,
    });
    break;
  case "publicar":
    await publicar(posicional[0], { expected: flags["expected-updated-at"], dryRun });
    break;
  default:
    console.log(`
uso:
  pauta.mjs buscar "<termo>" [--slug=<artigo>]
  pauta.mjs ver <id>
  pauta.mjs proxima <id> [--json] [--include=pesquisa,draft,linkedin]
  pauta.mjs validar <id> [--json]
  pauta.mjs job-claim --worker=<id> [--lease=900] [--dry-run]
  pauta.mjs job-complete <job-id> --worker=<id> --run-id=<uuid> [--status=concluido|aguardando-aprovacao]
  pauta.mjs job-fail <job-id> --worker=<id> --run-id=<uuid> --erro="<mensagem>"
  pauta.mjs criar --titulo="<título>" [--plataformas=blog,linkedin] --confirmar-aprovacao [--dry-run]
  pauta.mjs gravar <id> --bloco=<bloco> --arquivo=<path> [--forcar --confirmar-substituicao] [--expected-updated-at=<iso>] [--dry-run]
  pauta.mjs registrar-draft <id> --arquivo=<markdown> [--expected-updated-at=<iso>] [--dry-run]
  pauta.mjs produzir <id> --arquivo=<draft.md> --dados=<post.json> [--usar-existente] [--expected-updated-at=<iso>] [--dry-run]
  pauta.mjs publicar <id> [--expected-updated-at=<iso>] [--dry-run]

blocos: ${Object.keys(COLUNA_DO_BLOCO).join(" | ")}
`);
    process.exit(comando ? 2 : 0);
}
