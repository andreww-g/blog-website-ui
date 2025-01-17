<script lang="ts" setup>
import { ref } from 'vue';
import type { Article } from '~/types/article';
import type { Publisher } from '~/types/publisher';
import { restClient } from '~/openapi/rest-client';

const route = useRoute();
const slug = route.params.slug as string;

const article = ref<Article | null>(null);
const publisher = ref<Publisher | null>(null);
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
  if (!publisher.value?.user) return 'Anonymous';
  const { firstName, lastName } = publisher.value.user;
  return `${firstName} ${lastName}`;
});

const publisherAvatar = computed(() => {
  return publisher.value?.avatar?.url || '/default-avatar.png';
});

const readingTime = computed(() => {
  if (!article.value?.content) return '0 min read';
  const words = JSON.stringify(article.value.content).split(' ').length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
});

const socialLinks = computed(() => ({
  telegram: publisher.value?.contactInfo?.telegram,
  instagram: publisher.value?.contactInfo?.instagram,
  facebook: publisher.value?.contactInfo?.facebook
}));

const openSocialLink = (type: 'telegram' | 'instagram' | 'facebook') => {
  const link = socialLinks.value[type];
  if (link) {
    window.open(link, '_blank');
  }
};

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

const fetchPublisher = async (publisherId: string | null) => {
  if (!publisherId) return null;

  const { data, error: fetchError } = await restClient.get(`/v1/public/publishers/${publisherId}`);

  if (fetchError) {
    console.error('Error fetching publisher:', fetchError);
    return null;
  }

  return data?.data;
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

    if (articleData?.publisherId && articleData.id) {
      const [publisherData, relatedArticlesData] = await Promise.all([
        fetchPublisher(articleData.publisherId),
        fetchRelatedArticles(articleData.id)
      ]);

      publisher.value = publisherData;
      relatedArticles.value = relatedArticlesData;
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
              <NuxtLink 
                :to="`/publishers/${publisher?.id}`" 
                class="publisher-info"
              >
                <img
                  :src="publisherAvatar"
                  :alt="formattedName"
                  class="publisher-avatar"
                >
                <div class="publisher-details">
                  <span class="publisher-name">{{ formattedName }}</span>
                  <div class="post-info">
                    <span>{{ formattedDate }}</span>
                    <span class="dot-separator">·</span>
                    <span>{{ readingTime }}</span>
                  </div>
                </div>
              </NuxtLink>

              <div class="share-buttons">
                <Button
                  icon="pi pi-telegram"
                  class="p-button-text social-button"
                  @click="openSocialLink('telegram')"
                  :disabled="!socialLinks.telegram"
                  :title="socialLinks.telegram ? 'Visit Telegram' : 'Telegram not available'"
                />
                <Button
                  icon="pi pi-facebook"
                  class="p-button-text social-button"
                  @click="openSocialLink('facebook')"
                  :disabled="!socialLinks.facebook"
                  :title="socialLinks.facebook ? 'Visit Facebook' : 'Facebook not available'"
                />
                <Button
                  icon="pi pi-instagram"
                  class="p-button-text social-button"
                  @click="openSocialLink('instagram')"
                  :disabled="!socialLinks.instagram"
                  :title="socialLinks.instagram ? 'Visit Instagram' : 'Instagram not available'"
                />
                <Button icon="pi pi-bookmark" class="p-button-text" />
              </div>
            </div>
          </div>
        </header>

        <div class="article-content">
          <div v-if="article.image" class="featured-image">
            <img :src="article.image" :alt="article.title">
          </div>

          <div class="content-body">
            <div v-if="typeof article.content === 'object'" class="content-blocks">
              <template v-for="(block, index) in article.content?.blocks" :key="index">
                <div v-if="block.type === 'paragraph'" class="content-paragraph">
                  {{ block.data.text }}
                </div>
              </template>
            </div>
            <div v-else class="content-text">
              {{ article.content }}
            </div>
          </div>

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

      <section v-if="relatedArticles.length > 0" class="related-articles">
        <h2>Related articles</h2>
        <div class="related-grid">
          <article
            v-for="related in relatedArticles"
            :key="related.id"
            class="related-article"
          >
            <NuxtLink :to="`/articles-preview/${related.slug}`">
              <div class="related-content">
                <div class="related-text">
                  <h3>{{ related.title }}</h3>
                  <div class="related-meta">
                    <div class="related-publisher">
                      <img
                        :src="related.publisher?.avatar?.url || '/default-avatar.png'"
                        :alt="related.publisher?.user ?
                          `${related.publisher.user.firstName} ${related.publisher.user.lastName}` :
                          'Anonymous'"
                        class="publisher-mini-avatar"
                      >
                      <span class="publisher-name">
                        {{ related.publisher?.user ?
                          `${related.publisher.user.firstName} ${related.publisher.user.lastName}` :
                          'Anonymous'
                        }}
                      </span>
                      <span class="dot-separator">·</span>
                      <span class="read-time">{{ Math.ceil((related.content?.toString().split(' ').length || 0) / 200) }} min read</span>
                    </div>
                  </div>
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

.publisher-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.publisher-info:hover {
  opacity: 0.8;
}

.publisher-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.publisher-details {
  display: flex;
  flex-direction: column;
}

.publisher-name {
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
  gap: 1.5rem;
  padding: 1rem 0;
}

.related-text {
  flex: 1;
  min-width: 0;
}

.related-publisher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.publisher-mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.related-thumbnail {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.related-text h3 {
  font-size: 1.2rem;
  line-height: 1.4;
  color: #242424;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.publisher-name {
  color: #666;
  font-size: 0.9rem;
}

.read-time {
  color: #666;
  font-size: 0.9rem;
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
    flex-direction: row;
    padding: 0.75rem 0;
  }

  .related-thumbnail {
    width: 100px;
    height: 70px;
  }

  .related-text h3 {
    font-size: 1.1rem;
  }

  .related-publisher {
    font-size: 0.8rem;
  }
}

.related-meta {
  margin-top: 0.5rem;
}

.share-buttons .p-button.p-button-text {
  color: #4b0082;
}

.share-buttons .p-button.p-button-text:not(:disabled):hover {
  background: rgba(75, 0, 130, 0.04);
}

.share-buttons .p-button.p-button-text:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.social-button.p-button.p-button-text {
  color: #4b0082;
}

.social-button.p-button.p-button-text:not(:disabled):hover {
  background: rgba(75, 0, 130, 0.04);
}

.social-button.p-button.p-button-text:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
