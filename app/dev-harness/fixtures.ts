import type { Thread } from "@/types/comentario";

/**
 * Threads de mentira para inspecionar o painel sem banco e sem sessão.
 *
 * O painel real vive atrás do login do admin, e as tabelas da migration 009
 * podem ainda não existir. Isto cobre layout, filtros, agrupamento de órfãs e
 * os avisos — não cobre as server actions, que precisam das tabelas.
 */
export function threadsDeExemplo(agora: string): Thread[] {
  const ontem = new Date(Date.parse(agora) - 86400_000).toISOString();
  const semanaPassada = new Date(Date.parse(agora) - 7 * 86400_000).toISOString();

  return [
    {
      id: "fix-1",
      documentoSlug: "harness",
      ancora: {
        textoExato: "Relatório parcial",
        prefixo: "",
        sufixo: "",
        posicaoRelativa: 0.02,
        ancoraSecao: null,
      },
      docVersao: agora,
      status: "aberto",
      resolvidoPor: null,
      resolvidoEm: null,
      criadoPor: "Bruno",
      criadoEm: ontem,
      comentarios: [
        {
          id: "c1",
          threadId: "fix-1",
          corpo: "Dá pra deixar explícito que o mês ainda não fechou? Quem lê de fora acha que é o número final.",
          tipo: "duvida",
          autorNome: "Bruno",
          autorUserId: null,
          editadoEm: null,
          criadoEm: ontem,
        },
        {
          id: "c2",
          threadId: "fix-1",
          corpo: "Concordo, e o rodapé já tem o aviso. Subo pro topo.",
          tipo: "aprovacao",
          autorNome: "Convidado",
          autorUserId: null,
          editadoEm: null,
          criadoEm: agora,
        },
      ],
    },
    {
      id: "fix-2",
      documentoSlug: "harness",
      ancora: {
        textoExato: "este trecho nao existe mais no documento",
        prefixo: "",
        sufixo: "",
        posicaoRelativa: 0.4,
        ancoraSecao: null,
      },
      // Versão antiga: dispara o aviso de documento alterado.
      docVersao: semanaPassada,
      status: "aberto",
      resolvidoPor: null,
      resolvidoEm: null,
      criadoPor: "Bruno",
      criadoEm: semanaPassada,
      comentarios: [
        {
          id: "c3",
          threadId: "fix-2",
          corpo: "Este número está desatualizado desde a rodada parcial.",
          tipo: "reprovacao",
          autorNome: "Bruno",
          autorUserId: null,
          editadoEm: semanaPassada,
          criadoEm: semanaPassada,
        },
      ],
    },
    {
      id: "fix-3",
      documentoSlug: "harness",
      ancora: {
        textoExato: "Construir ou reformar",
        prefixo: "",
        sufixo: "",
        posicaoRelativa: 0.55,
        ancoraSecao: null,
      },
      // Ancorada e defasada ao mesmo tempo: é o único jeito de ver o aviso de
      // "documento mudou" sem o de órfã por cima.
      docVersao: semanaPassada,
      status: "resolvido",
      resolvidoPor: "Bruno",
      resolvidoEm: agora,
      criadoPor: "Convidado",
      criadoEm: semanaPassada,
      comentarios: [
        {
          id: "c4",
          threadId: "fix-3",
          corpo: "Fechado: mantivemos o título como está.",
          tipo: "comentario",
          autorNome: "Convidado",
          autorUserId: null,
          editadoEm: null,
          criadoEm: semanaPassada,
        },
      ],
    },
  ];
}
