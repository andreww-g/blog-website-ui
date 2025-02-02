import { defineStore } from 'pinia';
import { restClient } from '~/openapi/rest-client';
import type { OpenApiResponse } from '~/openapi/type-utils';

import type { PermissionEnum } from '~/types/enums';
import type { IProfile } from '~/types/profile';
import {useToast} from "primevue/usetoast";

type UserResponseType = OpenApiResponse<'get', 'v1/public/publishers/auth-profile'>['data'];

export const userUserStore = defineStore('profile', () => {
    const response = ref<UserResponseType | null>(null);

    const fetchProfile = async (): Promise<{ data: UserResponseType | null, error: Error | null }> => {
        const { data, error } = await restClient.get('v1/public/publishers/auth-profile');

        setProfile(data?.data ?? null);

        if (error) {
            useToast().error(error?.message || 'Failed to load the Profile');
            console.error(error);
        }

        return { data: data?.data ?? null, error };
    };

    const setProfile = (data: UserResponseType | null) => response.value = data;

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
