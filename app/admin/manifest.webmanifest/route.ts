import type { MetadataRoute } from "next";

/**
 * Manifest do PWA do admin.
 *
 * Isto era `app/admin/manifest.ts`, e não gerava rota nenhuma: a convenção
 * `manifest.ts` do Next só vale na RAIZ de `app/` — aninhada em `app/admin/`
 * ela é código morto. O build confirmava: nenhum `.webmanifest` era emitido e
 * `app-paths-manifest.json` não tinha a rota.
 *
 * O sintoma era indireto e por isso passou despercebido. `app/admin/layout.tsx`
 * apontava `manifest` para uma URL 404; o navegador descartava, caía no
 * `/manifest.json` do site público — cujo `start_url` é `"/"` — e o atalho
 * salvo na tela de início abria a home em vez do painel. Em produção o 404
 * ficava ainda mais escondido, porque o gate de sessão respondia 307 antes de
 * o roteador ser consultado.
 *
 * Route handler com extensão no segmento é o padrão que o projeto já usa em
 * `app/feed.xml/route.ts`.
 *
 * O `proxy.ts` libera este path do gate: o navegador busca manifest com
 * `credentials: "omit"`, então nem para usuário logado o cookie viaja.
 */
export const dynamic = "force-static";

const manifest: MetadataRoute.Manifest = {
  name: "Berkahn Admin",
  short_name: "Berkahn",
  description: "Operação comercial e conteúdo da Berkahn.",
  // "/admin", não "/admin/leads": roleCanAccessPath (lib/admin/access.ts:14) só
  // garante "/admin" para os quatro papéis. Um usuário `conteudo` ou `viewer`
  // abrindo o atalho em /admin/leads seria redirecionado na primeira navegação
  // — o app piscaria e cairia noutro lugar.
  start_url: "/admin",
  scope: "/admin/",
  display: "standalone",
  background_color: "#fafafa",
  theme_color: "#0a0a0a",
  orientation: "any",
  icons: [
    { src: "/images/logo/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/images/logo/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    { src: "/images/logo/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/images/logo/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
  ],
};

export function GET() {
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
