<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useArticleStore } from '~/stores/article';
import Dropdown from 'primevue/dropdown';
import { ArticleCategoryEnum } from '~/types/article';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const articleStore = useArticleStore();

if (!authStore.isAuthorized) {
  navigateTo('/auth');
}

const article = ref({
  title: '',
  description: '',
  content: {
    blocks: [{
      type: 'paragraph',
      data: {
        text: ''
      }
    }]
  },
  image: {
    url: '',
    name: '',
    mimeType: null,
    size: null
  },
  category: null,
  slug: ''
});

const categories = ref([]);
const loading = ref(false);

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Articles', to: '/articles-preview' },
  { text: 'Create Article' }
];

onMounted(async () => {
  const { data } = await articleStore.getCategories();
  categories.value = data;
});

const handleEditorInput = (event: any) => {
  const html = event.htmlValue || '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const blocks = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({
          type: 'paragraph',
          data: { text }
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const text = element.textContent?.trim();
      if (text) {
        blocks.push({
          type: 'paragraph',
          data: { text }
        });
      }
    }
  });

  article.value.content = { blocks };
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
  const savedArticle = await handleSave();
  if (savedArticle) {
    await handlePublish(savedArticle.id);
    router.push(`/articles-preview/${savedArticle.slug}`);
  }
};

const categoryOptions = [
  { name: ArticleCategoryEnum.TECHNOLOGY, slug: 'technology' },
  { name: ArticleCategoryEnum.BUSINESS, slug: 'business' },
  { name: ArticleCategoryEnum.LIFESTYLE, slug: 'lifestyle' },
];

const formatCategoryLabel = (category: { name: ArticleCategoryEnum }) => {
  return category.name.charAt(0) + category.name.slice(1).toLowerCase();
};
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
        <Editor
          id="content"
          :model-value="article.content.blocks.map(block => block.data.text).join('\n\n')"
          @update:model-value="handleEditorInput"
          editorStyle="height: 320px"
          class="content-editor"
        >
          <template #toolbar>
            <span class="ql-formats">
              <button class="ql-bold" />
              <button class="ql-italic" />
              <button class="ql-underline" />
            </span>
            <span class="ql-formats">
              <button class="ql-blockquote" />
            </span>
            <span class="ql-formats">
              <button class="ql-list" value="ordered" />
              <button class="ql-list" value="bullet" />
            </span>
          </template>
        </Editor>
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
          :option-label-method="formatCategoryLabel"
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
}

.form-group :deep(.p-inputtext),
.form-group :deep(.p-editor-container) {
  font-size: 1.1rem;
  padding: 1rem;
  border-radius: 8px;
}

.form-group :deep(.p-editor-container) {
  border: 1px solid #ced4da;
}

.form-group :deep(.p-editor-container) .p-editor-content {
  min-height: 320px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.p-button {
  padding: 1rem 2rem !important;
  font-size: 1.1rem !important;
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

  .p-button {
    width: 100%;
  }
}

.content-editor :deep(.ql-toolbar) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #f8f9fa;
  border-color: #ced4da;
}

.content-editor :deep(.ql-container) {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-color: #ced4da;
  font-size: 1.1rem;
}

.content-editor :deep(.ql-editor) {
  min-height: 320px;
  font-family: inherit;
  line-height: 1.6;
}

.content-editor :deep(.ql-editor p) {
  margin-bottom: 1rem;
}

.content-editor :deep(.ql-snow.ql-toolbar button) {
  width: 28px;
  height: 28px;
}

.content-editor :deep(.ql-snow .ql-stroke) {
  stroke: #666;
}

.content-editor :deep(.ql-snow .ql-fill) {
  fill: #666;
}

.content-editor :deep(.ql-snow.ql-toolbar button:hover .ql-stroke) {
  stroke: #6a0dad;
}

.content-editor :deep(.ql-snow.ql-toolbar button:hover .ql-fill) {
  fill: #6a0dad;
}

.content-editor :deep(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
  stroke: #6a0dad;
}

.content-editor :deep(.ql-snow.ql-toolbar button.ql-active .ql-fill) {
  fill: #6a0dad;
}

.helper-text {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.form-group :deep(.p-dropdown) {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
}

.form-group :deep(.p-dropdown-label) {
  padding: 0.25rem;
}

.form-group :deep(.p-dropdown-items) {
  padding: 0.5rem 0;
}

.form-group :deep(.p-dropdown-item) {
  padding: 0.75rem 1rem;
}
</style>
