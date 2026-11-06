import Link from "next/link";
import { ReadingCarousel } from "@/components/sections/sustentabilidade/ReadingCarousel";
import { createPublicClient } from "@/lib/supabase/public";
import { READING_SECTION } from "@/lib/sustentabilidade-data";
import { normalizeBlogCategory, type BlogPost } from "@/types/blog";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Artigos do blog no fim da página, na ordem de READING_SECTION.slugs.
 * Se a leitura falhar ou nenhum slug estiver publicado, a seção some: a
 * página de sustentabilidade não pode quebrar por causa do blog.
 */
async function loadPosts(): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_image, category, author, published_at, read_time, featured")
    .eq("status", "published")
    .in("slug", READING_SECTION.slugs);

  if (error) {
    console.error("Sustentabilidade: falha ao ler artigos relacionados:", error.message);
    return [];
  }

  const bySlug = new Map((data ?? []).map((row) => [row.slug, row]));
  return READING_SECTION.slugs.flatMap((slug) => {
    const row = bySlug.get(slug);
    if (!row) return [];
    return [
      {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        image: row.cover_image || "/images/Compartilhamento/og-image.webp",
        category: normalizeBlogCategory(row.category),
        author: row.author,
        date: row.published_at ? dateFormatter.format(new Date(row.published_at)).replace(/\./g, "") : "",
        publishedAt: row.published_at || undefined,
        readTime: `${row.read_time} min`,
        featured: row.featured,
      } satisfies BlogPost,
    ];
  });
}

export async function ReadingSection() {
  const posts = await loadPosts();
  if (posts.length === 0) return null;

  return (
    <section
      id="leia-mais"
      className="bg-off-white py-xl text-black md:py-3xl"
      aria-labelledby="leia-mais-title"
    >
      <div className="container">
        <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
          <h2
            id="leia-mais-title"
            className="max-w-5xl font-display text-[clamp(2.7rem,1.3rem+4.4vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] lg:col-span-8"
          >
            {READING_SECTION.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-black-70 lg:col-span-4 lg:self-end lg:text-lg">
            {READING_SECTION.lede}
          </p>
        </div>

        <div className="mt-10 md:mt-14">
          <ReadingCarousel posts={posts} />
        </div>

        <Link
          href="/atualidades"
          className="mt-10 inline-flex text-sm font-medium underline underline-offset-4 hover:text-black-70"
        >
          Ver todos os artigos
        </Link>
      </div>
    </section>
  );
}
