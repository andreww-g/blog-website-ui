import type { Article } from './article';
import type {PublisherContactInfo} from "~/types/publisher-contact-info";
import type {IUser} from "~/types/user";

export interface Publisher {
  id: string;
  userId: string;
  user: IUser;
  contactInfo: PublisherContactInfo,
  avatar: {
    url: string;
    name: string;
    mimeType: string | null;
    size: number | null;
  }
  articles: Article[];
  createdAt: Date;
  updatedAt: Date;
}
