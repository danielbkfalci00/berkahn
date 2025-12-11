import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  images: {
    domains: ["images.unsplash.com"],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/empresa.html",
        destination: "/empresa",
        permanent: true,
      },
      {
        source: "/servicos.html",
        destination: "/servicos",
        permanent: true,
      },
      {
        source: "/lsf.html",
        destination: "/lsf",
        permanent: true,
      },
      {
        source: "/portfolio.html",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/atualidade.html",
        destination: "/atualidade",
        permanent: true,
      },
      {
        source: "/contato.html",
        destination: "/contato",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
