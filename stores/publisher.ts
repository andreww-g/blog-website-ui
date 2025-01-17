import { defineStore } from 'pinia';
import { restClient } from '~/openapi/rest-client';
import type { Publisher } from '~/types/publisher';
import { useToast } from 'primevue/usetoast';

interface PublishersResponse {
  data: Publisher[];
  total: number;
}

export const usePublisherStore = defineStore('publisher', () => {
  const publishers = ref<Publisher[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchPublishers = async (params: { 
    skip?: number; 
    take?: number; 
    searchQuery?: string;
  }): Promise<{ data: Publisher[]; total: number }> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await restClient.get('/v1/public/publishers', {
        query: {
          skip: params.skip,
          take: params.take,
          searchQuery: params.searchQuery || null
        }
      });

      if (apiError) {
        throw apiError;
      }

      const response = data?.data as PublishersResponse;
      publishers.value = response.data;
      total.value = response.total;

      return { data: response.data, total: response.total };
    } catch (e) {
      const toast = useToast();
      const errorMessage = 'Failed to fetch publishers';
      error.value = errorMessage;
      toast.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      return { data: [], total: 0 };
    } finally {
      loading.value = false;
    }
  };

  return {
    publishers,
    total,
    loading,
    error,
    fetchPublishers
  };
});
