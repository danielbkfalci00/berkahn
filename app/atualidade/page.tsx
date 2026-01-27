// Atualidades - Blog da Berkahn
import { Metadata } from "next";
import { AtualidadeContent } from "./AtualidadeContent";

export const metadata: Metadata = {
  title: "Atualidades | Berkahn Steel Frame",
  description:
    "Insights, tendências e conteúdos exclusivos sobre construção industrializada em Light Steel Frame. Descubra o futuro da construção civil.",
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
      "Insights, tendências e conteúdos exclusivos sobre construção industrializada em Light Steel Frame.",
    type: "website",
  },
};

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

  return <AtualidadeContent supabasePosts={supabasePosts} />;
}
