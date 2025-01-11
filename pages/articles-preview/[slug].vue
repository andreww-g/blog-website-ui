<script lang="ts" setup>
import { ref } from 'vue';
import type { Article } from '~/types/article';
import { restClient } from '~/openapi/rest-client';

const route = useRoute();
const slug = route.params.slug as string;

const article = ref<Article | null>(null);
const relatedArticles = ref<Article[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const breadcrumbs = computed(() => [
  { text: 'Home', to: '/' },
  { text: 'Articles', to: '/articles' },
  { text: article.value?.title || 'Loading...' }
]);

const formattedDate = computed(() => {
  if (!article.value) return '';
  const date = new Date(article.value.publishedAt || article.value.createdAt);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
});

const formattedName = computed(() => {
  console.log(article)
  if (!article.value?.author) return '';
  return `${article.value.author.user.firstName} ${article.value.author.user.lastName}`;
});

const readingTime = computed(() => {
  if (!article.value?.content) return '0 min read';
  const words = JSON.stringify(article.value.content).split(' ').length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
});

const fetchArticle = async (slug: string) => {
  const { data, error: fetchError } = await restClient.get(`/v1/articles/by-slug/${slug}`);

  if (fetchError) {
    error.value = fetchError.message;
    return null;
  }

  return data?.data;
};

const fetchRelatedArticles = async (id: string) => {
  const { data, error: fetchError } = await restClient.get(`/v1/articles/${id}/related`);

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

    if (!slug) {
      error.value = 'Article slug is required';
      return;
    }

    const articleData = await fetchArticle(slug);
    article.value = articleData;

    if (articleData?.id) {
      relatedArticles.value = await fetchRelatedArticles(articleData.id);
    }
  } catch (e) {
    error.value = 'An error occurred while loading the article';
    console.error('Error initializing data:', e);
  } finally {
    loading.value = false;
  }
};

watch(() => route.params.slug, (newSlug) => {
  if (newSlug && newSlug !== slug) {
    initializeData();
  }
});

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div class="article-view">
    <div v-if="loading" class="loading">
      <ProgressSpinner />
    </div>

    <div v-else-if="error" class="error">
      <Message severity="error" :text="error" />
    </div>

    <template v-else-if="article">
      <!-- Top Navigation Bar -->
      <nav class="top-nav">
        <Breadcrumbs :items="breadcrumbs" />
        <div class="nav-actions">
          <Button icon="pi pi-bookmark" class="p-button-text" />
          <Button icon="pi pi-share-alt" class="p-button-text" />
        </div>
      </nav>

      <article class="main-article">
        <header class="article-header">
          <h1>{{ article.title }}</h1>
          <div class="article-subheader">
            <p class="description">{{ article.description }}</p>

            <div class="article-meta">
              <div class="author-info">
                <img
                  :src="article.publisher?.author.user.avatar?.url || '/default-avatar.png'"
                  alt="Author avatar"
                  class="author-avatar"
                >
                <div class="author-details">
                  <span class="author-name">
                    {{ formattedName || 'Anonymous' }}</span>
                  <div class="post-info">
                    <span>{{ formattedDate }}</span>
                    <span class="dot-separator">·</span>
                    <span>{{ readingTime }}</span>
                  </div>
                </div>
              </div>

              <div class="share-buttons">
                <Button icon="pi pi-twitter" class="p-button-text" />
                <Button icon="pi pi-facebook" class="p-button-text" />
                <Button icon="pi pi-linkedin" class="p-button-text" />
                <Button icon="pi pi-bookmark" class="p-button-text" />
              </div>
            </div>
          </div>
        </header>

        <!-- Article Content -->
        <div class="article-content">
          <div v-if="article.image" class="featured-image">
            <img :src="article.image" :alt="article.title">
          </div>

          <div class="content-body">
            <div v-if="typeof article.content === 'object'" class="content-blocks">
              <template v-for="(block, index) in article.content.blocks" :key="index">
                <div v-if="block.type === 'paragraph'" class="content-paragraph">
                  {{ block.data.text }}
                </div>
              </template>
            </div>
            <div v-else class="content-text">
              {{ article.content }}
            </div>
          </div>

          <!-- Tags -->
          <div class="tags-section">
            <Chip
              v-for="tag in article.tags"
              :key="tag"
              :label="tag"
              class="mr-2"
            />
          </div>
        </div>
      </article>

      <!-- Related Articles -->
      <section v-if="relatedArticles.length > 0" class="related-articles">
        <h2>More from Medium</h2>
        <div class="related-grid">
          <article
            v-for="related in relatedArticles"
            :key="related.id"
            class="related-article"
          >
            <NuxtLink :to="`/articles-preview/${related.slug}`">
              <div class="related-content">
                <div class="related-text">
                  <div class="related-author">
                    <img
                      :src="related.author?.avatar || '/default-avatar.png'"
                      alt="Author"
                      class="author-mini-avatar"
                    >
                    <span>{{ related.author?.name || 'Anonymous' }}</span>
                  </div>
                  <h3>{{ related.title }}</h3>
                </div>
                <img
                  v-if="related.image"
                  :src="related.image"
                  :alt="related.title"
                  class="related-thumbnail"
                >
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.article-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.main-article {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.article-header h1 {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #242424;
}

.article-subheader .description {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 500;
  color: #242424;
}

.post-info {
  color: #666;
  font-size: 0.9rem;
}

.dot-separator {
  margin: 0 0.5rem;
}

.featured-image {
  margin: 2rem 0;
}

.featured-image img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 4px;
}

.content-body {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #242424;
}

.content-paragraph {
  margin-bottom: 2rem;
}

.tags-section {
  margin: 3rem 0;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.related-articles {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.related-articles h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.related-grid {
  display: grid;
  gap: 2rem;
}

.related-article {
  border-bottom: 1px solid #eee;
  padding-bottom: 2rem;
}

.related-content {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.related-text {
  flex: 1;
}

.related-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.author-mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.related-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.related-article h3 {
  font-size: 1.2rem;
  line-height: 1.4;
  color: #242424;
}

@media (max-width: 768px) {
  .article-view {
    padding: 0 1rem;
  }

  .article-header h1 {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .related-content {
    flex-direction: column;
  }

  .related-thumbnail {
    width: 100%;
    height: 200px;
  }
}
</style>
