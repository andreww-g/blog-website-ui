<script lang="ts" setup>
import { usePublisherStore } from '~/stores/publisher';
import { useAuthStore } from '~/stores/auth';

const publisherStore = usePublisherStore();
const authStore = useAuthStore();

// Redirect if not authorized
if (!authStore.isAuthorized) {
  navigateTo('/auth');
}

const currentPage = ref(0);
const itemsPerPage = ref(10);
const searchQuery = ref('');

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Publishers' }
];

const fetchPublishers = async () => {
  await publisherStore.fetchPublishers({
    skip: currentPage.value * itemsPerPage.value,
    take: itemsPerPage.value,
    searchQuery: searchQuery.value
  });
};

const onPageChange = async (event: { page: number; rows: number }) => {
  currentPage.value = event.page;
  itemsPerPage.value = event.rows;
  await fetchPublishers();
};

const debouncedSearch = useDebounceFn(async () => {
  currentPage.value = 0;
  await fetchPublishers();
}, 300);

watch(searchQuery, () => {
  debouncedSearch();
});

onMounted(() => {
  fetchPublishers();
});
</script>

<template>
  <div class="publishers-page">
    <Breadcrumbs :items="breadcrumbs" />

    <div class="hero-section">
      <div class="search-container">
        <div class="search-box">
          <i class="pi pi-search search-icon" />
          <InputText
            v-model="searchQuery"
            placeholder="Search publishers..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <div class="content-section">
      <div v-if="publisherStore.loading" class="loading">
        <ProgressSpinner />
      </div>

      <div v-else-if="publisherStore.error" class="error">
        <Message severity="error" :text="publisherStore.error" />
      </div>

      <template v-else>
        <div class="publishers-grid">
          <div
            v-for="publisher in publisherStore.publishers"
            :key="publisher.id"
            class="publisher-card"
          >
            <div class="publisher-header">
              <img
                :src="publisher.avatar?.url || '/default-avatar.png'"
                :alt="publisher.user ? `${publisher.user.firstName} ${publisher.user.lastName}` : 'Anonymous'"
                class="publisher-avatar"
              >
              <div class="publisher-info">
                <h3>{{ publisher.user ? `${publisher.user.firstName} ${publisher.user.lastName}` : 'Anonymous' }}</h3>
                <div class="publisher-stats">
                  <span>Articles: {{ publisher.articles?.length || 0 }} </span>
                </div>
              </div>
            </div>

            <div class="recent-articles">
              <div
                v-for="article in publisher.articles?.slice(0, 2)"
                :key="article.id"
                class="article-preview"
              >
                <NuxtLink :to="`/articles-preview/${article.slug}`">
                  <h4>{{ article.title }}</h4>
                  <p>{{ article.description }}</p>
                </NuxtLink>
              </div>
            </div>

            <div class="social-links">
              <a
                v-if="publisher.contactInfo?.telegram"
                :href="publisher.contactInfo.telegram"
                target="_blank"
                class="social-link"
              >
                <i class="pi pi-telegram" />
              </a>
              <a
                v-if="publisher.contactInfo?.facebook"
                :href="publisher.contactInfo.facebook"
                target="_blank"
                class="social-link"
              >
                <i class="pi pi-facebook" />
              </a>
              <a
                v-if="publisher.contactInfo?.instagram"
                :href="publisher.contactInfo.instagram"
                target="_blank"
                class="social-link"
              >
                <i class="pi pi-instagram" />
              </a>
            </div>
          </div>
        </div>

        <Paginator
          v-if="publisherStore.total > itemsPerPage"
          :rows="itemsPerPage"
          :total-records="publisherStore.total"
          :first="currentPage * itemsPerPage"
          @page="onPageChange"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.publishers-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  background: #f8f9fa;
  padding: 3rem 0;
  margin: -2rem -2rem 2rem;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-icon {
  color: #6a0dad;
  margin-right: 0.5rem;
}

.search-input {
  flex: 1;
  border: none;
  padding: 0.5rem;
  font-size: 1.1rem;
}

.search-input:focus {
  outline: none;
}

.publishers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.publisher-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.publisher-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.publisher-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.publisher-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.publisher-stats {
  font-size: 0.9rem;
  color: #666;
}

.recent-articles {
  margin: 1rem 0;
}

.article-preview {
  margin-bottom: 1rem;
}

.article-preview a {
  text-decoration: none;
  color: inherit;
}

.article-preview h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #333;
}

.article-preview p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.social-link {
  color: #666;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
}

.social-link:hover {
  color: #6a0dad;
  background: rgba(106, 13, 173, 0.1);
}

@media (max-width: 768px) {
  .publishers-page {
    padding: 1rem;
  }

  .hero-section {
    margin: -1rem -1rem 1rem;
    padding: 2rem 0;
  }

  .publishers-grid {
    grid-template-columns: 1fr;
  }
}
</style>
