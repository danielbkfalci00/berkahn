import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/posts/PostEditor";
import { notFound } from "next/navigation";
import type { Post, PostInsert } from "@/types/admin";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function EditPostPage({ params, searchParams }: EditPostPageProps) {
  const { id } = await params;
  const { returnTo } = await searchParams;
  const supabase = await createClient();

  // Fetch post from Supabase
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error("Não foi possível carregar o artigo.");
  if (!post) notFound();

  // Ensure components field exists (for backwards compatibility)
  const postWithComponents: Post = {
    ...post,
    components: post.components || {},
  };

  const { data: revision, error: revisionError } = await supabase.from('conteudo_pautas')
    .select('id,atualizado_em,post_draft_payload').eq('post_id', id).maybeSingle();
  if (revisionError) throw new Error("Não foi possível carregar a revisão editorial.");
  return <PostEditor post={postWithComponents} returnTo={returnTo} revision={revision ? {
    pautaId: revision.id,
    updatedAt: revision.atualizado_em,
    payload: revision.post_draft_payload as PostInsert | null,
  } : undefined} />;
}
