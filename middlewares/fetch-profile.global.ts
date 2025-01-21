import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/stores/auth';
import { useProfile } from '~/stores/profile';
import { useRefreshTokenPipe } from '~/composables/useRefreshTokenPipe';


export default defineNuxtRouteMiddleware( async (to) => {
  const profileStore = useProfile();
  const authStore = useAuthStore();

  const { profile } = storeToRefs(profileStore);
  const { accessToken } = storeToRefs(authStore);

  if (accessToken.value && !profile.value) {
    await nextTick();

    const { error } = await profileStore.fetchProfile();

    if (error?.message === '401') {
      await useRefreshTokenPipe();
    }
  }

  if (!accessToken.value && to.path !== '/auth') return navigateTo('/auth');
});
