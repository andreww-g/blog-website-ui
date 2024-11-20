import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { restClient } from '~/openapi/rest-client';
import { userAuthorStore } from "~/stores/author";

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));

  const setTokens = (tokens: { accessToken?: string | null, refreshToken?: string | null }) => {
    accessToken.value = tokens?.accessToken || null;
    refreshToken.value = tokens?.refreshToken || null;

    localStorage.setItem('accessToken', accessToken.value);
    localStorage.setItem('refreshToken', refreshToken.value);
  };

  const signOut = () => {
    setTokens({ accessToken: null, refreshToken: null });
    userAuthorStore().setProfile(null);
    navigateTo({ name: 'auth' });
  };

  const refresh = async () => {
    if (!refreshToken.value) return false;

    const { data } = await restClient.post('/auth/refresh-token', {
      body: { refreshToken: refreshToken.value },
      auth: false,
    });

    if (data?.data) setTokens(data.data);
    else signOut();
  };

  const isTokenExpired = (token: string | undefined): boolean => {
    if (!token) return true;
    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      return decodedToken.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  };

  const getAccessToken = async (): Promise<string | undefined> => {
    if (!refreshToken.value) return undefined;
    if (!accessToken.value || isTokenExpired(accessToken.value)) {
      await refresh();
    }
    return accessToken.value;
  };

  const isAuthorized = computed(() => !!accessToken.value && !isTokenExpired(refreshToken.value));

  return {
    isAuthorized,
    accessToken,
    refreshToken,
    refresh,
    signOut,
    setTokens,
    getAccessToken,
  };
});
