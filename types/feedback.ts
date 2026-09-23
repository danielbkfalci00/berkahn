// Tipos do mural de feedback do admin
// Tabelas: feedback_itens, feedback_mensagens
// (supabase/migrations/034_admin_feedback.sql)
//
// Sem imports de propósito: scripts/analytics/testar-feedback.mjs compila este
// arquivo isolado para testar a validação real, não uma cópia.

export type StatusFeedback = "aberto" | "implementado";
export type CategoriaFeedback = "melhoria" | "bug" | "ideia" | "outro";
export type OrigemMensagem = "admin" | "cli";
export type FiltroFeedback = StatusFeedback | "todos";

/** Espelham os CHECK da 034. Cortar aqui devolve erro legível em vez de estourar no banco. */
export const LIMITES_FEEDBACK = {
  tituloMin: 4,
  tituloMax: 160,
  corpoMax: 5000,
  paginaMax: 300,
  notaMax: 2000,
} as const;

export const CATEGORIAS_FEEDBACK: CategoriaFeedback[] = ["melhoria", "bug", "ideia", "outro"];

export const CATEGORIA_LABEL: Record<CategoriaFeedback, string> = {
  melhoria: "Melhoria",
  bug: "Bug",
  ideia: "Ideia",
  outro: "Outro",
};

export const STATUS_LABEL: Record<StatusFeedback, string> = {
  aberto: "Aberto",
  implementado: "Implementado",
};

export interface MensagemFeedback {
  id: string;
  itemId: string;
  autorId: string | null;
  autorNome: string;
  corpo: string;
  origem: OrigemMensagem;
  criadoEm: string;
}

export interface ItemFeedback {
  id: string;
  titulo: string;
  categoria: CategoriaFeedback;
  status: StatusFeedback;
  paginaOrigem: string | null;
  autorNome: string;
  implementadoEm: string | null;
  implementadoPor: string | null;
  notaImplementacao: string | null;
  criadoEm: string;
  atualizadoEm: string;
  totalMensagens: number;
}

// ============================================
// Shapes crus do PostgREST (snake_case)
// ============================================

export interface ItemFeedbackRow {
  id: string;
  titulo: string;
  categoria: string;
  status: string;
  pagina_origem: string | null;
  autor_nome: string;
  implementado_em: string | null;
  implementado_por: string | null;
  nota_implementacao: string | null;
  criado_em: string;
  atualizado_em: string;
  feedback_mensagens?: { count: number }[];
}

export interface MensagemFeedbackRow {
  id: string;
  item_id: string;
  autor_id: string | null;
  autor_nome: string;
  corpo: string;
  origem: string;
  criado_em: string;
}

export function isCategoriaFeedback(value: unknown): value is CategoriaFeedback {
  return value === "melhoria" || value === "bug" || value === "ideia" || value === "outro";
}

export function isStatusFeedback(value: unknown): value is StatusFeedback {
  return value === "aberto" || value === "implementado";
}

/** Filtro da URL: qualquer valor desconhecido cai no padrão "aberto". */
export function parseFiltro(value: unknown): FiltroFeedback {
  if (value === "todos" || isStatusFeedback(value)) return value;
  return "aberto";
}

export function toItemFeedback(row: ItemFeedbackRow): ItemFeedback {
  return {
    id: row.id,
    titulo: row.titulo,
    categoria: isCategoriaFeedback(row.categoria) ? row.categoria : "outro",
    status: row.status === "implementado" ? "implementado" : "aberto",
    paginaOrigem: row.pagina_origem,
    autorNome: row.autor_nome,
    implementadoEm: row.implementado_em,
    implementadoPor: row.implementado_por,
    notaImplementacao: row.nota_implementacao,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
    totalMensagens: row.feedback_mensagens?.[0]?.count ?? 0,
  };
}

