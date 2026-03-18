"use client";

import { useState, useMemo } from "react";
import type { Post } from "@/types/admin";
import type { BlogPost } from "@/types/blog";
import { HeroEditorial } from "@/components/atualidade/HeroEditorial";
import { FeaturedArticle } from "@/components/atualidade/FeaturedArticle";
import { CategoryFilter } from "@/components/atualidade/CategoryFilter";
import { MasonryGrid } from "@/components/atualidade/MasonryGrid";
import { CTA } from "@/components/sections/CTA";
import {
  blogPosts,
  getFeaturedPost,
  getPostsByCategory,
  getCategories,
} from "@/data/posts";

interface AtualidadeContentProps {
  supabasePosts: Post[];
}

export function AtualidadeContent({ supabasePosts }: AtualidadeContentProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Converter Post do Supabase para BlogPost
  const convertToBlogPost = (post: Post): BlogPost => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.cover_image || "",
    category: post.category,
    author: post.author,
    date: post.published_at
      ? new Date(post.published_at).toISOString().split('T')[0]
      : "",
    readTime: `${post.read_time} min`,
    tags: post.tags,
    featured: post.featured,
  });

  // Usar apenas posts do Supabase
  const allPosts = useMemo(() =>
    supabasePosts.map(convertToBlogPost),
    [supabasePosts]
  );

  const categories = useMemo(() => {
    const cats = new Set(allPosts.map(p => p.category));
    return ["Todos", ...Array.from(cats)];
  }, [allPosts]);

  const featuredPost = useMemo(() =>
    allPosts.find(post => post.featured),
    [allPosts]
  );

  const filteredPosts = useMemo(() => {
    const posts = activeCategory === "Todos"
      ? allPosts
      : allPosts.filter(p => p.category === activeCategory);

    // Exclude featured post from grid
    if (featuredPost) {
      return posts.filter((post) => post.id !== featuredPost.id);
    }
    return posts;
  }, [activeCategory, featuredPost, allPosts]);

  return (
    <main className="bg-white">
      {/* Hero Editorial with Parallax */}
      <HeroEditorial
        title="ATUALIDADES"
        subtitle="Insights & Tendências em Steel Frame"
        imageSrc="/images/empresa/primeira-imagem.webp"
      />

      {/* Intro text — visível para Google e usuários */}
      <section className="container mx-auto px-4 pt-12 pb-6 max-w-3xl text-center">
        <p className="text-black-50 text-base md:text-lg leading-relaxed">
          Artigos e guias sobre Steel Frame: custos, prazos, comparativos e tendências
          da construção industrializada. Acompanhe as novidades do blog da Berkahn.
        </p>
      </section>

      {/* Featured Article */}
      {featuredPost && <FeaturedArticle post={featuredPost} />}

      {/* Category Filters */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Article Grid */}
      <MasonryGrid posts={filteredPosts} variant="masonry" />

      {/* CTA Section */}
      <CTA />
    </main>
  );
}
