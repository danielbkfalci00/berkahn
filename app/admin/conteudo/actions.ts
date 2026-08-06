"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ehColunaPauta,
  ehPlataforma,
  LIMITES,
  toPauta,
  type BlocoTextoPauta,
  type ColunaPauta,
  type Funil,
  type Intencao,
  type Pauta,
  type PautaRow,
  type Plataforma,
  type TipoPauta,
  type Trilha,
} from "@/types/conteudo";

type Resultado<T = null> = { data: T; error: string | null };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SELECT_COM_ARTIGO = `
  id, titulo, tipo, coluna, ordem,
  keyword, intencao, funil, prioridade, trilha, semana, data_alvo,
  insights, pesquisa_conteudo, post_id,
  capa_blog_url, capa_linkedin_url, linkedin_texto, linkedin_briefing,
  linkedin_imagem_prompt, linkedin_imagem_briefing,
  plataformas, criado_por, criado_em, atualizado_em,
  posts ( id, slug, title, status, published_at )
`;

/**
 * Mensagem para quando um UPDATE/DELETE não atinge linha nenhuma.
 *
 * ⚠️ O PostgREST **não** devolve erro quando a RLS filtra a linha: a operação
 * "funciona" e afeta zero linhas. Sem checar isso, uma sessão que expirou com a
 * aba aberta faz o autosave reportar "Salvo" para sempre enquanto o banco não
 * recebe nada — e a pessoa perde o texto ao fechar a aba. Verificado: `update`
 * com a anon key nesta tabela retorna `error: null` e `data: []`.
 */
const SEM_LINHA =
  "Nada foi gravado. Sua sessão pode ter expirado — abra o admin em outra aba, confirme que está logado e tente de novo.";

/** Corta e normaliza texto livre; string vazia vira null. */
function limpar(valor: string | null | undefined, max: number): string | null {
  if (valor === null || valor === undefined) return null;
  const texto = valor.trim().slice(0, max);
  return texto === "" ? null : texto;
}

async function registrarLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  acao: string,
  pautaId: string,
  titulo: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("activity_logs").insert({
    user_id: user.id,
    user_name: user.email || "Admin",
    action: acao,
    entity_type: "pauta",
    entity_id: pautaId,
    entity_name: titulo,
  });
}

// ============================================
// Criar / atualizar / excluir
// ============================================

export async function criarPauta(input: {
  titulo: string;
  coluna?: ColunaPauta;
  tipo?: TipoPauta;
  plataformas?: Plataforma[];
}): Promise<Resultado<Pauta | null>> {
  const titulo = limpar(input.titulo, LIMITES.tituloMax);
  if (!titulo) return { data: null, error: "Título obrigatório." };

  const coluna =
    input.coluna && ehColunaPauta(input.coluna) ? input.coluna : "decisao";
  const plataformas = (input.plataformas ?? []).filter(ehPlataforma);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Entra no fim da coluna de destino.
  const { data: ultima } = await supabase
    .from("conteudo_pautas")
    .select("ordem")
    .eq("coluna", coluna)
    .order("ordem", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("conteudo_pautas")
    .insert({
      titulo,
      coluna,
      tipo: input.tipo ?? "pauta",
      plataformas,
      ordem: ((ultima?.ordem as number | undefined) ?? 0) + 1,
      criado_por: user?.email ?? null,
    })
    .select(SELECT_COM_ARTIGO)
    .single();

  if (error) return { data: null, error: error.message };

  const pauta = toPauta(data as unknown as PautaRow);
  await registrarLog(supabase, "Pauta criada", pauta.id, pauta.titulo);
  revalidatePath("/admin/conteudo");
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
  }
): Promise<Resultado<Pauta | null>> {
  if (!UUID_PATTERN.test(id)) return { data: null, error: "Pauta inválida." };

  const update: Record<string, unknown> = {};

  if (patch.titulo !== undefined) {
    const titulo = limpar(patch.titulo, LIMITES.tituloMax);
    if (!titulo) return { data: null, error: "Título não pode ficar vazio." };
    update.titulo = titulo;
  }
  if (patch.keyword !== undefined)
    update.keyword = limpar(patch.keyword, LIMITES.keywordMax);
  if (patch.intencao !== undefined) update.intencao = patch.intencao;
  if (patch.funil !== undefined) update.funil = patch.funil;
  if (patch.trilha !== undefined) update.trilha = patch.trilha;
  if (patch.dataAlvo !== undefined) update.data_alvo = patch.dataAlvo || null;

  if (patch.prioridade !== undefined) {
    const p = patch.prioridade;
    if (p !== null && (!Number.isInteger(p) || p < 1 || p > 5))
      return { data: null, error: "Prioridade deve ser de 1 a 5." };
    update.prioridade = p;
  }
  if (patch.semana !== undefined) {
    const s = patch.semana;
    if (s !== null && (!Number.isInteger(s) || s < 1 || s > 53))
      return { data: null, error: "Semana deve ser de 1 a 53." };
    update.semana = s;
  }
  if (patch.plataformas !== undefined)
    update.plataformas = patch.plataformas.filter(ehPlataforma);

  if (Object.keys(update).length === 0)
    return { data: null, error: "Nada para atualizar." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_pautas")
    .update(update)
    .eq("id", id)
    .select(SELECT_COM_ARTIGO)
    .single();

  if (error) return { data: null, error: error.message };
  revalidatePath("/admin/conteudo");
  return { data: toPauta(data as unknown as PautaRow), error: null };
}

export async function excluirPauta(id: string): Promise<Resultado> {
  if (!UUID_PATTERN.test(id)) return { data: null, error: "Pauta inválida." };

  const supabase = await createClient();

  // Lê o título antes de apagar: depois do delete não há de onde tirar.
  const { data: alvo } = await supabase
    .from("conteudo_pautas")
    .select("titulo")
    .eq("id", id)
    .maybeSingle();

  const { data: apagadas, error } = await supabase
    .from("conteudo_pautas")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) return { data: null, error: error.message };
  if (!apagadas || apagadas.length === 0) return { data: null, error: SEM_LINHA };

  await registrarLog(
    supabase,
    "Pauta excluída",
    id,
    (alvo?.titulo as string | undefined) ?? "(sem título)"
  );
  revalidatePath("/admin/conteudo");
  return { data: null, error: null };
}

