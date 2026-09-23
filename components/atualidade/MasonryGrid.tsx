"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { BlogPost } from "@/types/blog";
import { ArticleCard, ArticleCardMinimal } from "./ArticleCard";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const POSTS_PER_PAGE = 9;

interface MasonryGridProps {
  posts: BlogPost[];
  variant?: "masonry" | "minimal";
  emptyMessage?: string;
  /** Título da lista; muda com a categoria filtrada. */
  title?: string;
  /** Controles de filtro, renderizados sob o título. */
  filter?: ReactNode;
}

export function MasonryGrid({
  posts,
  variant = "masonry",
  emptyMessage = "Ainda não há publicações nesta categoria.",
  title = "Todos os artigos",
  filter,
}: MasonryGridProps) {
  const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE);

  useEffect(() => {
    setDisplayCount(POSTS_PER_PAGE);
  }, [posts]);

  if (variant === "minimal") {
    return <MinimalGrid posts={posts} />;
  }

  const visiblePosts = posts.slice(0, displayCount);
  const leadPosts = visiblePosts.slice(0, 2);
  const restPosts = visiblePosts.slice(2);
  const remaining = posts.length - displayCount;

  return (
    <section className="bg-off-white pb-2xl pt-16 md:pb-3xl md:pt-24" aria-labelledby="arquivo-title">
      <div className="container">
        <div className="mb-10 md:mb-14">
          <div className="flex items-end justify-between gap-6">
            <h2
              id="arquivo-title"
              className="font-display text-[clamp(2.2rem,1.2rem+3vw,4.2rem)] font-semibold leading-none tracking-[-0.04em]"
            >
              {title}
            </h2>
            {/* Só para leitor de tela: as pílulas já mostram as contagens, e um
                número visível aqui divergia delas (o destaque fica fora da lista). */}
            <p role="status" aria-live="polite" className="sr-only">
              {posts.length} {posts.length === 1 ? "artigo" : "artigos"}
            </p>
          </div>
          {filter && <div className="mt-8">{filter}</div>}
        </div>

        {visiblePosts.length > 0 ? (
          <>
            {/* Os dois primeiros abrem maiores, lado a lado; o resto em três
                colunas. Antes era um bento de cinco com tamanhos variados e
                depois uma grade uniforme, sem motivo de leitura para a troca. */}
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
              {leadPosts.map((post, index) => (
                <RevealOnScroll key={post.id} delay={index * 0.08}>
                  <ArticleCard post={post} size="large" />
                </RevealOnScroll>
              ))}
            </div>

            {restPosts.length > 0 && (
              <div className="mt-16 grid gap-x-8 gap-y-14 border-t border-black-10 pt-16 md:grid-cols-2 lg:grid-cols-3">
                {restPosts.map((post, index) => (
                  <RevealOnScroll key={post.id} delay={(index % 3) * 0.08}>
                    <ArticleCard post={post} />
                  </RevealOnScroll>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="max-w-xl py-20 font-display text-2xl font-medium leading-tight tracking-tight md:text-3xl">
            {emptyMessage}
          </p>
        )}

        {remaining > 0 && (
          <div className="mt-16 flex justify-center md:mt-20">
            <button
              type="button"
              onClick={() => setDisplayCount((current) => Math.min(current + POSTS_PER_PAGE, posts.length))}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-black px-7 text-sm font-medium text-black transition-colors duration-300 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Mostrar mais {Math.min(POSTS_PER_PAGE, remaining)}
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
