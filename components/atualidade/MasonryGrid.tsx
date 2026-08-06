"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/types/blog";
import { ArticleCard, ArticleCardMinimal } from "./ArticleCard";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const POSTS_PER_PAGE = 9;

interface MasonryGridProps {
  posts: BlogPost[];
  variant?: "masonry" | "minimal";
  emptyMessage?: string;
}

export function MasonryGrid({
  posts,
  variant = "masonry",
  emptyMessage = "Ainda não há publicações nesta categoria.",
}: MasonryGridProps) {
  const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE);

  useEffect(() => {
    setDisplayCount(POSTS_PER_PAGE);
  }, [posts]);

  if (variant === "minimal") {
    return <MinimalGrid posts={posts} />;
  }

  const visiblePosts = posts.slice(0, displayCount);
  const bentoPosts = visiblePosts.slice(0, 5);
  const remainingPosts = visiblePosts.slice(5);
  const hasMore = displayCount < posts.length;

  return (
    <section className="bg-off-white py-16 md:py-24">
      <div className="container">
        <RevealOnScroll>
          <div className="mb-10 flex items-end justify-between gap-6 border-b-[3px] border-black pb-5 md:mb-14">
            <div>
              <p className="mb-3 font-tech text-[10px] lowercase tracking-wide text-black-50 md:text-xs">
                arquivo editorial
              </p>
              <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                Mais artigos
              </h2>
            </div>
            <p
              role="status"
              aria-live="polite"
              className="shrink-0 font-tech text-[10px] lowercase tracking-wide text-black-50 md:text-xs"
            >
              {String(visiblePosts.length).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
            </p>
          </div>

          {visiblePosts.length > 0 ? (
            <>
              <BentoGrid posts={bentoPosts} />

              {remainingPosts.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {remainingPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="border-b-[3px] border-black py-20">
              <p className="max-w-xl font-display text-2xl font-medium leading-tight tracking-tight md:text-3xl">
                {emptyMessage}
              </p>
            </div>
          )}
        </RevealOnScroll>

        {hasMore && (
          <div className="mt-14 text-center md:mt-20">
            <button
              type="button"
              onClick={() =>
                setDisplayCount((current) =>
                  Math.min(current + POSTS_PER_PAGE, posts.length)
                )
              }
              className="border-[3px] border-black px-7 py-4 font-tech text-xs lowercase tracking-wide text-black transition-colors duration-300 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              carregar mais · {Math.min(POSTS_PER_PAGE, posts.length - displayCount)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function MinimalGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="bg-white py-xl">
      <div className="container">
        <RevealOnScroll>
          <div className="mb-12 flex items-center justify-between">
            <h2 className="headline-sm">Mais Artigos</h2>
            <p className="text-sm uppercase tracking-wider text-black-50">
              {posts.length} artigos
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-12">
          {posts.map((post, index) => (
            <ArticleCardMinimal key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BentoGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  const layouts = [
    "lg:col-span-7",
    "lg:col-span-5",
    "lg:col-span-4",
    "lg:col-span-4",
    "lg:col-span-4",
  ];

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={index === 0 ? layouts[index] : `${layouts[index]} md:col-span-1`}
        >
          <ArticleCard post={post} size={index === 0 ? "large" : "small"} />
        </div>
      ))}
    </div>
  );
}

export function ArticleRow({
  posts,
  title = "Relacionados",
}: {
  posts: BlogPost[];
  title?: string;
}) {
  return (
    <section className="overflow-hidden bg-white py-lg">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text mb-8 text-black-50">{title}</p>
        </RevealOnScroll>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:gap-6 md:px-6 lg:px-[calc((100vw-1280px)/2+24px)]">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="w-[300px] shrink-0 snap-start md:w-[340px]"
          >
            <ArticleCardMinimal post={post} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
