<template>
  <div class="app-container">
    <HeaderDesktop />
    <main class="main-container">
      <Toast />
      <ConfirmDialog />
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  width: 100%;
}
</style>
