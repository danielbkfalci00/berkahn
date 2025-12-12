"use client";

import { useState, useMemo } from "react";
import { HeroEditorial } from "@/components/atualidade/HeroEditorial";
import { FeaturedArticle } from "@/components/atualidade/FeaturedArticle";
import { CategoryFilter } from "@/components/atualidade/CategoryFilter";
import { MasonryGrid } from "@/components/atualidade/MasonryGrid";
import { NewsletterSection } from "@/components/atualidade/NewsletterSection";
import { CTA } from "@/components/sections/CTA";
import {
  blogPosts,
  getFeaturedPost,
  getPostsByCategory,
  getCategories,
} from "@/data/posts";

export function AtualidadeContent() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = useMemo(() => getCategories(), []);
  const featuredPost = useMemo(() => getFeaturedPost(), []);

  const filteredPosts = useMemo(() => {
    const posts = getPostsByCategory(activeCategory);
    // Exclude featured post from grid
    if (featuredPost) {
      return posts.filter((post) => post.id !== featuredPost.id);
    }
    return posts;
  }, [activeCategory, featuredPost]);

  return (
    <main className="bg-white">
      {/* Hero Editorial with Parallax */}
      <HeroEditorial
        title="ATUALIDADES"
        subtitle="Insights & Tendências em Steel Frame"
        imageSrc="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
      />

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

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <CTA />
    </main>
  );
}
