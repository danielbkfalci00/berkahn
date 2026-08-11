import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Berkahn Admin",
    short_name: "Berkahn",
    description: "Operação comercial e conteúdo da Berkahn.",
    start_url: "/admin/leads",
    scope: "/admin/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#0a0a0a",
    orientation: "any",
    icons: [
      { src: "/images/logo/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/images/logo/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
