import type {IFile} from "~/types/file";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: IFile | null;
  createdAt: Date;
  updatedAt: Date;
}
