"use client";

import { useMemo, useState } from "react";
import {
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogCategoryFilter,
  type BlogPost,
} from "@/types/blog";
import {
  CategoryFilter,
  type CategoryFilterItem,
} from "@/components/atualidade/CategoryFilter";
import { MasonryGrid } from "@/components/atualidade/MasonryGrid";

interface AtualidadeContentProps {
  posts: BlogPost[];
  featuredPostId?: string;
  featuredPostCategory?: BlogCategory;
}

export function AtualidadeContent({
  posts,
  featuredPostId,
  featuredPostCategory,
}: AtualidadeContentProps) {
  const [activeCategory, setActiveCategory] =
    useState<BlogCategoryFilter>("Todos");

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

    return featuredPostId
      ? categoryPosts.filter((post) => post.id !== featuredPostId)
      : categoryPosts;
  }, [activeCategory, featuredPostId, posts]);

  const featuredIsOnlyResult =
    activeCategory !== "Todos" &&
    filteredPosts.length === 0 &&
    featuredPostCategory === activeCategory;

  return (
    <>
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
    </>
  );
}
