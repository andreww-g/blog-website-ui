import type { Article } from './article';
import type {PublisherContactInfo} from "~/types/publisher-contact-info";
import type {IUser} from "~/types/user";
import type {IFile} from "~/types/file";

export interface Publisher {
  id: string;
  userId: string;
  user: IUser;
  contactInfo: PublisherContactInfo,
  avatar: IFile | null;
  articles: Article[];
  createdAt: Date;
  updatedAt: Date;
}
