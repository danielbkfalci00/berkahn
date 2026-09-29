import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PostsTable, type PostListItem } from "@/components/admin/posts/PostsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { PostStatus } from "@/types/admin";
import { redirect } from "next/navigation";
import { editorialHref, postsListHref } from "@/lib/admin/return-to";

export default async function PostsPage({ searchParams }: {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[]; page?: string | string[] }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q.slice(0, 150) : "";
  const status = typeof params.status === "string" && ["draft", "published", "scheduled", "archived"].includes(params.status)
    ? params.status as PostStatus : "all";
  const page = Math.max(1, Math.min(100000, Number.parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1));
  const pageSize = 30;
  let total = 0;

  // Fetch posts from Supabase
  let posts: PostListItem[] = [];
  let unavailable = false;
  let invalidPage = false;
  try {
    let query = supabase
      .from('posts')
      .select('id,title,slug,category,status,featured,published_at,created_at', { count: 'exact' });
    if (status !== "all") query = query.eq('status', status);
    const term = search.replace(/[^\p{L}\p{N}\s-]/gu, "").trim();
    if (term) query = query.or(`title.ilike.%${term}%,category.ilike.%${term}%`);
    const { data, error, count } = await query
      .order('created_at', { ascending: false }).order('id', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      invalidPage = error.code === "PGRST103" && page > 1;
      unavailable = true;
      console.error('Posts: failed to load posts', error);
    } else if (data) {
      posts = data as PostListItem[];
      total = count ?? 0;
    }
  } catch (error) {
    unavailable = true;
    console.error('Posts: failed to load posts', error);
  }

  if (invalidPage) redirect(postsListHref(search, status, 1));
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  if (!unavailable && page > lastPage) redirect(postsListHref(search, status, lastPage));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500">
            Gerencie os posts do blog Atualidade
          </p>
        </div>
        <Link href={editorialHref("/admin/posts/new", postsListHref(search, status, page))}>
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
        <PostsTable key={`${search}:${status}:${page}`} posts={posts} search={search} statusFilter={status} page={page} pageSize={pageSize} total={total} />
      )}
    </div>
  );
}
