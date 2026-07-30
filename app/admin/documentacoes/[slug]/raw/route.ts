import { getDocumentoHtml } from "@/lib/documentacoes/queries";
import { injetarPonte, origemDoAdmin } from "@/lib/documentacoes/injecao";

// Serve o HTML bruto do documento para o <iframe> do viewer.
//
// Fica sob /admin/ e NÃO sob /api/ de propósito: o matcher do middleware.ts é
// ['/', '/admin/:path*'], então uma rota em /api/ ficaria pública. Aqui o guard
// de sessão de lib/supabase/middleware.ts já protege sem auth manual.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

// text/html exato é obrigatório: next.config.ts manda X-Content-Type-Options:
// nosniff, e com content-type errado o browser recusa renderizar.
const HEADERS_HTML = {
  "Content-Type": "text/html; charset=utf-8",
  "X-Frame-Options": "SAMEORIGIN",
  "Cache-Control": "private, max-age=0, must-revalidate",
} as const;

// 404 também é HTML: a resposta é renderizada dentro do iframe, onde um JSON
// apareceria como texto cru.
const HTML_404 = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Documento não encontrado</title>
<style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0;color:#525252}</style>
</head><body><p>Documento não encontrado.</p></body></html>`;

export async function GET(request: Request, { params }: Props) {
  const { slug } = await params;
  const html = await getDocumentoHtml(slug);
  const origem = origemDoAdmin(request);

  // O 404 também leva a ponte: sem ela o admin ficaria esperando o handshake
  // até o timeout.
  if (!html) {
    return new Response(injetarPonte(HTML_404, origem, slug), {
      status: 404,
      headers: HEADERS_HTML,
    });
  }

  return new Response(injetarPonte(html, origem, slug), {
    status: 200,
    headers: HEADERS_HTML,
  });
}
