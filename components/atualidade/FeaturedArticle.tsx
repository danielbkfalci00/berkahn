"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ArrowRight, Clock, User } from "lucide-react";

interface FeaturedArticleProps {
  post: BlogPost;
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <section className="py-xl bg-white">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text text-black-50 mb-4">Em Destaque</p>
        </RevealOnScroll>

        <Link href={`/atualidade/${post.slug}`} className="group block">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
            {/* Image */}
            <RevealOnScroll delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  className="w-full h-full"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                </motion.div>

                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center"
                >
                  <span className="px-6 py-3 bg-white text-black text-sm uppercase tracking-wider font-medium">
                    Ler Artigo
                  </span>
                </motion.div>
              </div>
            </RevealOnScroll>

            {/* Content */}
            <RevealOnScroll delay={0.2}>
              <div className="lg:py-8">
                {/* Badge */}
                <Badge
                  variant="outline"
                  className="mb-6 text-xs uppercase tracking-wider border-black/20 text-black/70"
                >
                  {post.category}
                </Badge>

                {/* Title */}
                <h2 className="headline-md mb-6 group-hover:text-black-70 transition-colors duration-300">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="body-md text-black-70 mb-8 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-6 text-sm text-black-50 mb-8">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span>{post.date}</span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                {/* CTA */}
                <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-wider group-hover:gap-4 transition-all duration-300">
                  Ler Artigo Completo
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </RevealOnScroll>
          </div>
        </Link>

        {/* Separator */}
        <RevealOnScroll delay={0.3}>
          <div className="mt-16 h-px bg-black-10" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
