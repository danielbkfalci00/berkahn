"use server";

import { createHash } from "node:crypto";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  ehPlataforma,
  ehStatusDoCanal,
  LIMITES,
  toPauta,
  type AcaoAutomacao,
  type BlocoTextoPauta,
  type CanalConteudo,
  type Funil,
  type Intencao,
  type Pauta,
  type PautaRow,
  type Plataforma,
  type StatusBlog,
  type StatusLinkedin,
  type TipoPauta,
  type TagConteudo,
  type Trilha,
} from "@/types/conteudo";

type Resultado<T = null> = { data: T; error: string | null };
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SELECT_COM_ARTIGO = `
  id, titulo, tipo,
  status_blog, status_linkedin, ordem_blog, ordem_linkedin,
  draft_path, linkedin_url, linkedin_publicado_em,
  keyword, intencao, funil, prioridade, trilha, semana, data_alvo,
  insights, pesquisa_conteudo, post_id,
  capa_blog_url, capa_linkedin_url, linkedin_texto, linkedin_briefing,
  linkedin_imagem_prompt, linkedin_imagem_briefing,
  plataformas, criado_por, criado_em, atualizado_em,
  posts ( id, slug, title, status, published_at )
`;
const SEM_LINHA =
  "Nada foi gravado. Sua sessão pode ter expirado — abra o admin em outra aba, confirme que está logado e tente de novo.";

function limpar(valor: string | null | undefined, max: number): string | null {
  if (valor === null || valor === undefined) return null;
  const texto = valor.trim().slice(0, max);
  return texto === "" ? null : texto;
}

function revalidarPauta(id?: string) {
  revalidatePath("/admin/conteudo");
  if (id) revalidatePath(`/admin/conteudo/${id}`);
}

async function registrarLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  acao: string,
  pautaId: string,
  titulo: string,
  details?: Record<string, unknown>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("activity_logs").insert({
    user_id: user.id,
    user_name: user.email || "Admin",
    action: acao,
    entity_type: "pauta",
    entity_id: pautaId,
    entity_name: titulo,
    details: details ?? null,
  });
}

