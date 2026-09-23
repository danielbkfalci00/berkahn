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

/**
 * Cartão da lista de /atualidades: foto, categoria e data numa linha discreta,
 * título. Antes tinha etiqueta preta sobre a foto, régua de 3px, rótulos em
 * fonte monoespaçada e "ler artigo" com barra em todos os cartões; o cartão
 * inteiro já é o link.
 */
export function ArticleCard({ post, size = "small" }: ArticleCardProps) {
  const isLarge = size === "large";

  return (
    <article className="group h-full">
      <Link
        href={`/atualidades/${post.slug}`}
        prefetch={false}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
      >
        <div className={cn("relative overflow-hidden bg-black-5", isLarge ? "aspect-[16/10]" : "aspect-[3/2]")}>
          <Image
            src={post.image}
            alt=""
            fill
            quality={80}
            className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04] motion-reduce:transition-none"
            sizes={isLarge ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"}
          />
        </div>

        <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-black-50">
          {post.category}
          <span className="mx-2 text-black-30" aria-hidden="true">·</span>
          {post.date}
        </p>

        <h3
          className={cn(
            "mt-3 font-display font-semibold leading-[1.08] tracking-[-0.02em] text-black decoration-[1.5px] underline-offset-4 group-hover:underline",
            isLarge ? "text-[clamp(1.6rem,1rem+1.6vw,2.4rem)]" : "text-xl md:text-[1.4rem]"
          )}
        >
          {post.title}
        </h3>

        {isLarge && (
          <p className="mt-3 line-clamp-2 max-w-xl text-base leading-relaxed text-black-70">{post.excerpt}</p>
        )}

        <p className="mt-3 text-sm text-black-50">{post.readTime} de leitura</p>
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
