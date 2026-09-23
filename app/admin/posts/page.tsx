import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PostsTable } from "@/components/admin/posts/PostsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Post } from "@/types/admin";

export default async function PostsPage() {
  const supabase = await createClient();

  // Fetch posts from Supabase
  let posts: Post[] = [];
  let unavailable = false;
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      unavailable = true;
      console.error('Posts: failed to load posts', error);
    } else if (data) {
      posts = data as Post[];
    }
  } catch (error) {
    unavailable = true;
    console.error('Posts: failed to load posts', error);
  }

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
          <Button className="bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </Link>
      </div>

      {/* Posts table */}
      {unavailable ? (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          Não foi possível carregar os posts agora. Tente atualizar a página.
        </div>
      ) : (
        <PostsTable posts={posts} />
      )}
    </div>
  );
}
