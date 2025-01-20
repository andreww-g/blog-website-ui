<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { restClient } from '~/openapi/rest-client';
import type { Article } from '~/types/article';
import { useReadingTime } from '~/composables/useReadingTime';
import { useAuthStore } from '~/stores/auth';

const articles = ref<Article[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const authStore = useAuthStore();

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Articles' }
];

const { calculateReadingTime } = useReadingTime();

const fetchArticles = async () => {
  const { data, error: fetchError } = await restClient.get('/v1/articles', {
    query: {
      take: 20,
      skip: 0,
      orderBy: 'createdAt',
      orderDir: 'DESC'
    }
  });

  if (fetchError) {
    error.value = fetchError.message;
    return null;
  }

  return data.data;
};

const initializeData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const articlesData = await fetchArticles();
    articles.value = articlesData || [];
  } catch (e) {
    error.value = 'An error occurred while loading articles';
    console.error('Error initializing data:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="articles-list">
    <Breadcrumbs :items="breadcrumbs" />

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <template v-else>
      <h1>Articles</h1>

      <div class="articles-grid">
        <article
          v-for="article in articles"
          :key="article.id"
          class="article-card"
        >
          <NuxtLink :to="`articles-preview/${article.slug}`">
            <div class="article-image" v-if="article.image">
              <img :src="article.image" :alt="article.title">
            </div>
            <div class="article-content">
              <h2>{{ article.title }}</h2>
              <p>{{ article.description }}</p>
              <div class="article-meta">
                <div class="meta-item">
                  <span class="label">Publication date:</span>
                  <span class="value">
                    {{ new Date(article.publishedAt || article.createdAt).toLocaleDateString() }}
                  </span>
                </div>
                <div class="meta-item">
                  <span class="label">Reading time:</span>
                  <span class="value">
                    {{ calculateReadingTime(article.content) }}
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </template>
  </div>
</template>

<style scoped>
.articles-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateY(-4px);
}

.article-card a {
  text-decoration: none;
  color: inherit;
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
}

.article-content h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  line-height: 1.4;
}

.article-content p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.meta-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.label {
  color: #333;
  font-weight: 700;
}

.value {
  color: #666;
}

@media (max-width: 768px) {
  .articles-list {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>