export async function criarPauta(input: {
  titulo: string;
  tipo?: TipoPauta;
  plataformas?: Plataforma[];
  canal?: CanalConteudo;
  status?: StatusBlog | StatusLinkedin;
}): Promise<Resultado<Pauta | null>> {
  const titulo = limpar(input.titulo, LIMITES.tituloMax);
  if (!titulo) return { data: null, error: "Título obrigatório." };

  const plataformas = [
    ...new Set(
      (input.plataformas ??
        (input.tipo === "linkedin-acervo" ? ["linkedin"] : ["blog", "linkedin"]))
        .filter(ehPlataforma)
    ),
  ];
  if (plataformas.length === 0)
    return { data: null, error: "Escolha ao menos uma plataforma." };
  if (input.canal && !plataformas.includes(input.canal))
    return { data: null, error: "A coluna escolhida não pertence às plataformas da pauta." };
  if (input.canal && input.status && !ehStatusDoCanal(input.canal, input.status))
    return { data: null, error: "Status inválido para o canal." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const insert: Record<string, unknown> = {
    titulo,
    tipo: input.tipo ?? "pauta",
    plataformas,
    criado_por: user?.email ?? null,
  };
  if (input.canal === "blog" && input.status) insert.status_blog = input.status;
  if (input.canal === "linkedin" && input.status) insert.status_linkedin = input.status;

  const { data, error } = await supabase
    .from("conteudo_pautas")
    .insert(insert)
    .select(SELECT_COM_ARTIGO)
    .single();

  if (error) return { data: null, error: error.message };
  const pauta = toPauta(data as unknown as PautaRow);
  await registrarLog(supabase, "Pauta criada", pauta.id, pauta.titulo, {
    origem: "admin",
    plataformas,
  });
  revalidarPauta(pauta.id);
  return { data: pauta, error: null };
}

export async function atualizarPauta(
  id: string,
  patch: {
    titulo?: string;
    keyword?: string | null;
    intencao?: Intencao | null;
    funil?: Funil | null;
    prioridade?: number | null;
    trilha?: Trilha | null;
    semana?: number | null;
    dataAlvo?: string | null;
    plataformas?: Plataforma[];
    tags?: TagConteudo[];
  }
): Promise<Resultado<Pauta | null>> {
  if (!UUID_PATTERN.test(id)) return { data: null, error: "Pauta inválida." };
  const update: Record<string, unknown> = {};

  if (patch.titulo !== undefined) {
    const titulo = limpar(patch.titulo, LIMITES.tituloMax);
    if (!titulo) return { data: null, error: "Título não pode ficar vazio." };
    update.titulo = titulo;
  }
  if (patch.keyword !== undefined) update.keyword = limpar(patch.keyword, LIMITES.keywordMax);
  if (patch.intencao !== undefined) update.intencao = patch.intencao;
  if (patch.funil !== undefined) update.funil = patch.funil;
  if (patch.trilha !== undefined) update.trilha = patch.trilha;
  if (patch.dataAlvo !== undefined) update.data_alvo = patch.dataAlvo || null;
  if (patch.prioridade !== undefined) {
    if (
      patch.prioridade !== null &&
      (!Number.isInteger(patch.prioridade) || patch.prioridade < 1 || patch.prioridade > 5)
    ) return { data: null, error: "Prioridade deve ser de 1 a 5." };
    update.prioridade = patch.prioridade;
  }
  if (patch.semana !== undefined) {
    if (
      patch.semana !== null &&
      (!Number.isInteger(patch.semana) || patch.semana < 1 || patch.semana > 53)
    ) return { data: null, error: "Semana deve ser de 1 a 53." };
    update.semana = patch.semana;
  }
  if (patch.plataformas !== undefined) {
    const plataformas = [...new Set(patch.plataformas.filter(ehPlataforma))];
    if (plataformas.length === 0)
      return { data: null, error: "A pauta precisa de ao menos uma plataforma." };
    update.plataformas = plataformas;
  }

  const tags = patch.tags === undefined
    ? undefined
    : [...new Set(patch.tags.filter((tag): tag is TagConteudo => /^domain\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)))];
  if (patch.tags !== undefined && tags?.length !== patch.tags.length)
    return { data: null, error: "Uma ou mais tags não pertencem à taxonomia oficial." };
  if (Object.keys(update).length === 0 && tags === undefined)
    return { data: null, error: "Nada para atualizar." };

  const supabase = await createClient();
  let data: unknown;
  if (Object.keys(update).length > 0) {
    const resultado = await supabase
      .from("conteudo_pautas")
      .update(update)
      .eq("id", id)
      .select(SELECT_COM_ARTIGO)
      .single();
    if (resultado.error) return { data: null, error: resultado.error.message };
    data = resultado.data;
  } else {
    const resultado = await supabase
      .from("conteudo_pautas")
      .select(SELECT_COM_ARTIGO)
      .eq("id", id)
      .single();
    if (resultado.error) return { data: null, error: resultado.error.message };
    data = resultado.data;
  }

  if (tags !== undefined) {
    const { error } = await supabase.rpc("atualizar_tags_pauta", {
      p_pauta_id: id,
      p_tags: tags,
    });
    if (error) return { data: null, error: error.message };
  }

  const { data: tagRows } = await supabase
    .from("conteudo_pauta_tags")
    .select("tag_slug")
    .eq("pauta_id", id);
  const pauta = toPauta(data as PautaRow);
  pauta.tags = (tagRows ?? []).map((row) => row.tag_slug as TagConteudo);
  revalidarPauta(id);
  return { data: pauta, error: null };
}

export async function excluirPauta(id: string): Promise<Resultado> {
  if (!UUID_PATTERN.test(id)) return { data: null, error: "Pauta inválida." };
  const supabase = await createClient();
  const { data: alvo } = await supabase
    .from("conteudo_pautas")
    .select("titulo,capa_blog_url,capa_linkedin_url")
    .eq("id", id)
    .maybeSingle();

  const { data: apagadas, error } = await supabase
    .from("conteudo_pautas")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) return { data: null, error: error.message };
  if (!apagadas?.length) return { data: null, error: SEM_LINHA };

  const caminhos = [
    caminhoStorageDaUrl(alvo?.capa_blog_url ?? null),
    caminhoStorageDaUrl(alvo?.capa_linkedin_url ?? null),
    `conteudo/${id}/blog.jpg`,
    `conteudo/${id}/linkedin.jpg`,
  ].filter((caminho): caminho is string => Boolean(caminho));
  if (caminhos.length) await supabase.storage.from("post-images").remove([...new Set(caminhos)]);
  await registrarLog(
    supabase,
    "Pauta excluída",
    id,
    (alvo?.titulo as string | undefined) ?? "(sem título)",
    { origem: "admin" }
  );
  revalidarPauta();
  return { data: null, error: null };
}

