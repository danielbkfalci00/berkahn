import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Required for static export
  },
  async redirects() {
    return [
      // SEO redirects para slugs antigos (301 permanent redirects)
      {
        source: "/atualidade/5-vantagens-light-steel-frame",
        destination: "/atualidade/5-vantagens-decisivas-light-steel-frame",
        permanent: true,
      },
      {
        source: "/atualidade/como-funciona-construcao-steel-frame",
        destination: "/atualidade/passo-passo-construcao-steel-frame",
        permanent: true,
      },
      {
        source: "/atualidade/steel-frame-vs-alvenaria-comparativo",
        destination: "/atualidade/steel-frame-vs-alvenaria",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
