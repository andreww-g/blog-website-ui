import type { File } from './file';
import type { Author } from './author';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: File | null;
  authorId: string | null;
  author: Author | null;
  createdAt: Date;
  updatedAt: Date;
} 