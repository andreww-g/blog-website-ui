<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArticleStore } from '~/stores/article';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const articleStore = useArticleStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

if (!authStore.isAuthorized) {
  navigateTo('/auth');
}

const articles = ref([]);
const loading = ref(false);

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'My Articles' }
];

const fetchArticles = async () => {
  loading.value = true;
  try {
    const { data } = await articleStore.getPublisherArticles();
    articles.value = data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch articles'
    });
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (articleId: string) => {
  confirm.require({
    message: 'Are you sure you want to delete this article?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await articleStore.deleteArticle(articleId);
        await fetchArticles(); // Refresh the list
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Article deleted successfully'
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete article'
        });
      }
    }
  });
};

onMounted(fetchArticles);
</script>

<template>
  <div class="publisher-articles">
    <Breadcrumbs :items="breadcrumbs" />
    
    <div class="header">
      <h1>My Articles</h1>
      <Button
        label="Create Article"
        icon="pi pi-plus"
        @click="router.push('/articles-preview/create')"
        class="p-button-primary"
      />
    </div>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else class="articles-list">
      <div v-for="article in articles" :key="article.id" class="article-card">
        <div class="article-header">
          <h3>{{ article.title }}</h3>
          <div class="article-actions">
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click.prevent="handleDelete(article.id)"
              aria-label="Delete"
            />
          </div>
        </div>
        <NuxtLink :to="`/articles-preview/${article.slug}`" class="article-link">
          <p class="description">{{ article.description }}</p>
          <div class="article-meta">
            <span class="date">{{ new Date(article.createdAt).toLocaleDateString() }}</span>
            <span class="category">{{ article.category.name }}</span>
            <span class="status" :class="article.publishedAt ? 'published' : 'draft'">
              {{ article.publishedAt ? 'Published' : 'Draft' }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.publisher-articles {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.articles-list {
  display: grid;
  gap: 1.5rem;
}

.article-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.article-header h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
  flex: 1;
  padding-right: 1rem;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.article-actions :deep(.p-button.p-button-text) {
  padding: 0.5rem;
  color: #dc3545;
}

.article-actions :deep(.p-button.p-button-text:hover) {
  background: rgba(220, 53, 69, 0.1);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.9rem;
}

.date {
  color: #666;
}

.category {
  color: #6a0dad;
  font-weight: 500;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status.published {
  background: #d4edda;
  color: #155724;
}

.status.draft {
  background: #f8f9fa;
  color: #6c757d;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .publisher-articles {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .article-card {
    padding: 1rem;
  }
}
</style> 