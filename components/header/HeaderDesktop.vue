<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const menu = ref();

onMounted(() => {
  authStore.initializeTokens();
});

const handleNavigation = (path: string) => {
  if (!authStore.isAuthorized && (path.includes('articles') || path.includes('publishers'))) {
    router.push('/register');
    return;
  }
  navigateTo(path);
};

const handleSearch = () => {
  router.push('/publishers-preview');
};

const handleSignOut = () => {
  authStore.signOut();
};

const handleViewProfile = () => {
  navigateTo('/profile');
};

const items = computed(() => [
  {
    label: 'View Profile',
    icon: 'pi pi-user',
    command: handleViewProfile,
    visible: authStore.isAuthorized
  },
  {
    separator: true,
    visible: authStore.isAuthorized
  },
  {
    label: 'Sign Out',
    icon: 'pi pi-sign-out',
    command: handleSignOut,
    visible: authStore.isAuthorized
  },
  {
    label: 'Sign Up',
    icon: 'pi pi-user-plus',
    command: () => { router.push('/register') },
    visible: !authStore.isAuthorized
  },
  {
    label: 'Already have an account? Sign In',
    icon: 'pi pi-sign-in',
    command: () => { router.push('/auth') },
    visible: !authStore.isAuthorized
  }
]);

const handleProfileClick = (event: Event) => {
  if (authStore.isAuthorized) {
    toggleMenu(event);
  } else {
    toggleMenu(event);
  }
};

const toggleMenu = (event: Event) => {
  menu.value?.toggle(event);
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
          <li>
            <a href="#" @click.prevent="handleNavigation('/articles-preview')">Articles</a>
          </li>
          <li>
            <a href="#" @click.prevent="handleNavigation('/publishers-preview')">Publishers</a>
          </li>
          <li><NuxtLink to="/contact-us">Contact Us</NuxtLink></li>
        </ul>
      </nav>
      <div class="user-actions">
        <Button
          v-if="authStore.isAuthorized"
          icon="pi pi-plus"
          class="create-button p-button-text"
          @click="navigateToCreateArticle"
          :title="'Create Article'"
        />
        <Button
          icon="pi pi-user"
          class="profile-btn p-button-text"
          @click="handleProfileClick"
          severity="secondary"
          :title="authStore.isAuthorized ? 'Account Menu' : 'Sign Up'"
        />
        <Menu
          ref="menu"
          :model="items"
          :popup="true"
          class="header-menu"
        />
      </div>
    </div>
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
  background: none !important;
  border: none !important;
  color: white !important;
  cursor: pointer;
  padding: 0.5rem !important;
  border-radius: 50% !important;
  transition: background-color 0.2s, transform 0.2s;
  width: 2.5rem !important;
  height: 2.5rem !important;
}

.create-button:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.1);
}

.create-button:active {
  transform: scale(0.95);
}

.profile-btn {
  background: none !important;
  border: none !important;
  color: white !important;
  cursor: pointer;
  padding: 0.5rem !important;
  border-radius: 50% !important;
  transition: background-color 0.2s, transform 0.2s;
}

.profile-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.1);
}

.profile-btn:active {
  transform: scale(0.95);
}

:deep(.header-menu.p-menu) {
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 250px;
}

:deep(.p-menuitem-link) {
  padding: 0.85rem 1.25rem !important;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

:deep(.p-menuitem-link:hover) {
  background-color: rgba(106, 13, 173, 0.1) !important;
}

:deep(.p-menuitem-icon) {
  color: #6a0dad !important;
  margin-right: 0.75rem;
  font-size: 1rem;
}

:deep(.p-menuitem-text) {
  color: #333;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.5;
}

:deep(.p-menuitem-link[aria-label="Already have an account? Sign In"]) {
  .p-menuitem-text {
    font-size: 0.9rem;
    color: #666;
  }
  .p-menuitem-icon {
    color: #666 !important;
  }
}

:deep(.p-menu-separator) {
  border-top: 1px solid #eee;
  margin: 0.25rem 0;
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
