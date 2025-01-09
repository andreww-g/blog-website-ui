export interface Article {
  id: string;
  title: string;
  content: Record<string, unknown> | null;
  description: string;
  authorId: string;
  publisherId: string | null;
  slug: string;
  tags: string[];
  image: string,
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