// ============================================
// Blocos de texto
// ============================================

/**
 * Allowlist bloco → coluna.
 *
 * ⚠️ É a fronteira de segurança desta action. Passar o nome do bloco direto
 * para `.update({ [bloco]: texto })` deixaria o cliente escolher a coluna a
 * escrever — daria para sobrescrever `post_id`, `coluna` ou `ordem` mandando
 * outra string. O mapa fecha isso: só estas três chaves existem.
 */
const COLUNA_DO_BLOCO: Record<BlocoTextoPauta, string> = {
  insights: "insights",
  pesquisa: "pesquisa_conteudo",
  linkedin: "linkedin_texto",
  "imagem-prompt": "linkedin_imagem_prompt",
  "imagem-briefing": "linkedin_imagem_briefing",
};

/**
 * Salva um dos blocos de texto longo.
 *
 * Sem `revalidatePath`, deliberado — mesma razão de `moverPautas` e do
 * `reorderTasks` em app/admin/analytics/actions.ts: a UI é otimista e o
 * autosave dispara a cada pausa de digitação. Revalidar re-buscaria o quadro
 * inteiro a cada 1,2s e causaria flicker no que a pessoa está escrevendo.
 */
export async function salvarBloco(
  id: string,
  bloco: BlocoTextoPauta,
  texto: string
): Promise<Resultado> {
  if (!UUID_PATTERN.test(id)) return { data: null, error: "Pauta inválida." };

  const coluna = COLUNA_DO_BLOCO[bloco];
  if (!coluna) return { data: null, error: "Bloco desconhecido." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_pautas")
    .update({ [coluna]: limpar(texto, LIMITES.blocoMax) })
    .eq("id", id)
    .select("id");

  if (error) return { data: null, error: error.message };
  if (!data || data.length === 0) return { data: null, error: SEM_LINHA };
  return { data: null, error: null };
}

// ============================================
// Drag and drop
// ============================================

/**
 * Persiste coluna e ordem depois de um arrasto.
 *
 * Recebe só as linhas que mudaram (o cliente diffa contra o snapshot
 * pré-arrasto), e não a coluna inteira: com 66 pautas, recalcular tudo seria
 * 66 round-trips por card solto.
 *
 * Sem `revalidatePath` — ver a nota em `salvarBloco`.
 */
export async function moverPautas(
  updates: { id: string; coluna: ColunaPauta; ordem: number }[]
): Promise<Resultado> {
  if (updates.length === 0) return { data: null, error: null };

  for (const u of updates) {
    if (!UUID_PATTERN.test(u.id))
      return { data: null, error: "Pauta inválida no lote." };
    if (!ehColunaPauta(u.coluna))
      return { data: null, error: `Coluna desconhecida: ${u.coluna}` };
    if (!Number.isInteger(u.ordem))
      return { data: null, error: "Ordem inválida." };
  }

  const supabase = await createClient();
  for (const u of updates) {
    const { data, error } = await supabase
      .from("conteudo_pautas")
      .update({ coluna: u.coluna, ordem: u.ordem })
      .eq("id", u.id)
      .select("id");
    if (error) return { data: null, error: error.message };
    if (!data || data.length === 0) return { data: null, error: SEM_LINHA };
  }

  return { data: null, error: null };
}

// ============================================
// Artigo vinculado
// ============================================

/**
 * Liga (ou desliga) a pauta de um artigo.
 *
 * O pré-check existe porque a UNIQUE parcial de `post_id` vai disparar de
 * verdade: quatro pautas Core do calendário são refresh declarado de artigo
 * existente. Disparar é o comportamento certo — significa "esses dois cards
 * são o mesmo assunto". O que não pode é vazar `duplicate key value violates
 * unique constraint` na tela.
 */
export async function vincularPost(
  pautaId: string,
  postId: string | null
): Promise<Resultado<Pauta | null>> {
  if (!UUID_PATTERN.test(pautaId))
    return { data: null, error: "Pauta inválida." };
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
    pauta.titulo
  );
  revalidatePath("/admin/conteudo");
  return { data: pauta, error: null };
}

