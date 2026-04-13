import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://www.berkahn.com.br";

export const revalidate = 3600; // Revalidate every hour

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRFC822(date: string): string {
  return new Date(date).toUTCString();
}

export async function GET() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, author, category, published_at, cover_image")
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  const items = (posts ?? [])
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/atualidades/${post.slug}</link>
      <description>${escapeXml(post.excerpt || "")}</description>
      <pubDate>${toRFC822(post.published_at)}</pubDate>
      <author>${escapeXml(post.author || "Berkahn")}</author>
      <category>${escapeXml(post.category || "")}</category>
      <guid isPermaLink="true">${BASE_URL}/atualidades/${post.slug}</guid>
    </item>`
    )
    .join("\n");

  const lastBuildDate =
    posts && posts.length > 0
      ? toRFC822(posts[0].published_at)
      : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Berkahn Steel Frame — Atualidades</title>
    <link>${BASE_URL}/atualidades</link>
    <description>Artigos e guias sobre construção em Steel Frame: custos, prazos, comparativos e tendências da construção industrializada em São Paulo.</description>
    <language>pt-BR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/images/logo/berkahn-logo.webp</url>
      <title>Berkahn Steel Frame</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
