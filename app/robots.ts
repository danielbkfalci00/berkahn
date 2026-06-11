import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/orcamento/pdf", "/apresentacao-executiva/", "/etapas-da-obra/"],
      },
      {
        // Block training-only crawlers (no search/citation value)
        userAgent: ["CCBot", "GPTBot", "ClaudeBot", "Google-Extended"],
        disallow: "/",
      },
      {
        // Explicitly allow AI search bots (contribute to citations/visibility)
        userAgent: ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"],
        allow: "/",
      },
    ],
    sitemap: "https://www.berkahn.com.br/sitemap.xml",
  };
}
