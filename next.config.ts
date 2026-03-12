import type { NextConfig } from "next";

// Build mode:
// - "static" (default): Site público estático para berkahn.com.br
// - "full": Inclui admin com rotas dinâmicas para admin.berkahn.com.br
const BUILD_MODE = process.env.BUILD_MODE || "full";

const nextConfig: NextConfig = {
  // Static export only for public site build
  ...(BUILD_MODE === "static" && {
    output: "export",
  }),
  images: {
    unoptimized: true, // Required for static export
  },
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  // Redirects only work in "full" mode (not with output:"export")
  ...(BUILD_MODE !== "static" && {
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
      ];
    },
  }),
  // Note: For static export, configure redirects in hosting platform (Vercel/Netlify):
  // - /atualidade → /atualidades
  // - /atualidade/:slug → /atualidades/:slug
  // - /atualidades/5-vantagens-light-steel-frame → /atualidades/5-vantagens-decisivas-light-steel-frame
  // - /atualidades/como-funciona-construcao-steel-frame → /atualidades/passo-passo-construcao-steel-frame
  // - /atualidades/steel-frame-vs-alvenaria-comparativo → /atualidades/steel-frame-vs-alvenaria
};

export default nextConfig;
