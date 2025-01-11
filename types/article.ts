import type {ArticleCategory} from "~/types/article-category";
import type {Publisher} from "~/types/publisher";
import type {Author} from "~/types/author";

export interface Article {
  id: string;
  title: string;
  content: Record<string, unknown> | null;
  description: string;
  authorId: string;
  author: Author;
  publisherId: string | null;
  publisher: Publisher | null;
  slug: string;
  tags: string[];
  image: string,
  category: ArticleCategory,
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleResponse {
  success: true;
  data: Article;
}

export interface ArticlesResponse {
  success: true;
  data: Article[];
}
