import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PostsTable } from "@/components/admin/posts/PostsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Post } from "@/types/admin";

export default async function PostsPage() {
  const supabase = await createClient();

  // TODO: Replace with real Supabase query when table is created
  // const { data: posts, error } = await supabase
  //   .from('posts')
  //   .select('*')
  //   .order('created_at', { ascending: false });

  // Mock data for development
  const posts: Post[] = [
    {
      id: "1",
      title: "5 Vantagens Decisivas do Light Steel Frame",
      slug: "5-vantagens-decisivas-light-steel-frame",
      excerpt: "Descubra por que o Steel Frame está revolucionando a construção civil...",
      content: "# Conteúdo do post...",
      cover_image: "/images/atualidade/steel-frame-vantagens.webp",
      category: "Tecnologia",
      tags: ["steel-frame", "construção", "sustentabilidade"],
      author: "Berkahn",
      status: "published",
      published_at: "2024-01-15T10:00:00Z",
      scheduled_at: null,
      read_time: 8,
      featured: true,
      meta_title: null,
      meta_description: null,
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Steel Frame vs Alvenaria: Comparativo Completo",
      slug: "steel-frame-vs-alvenaria",
      excerpt: "Uma análise detalhada comparando os dois métodos construtivos...",
      content: "# Conteúdo do post...",
      cover_image: "/images/atualidade/comparativo.webp",
      category: "Análise",
      tags: ["steel-frame", "alvenaria", "comparativo"],
      author: "Berkahn",
      status: "published",
      published_at: "2024-01-20T10:00:00Z",
      scheduled_at: null,
      read_time: 12,
      featured: false,
      meta_title: null,
      meta_description: null,
      created_at: "2024-01-18T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z",
    },
    {
      id: "3",
      title: "Novo Artigo em Desenvolvimento",
      slug: "novo-artigo-desenvolvimento",
      excerpt: "Este artigo está sendo preparado...",
      content: "# Rascunho...",
      cover_image: null,
      category: "Guia",
      tags: [],
      author: "Berkahn",
      status: "draft",
      published_at: null,
      scheduled_at: null,
      read_time: 5,
      featured: false,
      meta_title: null,
      meta_description: null,
      created_at: "2024-01-25T10:00:00Z",
      updated_at: "2024-01-25T10:00:00Z",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500">
            Gerencie os posts do blog Atualidade
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-neutral-900 hover:bg-neutral-800">
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </Link>
      </div>

      {/* Posts table */}
      <PostsTable posts={posts} />
    </div>
  );
}
