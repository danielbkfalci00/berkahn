// Aparência das colunas do quadro.
//
// Módulo NEUTRO de propósito: sem "server-only" e sem "use client". A query o
// usa no servidor para ordenar, o cabeçalho de coluna o usa no cliente para
// pintar. Um `import "server-only"` copiado para cá quebra o build.
//
// A ordem e os rótulos vivem em types/conteudo.ts (COLUNAS, COLUNA_LABEL);
// aqui fica só o que é visual.

import type { ColunaPauta } from "@/types/conteudo";

/**
 * Ponto colorido ao lado do nome da coluna, no espírito do Notion de onde o
 * quadro veio. Tons dessaturados para conviver com o resto do admin, que é
 * preto/off-white — a cor marca progresso, não decora.
 */
export const COLUNA_PONTO: Record<ColunaPauta, string> = {
  decisao: "bg-neutral-400",
  pesquisa: "bg-violet-400",
  envelopar: "bg-rose-400",
  produzido: "bg-sky-400",
  aprovado: "bg-amber-400",
  publicado: "bg-emerald-500",
};

/**
 * Badge de status do artigo vinculado. Estende a paleta semântica que o admin
 * já usa em components/admin/posts/PostsTable.tsx.
 */
export const ARTIGO_BADGE = {
  draft: { label: "Rascunho", classe: "bg-neutral-100 text-neutral-700" },
  scheduled: { label: "Agendado", classe: "bg-amber-100 text-amber-700" },
  published: { label: "No ar", classe: "bg-green-100 text-green-700" },
  archived: { label: "Arquivado", classe: "bg-red-100 text-red-700" },
} as const;
