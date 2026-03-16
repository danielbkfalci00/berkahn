import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { preload } from "react-dom";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AuthorBio } from "@/components/article/AuthorBio";
import { createClient } from "@/lib/supabase/server";
import { getArticleBySlug, richArticles } from "@/data/articles/steel-frame-futuro";
import { ArticleContent } from "./ArticleContent";
import { RichPostRenderer } from "@/components/blog/RichPostRenderer";
import type { Post } from "@/types/admin";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Allow dynamic routes for new posts without redeploying
export const dynamicParams = true;

// Revalidate pages every 60 seconds (ISR)
export const revalidate = 60;

// Fetch post from Supabase
async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  return data as Post;
}

// Generate static paths for all articles (legacy + Supabase)
export async function generateStaticParams() {
  // Legacy articles from TypeScript files
  const legacyPaths = richArticles.map((article) => ({
    slug: article.slug,
  }));

  // Try to get published posts from Supabase
  try {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from('posts')
      .select('slug')
      .eq('status', 'published');

    if (posts) {
      const supabasePaths = posts.map((post) => ({ slug: post.slug }));
      // Combine and deduplicate
      const allSlugs = new Set([...legacyPaths.map(p => p.slug), ...supabasePaths.map(p => p.slug)]);
      return Array.from(allSlugs).map(slug => ({ slug }));
    }
  } catch {
    // Supabase not available, use only legacy paths
  }

  return legacyPaths;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try Supabase first
  const post = await getPostBySlug(slug);

  if (post) {
    return {
      title: post.meta_title || `${post.title} | Berkahn`,
      description: post.meta_description || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.cover_image ? [{ url: post.cover_image }] : [],
        type: "article",
        publishedTime: post.published_at || undefined,
        authors: [post.author],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: post.cover_image ? [post.cover_image] : [],
      },
    };
  }

  // Fallback to legacy TypeScript articles
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artigo não encontrado | Berkahn",
    };
  }

  return {
    title: article.metaTitle || `${article.title} | Berkahn`,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.heroImage }],
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Try Supabase first (new system)
  const post = await getPostBySlug(slug);

  if (post) {
    // Preload LCP cover image — injects <link rel="preload" fetchpriority="high"> in <head>
    if (post.cover_image) {
      preload(post.cover_image, { as: "image", fetchPriority: "high" });
    }

    // Use new RichPostRenderer for Supabase posts
    return (
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute z-30 w-full">
            <Breadcrumb
              items={[
                { name: "Blog", href: "/atualidades" },
                { name: post.title, href: `/atualidades/${slug}` },
              ]}
              light={true}
              className="container mx-auto px-4 pt-24 pb-2"
            />
          </div>
        <section className="relative h-[50vh] min-h-[400px] flex items-end">
          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          {post.cover_image && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          )}
          <div className="relative z-10 container mx-auto px-4 pb-12">
            <span className="inline-block bg-white text-neutral-900 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mb-4">
              {post.title}
            </h1>
            <p className="text-neutral-300 text-lg max-w-2xl">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-neutral-300 text-sm">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.read_time} min de leitura</span>
              {post.published_at && (
                <>
                  <span>•</span>
                  <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                </>
              )}
              {post.updated_at && post.updated_at !== post.published_at && (
                <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded">
                  Atualizado em {new Date(post.updated_at).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        </section>
        </div>

        {/* BlogPosting structured data for rich snippets + AI citation */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.cover_image || undefined,
            datePublished: post.published_at || undefined,
            dateModified: post.updated_at || post.published_at || undefined,
            author: {
              "@type": "Person",
              name: post.author,
            },
            publisher: {
              "@id": "https://www.berkahn.com.br/#organization",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.berkahn.com.br/atualidades/${slug}`,
            },
            wordCount: Math.round(post.content.split(/\s+/).length),
            timeRequired: `PT${post.read_time}M`,
          })}
        </script>

        {/* Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <RichPostRenderer post={post} />
            <AuthorBio authorName={post.author} />
          </div>
        </section>
      </main>
    );
  }

  // Fallback to legacy TypeScript articles
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} />;
}
