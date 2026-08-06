"use client";

import { useMemo, useState } from "react";
import {
  BLOG_CATEGORIES,
  type BlogCategoryFilter,
  type BlogPost,
} from "@/types/blog";
import { HeroEditorial } from "@/components/atualidade/HeroEditorial";
import {
  CategoryFilter,
  type CategoryFilterItem,
} from "@/components/atualidade/CategoryFilter";
import { MasonryGrid } from "@/components/atualidade/MasonryGrid";
import { CTA } from "@/components/sections/CTA";

interface AtualidadeContentProps {
  posts: BlogPost[];
}

export function AtualidadeContent({ posts }: AtualidadeContentProps) {
  const [activeCategory, setActiveCategory] =
    useState<BlogCategoryFilter>("Todos");

  const featuredPost = useMemo(
    () => posts.find((post) => post.featured) ?? posts[0],
    [posts]
  );

  const categories = useMemo<CategoryFilterItem[]>(
    () => [
      { category: "Todos", count: posts.length },
      ...BLOG_CATEGORIES.map((category) => ({
        category,
        count: posts.filter((post) => post.category === category).length,
      })),
    ],
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const categoryPosts =
      activeCategory === "Todos"
        ? posts
        : posts.filter((post) => post.category === activeCategory);

    return featuredPost
      ? categoryPosts.filter((post) => post.id !== featuredPost.id)
      : categoryPosts;
  }, [activeCategory, featuredPost, posts]);

  const featuredIsOnlyResult =
    activeCategory !== "Todos" &&
    filteredPosts.length === 0 &&
    featuredPost?.category === activeCategory;

  return (
    <main className="bg-off-white">
      <HeroEditorial post={featuredPost} />

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <MasonryGrid
        posts={filteredPosts}
        emptyMessage={
          featuredIsOnlyResult
            ? "A publicação desta categoria está em destaque na abertura."
            : "Ainda não há publicações nesta categoria."
        }
      />

      <CTA />
    </main>
  );
}