const COLUNA_DO_BLOCO: Record<BlocoTextoPauta, string> = {
  insights: "insights",
  pesquisa: "pesquisa_conteudo",
  linkedin: "linkedin_texto",
  "imagem-prompt": "linkedin_imagem_prompt",
  "imagem-briefing": "linkedin_imagem_briefing",
};

export async function salvarBloco(
  id: string,
  bloco: BlocoTextoPauta,
  texto: string
): Promise<Resultado> {
  if (!UUID_PATTERN.test(id)) return { data: null, error: "Pauta inválida." };
  const coluna = COLUNA_DO_BLOCO[bloco];
  if (!coluna) return { data: null, error: "Bloco desconhecido." };

  const supabase = await createClient();
  const { data: atual } = await supabase
    .from("conteudo_pautas")
    .select("status_blog,status_linkedin,capa_linkedin_url")
    .eq("id", id)
    .maybeSingle();
  if (!atual) return { data: null, error: SEM_LINHA };

  const valor = limpar(texto, LIMITES.blocoMax);
  const update: Record<string, unknown> = { [coluna]: valor };
  if (bloco === "pesquisa" && atual.status_blog === "planejada")
    update.status_blog = "pesquisa";
  if (["linkedin", "imagem-prompt", "imagem-briefing"].includes(bloco)) {
    if (atual.status_linkedin === "planejada") update.status_linkedin = "producao";
    if (
      bloco === "linkedin" &&
      valor &&
      atual.capa_linkedin_url &&
      ["planejada", "producao"].includes(atual.status_linkedin ?? "")
    ) update.status_linkedin = "produzido";
  }

  const { data, error } = await supabase
    .from("conteudo_pautas")
    .update(update)
    .eq("id", id)
    .select("id");
  if (error) return { data: null, error: error.message };
  if (!data?.length) return { data: null, error: SEM_LINHA };
  return { data: null, error: null };
}

export interface MudancaPauta {
  id: string;
  status: StatusBlog | StatusLinkedin;
  ordem: number;
}

