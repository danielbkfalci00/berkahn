import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { richArticles } from "@/data/articles/steel-frame-futuro";
import { getAllProjectSlugs } from "@/data/projects";

const BASE_URL = "https://www.berkahn.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/residencial`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/comercial-industrial`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/lsf`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/servicos`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/atualidades`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/empresa`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/perguntas-frequentes`, lastModified: new Date('2026-03-01'), changeFrequency: "monthly", priority: 0.6 },
{ url: `${BASE_URL}/privacidade`, lastModified: new Date('2025-06-01'), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/termos-de-uso`, lastModified: new Date('2025-06-01'), changeFrequency: "yearly", priority: 0.3 },
  ];

  // 2. Dynamic articles from Supabase
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, published_at")
    .eq("status", "published");

  const supabaseArticles: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/atualidades/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 3. Legacy static articles
  const legacyArticles: MetadataRoute.Sitemap = richArticles.map((article) => ({
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