export function toMensagemFeedback(row: MensagemFeedbackRow): MensagemFeedback {
  return {
    id: row.id,
    itemId: row.item_id,
    autorId: row.autor_id,
    autorNome: row.autor_nome,
    corpo: row.corpo,
    origem: row.origem === "cli" ? "cli" : "admin",
    criadoEm: row.criado_em,
  };
}

// ============================================
// Validação (servidor e cliente usam a mesma)
// ============================================

type Validado<T> = { ok: true; valor: T } | { ok: false; erro: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

/**
 * Só aceita caminho interno do admin. A origem vem do cliente; sem isso um
 * link externo arbitrário viraria um <a> clicável na lista.
 */
export function normalizarPagina(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const limpo = value.trim().split(/[?#]/)[0];
  if (!/^\/admin(\/[\w\-./[\]]*)?$/.test(limpo) || limpo.includes("..")) return null;
  return limpo.slice(0, LIMITES_FEEDBACK.paginaMax);
}

export interface NovoFeedback {
  titulo: string;
  categoria: CategoriaFeedback;
  descricao: string;
  paginaOrigem: string | null;
}

export function validarNovoFeedback(input: {
  titulo?: unknown;
  categoria?: unknown;
  descricao?: unknown;
  paginaOrigem?: unknown;
}): Validado<NovoFeedback> {
  const tituloInformado = typeof input.titulo === "string" ? input.titulo.trim().replace(/\s+/g, " ") : "";
  const descricao = typeof input.descricao === "string" ? input.descricao.trim() : "";
  if (descricao.length > LIMITES_FEEDBACK.corpoMax) {
    return { ok: false, erro: `A descrição aceita até ${LIMITES_FEEDBACK.corpoMax} caracteres.` };
  }
  // O título é opcional na captura rápida; o banco continua recebendo um
  // título válido, derivado do começo da descrição quando necessário.
  const titulo = tituloInformado || descricao.replace(/\s+/g, " ").slice(0, 100);
  if (titulo.length < LIMITES_FEEDBACK.tituloMin) {
    return { ok: false, erro: `Escreva um título ou uma descrição com pelo menos ${LIMITES_FEEDBACK.tituloMin} caracteres.` };
  }
  if (titulo.length > LIMITES_FEEDBACK.tituloMax) {
    return { ok: false, erro: `O título aceita até ${LIMITES_FEEDBACK.tituloMax} caracteres.` };
  }
  if (!isCategoriaFeedback(input.categoria)) return { ok: false, erro: "Escolha uma categoria." };
  return {
    ok: true,
    valor: { titulo, categoria: input.categoria, descricao, paginaOrigem: normalizarPagina(input.paginaOrigem) },
  };
}

export function validarCorpo(value: unknown): Validado<string> {
  const corpo = typeof value === "string" ? value.trim() : "";
  if (!corpo) return { ok: false, erro: "Escreva uma mensagem." };
  if (corpo.length > LIMITES_FEEDBACK.corpoMax) {
    return { ok: false, erro: `A mensagem aceita até ${LIMITES_FEEDBACK.corpoMax} caracteres.` };
  }
  return { ok: true, valor: corpo };
}

export function validarNota(value: unknown): Validado<string | null> {
  const nota = typeof value === "string" ? value.trim() : "";
  if (nota.length > LIMITES_FEEDBACK.notaMax) {
    return { ok: false, erro: `A nota aceita até ${LIMITES_FEEDBACK.notaMax} caracteres.` };
  }
  return { ok: true, valor: nota || null };
}

/**
 * True quando o erro diz que a tabela não existe: PGRST205 (cache do PostgREST)
 * ou 42P01 (Postgres). É o estado normal antes de aplicar a migration 034.
 */
export function isTabelaAusente(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  if (error.code === "PGRST205" || error.code === "42P01") return true;
  return /could not find the table|relation .* does not exist/i.test(error.message ?? "");
}

export const MSG_MIGRATION_PENDENTE =
  "O mural de feedback ainda não está disponível: a migration 034 (admin_feedback) não foi aplicada no banco.";
