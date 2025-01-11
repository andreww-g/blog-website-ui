import type { Article } from './article';
import type { Author } from './author';

export interface Publisher {
  id: string;
  authorId: string;
  author: Author;
  articles: Article[];
  createdAt: Date;
  updatedAt: Date;
}
