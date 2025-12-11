import { BlogPost } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

interface BlogGridProps {
  posts: BlogPost[];
  showHeader?: boolean;
}

export function BlogGrid({ posts, showHeader = true }: BlogGridProps) {
  return (
    <section className="py-xl bg-black-5">
      <div className="container">
        {showHeader && (
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="label-text mb-4">BLOG</p>
              <h2 className="headline-lg mb-6">Atualidades</h2>
              <p className="body-lg text-black-70 max-w-2xl mx-auto">
                Conteúdos sobre construção industrializada, inovação e
                tendências em Light Steel Frame.
              </p>
            </div>
          </RevealOnScroll>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <RevealOnScroll key={post.id} delay={index * 0.1}>
              <BlogCard post={post} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
