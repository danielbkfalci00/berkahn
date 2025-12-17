import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
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
