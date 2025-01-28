import type { OpenApiResponse } from '~/openapi/type-utils';
import type { IProfile } from '~/types/profile.interface';

import { defineStore } from 'pinia';

import { restClient } from '~/openapi/rest-client';
import { useToast } from "primevue/usetoast";


type ProfileResponseType = OpenApiResponse<'get', 'v1/publishers/auth-profile'>['data'];

interface UpdateProfileData {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        password?: string;
    };
    contactInfo: {
        telegram?: string | null;
        facebook?: string | null;
        instagram?: string | null;
    };
}

export const useProfile = defineStore('profile', () => {
    const response = ref<IProfile | null>(null);

    const toast = useToast();

    const fetchProfile = async () => {
        try {
            const { data, error } = await restClient.get('v1/publishers/auth-profile');

            if (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'Failed to load the Profile'
                });
            }

            setProfile(data?.data ?? null);
            return { data: data?.data ?? null, error };
        } catch (err) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load the Profile'
            });
            return { data: null, error: err as Error };
        }
    };

    const updateProfile = async (data: UpdateProfileData): Promise<{ data: ProfileResponseType | null, success: boolean }> => {
        if (!response.value?.id) {
            return { data: null, success: false };
        }

        try {
            const { data: updatedPublisher, error } = await restClient.patch(`/v1/publishers/${response.value.id}`, {
                body: {
                    user: {
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                        ...(data.user.password ? { password: data.user.password } : {})
                    },
                    contactInfo: {
                        telegram: data.contactInfo.telegram || null,
                        facebook: data.contactInfo.facebook || null,
                        instagram: data.contactInfo.instagram || null
                    }
                }
            });

            if (error) throw error;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully'
            });
            return { success: true, data: updatedPublisher?.data };
        } catch (err) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update profile'
            });
            return { success: false, data: null };
        }
    };

    const setProfile = (data: IProfile | null) => response.value = data;

    const profile = computed((): IProfile | null => {
        if (!response.value) return null;

        return response.value
    });

    return {
        profile,
        setProfile,
        fetchProfile,
        updateProfile,
    };
});
