<script lang="ts" setup>
import { ref } from 'vue';
import AuthComponent from './auth.vue';

const showAuth = ref(false);
</script>

<template>
  <div class="index-container">
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
  .main-content h1 {
    font-size: 2rem;
  }
}
</style> 