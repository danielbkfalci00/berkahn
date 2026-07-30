import { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { richArticles } from "@/data/articles/steel-frame-futuro";
import { getAllProjectSlugs } from "@/data/projects";
import { isExcludedFromSitemap } from "@/lib/seo/thin-content";

const BASE_URL = "https://www.berkahn.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Dynamic articles from Supabase
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, published_at")
    .eq("status", "published");

  // Fora do sitemap: artigos em noindex e os consolidados por 301. Anunciar
  // uma URL que responde noindex ou redirect é sinal contraditório.
  // Ver lib/seo/thin-content.ts.
  //
  // `lastModified` é omitido quando não há `published_at`. O fallback anterior
  // era `new Date()`, que fazia o sitemap declarar "modificado agora" a cada
  // crawl — lastmod que muda sozinho ensina o Google a ignorar o campo.
  const publicados = (posts ?? []).filter(
    (post) => !isExcludedFromSitemap(post.slug)
  );

  const supabaseArticles: MetadataRoute.Sitemap = publicados.map((post) => ({
    url: `${BASE_URL}/atualidades/${post.slug}`,
    ...(post.published_at ? { lastModified: new Date(post.published_at) } : {}),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // A listagem muda quando sai artigo novo — essa é a data honesta para ela.
  const ultimaPublicacao = publicados
    .map((post) => post.published_at)
    .filter((data): data is string => Boolean(data))
    .sort()
    .at(-1);

  // 2. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/residencial`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/comercial-industrial`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/lsf`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/servicos`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${BASE_URL}/atualidades`,
      ...(ultimaPublicacao ? { lastModified: new Date(ultimaPublicacao) } : {}),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${BASE_URL}/contato`, lastModified: new Date('2026-07-30'), changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/empresa`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/perguntas-frequentes`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacidade`, lastModified: new Date('2025-06-01'), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/termos-de-uso`, lastModified: new Date('2025-06-01'), changeFrequency: "yearly", priority: 0.3 },
  ];

  // 3. Legacy static articles
  const legacyArticles: MetadataRoute.Sitemap = richArticles
    .filter((article) => !isExcludedFromSitemap(article.slug))
    .map((article) => ({
      url: `${BASE_URL}/atualidades/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // 4. Project pages
  const projectSlugs = getAllProjectSlugs();
  const projects: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${BASE_URL}/projetos/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...supabaseArticles, ...legacyArticles, ...projects];
}
