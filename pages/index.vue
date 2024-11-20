<script lang="ts" setup>
import { ref } from 'vue';
import AuthComponent from './auth.vue';

const showAuth = ref(false);
</script>

<template>
  <div class="index-container">
    <header class="header">
      <div class="header-content">
        <div class="brand">
          <h2>Blog Website</h2>
        </div>
        <nav class="navigation">
          <ul>
            <li><NuxtLink to="/recertification">Articles</NuxtLink></li>
            <li><NuxtLink to="/certification">Publishers</NuxtLink></li>
            <li><NuxtLink to="/examinations">Reviews</NuxtLink></li>
            <li><NuxtLink to="/education">Education</NuxtLink></li>
            <li><NuxtLink to="/ethics">Ethics</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
          </ul>
        </nav>
        <div class="user-actions">
          <button class="search-btn">
            <i class="pi pi-search"></i>
          </button>
          <button class="profile-btn" @click="showAuth = true">
            <i class="pi pi-user"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <h1>Develop your own blog in 2 minutes</h1>
      <p>We offer various tools for that</p>
    </main>

    <AuthComponent v-if="showAuth" @close="showAuth = false" />
  </div>
</template>

<style scoped>
.index-container {
  min-height: 100vh;
}

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
  transition: background-color 0.2s;
}

.user-actions button:hover {
  background-color: #4b0082;
}

.user-actions button i {
  font-size: 1.2rem;
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  text-align: center;
}

.main-content h1 {
  color: #6a0dad;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.main-content p {
  color: #4b0082;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .navigation {
    display: none;
  }
  
  .header-content {
    justify-content: space-between;
  }
  
  .main-content h1 {
    font-size: 2rem;
  }
}
</style> 