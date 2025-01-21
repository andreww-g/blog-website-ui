import { defineStore } from 'pinia';
import { restClient } from '~/openapi/rest-client';
import { useToast } from "primevue/usetoast";
import { ArticleCategoryEnum } from '~/types/article';

interface ArticleImage {
  url: string;
  name: string;
  mimeType: string | null;
  size: number | null;
}

interface EditorBlock {
  type: string;
  data: {
    text?: string;
  };
}

interface ArticleCategory {
  id: string;
  name: ArticleCategoryEnum;
  slug: string;
}

interface CreateArticleData {
  title: string;
  description: string;
  content: {
    blocks: EditorBlock[];
  };
  image: ArticleImage;
  category: ArticleCategory | null;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  content: any;
  image: ArticleImage;
  category: any;
  slug: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const useArticleStore = defineStore('article', () => {
  const toast = useToast();

  const getCategories = async (): Promise<{ data: ArticleCategory[], error: Error | null }> => {
    try {
      const { data, error } = await restClient.get('/v1/articles/categories');
      if (error) throw error;
      return { data: data?.data ?? [], error: null };
    } catch (err) {
      return { data: [], error: err as Error };
    }
  };

  const createArticle = async (data: CreateArticleData): Promise<{ data: Article | null, error: Error | null }> => {
    try {
      const { data: response, error } = await restClient.post('/v1/articles', {
        body: data
      });

      if (error) throw error;

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Article saved successfully'
      });

      return { data: response?.data ?? null, error: null };
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save article'
      });
      return { data: null, error: err as Error };
    }
  };

  const publishArticle = async (id: string): Promise<{ success: boolean, error: Error | null }> => {
    try {
      const { error } = await restClient.post(`/v1/articles/${id}/publish`);

      if (error) throw error;

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Article published successfully'
      });

      return { success: true, error: null };
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to publish article'
      });
      return { success: false, error: err as Error };
    }
  };

  const unpublishArticle = async (id: string): Promise<{ success: boolean, error: Error | null }> => {
    try {
      const { error } = await restClient.post(`/v1/articles/${id}/unpublish`);

      if (error) throw error;

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Article unpublished successfully'
      });

      return { success: true, error: null };
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to unpublish article'
      });
      return { success: false, error: err as Error };
    }
  };

  return {
    createArticle,
    publishArticle,
    unpublishArticle,
    getCategories,
  };
});
