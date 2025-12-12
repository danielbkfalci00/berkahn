"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  post: BlogPost;
  size?: "small" | "large";
  index?: number;
}

export function ArticleCard({ post, size = "small", index = 0 }: ArticleCardProps) {
  const isLarge = size === "large";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1],
      }}
      className={cn(
        "group relative bg-white",
        isLarge ? "row-span-2" : "row-span-1"
      )}
    >
      <Link href={`/atualidade/${post.slug}`} className="block h-full">
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden",
            isLarge ? "aspect-[3/4]" : "aspect-[4/3]"
          )}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="w-full h-full"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-all duration-700 group-hover:grayscale-0 grayscale-[20%]"
              sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          </motion.div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Category Badge */}
          <Badge
            variant="outline"
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs uppercase tracking-wider border-0 text-black/80"
          >
            {post.category}
          </Badge>

          {/* Hover Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ArrowUpRight className="w-5 h-5 text-black" />
          </motion.div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-white/70 mb-3">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-white/50" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h3
              className={cn(
                "font-heading font-semibold leading-tight",
                isLarge ? "text-xl md:text-2xl" : "text-lg"
              )}
            >
              {post.title}
            </h3>

            {/* Excerpt - Only on large cards */}
            {isLarge && (
              <p className="mt-3 text-sm text-white/80 line-clamp-2">
                {post.excerpt}
              </p>
            )}

            {/* Read More Link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
            >
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-white/90">
                Ler Artigo
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// Alternative minimal card style
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
      <Link href={`/atualidade/${post.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden mb-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="w-full h-full"
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

        {/* Content */}
        <div>
          <Badge
            variant="outline"
            className="mb-3 text-[10px] uppercase tracking-wider border-black/20 text-black/60"
          >
            {post.category}
          </Badge>

          <h3 className="text-lg font-heading font-semibold leading-tight mb-2 group-hover:text-black/70 transition-colors duration-300">
            {post.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-black/50">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-black/30" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
