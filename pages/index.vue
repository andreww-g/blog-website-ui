<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const handleStartJourney = () => {
  if (authStore.isAuthorized) {
    navigateTo('/articles-preview');
  } else {
    navigateTo('/auth');
  }
};
</script>

<template>
  <div class="home-container">
    <h1 class="title">Develop your own blog in 2 minutes</h1>
    <p class="subtitle">We offer various tools for that</p>
    <Button
      label="Start Journey"
      class="start-button"
      @click="handleStartJourney"
    />
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  color: #4b0082;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.start-button {
  background-color: #4b0082;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: background-color 0.2s;
}

.start-button:hover {
  background-color: #5a2d8a;
}
</style>
