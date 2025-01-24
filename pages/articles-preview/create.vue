<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useArticleStore } from '~/stores/article';
import Dropdown from 'primevue/dropdown';
import { ArticleCategoryEnum } from '~/types/article';
import ArticleEditor from '~/components/ArticleEditor.vue';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const articleStore = useArticleStore();

if (!authStore.isAuthorized) {
  navigateTo('/auth');
}

interface ArticleCategory {
  type: ArticleCategoryEnum;
  name: string;
}

const article = ref({
  title: '',
  description: '',
  content: {
    blocks: [] as Array<{type: string, data: {text: string}}>,
  },
  image: {
    url: '',
    name: '',
    mimeType: null,
    size: null
  },
  category: {
    type: ArticleCategoryEnum.TECHNOLOGY,
    name: 'Technology'
  } as ArticleCategory,
  slug: ''
});

const categories = ref([]);
const loading = ref(false);

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Articles', to: '/articles-preview' },
  { text: 'Create Article' }
];

const editorContent = ref('');

const editorConfig = {
  modules: {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }]
    ]
  },
  placeholder: 'Write your article content here...'
};

onMounted(async () => {
  const { data } = await articleStore.getCategories();
  categories.value = data;
});

const handleEditorInput = (html: string) => {
  if (!html) {
    article.value.content.blocks = [];
    return;
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const blocks = Array.from(doc.body.children).map(element => ({
    type: 'paragraph',
    data: {
      text: element.textContent?.trim() || ''
    }
  })).filter(block => block.data.text.length > 0);

  article.value.content.blocks = blocks;
};

const generateSlug = computed(() => {
  return article.value.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/--+/g, '-');
});

watch(() => article.value.title, (newTitle) => {
  if (newTitle) {
    article.value.slug = generateSlug.value;
  }
});

const handleSave = async () => {
  loading.value = true;
  const { data, error } = await articleStore.createArticle({
    title: article.value.title,
    description: article.value.description,
    content: article.value.content,
    image: article.value.image,
    category: article.value.category,
    slug: article.value.slug
  });
  loading.value = false;
  return data;
};

const handlePublish = async (articleId: string) => {
  loading.value = true;
  await articleStore.publishArticle(articleId);
  loading.value = false;
};

const handleUnpublish = async (articleId: string) => {
  loading.value = true;
  await articleStore.unpublishArticle(articleId);
  loading.value = false;
};

const handleSubmit = async () => {
  if (!article.value.content.blocks.length) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Content cannot be empty'
    });
    return;
  }

  const savedArticle = await handleSave();
  if (savedArticle) {
    await handlePublish(savedArticle.id);
    router.push(`/articles-preview/${savedArticle.slug}`);
  }
};

const categoryOptions = [
  {
    type: ArticleCategoryEnum.TECHNOLOGY,
    name: 'Technology'
  },
  {
    type: ArticleCategoryEnum.BUSINESS,
    name: 'Business'
  },
  {
    type: ArticleCategoryEnum.LIFESTYLE,
    name: 'Lifestyle'
  }
] as ArticleCategory[];
</script>

<template>
  <div class="create-article">
    <Breadcrumbs :items="breadcrumbs" />
    <h1>Create Article</h1>

    <form @submit.prevent="handleSubmit" class="article-form">
      <div class="form-group">
        <label for="title">Title</label>
        <InputText
          id="title"
          v-model="article.title"
          required
          class="w-full"
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="article.description"
          required
          rows="4"
          class="w-full"
        />
      </div>

      <div class="form-group">
        <label for="content">Content</label>
        <ArticleEditor
          v-model="editorContent"
          @update:modelValue="handleEditorInput"
          placeholder="Write your article content here..."
        />
        <small class="helper-text">Write your article content here. Use the toolbar for formatting.</small>
        <div v-if="article.content.blocks.length === 0" class="error-text">
          Content is required
        </div>
      </div>

      <div class="form-group">
        <label for="image">Image URL</label>
        <InputText
          id="image"
          v-model="article.image.url"
          class="w-full"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <Dropdown
          id="category"
          v-model="article.category"
          :options="categoryOptions"
          option-label="name"
          :option-value="null"
          placeholder="Select a category"
          class="w-full"
        />
      </div>

      <div class="form-group">
        <label for="slug">URL Slug</label>
        <InputText
          id="slug"
          v-model="article.slug"
          required
          class="w-full"
          :disabled="!article.title"
        />
        <small class="helper-text">This will be the URL of your article. Generated from title but can be customized.</small>
      </div>

      <div class="form-actions">
        <Button
          type="button"
          label="Save Draft"
          :loading="loading"
          class="p-button-secondary"
          @click="handleSave"
        />
        <Button
          type="submit"
          label="Save & Publish"
          :loading="loading"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-article {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.article-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.form-group :deep(.p-inputtext),
.form-group :deep(.p-dropdown),
.form-group :deep(.p-textarea) {
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.5;
}

.form-group :deep(.p-dropdown-label) {
  padding: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.form-group :deep(.p-dropdown-trigger) {
  width: 3rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.form-actions :deep(.p-button) {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  height: auto;
}

.p-button-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

.p-button-primary {
  background-color: #6a0dad !important;
  border-color: #6a0dad !important;
}

@media (max-width: 768px) {
  .article-form {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

}

.content-editor :deep(.ql-editor p) {
  margin-bottom: 1rem;
}

.content-editor :deep(.ql-snow.ql-toolbar button) {
  width: 28px;
  height: 28px;
}

.helper-text {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}
</style>
