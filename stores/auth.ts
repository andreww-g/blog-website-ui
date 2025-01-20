import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { restClient } from '~/openapi/rest-client';
import { userUserStore } from "~/stores/user";

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const initialized = ref(false);

  // Initialize tokens from localStorage
  const initializeTokens = () => {
    if (process.client) {  // Only run on client-side
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

  const refresh = async () => {
    if (!refreshToken.value) return false;

    const { data } = await restClient.post('/v1/auth/refresh-token', {
      body: { refreshToken: refreshToken.value },
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

  // Initialize on store creation
  if (process.client) {  // Only run on client-side
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
