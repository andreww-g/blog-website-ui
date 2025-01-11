export interface File {
  id: string;
  url: string;
  name: string;
  mimeType: string | null;
  size: number | null;
  createdAt: Date;
  updatedAt: Date;
} 