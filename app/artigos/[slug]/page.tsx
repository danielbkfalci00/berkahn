import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, richArticles } from "@/data/articles/steel-frame-futuro";
import { ArticleContent } from "./ArticleContent";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all articles
export async function generateStaticParams() {
  return richArticles.map((article) => ({
    slug: article.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
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
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} />;
}
