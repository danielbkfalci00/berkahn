import { readFile } from "node:fs/promises";
import path from "node:path";
import { injetarPonte, origemDoAdmin } from "@/lib/documentacoes/injecao";
import { HARNESS_HABILITADO, DOCS_HARNESS } from "@/lib/documentacoes/harness";

// Serve um documento real do vault com a ponte injetada, SEM passar pelo
// Supabase e SEM exigir sessão — é o único jeito de exercitar a ancoragem sem
// poder autenticar no admin.
//
// Roda contra o build de produção (`npm run build && npm start`), que é o que
// importa: o dev server não minifica, então testar só em dev não prova nada
// sobre a serialização da ponte.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!HARNESS_HABILITADO) return new Response("Not found", { status: 404 });

  const nome = new URL(request.url).searchParams.get("doc") || DOCS_HARNESS[0];
  // Allowlist e não sanitização de path: o conjunto é fixo e conhecido.
  if (!(DOCS_HARNESS as readonly string[]).includes(nome)) {
    return new Response("Documento fora da allowlist", { status: 400 });
  }

  // O harness é desligado estruturalmente na Vercel. Ignorar este acesso no
  // tracing impede que o build inclua todo o repositório no bundle server;
  // localmente, os dois arquivos da allowlist já existem no workspace.
  const html = await readFile(
    path.join(/* turbopackIgnore: true */ process.cwd(), nome),
    "utf8",
  );

  return new Response(injetarPonte(html, origemDoAdmin(request), "harness"), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
