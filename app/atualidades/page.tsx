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
      <div className="relative">
        <div className="absolute z-30 w-full">
          <Breadcrumb
            items={[{ name: "Blog", href: "/atualidades" }]}
          light={true}
            className="container mx-auto px-4 pt-24 pb-2"
          />
        </div>
        <AtualidadeContent supabasePosts={supabasePosts} />
      </div>
    </>
  );
}
