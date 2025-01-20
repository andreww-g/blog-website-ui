<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AuthComponent from '~/pages/auth.vue';

const showAuth = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const menu = ref();

onMounted(() => {
  authStore.initializeTokens();
});

const handleSearch = () => {
  router.push('/publishers-preview');
};

const handleSignOut = () => {
  authStore.signOut();
};

const items = computed(() => [
  {
    label: 'Sign Out',
    icon: 'pi pi-sign-out',
    command: handleSignOut
  }
]);

const toggleMenu = (event: Event) => {
  menu.value?.toggle(event);
};

const handleProfileClick = (event: Event) => {
  if (authStore.isAuthorized) {
    toggleMenu(event);
  } else {
    showAuth.value = true;
  }
};

const navigateToCreateArticle = () => {
  navigateTo('/articles-preview/create');
};
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="brand">
        <NuxtLink to="/">
          <h2>Blog Website</h2>
        </NuxtLink>
      </div>
      <nav class="navigation">
        <ul>
          <li><NuxtLink to="/articles-preview">Articles</NuxtLink></li>
          <li><NuxtLink to="/publishers-preview">Publishers</NuxtLink></li>
          <li><NuxtLink to="/contact-us">Contact Us</NuxtLink></li>
        </ul>
      </nav>
      <div class="user-actions">
        <Button
          v-if="authStore.isAuthorized"
          label="Create Article"
          icon="pi pi-plus"
          class="create-button"
          @click="navigateToCreateArticle"
        />
        <Button
          icon="pi pi-user"
          class="profile-btn p-button-text"
          @click="handleProfileClick"
          severity="secondary"
          :title="authStore.isAuthorized ? 'Account Menu' : 'Sign In'"
        />
        <Menu :model="items" :popup="true" ref="menu" />
      </div>
    </div>
    <AuthComponent v-if="showAuth" @close="showAuth = false" />
  </header>
</template>

<style scoped>
.header {
  background-color: #6a0dad;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand a {
  text-decoration: none;
}

.brand h2 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.navigation ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.navigation li a:hover {
  color: #8b6b9f;
}

.user-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.create-button {
  background-color: #4b0082 !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #6a0dad !important;
}

.profile-btn {
  background: none !important;
  border: none;
  color: white !important;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s, transform 0.2s;
}

.profile-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.1);
}

.profile-btn:active {
  transform: scale(0.95);
}

:deep(.p-menu) {
  min-width: 150px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.p-menuitem-link) {
  padding: 0.75rem 1rem;
  color: #333;
  transition: background-color 0.2s;
}

:deep(.p-menuitem-link:hover) {
  background-color: #f5f5f5;
}

:deep(.p-menuitem-icon) {
  color: #4b0082;
  margin-right: 0.5rem;
}

:deep(.p-button.p-button-text) {
  color: white !important;
  padding: 0.5rem;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

@media (max-width: 768px) {
  .navigation {
    display: none;
  }

  .header-content {
    justify-content: space-between;
  }

  .create-button {
    display: none;  /* Hide create button on mobile */
  }
}
</style>
