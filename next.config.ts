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
  // Note: redirects() don't work with output:"export"
  // Configure redirects in hosting platform (Vercel/Netlify) instead:
  // - /atualidade/5-vantagens-light-steel-frame → /atualidade/5-vantagens-decisivas-light-steel-frame
  // - /atualidade/como-funciona-construcao-steel-frame → /atualidade/passo-passo-construcao-steel-frame
  // - /atualidade/steel-frame-vs-alvenaria-comparativo → /atualidade/steel-frame-vs-alvenaria
};

export default nextConfig;
