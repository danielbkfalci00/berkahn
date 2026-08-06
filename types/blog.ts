export const BLOG_CATEGORIES = [
  "Guias e Tutoriais",
  "Tecnologia e Inovação",
  "Mercado e Custos",
  "Segurança e Normas",
  "Sustentabilidade",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogCategoryFilter = "Todos" | BlogCategory;

const BLOG_CATEGORY_ALIASES: Readonly<Record<string, BlogCategory>> = {
  "Guias e Tutoriais": "Guias e Tutoriais",
  Guia: "Guias e Tutoriais",
  Guias: "Guias e Tutoriais",
  "Guia Técnico": "Guias e Tutoriais",
  Educação: "Guias e Tutoriais",
  "Tecnologia e Inovação": "Tecnologia e Inovação",
  Tecnologia: "Tecnologia e Inovação",
  "Arquitetura e Tecnologia": "Tecnologia e Inovação",
  "Construção Industrializada": "Tecnologia e Inovação",
  "Mercado e Custos": "Mercado e Custos",
  Mercado: "Mercado e Custos",
  Análise: "Mercado e Custos",
  "Segurança e Normas": "Segurança e Normas",
  Segurança: "Segurança e Normas",
  "Engenharia Estrutural": "Segurança e Normas",
  Sustentabilidade: "Sustentabilidade",
  "Meio Ambiente": "Sustentabilidade",
  "Eficiência Energética": "Sustentabilidade",
};

export function normalizeBlogCategory(category: string): BlogCategory {
  const normalized = BLOG_CATEGORY_ALIASES[category.trim()];

  if (!normalized) {
    throw new Error(`Categoria de blog desconhecida: "${category}"`);
  }

  return normalized;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: BlogCategory;
  author: string;
  date: string;
  publishedAt?: string;
  readTime: string;
  tags?: string[];
  featured?: boolean;
}
