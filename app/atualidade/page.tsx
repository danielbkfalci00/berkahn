// Atualidades - Blog da Berkahn
import { Metadata } from "next";
import { HeroPage } from "@/components/sections/HeroPage";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { CTA } from "@/components/sections/CTA";
import { blogPosts } from "@/data/posts";

export const metadata: Metadata = {
  title: "Atualidades | Berkahn Steel Frame",
  description:
    "Notícias, tendências e conteúdos sobre construção industrializada em Light Steel Frame. Fique por dentro das inovações do setor.",
  keywords: [
    "steel frame notícias",
    "construção industrializada",
    "light steel frame",
    "inovação construção",
    "blog berkahn",
    "atualidades",
  ],
};

export default function AtualidadePage() {
  return (
    <main>
      {/* Hero */}
      <HeroPage
        title="Atualidades"
        subtitle="Notícias e Conteúdos"
        imageSrc="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
        imageAlt="Atualidades Berkahn"
      />

      {/* Blog Grid */}
      <BlogGrid posts={blogPosts} showHeader={false} />

      {/* CTA */}
      <CTA />
    </main>
  );
}
