"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/types/blog";

interface ReadingCarouselProps {
  posts: BlogPost[];
}

/**
 * Carrossel de artigos: rolagem horizontal nativa com snap (arrasta com o
 * dedo ou o trackpad) e setas para mouse. As setas desabilitam nas pontas.
 */
export function ReadingCarousel({ posts }: ReadingCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const step = (card?.offsetWidth ?? el.clientWidth * 0.8) + 20;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        <button type="button" aria-label="Artigos anteriores" disabled={!canPrev} onClick={() => scrollByCard(-1)} className={arrowClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" aria-label="Próximos artigos" disabled={!canNext} onClick={() => scrollByCard(1)} className={arrowClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Artigos sobre sustentabilidade"
        className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <li key={post.id} className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
