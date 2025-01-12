import type {ArticleCategory} from "~/types/article-category";
import type {Publisher} from "~/types/publisher";

export interface Article {
  id: string;
  title: string;
  content: Record<string, unknown> | null;
  description: string;
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
