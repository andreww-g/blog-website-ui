
import type { MenuItem } from 'primevue/menuitem';

export const useLayoutStore = defineStore('layout', () => {
  const breadcrumbs = ref<MenuItem[]>([]);

  return {
    breadcrumbs,
  };
});
