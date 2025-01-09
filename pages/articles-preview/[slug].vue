<script lang="ts" setup>
import { ref } from 'vue';
import { restClient } from '~/openapi/rest-client';
import type { Article, ArticleResponse, ArticlesResponse } from '~/types/article';

const route = useRoute();
const articleId = route.query.id as string;

const article = ref<Article | null>(null);
const relatedArticles = ref<Article[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const breadcrumbs = computed(() => [
  { text: 'Home', to: '/' },
  { text: 'Articles', to: '/articles' },
  { text: article.value?.title || 'Loading...' }
]);

const fetchArticle = async (id: string) => {
  const { data, error: fetchError } = await restClient.get(`/articles/${id}`, {
    query: {
      onlyPublished: true
    }
  }) as { data: ArticleResponse | null, error: Error | null };

  if (fetchError) {
    error.value = fetchError.message;
    return null;
  }

  return data?.data;
};

const fetchRelatedArticles = async (id: string) => {
  const { data, error: fetchError } = await restClient.get('/articles/relative', {
    query: { id }
  }) as { data: ArticlesResponse | null, error: Error | null };

  if (fetchError) {
    console.error('Error fetching related articles:', fetchError);
    return [];
  }

  return data?.data || [];
};

const initializeData = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!articleId) {
      error.value = 'Article ID is required';
      return;
    }

    const [articleData, relatedData] = await Promise.all([
      fetchArticle(articleId),
      fetchRelatedArticles(articleId)
    ]);

    article.value = articleData;
    relatedArticles.value = relatedData;
  } catch (e) {
    error.value = 'An error occurred while loading the article';
    console.error('Error initializing data:', e);
  } finally {
    loading.value = false;
  }
};

// Watch for route changes to reload data
watch(() => route.query.id, (newId) => {
  if (newId && newId !== articleId) {
    initializeData();
  }
});

// Initial load
onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="article-preview">
    <Breadcrumbs :items="breadcrumbs" />
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <template v-else-if="article">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span>></span>
        <NuxtLink to="/articles">Articles</NuxtLink>
        <span>></span>
        <span>{{ article.title }}</span>
      </nav>

      <!-- Main Article -->
      <article class="main-article">
        <header class="article-header">
          <div class="article-meta">
            <span class="article-type">Article</span>
            <span class="publish-date">
              {{ new Date(article.publishedAt || article.createdAt).toLocaleDateString() }}
            </span>
          </div>

          <h1>{{ article.title }}</h1>
          <p class="description">{{ article.description }}</p>

          <div class="tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </header>

        <div v-if="article.content" class="article-content">
          <!-- Render your article content here based on your content structure -->
          {{ article.content }}
        </div>
      </article>

      <!-- Related Articles -->
      <section v-if="relatedArticles.length > 0" class="related-articles">
        <h2>Related Articles</h2>
        <div class="articles-grid">
          <article
              v-for="related in relatedArticles"
              :key="related.id"
              class="article-card"
          >
            <NuxtLink :to="`/articles-preview?id=${related.id}`">
              <div class="article-content">
                <h3>{{ related.title }}</h3>
                <p>{{ related.description }}</p>
                <div class="article-meta">
                  <span class="publish-date">
                    {{ new Date(related.publishedAt || related.createdAt).toLocaleDateString() }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </template>

    <div v-else class="error">
      Article not found
    </div>
  </div>
</template>

<style scoped>
.article-preview {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.breadcrumb {
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
}

.breadcrumb span {
  margin: 0 0.5rem;
  color: #666;
}

.main-article {
  margin-bottom: 3rem;
}

.article-header {
  margin-bottom: 2rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-type {
  text-transform: uppercase;
  font-weight: 600;
  color: #1a1a1a;
}

h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background-color: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
}

.related-articles {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.related-articles h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 4px;
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
  padding: 1.5rem;
  display: block;
}

.article-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
  line-height: 1.4;
}

.article-card p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .article-preview {
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
