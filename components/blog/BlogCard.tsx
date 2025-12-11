import { BlogPost } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/atualidade/${post.slug}`} className="group block">
      <article className="bg-white overflow-hidden shadow-luxury-sm hover:shadow-luxury-md transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="aspect-video overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={600}
            height={338}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-black-50 mb-3 flex-wrap">
            <span className="label-text text-[10px]">{post.category}</span>
            <span className="text-black-50">•</span>
            <span>{post.date}</span>
            <span className="text-black-50">•</span>
            <span>{post.readTime}</span>
          </div>

          {/* Title */}
          <h3 className="headline-sm mb-3 group-hover:text-black-70 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="body-md text-black-70 line-clamp-3 flex-grow">
            {post.excerpt}
          </p>

          {/* Footer spacer */}
          <div className="mt-4 pt-4 border-t border-black-10">
            <span className="inline-flex items-center text-sm font-medium text-black group-hover:gap-2 transition-all">
              Ler mais
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
