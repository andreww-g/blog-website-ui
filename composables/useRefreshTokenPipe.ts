import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/stores/auth';
import { useProfile } from '~/stores/profile';


export const useRefreshTokenPipe = async () => {
  const profileStore = useProfile();
  const authStore = useAuthStore();

  const { refreshToken } = storeToRefs(authStore);

  if (refreshToken.value) {
    const tokens = await authStore.refresh(refreshToken.value);

    if (tokens) {
      const { data } = await profileStore.fetchProfile();

      return !!data;
    }
  }

  return false;
};