export async function moverPautas(
  canal: CanalConteudo,
  updates: MudancaPauta[]
): Promise<Resultado> {
  if (updates.length === 0) return { data: null, error: null };
  for (const update of updates) {
    if (!UUID_PATTERN.test(update.id))
      return { data: null, error: "Pauta inválida no lote." };
    if (!ehStatusDoCanal(canal, update.status))
      return { data: null, error: `Status inválido para ${canal}.` };
    if (!Number.isInteger(update.ordem) || update.ordem < 1)
      return { data: null, error: "Ordem inválida." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("mover_pautas_conteudo", {
    p_canal: canal,
    p_updates: updates,
    p_origem: "admin",
  });
  return { data: null, error: error?.message ?? null };
}

export async function alterarStatusPauta(
  id: string,
  canal: CanalConteudo,
  status: StatusBlog | StatusLinkedin
): Promise<Resultado<Pauta | null>> {
  if (!UUID_PATTERN.test(id)) return { data: null, error: "Pauta inválida." };
  if (!ehStatusDoCanal(canal, status))
    return { data: null, error: "Status inválido para o canal." };

  const supabase = await createClient();
  const colunaStatus = canal === "blog" ? "status_blog" : "status_linkedin";
  const colunaOrdem = canal === "blog" ? "ordem_blog" : "ordem_linkedin";
  const { data: atual } = await supabase
    .from("conteudo_pautas")
    .select(`${colunaStatus},${colunaOrdem}`)
    .eq("id", id)
    .maybeSingle();
  if (!atual) return { data: null, error: SEM_LINHA };

  const statusAtual = atual[colunaStatus as keyof typeof atual] as string | null;
  const ordemAtual = atual[colunaOrdem as keyof typeof atual] as number | null;
  if (statusAtual !== status) {
    const { data: ultima } = await supabase
      .from("conteudo_pautas")
      .select(colunaOrdem)
      .eq(colunaStatus, status)
      .order(colunaOrdem, { ascending: false })
      .limit(1)
      .maybeSingle();
    const ultimaOrdem =
      (ultima?.[colunaOrdem as keyof typeof ultima] as number | undefined) ?? 0;
    const { error } = await supabase.rpc("mover_pautas_conteudo", {
      p_canal: canal,
      p_updates: [{ id, status, ordem: ultimaOrdem + 1 }],
      p_origem: "admin-detalhe",
    });
    if (error) return { data: null, error: error.message };
  } else if (!ordemAtual) {
    return { data: null, error: "A trilha está sem ordem válida." };
  }

  const { data, error } = await supabase
    .from("conteudo_pautas")
    .select(SELECT_COM_ARTIGO)
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  revalidarPauta(id);
  return { data: toPauta(data as unknown as PautaRow), error: null };
}

export async function marcarLinkedinPublicado(
  id: string,
  urlInformada: string,
  dataInformada: string
): Promise<Resultado<Pauta | null>> {
  if (!UUID_PATTERN.test(id)) return { data: null, error: "Pauta inválida." };
  let url: URL;
  try {
    url = new URL(urlInformada.trim());
  } catch {
    return { data: null, error: "Informe uma URL válida do LinkedIn." };
  }
  if (
    url.protocol !== "https:" ||
    !(url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com"))
  ) return { data: null, error: "A URL precisa ser https://...linkedin.com/..." };

  const instante = new Date(dataInformada);
  if (!dataInformada || Number.isNaN(instante.getTime()))
    return { data: null, error: "Informe a data de publicação." };

  const supabase = await createClient();
  const { data: anterior } = await supabase
    .from("conteudo_pautas")
    .select("titulo,status_linkedin")
    .eq("id", id)
    .maybeSingle();
  if (!anterior) return { data: null, error: SEM_LINHA };

  const { data, error } = await supabase
    .from("conteudo_pautas")
    .update({
      linkedin_url: url.toString(),
      linkedin_publicado_em: instante.toISOString(),
      status_linkedin: "publicado",
    })
    .eq("id", id)
    .select(SELECT_COM_ARTIGO)
    .single();
  if (error) return { data: null, error: error.message };

  const pauta = toPauta(data as unknown as PautaRow);
  await registrarLog(supabase, "LinkedIn publicado", id, pauta.titulo, {
    canal: "linkedin",
    origem: "admin",
    anterior: anterior.status_linkedin,
    novo: "publicado",
    url: pauta.linkedinUrl,
  });
  revalidarPauta(id);
  return { data: pauta, error: null };
}

export async function vincularPost(
  pautaId: string,
  postId: string | null
): Promise<Resultado<Pauta | null>> {
  if (!UUID_PATTERN.test(pautaId)) return { data: null, error: "Pauta inválida." };
  if (postId !== null && !UUID_PATTERN.test(postId))
    return { data: null, error: "Artigo inválido." };

  const supabase = await createClient();
  if (postId !== null) {
    const { data: jaTem } = await supabase
      .from("conteudo_pautas")
      .select("id, titulo")
      .eq("post_id", postId)
      .neq("id", pautaId)
      .maybeSingle();
    if (jaTem) {
      return {
        data: null,
        error: `Este artigo já está vinculado à pauta "${jaTem.titulo}". Funda os dois cards em vez de duplicar.`,
      };
    }
  }

  const { data, error } = await supabase
    .from("conteudo_pautas")
    .update({ post_id: postId })
    .eq("id", pautaId)
    .select(SELECT_COM_ARTIGO)
    .single();
  if (error) return { data: null, error: error.message };

  const pauta = toPauta(data as unknown as PautaRow);
  await registrarLog(
    supabase,
    postId ? "Artigo vinculado à pauta" : "Artigo desvinculado da pauta",
    pauta.id,
    pauta.titulo,
    { canal: "blog", origem: "admin", post_id: postId }
  );
  revalidarPauta(pautaId);
  return { data: pauta, error: null };
}

export async function solicitarAutomacao(
  pautaId: string,
  acao: AcaoAutomacao
): Promise<Resultado<{ id: string; status: string } | null>> {
  if (!UUID_PATTERN.test(pautaId)) return { data: null, error: "Pauta inválida." };
  const permitidas: AcaoAutomacao[] = [
    "pesquisar", "criar-draft", "produzir-artigo",
    "produzir-linkedin", "revisar", "preparar-publicacao",
  ];
  if (!permitidas.includes(acao)) return { data: null, error: "Ação inválida." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: SEM_LINHA };
  const { data: pauta } = await supabase
    .from("conteudo_pautas")
    .select("titulo,atualizado_em")
    .eq("id", pautaId)
    .maybeSingle();
  if (!pauta) return { data: null, error: SEM_LINHA };

  const { data, error } = await supabase
    .from("conteudo_automation_jobs")
    .insert({
      pauta_id: pautaId,
      acao,
      solicitado_por: user.id,
      esperado_atualizado_em: pauta.atualizado_em,
    })
    .select("id,status")
    .single();
  if (error?.code === "23505")
    return { data: null, error: "Esta ação já está na fila ou aguardando aprovação." };
  if (error) return { data: null, error: error.message };

  await registrarLog(supabase, "Automação solicitada", pautaId, pauta.titulo, {
    origem: "admin",
    acao,
    job_id: data.id,
  });
  revalidarPauta(pautaId);
  return { data, error: null };
}

export async function cancelarAutomacao(
  pautaId: string,
  jobId: string
): Promise<Resultado> {
  if (!UUID_PATTERN.test(pautaId) || !UUID_PATTERN.test(jobId))
    return { data: null, error: "Job inválido." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_automation_jobs")
    .update({ status: "cancelado" })
    .eq("id", jobId)
    .eq("pauta_id", pautaId)
    .in("status", ["na-fila", "falhou"])
    .select("id");
  if (error) return { data: null, error: error.message };
  if (!data?.length) return { data: null, error: "O job já começou e não pode mais ser cancelado." };
  revalidarPauta(pautaId);
  return { data: null, error: null };
}

const TAMANHO_MAX_CAPA = 5 * 1024 * 1024;
const COLUNA_DA_CAPA = {
  blog: "capa_blog_url",
  linkedin: "capa_linkedin_url",
} as const;
export type TipoCapa = keyof typeof COLUNA_DA_CAPA;

function caminhoStorageDaUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname;
    const marcador = "/post-images/";
    const indice = pathname.indexOf(marcador);
    return indice === -1 ? null : decodeURIComponent(pathname.slice(indice + marcador.length));
  } catch {
    return null;
  }
}

export async function definirCapa(
  formData: FormData
): Promise<Resultado<{ url: string; warning?: string | null; cleanupPath?: string | null } | null>> {
  const pautaId = String(formData.get("pautaId") ?? "");
  const tipo = String(formData.get("tipo") ?? "") as TipoCapa;
  const arquivo = formData.get("arquivo") as File | null;
  if (!UUID_PATTERN.test(pautaId)) return { data: null, error: "Pauta inválida." };
  if (!COLUNA_DA_CAPA[tipo]) return { data: null, error: "Tipo de capa desconhecido." };
  if (!arquivo?.size) return { data: null, error: "Nenhum arquivo enviado." };
  if (!arquivo.type.startsWith("image/"))
    return { data: null, error: "O arquivo precisa ser uma imagem." };
  if (arquivo.size > TAMANHO_MAX_CAPA)
    return { data: null, error: "A imagem passa de 5 MB." };

  const supabase = await createClient();
  const { data: pauta } = await supabase
    .from("conteudo_pautas")
    .select("titulo,capa_blog_url,capa_linkedin_url")
    .eq("id", pautaId)
    .maybeSingle();
  if (!pauta) return { data: null, error: SEM_LINHA };

  let pipeline = sharp(Buffer.from(await arquivo.arrayBuffer())).rotate();
  const metadata = await pipeline.metadata();
  if (!metadata.width || !metadata.height)
    return { data: null, error: "Não foi possível ler as dimensões da imagem." };
  if (tipo === "linkedin") {
    const proporcao = metadata.width / metadata.height;
    if (Math.abs(proporcao - 0.8) > 0.02)
      return { data: null, error: "A capa do LinkedIn precisa estar em 4:5 (ex.: 1080×1350)." };
    pipeline = pipeline.resize(1080, 1350, { fit: "cover" });
  } else {
    pipeline = pipeline.resize(1200, 800, { fit: "cover" });
  }
  const buffer = await pipeline
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 86, progressive: true })
    .toBuffer();

  const hash = createHash("sha256").update(buffer).digest("hex");
  const caminho = `conteudo/${pautaId}/${tipo}/${hash}.jpg`;
  const anteriorUrl = tipo === "blog" ? pauta.capa_blog_url : pauta.capa_linkedin_url;
  const caminhoAnterior = caminhoStorageDaUrl(anteriorUrl);
  const { error: erroUpload } = await supabase.storage
    .from("post-images")
    .upload(caminho, buffer, { upsert: true, contentType: "image/jpeg" });
  if (erroUpload) return { data: null, error: erroUpload.message };

  const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(caminho);
  const { data: linhas, error } = await supabase
    .from("conteudo_pautas")
    .update({ [COLUNA_DA_CAPA[tipo]]: publicUrl })
    .eq("id", pautaId)
    .select("id");
  if (error || !linhas?.length) {
    if (caminhoAnterior !== caminho)
      await supabase.storage.from("post-images").remove([caminho]);
    return { data: null, error: error?.message ?? SEM_LINHA };
  }

  let warning: string | null = null;
  if (caminhoAnterior && caminhoAnterior !== caminho) {
    const { error: limpeza } = await supabase.storage.from("post-images").remove([caminhoAnterior]);
    if (limpeza) warning = "A capa foi salva, mas a versão anterior ficou pendente de limpeza.";
  }
  await registrarLog(supabase, "Capa da pauta atualizada", pautaId, pauta.titulo, {
    origem: "admin",
    tipo,
    caminho,
    anterior: caminhoAnterior,
    cleanup_pendente: Boolean(warning),
  });
  revalidarPauta(pautaId);
  return { data: { url: publicUrl, warning, cleanupPath: warning ? caminhoAnterior : null }, error: null };
}

