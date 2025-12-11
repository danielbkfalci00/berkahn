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
}
