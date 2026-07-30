// Protocolo de mensagens entre o admin e o iframe do documento.
//
// Tipos mais uma única string: é importado pelos dois lados, e o lado do admin
// é um client component — qualquer coisa maior aqui entraria no bundle do
// cliente. A ponte (bridge.ts) NÃO importa deste arquivo e repete a string
// literalmente, pela regra de serialização documentada lá.

import type { Ancora } from "@/types/comentario";

/** Discrimina as mensagens da ponte de qualquer outro postMessage na página. */
export const NAMESPACE = "berkahn-doc-bridge";

/** Retângulo da seleção, em coordenadas do viewport DO IFRAME. */
export interface RectSelecao {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface AncoraParaPintar {
  threadId: string;
  ancora: Ancora;
}

export type MensagemDoDocumento =
  | { ns: typeof NAMESPACE; tipo: "ready" }
  | {
      ns: typeof NAMESPACE;
      tipo: "selecao";
      ancora: Ancora;
      rect: RectSelecao;
    }
  | { ns: typeof NAMESPACE; tipo: "selecao-cancelada" }
  | { ns: typeof NAMESPACE; tipo: "clique"; threadId: string }
  | {
      ns: typeof NAMESPACE;
      tipo: "resolucao";
      resolvidos: string[];
      orfaos: string[];
    };

export type MensagemDoAdmin =
  | { ns: typeof NAMESPACE; tipo: "hello" }
  | { ns: typeof NAMESPACE; tipo: "pintar"; ancoras: AncoraParaPintar[] }
  | { ns: typeof NAMESPACE; tipo: "ir-para"; threadId: string }
  | { ns: typeof NAMESPACE; tipo: "realce"; threadId: string | null };

/**
 * Mensagem sem o campo de namespace, para quem só monta o corpo.
 * Distributivo de propósito: `Omit<Uniao, "ns">` colapsaria a união nas
 * propriedades comuns e perderia os campos de cada variante.
 */
export type SemNs<T> = T extends { ns: unknown } ? Omit<T, "ns"> : never;

/** Config injetada no script pelo route handler. */
export interface ConfigPonte {
  /** Origem exata do admin. child -> parent nunca usa '*'. */
  parentOrigin: string;
  slug: string;
}
