import type { Author } from './author';

export interface AuthorContactInfo {
  id: string;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
} 