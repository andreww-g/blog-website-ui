<script setup lang="ts">
const showAuth = ref(false);
const router = useRouter();

const handleSearch = () => {
  router.push('/publishers-preview');
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
          <li><NuxtLink to="/reviews">Reviews</NuxtLink></li>
          <li><NuxtLink to="/education">Education</NuxtLink></li>
          <li><NuxtLink to="/ethics">Ethics</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
        </ul>
      </nav>
      <div class="user-actions">
        <button class="search-btn" @click="handleSearch">
          <i class="pi pi-search"></i>
        </button>
        <button class="profile-btn" @click="showAuth = true">
          <i class="pi pi-user"></i>
        </button>
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
}

.user-actions button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s, transform 0.2s;
}

.user-actions button:hover {
  background-color: #4b0082;
  transform: scale(1.1);
}

.user-actions button:active {
  transform: scale(0.95);
}

.user-actions button i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .navigation {
    display: none;
  }

  .header-content {
    justify-content: space-between;
  }
}
</style>
