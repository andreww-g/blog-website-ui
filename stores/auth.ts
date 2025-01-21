import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { restClient } from '~/openapi/rest-client';
import { userUserStore } from "~/stores/user";

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const initialized = ref(false);

  const initializeTokens = () => {
    if (import.meta.client) {
      accessToken.value = localStorage.getItem('accessToken');
      refreshToken.value = localStorage.getItem('refreshToken');
    }
    initialized.value = true;
  };

  const setTokens = (tokens: { accessToken?: string | null, refreshToken?: string | null }) => {
    accessToken.value = tokens?.accessToken || null;
    refreshToken.value = tokens?.refreshToken || null;

    if (process.client) {  // Only interact with localStorage on client-side
      if (tokens?.accessToken && tokens?.refreshToken) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  };

  const signOut = () => {
    setTokens({ accessToken: null, refreshToken: null });
    userUserStore().setProfile(null);
    navigateTo({ name: 'auth' });
  };

  const refresh = async (token: string = refreshToken.value || '') => {
    if (!token && !refreshToken.value) return false;

    const { data } = await restClient.post('/v1/auth/refresh-token', {
      body: { refreshToken: token ?? refreshToken.value },
      auth: false,
    });

    if (data?.data) setTokens(data.data);
    else signOut();
  };

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      return decodedToken.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!refreshToken.value) return null;

    if (!accessToken.value || isTokenExpired(accessToken.value)) {
      await refresh();
    }

    return accessToken.value;
  };

  const isAuthorized = computed(() => {
    if (!initialized.value) return false;
    return !!accessToken.value &&
           !!refreshToken.value &&
           !isTokenExpired(refreshToken.value);
  });

  if (import.meta.client) {
    initializeTokens();
  }

  return {
    isAuthorized,
    accessToken,
    refreshToken,
    refresh,
    signOut,
    setTokens,
    getAccessToken,
    initializeTokens,
  };
});