export async function removerCapa(
  pautaId: string,
  tipo: TipoCapa
): Promise<Resultado<{ warning: string | null; cleanupPath: string | null } | null>> {
  if (!UUID_PATTERN.test(pautaId)) return { data: null, error: "Pauta inválida." };
  if (!COLUNA_DA_CAPA[tipo]) return { data: null, error: "Tipo de capa desconhecido." };

  const supabase = await createClient();
  const coluna = COLUNA_DA_CAPA[tipo];
  const { data: pauta } = await supabase
    .from("conteudo_pautas")
    .select(`titulo,${coluna}`)
    .eq("id", pautaId)
    .maybeSingle();
  if (!pauta) return { data: null, error: SEM_LINHA };
  const urlAnterior = pauta[coluna as keyof typeof pauta] as string | null;
  const caminhoAnterior = caminhoStorageDaUrl(urlAnterior);

  const { data: linhas, error } = await supabase
    .from("conteudo_pautas")
    .update({ [coluna]: null })
    .eq("id", pautaId)
    .select("id");
  if (error) return { data: null, error: error.message };
  if (!linhas?.length) return { data: null, error: SEM_LINHA };

  const { error: erroStorage } = caminhoAnterior
    ? await supabase.storage.from("post-images").remove([caminhoAnterior])
    : { error: null };
  const warning = erroStorage
    ? "A referência foi removida, mas o objeto ficou pendente de limpeza."
    : null;
  await registrarLog(supabase, "Capa da pauta removida", pautaId, String(pauta.titulo), {
    origem: "admin",
    tipo,
    caminho: caminhoAnterior,
    cleanup_pendente: Boolean(warning),
  });
  revalidarPauta(pautaId);
  return { data: { warning, cleanupPath: warning ? caminhoAnterior : null }, error: null };
}

export async function limparObjetoCapa(caminho: string): Promise<Resultado> {
  const seguro =
    new RegExp("^conteudo/[0-9a-f-]{36}/(blog|linkedin)/[0-9a-f]{64}[.]jpg$", "i").test(caminho);
  if (!seguro) return { data: null, error: "Caminho de limpeza inválido." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Sessão expirada." };
  const { error } = await supabase.storage.from("post-images").remove([caminho]);
  return { data: null, error: error?.message ?? null };
}
