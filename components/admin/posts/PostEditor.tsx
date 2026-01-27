"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Clock,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Quote,
  X,
  Loader2,
  Upload,
  Calendar,
} from "lucide-react";
import type { Post, PostInsert, PostStatus } from "@/types/admin";
import { BLOG_CATEGORIES } from "@/types/blog";
import { cn } from "@/lib/utils";
import { uploadCoverImage } from "@/app/admin/posts/upload-actions";
import { useToast } from "@/hooks/use-toast";
import { createPost, updatePost } from "@/app/admin/posts/actions";

interface PostEditorProps {
  post?: Post;
}

const defaultPost: PostInsert = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: null,
  category: "Tecnologia",
  tags: [],
  author: "Berkahn",
  status: "draft",
  read_time: 5,
  featured: false,
};

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PostInsert>(
    post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          cover_image: post.cover_image,
          category: post.category,
          tags: post.tags,
          author: post.author,
          status: post.status,
          read_time: post.read_time,
          featured: post.featured,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
        }
      : defaultPost
  );

  const [isUploading, setIsUploading] = useState(false);

  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  // Calculate read time based on content
  useEffect(() => {
    const words = formData.content.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    setFormData((prev) => ({ ...prev, read_time: readTime }));
  }, [formData.content]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [formData]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags?.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById(
      "content-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) + before + selectedText + after + text.substring(end);

    setFormData((prev) => ({ ...prev, content: newText }));

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de imagem válido",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('postSlug', formData.slug || 'new-post');

      const result = await uploadCoverImage(uploadFormData);

      if (result.error) {
        toast({
          title: "Erro no upload",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.url) {
        setFormData((prev) => ({ ...prev, cover_image: result.url }));
        toast({
          title: "Sucesso",
          description: "Imagem enviada com sucesso!",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar imagem",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (publish: boolean = false) => {
    const saveMethod = publish ? setIsPublishing : setIsSaving;
    saveMethod(true);

    try {
      const dataToSave = {
        ...formData,
        status: publish ? ("published" as PostStatus) : formData.status,
        published_at: publish ? new Date().toISOString() : null,
      };

      // Chamar server action apropriada
      const result = post
        ? await updatePost(post.id, { ...dataToSave, id: post.id })
        : await createPost(dataToSave);

      if (result.error) {
        toast({
          title: "Erro ao salvar",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Feedback de sucesso
      toast({
        title: publish ? "Post publicado!" : "Post salvo",
        description: publish
          ? "O post foi publicado com sucesso e está visível no site."
          : "As alterações foram salvas como rascunho.",
      });

      setHasUnsavedChanges(false);
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o post. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      saveMethod(false);
    }
  };

  const renderMarkdownPreview = () => {
    // Simple markdown-to-HTML conversion for preview
    // In production, use a proper MDX renderer
    let html = formData.content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-neutral-100 px-1 rounded">$1</code>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n\n/g, "</p><p class='my-4'>")
      .replace(/\n/g, "<br/>");

    return `<p class='my-4'>${html}</p>`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              {isEditing ? "Editar Post" : "Novo Post"}
            </h2>
            {hasUnsavedChanges && (
              <p className="text-sm text-amber-600">Alterações não salvas</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isSaving || isPublishing}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar rascunho
          </Button>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800"
            onClick={() => handleSave(true)}
            disabled={isSaving || isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Publicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título do post"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="text-lg font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <div className="flex items-center">
                  <span className="text-sm text-neutral-500 mr-1">
                    /atualidade/
                  </span>
                  <Input
                    id="slug"
                    placeholder="url-do-post"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Content Editor */}
          <Card className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "write" | "preview")}
            >
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="write">Escrever</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                {/* Toolbar */}
                {activeTab === "write" && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("**", "**")}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("*", "*")}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("# ")}
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("## ")}
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("- ")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("1. ")}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("[", "](url)")}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("`", "`")}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("> ")}
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="write" className="mt-0">
                <Textarea
                  id="content-editor"
                  placeholder="Escreva o conteúdo do post em Markdown..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="min-h-[500px] font-mono text-sm resize-none"
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div
                  className="min-h-[500px] prose prose-neutral max-w-none p-4 border rounded-lg bg-white"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownPreview() }}
                />
              </TabsContent>
            </Tabs>
          </Card>

          {/* Excerpt */}
          <Card className="p-6">
            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo (excerpt)</Label>
              <Textarea
                id="excerpt"
                placeholder="Breve descrição do post para listagens e SEO..."
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                className="min-h-[100px]"
              />
              <p className="text-xs text-neutral-500">
                {formData.excerpt.length}/160 caracteres
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Status atual</span>
                <Badge
                  className={cn(
                    formData.status === "published" &&
                      "bg-green-100 text-green-700",
                    formData.status === "draft" &&
                      "bg-neutral-100 text-neutral-700",
                    formData.status === "scheduled" &&
                      "bg-amber-100 text-amber-700"
                  )}
                >
                  {formData.status === "published" && "Publicado"}
                  {formData.status === "draft" && "Rascunho"}
                  {formData.status === "scheduled" && "Agendado"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Tempo de leitura</span>
                <span className="text-sm flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formData.read_time} min
                </span>
              </div>
            </div>
          </Card>

          {/* Category */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Categoria</h3>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
            >
              {BLOG_CATEGORIES.filter((c) => c !== "Todos").map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Tags</h3>
            <Input
              placeholder="Adicionar tag (Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </Card>

          {/* Featured */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Destaque</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="w-4 h-4 rounded border-neutral-300"
              />
              <span className="text-sm text-neutral-600">
                Marcar como post em destaque
              </span>
            </label>
          </Card>

          {/* Cover Image */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Imagem de capa
            </h3>
            {formData.cover_image ? (
              <div className="relative">
                <img
                  src={formData.cover_image}
                  alt="Cover"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, cover_image: null }))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  disabled={isUploading}
                  className="w-full h-32 border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                      <span className="text-sm">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm">Clique para upload</span>
                      <span className="text-xs text-neutral-400 mt-1">PNG, JPG ou WebP até 5MB</span>
                    </>
                  )}
                </button>
              </>
            )}
          </Card>

          {/* SEO */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta título</Label>
                <Input
                  id="meta_title"
                  placeholder={formData.title || "Título para SEO"}
                  value={formData.meta_title || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta descrição</Label>
                <Textarea
                  id="meta_description"
                  placeholder={formData.excerpt || "Descrição para SEO"}
                  value={formData.meta_description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_description: e.target.value,
                    }))
                  }
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
