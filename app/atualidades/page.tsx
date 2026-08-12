import { Metadata } from "next";
import { AtualidadeContent } from "./AtualidadeContent";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { createPublicClient } from "@/lib/supabase/public";
import { normalizeBlogCategory, type BlogPost } from "@/types/blog";
import { HeroEditorial } from "@/components/atualidade/HeroEditorial";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Atualidades | Berkahn Steel Frame",
  description:
    "Artigos e guias sobre Steel Frame: custos, prazos, comparativos e tendências da construção industrializada. Blog da Berkahn Construtora em São Paulo.",
  keywords: [
    "steel frame notícias",
    "construção industrializada",
    "light steel frame",
    "inovação construção",
    "blog berkahn",
    "atualidades",
    "tendências construção",
  ],
  openGraph: {
    title: "Atualidades | Berkahn Steel Frame",
    description:
      "Artigos e guias sobre Steel Frame: custos, prazos, comparativos e tendências da construção industrializada. Blog da Berkahn.",
    type: "website",
  },
  alternates: {
    canonical: "/atualidades",
    languages: { "pt-BR": "https://www.berkahn.com.br/atualidades" },
  },
};

export const revalidate = 60;

type PostListRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  author: string;
  published_at: string | null;
  read_time: number;
  featured: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function toBlogPost(post: PostListRow): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.cover_image || "/images/Compartilhamento/og-image.webp",
    category: normalizeBlogCategory(post.category),
    author: post.author,
    date: post.published_at
      ? dateFormatter.format(new Date(post.published_at)).replace(/\./g, "")
      : "",
    publishedAt: post.published_at || undefined,
    readTime: `${post.read_time} min`,
    featured: post.featured,
  };
}

export default async function AtualidadePage() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, excerpt, cover_image, category, author, published_at, read_time, featured"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching published posts:", error);
    throw new Error(`Falha ao atualizar /atualidades: ${error.message}`);
  }

  const posts = ((data ?? []) as PostListRow[]).map(toBlogPost);
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];

  return (
    <div>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Atualidades | Berkahn Steel Frame",
          description:
            "Artigos e guias sobre Steel Frame: custos, prazos, comparativos e tendências da construção industrializada.",
          url: "https://www.berkahn.com.br/atualidades",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "BlogPosting",
                headline: post.title,
                description: post.excerpt,
                url: `https://www.berkahn.com.br/atualidades/${post.slug}`,
                image: post.image,
                datePublished: post.publishedAt,
                author: { "@type": "Person", name: post.author },
              },
            })),
          },
        })}
      </script>

      <div className="relative">
        <Breadcrumb
          items={[{ name: "Atualidades", href: "/atualidades" }]}
          schemaOnly
        />
        <main className="bg-off-white">
          <HeroEditorial post={featuredPost} />
          <AtualidadeContent
            posts={posts}
            featuredPostId={featuredPost?.id}
            featuredPostCategory={featuredPost?.category}
          />
          <CTA />
        </main>
      </div>
    </div>
  );
}
