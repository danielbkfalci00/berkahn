import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/posts/PostEditor";
import { notFound } from "next/navigation";
import type { Post } from "@/types/admin";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch post from Supabase
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    console.error('Error fetching post:', error);
    notFound();
  }

  // Ensure components field exists (for backwards compatibility)
  const postWithComponents: Post = {
    ...post,
    components: post.components || {},
  };

  return <PostEditor post={postWithComponents} />;
}
