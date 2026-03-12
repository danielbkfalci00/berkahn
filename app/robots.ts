import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/orcamento/pdf", "/apresentacao-executiva/"],
      },
    ],
    sitemap: "https://www.berkahn.com.br/sitemap.xml",
  };
}
