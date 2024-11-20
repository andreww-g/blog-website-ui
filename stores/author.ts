import { defineStore } from 'pinia';
import { restClient } from '~/openapi/rest-client';
import type { OpenApiResponse } from '~/openapi/type-utils';

import type { PermissionEnum } from '~/types/enums';
import type { IProfile } from '~/types/profile';
import {useToast} from "primevue/usetoast";

type AuthorResponseType = OpenApiResponse<'get', 'v1/public/authors/auth-profile'>['data'];

export const userAuthorStore = defineStore('profile', () => {
  const response = ref<AuthorResponseType | null>(null);

  const fetchProfile = async (): Promise<{ data: AuthorResponseType | null, error: Error | null }> => {
    const { data, error } = await restClient.get('v1/public/authors/auth-profile');

    setProfile(data?.data ?? null);

    if (error) {
      useToast().error(error?.message || 'Failed to load the Profile');
      console.error(error);
    }

    return { data: data?.data ?? null, error };
  };

  const setProfile = (data: AuthorResponseType | null) => response.value = data;

  const profile = computed((): IProfile | null => {
    if (!response.value) return null;

    return {
      ...response.value,
      comment: response.value.comment ?? null,
      permissions: response.value.permissions as PermissionEnum[],
    };
  });

  return {
    profile,
    setProfile,
    fetchProfile,
  };
});
