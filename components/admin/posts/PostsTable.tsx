"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  Search,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { Post, PostStatus } from "@/types/admin";
import { cn } from "@/lib/utils";
import { deletePost, toggleFeatured } from "@/app/admin/posts/actions";

interface PostsTableProps {
  posts: Post[];
}

const statusConfig: Record<PostStatus, { label: string; className: string }> = {
  draft: {
    label: "Rascunho",
    className: "bg-neutral-100 text-neutral-700 hover:bg-neutral-100",
  },
  scheduled: {
    label: "Agendado",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
  published: {
    label: "Publicado",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  archived: {
    label: "Arquivado",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
};

export function PostsTable({ posts }: PostsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState<string | null>(null);

  const handleToggleFeatured = async (post: Post) => {
    setTogglingFeatured(post.id);

    try {
      const result = await toggleFeatured(post.id, !post.featured);

      if (result.error) {
        alert(`Erro ao atualizar destaque: ${result.error}`);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Erro ao atualizar destaque');
    } finally {
      setTogglingFeatured(null);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    setDeletingPost(id);
    try {
      const result = await deletePost(id);
      if (result.error) {
        alert(`Erro ao excluir post: ${result.error}`);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Erro ao excluir post");
    } finally {
      setDeletingPost(null);
    }
  };

  const postActions = (post: Post) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => handleToggleFeatured(post)}
        disabled={togglingFeatured === post.id}
        className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:opacity-50"
        aria-label={`${post.featured ? "Remover destaque de" : "Destacar"} ${post.title}`}
      >
        {togglingFeatured === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={cn("h-4 w-4", post.featured ? "fill-amber-500 text-amber-500" : "text-neutral-500")} />}
      </button>
      {post.status === "published" && (
        <Link href={`/atualidades/${post.slug}`} target="_blank" className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900" aria-label={`Ver ${post.title} no site`}>
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
      <Link href={`/admin/posts/${post.id}`} className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900" aria-label={`Editar ${post.title}`}>
        <Edit className="h-4 w-4" />
      </Link>
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
        onClick={() => handleDelete(post.id)}
        disabled={deletingPost === post.id}
        aria-label={`Excluir ${post.title}`}
      >
        {deletingPost === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <Card className="min-w-0 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-neutral-200 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Buscar posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9"
            aria-label="Buscar posts"
          />
        </div>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Filtrar por status">
          {(["all", "published", "draft", "scheduled", "archived"] as const).map(
            (status) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                className={cn(
                  "h-11 shrink-0 px-3",
                  statusFilter === status && "bg-neutral-100 border-neutral-300"
                )}
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
              >
                {status === "all" ? "Todos" : statusConfig[status].label}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="divide-y divide-neutral-200 md:hidden">
        {filteredPosts.length === 0 ? (
          <p className="p-6 text-center text-neutral-500">Nenhum post encontrado</p>
        ) : filteredPosts.map((post) => (
          <article key={post.id} className="min-w-0 p-4">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/admin/posts/${post.id}`} className="min-w-0 font-medium text-neutral-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
                {post.title}
              </Link>
              <Badge className={cn("shrink-0", statusConfig[post.status].className)}>{statusConfig[post.status].label}</Badge>
            </div>
            <p className="mt-2 text-sm text-neutral-500">{post.category} · {formatDate(post.status === "published" ? post.published_at : post.created_at)}</p>
            <div className="mt-2 border-t border-neutral-100 pt-2">{postActions(post)}</div>
          </article>
        ))}
      </div>
      <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-neutral-500">Nenhum post encontrado</p>
              </TableCell>
            </TableRow>
          ) : (
            filteredPosts.map((post) => (
              <TableRow key={post.id} className="group">
                <TableCell>
                  {post.featured && <Star className="h-4 w-4 fill-amber-500 text-amber-500" aria-label="Destaque" />}
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <p className="font-medium text-neutral-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-sm text-neutral-500 truncate">
                      /{post.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{post.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[post.status].className}>
                    {statusConfig[post.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-neutral-500">
                  {post.status === "published"
                    ? formatDate(post.published_at)
                    : formatDate(post.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">{postActions(post)}</div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </Card>
  );
}
