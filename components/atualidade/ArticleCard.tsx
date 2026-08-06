"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  post: BlogPost;
  size?: "small" | "large";
  index?: number;
}

export function ArticleCard({ post, size = "small" }: ArticleCardProps) {
  const isLarge = size === "large";

  return (
    <article className="group h-full">
      <Link
        href={`/atualidades/${post.slug}`}
        prefetch={false}
        className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <div
          className={cn(
            "relative overflow-hidden bg-carbon-soft",
            isLarge ? "aspect-[16/10]" : "aspect-[4/3]"
          )}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover grayscale-[12%] transition duration-700 ease-expo group-hover:scale-[1.025] group-hover:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none"
            sizes={
              isLarge
                ? "(max-width: 768px) 100vw, 58vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
          />
          <span className="absolute left-0 top-0 bg-black px-3 py-2 font-tech text-[10px] lowercase tracking-wide text-white md:text-xs">
            {post.category}
          </span>
        </div>

        <div className="border-t-[3px] border-black pt-4">
          <div className="mb-3 flex items-center justify-between gap-4 font-tech text-[10px] lowercase tracking-wide text-black-50 md:text-xs">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>

          <h3
            className={cn(
              "font-display font-semibold leading-[1.04] tracking-tight text-black transition-colors duration-300 group-hover:text-black-70",
              isLarge ? "text-3xl md:text-5xl" : "text-2xl md:text-[1.7rem]"
            )}
          >
            {post.title}
          </h3>

          {isLarge && (
            <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-relaxed text-black-70 md:text-base">
              {post.excerpt}
            </p>
          )}

          <span className="mt-5 flex items-center gap-3 font-tech text-[10px] lowercase tracking-wide text-black md:text-xs">
            ler artigo
            <span
              className="h-[3px] w-8 bg-black transition-[width] duration-500 ease-expo group-hover:w-14 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}

// Shared by the article related-post carousel. Keep behavior stable.
export function ArticleCardMinimal({ post, index = 0 }: Omit<ArticleCardProps, "size">) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="group"
    >
      <Link href={`/atualidades/${post.slug}`} className="block">
        <div className="relative mb-4 aspect-[16/10] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="h-full w-full"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
        </div>

        <div>
          <Badge
            variant="outline"
            className="mb-3 border-black/20 text-[10px] uppercase tracking-wider text-black/60"
          >
            {post.category}
          </Badge>

          <h3 className="mb-2 font-heading text-lg font-semibold leading-tight transition-colors duration-300 group-hover:text-black/70">
            {post.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-black/50">
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-black/30" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
