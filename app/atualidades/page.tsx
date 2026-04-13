// Atualidades - Blog da Berkahn
import { Metadata } from "next";
import { AtualidadeContent } from "./AtualidadeContent";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

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

// Revalidate every 60 seconds to fetch new posts from Supabase
export const revalidate = 60;

import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/admin";

export default async function AtualidadePage() {
  const supabase = await createClient();

  // Buscar posts publicados do Supabase
  let supabasePosts: Post[] = [];
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (!error && data) {
      supabasePosts = data as Post[];
    }
  } catch (err) {
    console.error('Error fetching posts:', err);
  }

  return (
    <>
      {/* ItemList structured data for rich snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Atualidades | Berkahn Steel Frame",
          description: "Artigos e guias sobre Steel Frame: custos, prazos, comparativos e tendências da construção industrializada.",
          url: "https://www.berkahn.com.br/atualidades",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: supabasePosts.length,
            itemListElement: supabasePosts.map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "BlogPosting",
                headline: post.title,
                description: post.excerpt,
                url: `https://www.berkahn.com.br/atualidades/${post.slug}`,
                image: post.cover_image || undefined,
                datePublished: post.published_at || undefined,
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
        <AtualidadeContent supabasePosts={supabasePosts} />
      </div>
    </>
  );
}
