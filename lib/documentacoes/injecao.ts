// Injeção do script-ponte no HTML de um documento.
//
// Vive fora do route handler porque o harness (app/_harness/) precisa do MESMO
// caminho de código: um harness que montasse o script por conta própria não
// provaria nada sobre o que a rota real serve.

import "server-only";
import { criarMotorAncoragem } from "./ancoragem";
import { bridgeMain } from "./bridge";

/**
 * Origem do admin, para o `targetOrigin` do child -> parent.
 *
 * Precisa vir do servidor porque o documento roda em origem opaca e não
 * consegue descobrir sozinho quem é o parent (`window.parent.origin` lança).
 */
export function origemDoAdmin(request: Request): string {
  const url = new URL(request.url);
  const proto =
    request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    url.host;
  return `${proto}://${host}`;
}

/**
 * Injeta o script-ponte antes de `</body>`.
 *
 * Duas armadilhas evitadas de propósito:
 *
 * 1. `html.replace("</body>", …)` trocaria a PRIMEIRA ocorrência, e `$` na
 *    string de substituição é especial (`$&`, `$'`) — um payload com cifrão
 *    corromperia a saída em silêncio. Daí lastIndexOf + slice.
 *
 * 2. `criarMotorAncoragem` e `bridgeMain` são serializadas SEPARADAMENTE e cada
 *    uma é autossuficiente. Se uma chamasse a outra, o webpack reescreveria a
 *    chamada como acesso a módulo (`(0,e.Ay)(…)`) e o script quebraria dentro
 *    do iframe — só em produção, porque o dev server não minifica. Ver o
 *    comentário no topo de bridge.ts.
 */
export function injetarPonte(
  html: string,
  parentOrigin: string,
  slug: string
): string {
  const cfg = JSON.stringify({ parentOrigin, slug }).replace(/</g, "\\u003c");

  const tag = `<script>(function(){try{
var motor=(${criarMotorAncoragem.toString()})();
(${bridgeMain.toString()})(${cfg},motor);
}catch(e){console.error('[berkahn] ponte de comentarios falhou',e);}})();</script>`;

  const i = html.lastIndexOf("</body>");
  return i === -1 ? html + tag : html.slice(0, i) + tag + html.slice(i);
}
