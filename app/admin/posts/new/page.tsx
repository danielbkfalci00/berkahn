import { PostEditor } from "@/components/admin/posts/PostEditor";

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <PostEditor returnTo={returnTo} />;
}
