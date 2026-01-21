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
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      posts = data as Post[];
    }
  } catch {
    // Table may not exist yet
    console.log('Posts: table may not exist yet');
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
