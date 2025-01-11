import type { AuthorContactInfo } from './author-contact-info';
import type { User } from './user';
import type { Publisher } from './publisher';

export interface Author {
  id: string;
  contactInfo: AuthorContactInfo;
  description: string | null;
  userId: string;
  user: User;
  publisherId: string | null;
  publisher: Publisher;
  createdAt: Date;
  updatedAt: Date;
} 