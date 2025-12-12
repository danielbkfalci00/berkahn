"use client";

import { BlogPost } from "@/types/blog";
import { blogPosts } from "@/data/posts";
import { ArticleCardMinimal } from "@/components/atualidade/ArticleCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

interface RelatedArticlesCarouselProps {
  currentSlug: string;
  currentCategory: string;
}

export function RelatedArticlesCarousel({
  currentSlug,
  currentCategory,
}: RelatedArticlesCarouselProps) {
  // Lógica de filtro inteligente
  const getRelatedArticles = (): BlogPost[] => {
    // 1. Filtrar artigos da mesma categoria (exceto atual)
    const sameCategory = blogPosts.filter(
      (post) => post.slug !== currentSlug && post.category === currentCategory
    );

    // 2. Pegar artigos recentes de outras categorias
    const otherArticles = blogPosts.filter(
      (post) => post.slug !== currentSlug && post.category !== currentCategory
    );

    // 3. Combinar: priorizar mesma categoria, completar com recentes
    const related = [
      ...sameCategory.slice(0, 2),
      ...otherArticles.slice(0, 2),
    ];

    // 4. Retornar 3-4 artigos
    return related.slice(0, 4);
  };

  const relatedArticles = getRelatedArticles();

  // Se não houver artigos relacionados, não renderizar
  if (relatedArticles.length === 0) return null;

  return (
    <RevealOnScroll>
      <div className="mt-16 pt-12 border-t border-black-10">
        {/* Header */}
        <div className="mb-8">
          <p className="label-text text-black-50 mb-2">Continue Lendo</p>
          <h2 className="headline-md">Artigos Relacionados</h2>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {relatedArticles.map((post, index) => (
              <CarouselItem
                key={post.id}
                className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <ArticleCardMinimal post={post} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <div className="flex gap-2 mt-8 justify-end">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </RevealOnScroll>
  );
}
