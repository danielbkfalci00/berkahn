import { BlogCategory } from "./blog";

// Extended article types for rich content pages
export interface RichArticle {
  slug: string;
  title: string;
  subtitle?: string;
  category: BlogCategory;
  author: string;
  publishDate: string;
  readTime: number; // in minutes
  heroImage: string;
  excerpt: string;

  // Table of contents
  sections: ArticleSection[];

  // Special content components
  tables?: ArticleTable[];
  process?: ProcessStep[];
  myths?: Myth[];
  stats?: Stat[];
  norms?: Norm[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  level: 2 | 3;
}

export interface ArticleTable {
  id: string;
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
  highlightColumn?: number;
}

export interface ProcessStep {
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  duration?: string;
}

export interface Myth {
  myth: string;
  truth: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
}

export interface Norm {
  code: string;
  title: string;
  description: string;
  year?: string;
}
