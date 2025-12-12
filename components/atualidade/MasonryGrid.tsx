"use client";

import { motion } from "framer-motion";
import { BlogPost } from "@/types/blog";
import { ArticleCard, ArticleCardMinimal } from "./ArticleCard";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

interface MasonryGridProps {
  posts: BlogPost[];
  variant?: "masonry" | "minimal";
}

export function MasonryGrid({ posts, variant = "masonry" }: MasonryGridProps) {
  if (variant === "minimal") {
    return <MinimalGrid posts={posts} />;
  }

  // Define pattern for masonry layout
  // Pattern: Large cards at positions 0, 3, 6... (every 3rd starting from 0)
  const getCardSize = (index: number): "small" | "large" => {
    return index % 3 === 0 ? "large" : "small";
  };

  return (
    <section className="py-xl bg-white">
      <div className="container">
        <RevealOnScroll>
          <div className="flex items-center justify-between mb-12">
            <h2 className="headline-sm">Mais Artigos</h2>
            <p className="text-sm text-black-50 uppercase tracking-wider">
              {posts.length} artigos
            </p>
          </div>
        </RevealOnScroll>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-auto">
          {posts.map((post, index) => (
            <ArticleCard
              key={post.id}
              post={post}
              size={getCardSize(index)}
              index={index}
            />
          ))}
        </div>

        {/* Load More Button */}
        {posts.length >= 6 && (
          <RevealOnScroll delay={0.3}>
            <div className="mt-16 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border border-black text-black text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition-colors duration-300"
              >
                Ver Mais Artigos
              </motion.button>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}

// Alternative minimal grid layout
function MinimalGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-xl bg-white">
      <div className="container">
        <RevealOnScroll>
          <div className="flex items-center justify-between mb-12">
            <h2 className="headline-sm">Mais Artigos</h2>
            <p className="text-sm text-black-50 uppercase tracking-wider">
              {posts.length} artigos
            </p>
          </div>
        </RevealOnScroll>

        {/* Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {posts.map((post, index) => (
            <ArticleCardMinimal key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Bento-style grid for featured sections
export function BentoGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length < 4) return null;

  return (
    <section className="py-xl bg-black-5">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text text-black-50 mb-4">Explorar por Tema</p>
          <h2 className="headline-md mb-12">Artigos em Destaque</h2>
        </RevealOnScroll>

        {/* Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Large card - spans 2 cols and 2 rows */}
          <div className="md:col-span-2 md:row-span-2">
            <ArticleCard post={posts[0]} size="large" index={0} />
          </div>

          {/* Two small cards stacked */}
          <div className="md:col-span-1">
            <ArticleCard post={posts[1]} size="small" index={1} />
          </div>
          <div className="md:col-span-1">
            <ArticleCard post={posts[2]} size="small" index={2} />
          </div>

          {/* Bottom row */}
          <div className="md:col-span-1">
            <ArticleCard post={posts[3]} size="small" index={3} />
          </div>
          {posts[4] && (
            <div className="md:col-span-1">
              <ArticleCard post={posts[4]} size="small" index={4} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Horizontal scrolling row for related posts
export function ArticleRow({ posts, title = "Relacionados" }: { posts: BlogPost[]; title?: string }) {
  return (
    <section className="py-lg bg-white overflow-hidden">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text text-black-50 mb-8">{title}</p>
        </RevealOnScroll>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <motion.div
          className="flex gap-6 px-6 lg:px-[calc((100vw-1280px)/2+24px)] overflow-x-auto scrollbar-hide pb-4"
          drag="x"
          dragConstraints={{ right: 0, left: -((posts.length - 3) * 340) }}
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[300px] md:w-[340px]"
            >
              <ArticleCardMinimal post={post} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient Edges */}
        <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
