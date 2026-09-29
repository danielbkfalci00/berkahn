"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  Send,
  Clock,
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
} from "lucide-react";
import type { Post, PostInsert, PostStatus } from "@/types/admin";
import { BLOG_CATEGORIES, normalizeBlogCategory } from "@/types/blog";
import { cn } from "@/lib/utils";
import { uploadCoverImage } from "@/app/admin/posts/upload-actions";
import { useToast } from "@/hooks/use-toast";
import { createPost, updatePost, savePostRevision, publishPostRevision } from "@/app/admin/posts/actions";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

const RichPostRenderer = dynamic(() => import("@/components/blog/RichPostRenderer").then((module) => module.RichPostRenderer), {
  loading: () => <p role="status" className="p-4 text-sm text-neutral-500">Carregando prévia…</p>,
});

interface PostEditorProps {
  post?: Post;
  revision?: { pautaId: string; updatedAt: string; payload: PostInsert | null };
}

const defaultPost: PostInsert = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: null,
  category: "Tecnologia e Inovação",
  tags: [],
  author: "Berkahn",
  status: "draft",
  read_time: 1,
  featured: false,
};

export function PostEditor({ post, revision }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;
  const [isPublished, setIsPublished] = useState(post?.status === "published");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sourcePost = post && revision?.payload ? { ...post, ...revision.payload } : post;
  const [formData, setFormData] = useState<PostInsert>(
    sourcePost
      ? {
          title: sourcePost.title,
          slug: sourcePost.slug,
          excerpt: sourcePost.excerpt,
          content: sourcePost.content,
          cover_image: sourcePost.cover_image,
          category: normalizeBlogCategory(sourcePost.category),
          tags: sourcePost.tags,
          author: sourcePost.author,
          status: post?.status ?? "draft",
          read_time: Math.max(1, Math.ceil(sourcePost.content.split(/\s+/).filter(Boolean).length / 200)),
          featured: sourcePost.featured,
          meta_title: sourcePost.meta_title,
          meta_description: sourcePost.meta_description,
          answer_summary: sourcePost.answer_summary,
          components: sourcePost.components,
        }
      : defaultPost
  );

  const [isUploading, setIsUploading] = useState(false);

  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [savedBaseline, setSavedBaseline] = useState(() => JSON.stringify(formData));
  const hasUnsavedChanges = JSON.stringify(formData) !== savedBaseline;
  useUnsavedChanges(hasUnsavedChanges);
  const currentForm = useRef(formData);
  currentForm.current = formData;
  const [revisionVersion, setRevisionVersion] = useState(revision?.updatedAt ?? null);
  const [pautaId, setPautaId] = useState(revision?.pautaId);
  const [hasRevision, setHasRevision] = useState(Boolean(revision?.payload));
  const [postVersion, setPostVersion] = useState(post?.updated_at);
  const [savedPostId, setSavedPostId] = useState(post?.id);

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
    if (isSaving || isPublishing || isUploading) return;
    const submitted = JSON.stringify(formData);
    const saveMethod = publish ? setIsPublishing : setIsSaving;
    saveMethod(true);

    try {
      const dataToSave = {
        ...formData,
        status: publish ? ("published" as PostStatus) : ("draft" as PostStatus),
        published_at: publish ? post?.published_at ?? new Date().toISOString() : post?.published_at ?? null,
      };

      if (isPublished && savedPostId && postVersion) {
        const result = await savePostRevision(savedPostId, formData, postVersion, revisionVersion);
        if (result.error) {
          toast({ title: "Revisão não salva", description: result.error, variant: "destructive" });
          return;
        }
        setRevisionVersion(result.updatedAt ?? null);
        setPautaId(result.pautaId);
        setHasRevision(true);
        setSavedBaseline(submitted);
        toast({ title: "Revisão salva", description: "O artigo publicado foi preservado. Revise e aprove as alterações na pauta." });
        return;
      }

      // Chamar server action apropriada
      const result = savedPostId && postVersion
        ? await updatePost(savedPostId, { ...dataToSave, id: savedPostId }, postVersion)
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

      setSavedBaseline(JSON.stringify({ ...formData, status: result.data?.status ?? formData.status }));
      if (result.data) {
        setSavedPostId(result.data.id);
        setPostVersion(result.data.updated_at);
        setIsPublished(result.data.status === "published");
        setFormData((current) => ({ ...current, status: result.data!.status }));
      }
      if (JSON.stringify(currentForm.current) === submitted) router.push("/admin/posts");
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

  const handlePublishRevision = async () => {
    if (!savedPostId || !postVersion || !revisionVersion || !hasRevision || hasUnsavedChanges || isSaving || isPublishing) return;
    if (!window.confirm("Publicar a revisão salva agora? O conteúdo visível no site será atualizado e a data original de publicação será mantida. A cópia editorial no vault deve ser sincronizada após esta publicação.")) return;
    setIsPublishing(true);
    try {
      const result = await publishPostRevision(savedPostId, postVersion, revisionVersion);
      if (result.error) {
        toast({ title: "Revisão não publicada", description: result.error, variant: "destructive" });
        return;
      }
      setPostVersion(result.postUpdatedAt);
      setRevisionVersion(result.updatedAt ?? null);
      setHasRevision(false);
      toast({ title: "Revisão publicada", description: "O artigo no site foi atualizado com a data original. A cópia editorial no vault deve ser sincronizada após esta publicação." });
    } catch {
      toast({ title: "Não foi possível confirmar a publicação", description: "Atualize a página para conferir o estado antes de tentar novamente.", variant: "destructive" });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/posts" aria-label="Voltar para posts">
              <ArrowLeft className="h-5 w-5" />
          </Link>
            </Button>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              {isEditing ? "Editar Post" : "Novo Post"}
            </h2>
            {hasUnsavedChanges && (
              <p className="text-sm text-amber-600">Alterações não salvas</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isSaving || isPublishing || isUploading}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isPublished ? "Salvar revisão" : "Salvar rascunho"}
          </Button>
          {!isPublished && <Button
            className="bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white"
            onClick={() => handleSave(true)}
            disabled={isSaving || isPublishing || isUploading}
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Publicar
          </Button>}
          {isPublished && hasRevision && <Button onClick={handlePublishRevision}
            disabled={hasUnsavedChanges || isSaving || isPublishing || isUploading}>
            {isPublishing ? "Publicando…" : "Publicar revisão salva"}
          </Button>}
          {isPublished && pautaId && <Button variant="outline" asChild><Link href={`/admin/conteudo/${pautaId}`}>Revisar na pauta</Link></Button>}
        </div>
      </div>
      {isPublished && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        O artigo publicado permanece no site. Salve as alterações, confira a prévia e use Publicar revisão salva para aplicá-las.
      </p>}

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
                    /atualidades/
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <TabsList>
                  <TabsTrigger value="write">Escrever</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                {/* Toolbar */}
                {activeTab === "write" && (
                  <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Formatação do artigo">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("**", "**")}
                      aria-label="Negrito"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("*", "*")}
                      aria-label="Itálico"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("# ")}
                      aria-label="Título principal"
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("## ")}
                      aria-label="Subtítulo"
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("- ")}
                      aria-label="Lista com marcadores"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("1. ")}
                      aria-label="Lista numerada"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("[", "](url)")}
                      aria-label="Inserir link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("`", "`")}
                      aria-label="Código"
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => insertMarkdown("> ")}
                      aria-label="Citação"
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="write" className="mt-0">
                <Textarea
                  id="content-editor"
                  aria-label="Conteúdo do artigo"
                  placeholder="Escreva o conteúdo do post em Markdown..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="min-h-[500px] font-mono text-sm resize-none"
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                {activeTab === "preview" && <div className="min-h-[500px] p-4 border rounded-lg bg-white">
                  <RichPostRenderer post={{ ...post, ...formData, components: formData.components ?? {} } as Post} />
                </div>}
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
              aria-label="Categoria do artigo"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
            >
              {BLOG_CATEGORIES.map((category) => (
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
              aria-label="Adicionar tag"
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
                    type="button"
                    aria-label={`Remover tag ${tag}`}
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
              <div className="relative h-32 overflow-hidden rounded-lg">
                <Image
                  src={formData.cover_image}
                  alt="Prévia da imagem de capa"
                  fill
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="object-cover"
                  unoptimized
                />
                <Button
                  variant="destructive"
                  aria-label="Remover imagem de capa"
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
