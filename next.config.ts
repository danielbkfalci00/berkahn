import type { NextConfig } from "next";

// Um caminho de build só, igual ao que a Vercel executa: vercel.json manda
// `npm run build` nos dois projetos (berkahn e berkahn-admin).
//
// Havia um modo BUILD_MODE=static que gerava export estático do site público.
// Removido em 2026-07-31 — nunca rodou no deploy, e hoje é incompatível com a
// arquitetura: 14 rotas usam `force-dynamic`, o sitemap e o feed leem do
// Supabase, e `/atualidades/[slug]` depende de ISR, que não existe sob
// `output: "export"`.
const nextConfig: NextConfig = {
  // Keep tracing scoped to this app instead of the global user lockfile.
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ["xlsx-js-style"],
  images: {
    qualities: [65, 70, 75, 78, 80, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sfqaknxomxwmviarpwfy.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      // Old /atualidade → /atualidades (SEO-safe permanent redirect)
      {
        source: "/atualidade",
        destination: "/atualidades",
        permanent: true,
      },
      {
        source: "/atualidade/:slug",
        destination: "/atualidades/:slug",
        permanent: true,
      },
      // Antiga rota da curadoria — substituída por /curadoria-berkahn
      {
        source: "/arquitetos-parceiros",
        destination: "/curadoria-berkahn",
        permanent: true,
      },
      {
        source: "/arquitetos-parceiros/:slug",
        destination: "/curadoria-berkahn/:slug",
        permanent: true,
      },
      // Artigos que nasceram como stub e nunca receberam conteúdo, e cujo
      // tema já é coberto por um artigo publicado. O 301 consolida o sinal
      // em vez de dispersá-lo; reescrevê-los criaria canibalização nova.
      // Destinos verificados como "Submitted and indexed" antes de apontar.
      // Lista espelhada em lib/seo/thin-content.ts (REDIRECTED_SLUGS).
      {
        source: "/atualidades/financiamento-construcao-steel-frame",
        destination: "/atualidades/financiar-construcao-light-steel-frame",
        permanent: true,
      },
      {
        source: "/atualidades/certificacoes-steel-frame",
        destination: "/atualidades/normas-light-steel-frame-brasil",
        permanent: true,
      },
      {
        source: "/atualidades/sustentabilidade-construcao-industrializada",
        destination:
          "/atualidades/sustentabilidade-construcao-civil-economia-circular",
        permanent: true,
      },
      {
        source: "/atualidades/5-vantagens-decisivas-light-steel-frame",
        destination: "/atualidades/steel-frame-vs-alvenaria",
        permanent: true,
      },
      {
        source: "/atualidades/steel-frame-futuro-construcao",
        destination:
          "/atualidades/construcao-industrializada-casa-montada-como-carro",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
