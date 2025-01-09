<script lang="ts" setup>
interface Breadcrumb {
  text: string;
  to?: string;
}

defineProps<{
  items: Breadcrumb[];
}>();
</script>

<template>
  <nav class="breadcrumbs">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <template v-if="item.to">
          <NuxtLink :to="item.to">{{ item.text }}</NuxtLink>
        </template>
        <template v-else>
          <span>{{ item.text }}</span>
        </template>
        <span v-if="index < items.length - 1" class="separator">/</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.breadcrumbs ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
}

.breadcrumbs li {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.breadcrumbs a {
  color: #6a0dad;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumbs a:hover {
  color: #4b0082;
}

.separator {
  margin: 0 0.5rem;
  color: #999;
}
</style> 