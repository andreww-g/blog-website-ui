export interface IFile {
  id: string;
  url: string;
  name: string;
  mimeType: string | null;
  size: number | null;
  createdAt: Date;
  updatedAt: Date;
}
