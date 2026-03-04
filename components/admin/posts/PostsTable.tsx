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
  Eye,
  Search,
  MoreHorizontal,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { Post, PostStatus } from "@/types/admin";
import { cn } from "@/lib/utils";
import { toggleFeatured } from "@/app/admin/posts/actions";

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
    // TODO: Implement delete with Supabase
    console.log("Delete post:", id);
  };

  return (
    <Card>
      {/* Filters */}
      <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Buscar posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft", "scheduled", "archived"] as const).map(
            (status) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                className={cn(
                  statusFilter === status && "bg-neutral-100 border-neutral-300"
                )}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "Todos" : statusConfig[status].label}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Table */}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFeatured(post);
                    }}
                    disabled={togglingFeatured === post.id}
                    className="p-1 hover:bg-neutral-100 rounded transition-colors disabled:opacity-50"
                    title={post.featured ? "Remover destaque" : "Marcar como destaque"}
                  >
                    {togglingFeatured === post.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                    ) : post.featured ? (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ) : (
                      <Star className="h-4 w-4 text-neutral-300 hover:text-amber-500 transition-colors" />
                    )}
                  </button>
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
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {post.status === "published" && (
                      <Link
                        href={`/atualidades/${post.slug}`}
                        target="_blank"
                        className="inline-flex"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/posts/${post.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