// ============================================
// Capas
// ============================================

const TAMANHO_MAX_CAPA = 5 * 1024 * 1024;
const COLUNA_DA_CAPA = {
  blog: "capa_blog_url",
  linkedin: "capa_linkedin_url",
} as const;

export type TipoCapa = keyof typeof COLUNA_DA_CAPA;

/**
 * Sobe uma capa para o bucket `post-images`.
 *
 * Path próprio `conteudo/{pauta_id}/{tipo}.{ext}`: as duas convenções que já
 * existem no projeto não servem. `covers/{slug}` (upload-actions.ts) depende
 * de um slug de POST, que a pauta pode não ter; a de lib/services/storage.ts
 * está órfã. O `upsert` mantém uma capa por tipo, sem acumular lixo.
 */
export async function definirCapa(
  formData: FormData
): Promise<Resultado<{ url: string } | null>> {
  const pautaId = String(formData.get("pautaId") ?? "");
  const tipo = String(formData.get("tipo") ?? "") as TipoCapa;
  const arquivo = formData.get("arquivo") as File | null;

  if (!UUID_PATTERN.test(pautaId))
    return { data: null, error: "Pauta inválida." };
  if (!COLUNA_DA_CAPA[tipo])
    return { data: null, error: "Tipo de capa desconhecido." };
  if (!arquivo || arquivo.size === 0)
    return { data: null, error: "Nenhum arquivo enviado." };
  if (!arquivo.type.startsWith("image/"))
    return { data: null, error: "O arquivo precisa ser uma imagem." };
  if (arquivo.size > TAMANHO_MAX_CAPA)
    return { data: null, error: "A imagem passa de 5 MB." };

  const ext = (arquivo.name.split(".").pop() ?? "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const caminho = `conteudo/${pautaId}/${tipo}.${ext || "jpg"}`;

  const supabase = await createClient();
  const { error: erroUpload } = await supabase.storage
    .from("post-images")
    .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type });

  if (erroUpload) return { data: null, error: erroUpload.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("post-images").getPublicUrl(caminho);

  // Query string com o timestamp: o path é o mesmo a cada upsert, então sem
  // isso o navegador serve a capa antiga do cache depois de trocar a imagem.
  const url = `${publicUrl}?v=${Date.now()}`;

  const { data: linhas, error } = await supabase
    .from("conteudo_pautas")
    .update({ [COLUNA_DA_CAPA[tipo]]: url })
    .eq("id", pautaId)
    .select("id");

  if (error) return { data: null, error: error.message };
  if (!linhas || linhas.length === 0) return { data: null, error: SEM_LINHA };
  revalidatePath("/admin/conteudo");
  return { data: { url }, error: null };
}

export async function removerCapa(
  pautaId: string,
  tipo: TipoCapa
): Promise<Resultado> {
  if (!UUID_PATTERN.test(pautaId))
    return { data: null, error: "Pauta inválida." };
  if (!COLUNA_DA_CAPA[tipo])
    return { data: null, error: "Tipo de capa desconhecido." };

  const supabase = await createClient();
  const { data: linhas, error } = await supabase
    .from("conteudo_pautas")
    .update({ [COLUNA_DA_CAPA[tipo]]: null })
    .eq("id", pautaId)
    .select("id");

  if (error) return { data: null, error: error.message };
  if (!linhas || linhas.length === 0) return { data: null, error: SEM_LINHA };
  revalidatePath("/admin/conteudo");
  return { data: null, error: null };
}
