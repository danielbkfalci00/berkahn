export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags?: string[];
  featured?: boolean;
}

export type BlogCategory =
  | "Todos"
  | "Tecnologia"
  | "Guia"
  | "Educação"
  | "Análise"
  | "Meio Ambiente"
  | "Mercado"
  | "Segurança"
  | "Case";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Todos",
  "Tecnologia",
  "Guia",
  "Educação",
  "Análise",
  "Meio Ambiente",
  "Mercado",
  "Segurança",
  "Case",
];
