<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProfile } from '~/stores/profile';
import { useAuthStore } from '~/stores/auth';
import { restClient } from '~/openapi/rest-client';
import { useReadingTime } from '~/composables/useReadingTime';

const profileStore = useProfile();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);
const { calculateReadingTime } = useReadingTime();

const password = ref('');
const showPassword = ref(false);

// Form data with reactivity
const formData = reactive({
  user: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  contactInfo: {
    telegram: '',
    facebook: '',
    instagram: '',
  },
});

watch(() => profileStore.profile, (newProfile) => {
  if (newProfile) {
    formData.user = {
      firstName: newProfile.user.firstName,
      lastName: newProfile.user.lastName,
      email: newProfile.user.email,
      password: newProfile.user.password,
    };
    formData.contactInfo = {
      telegram: newProfile.contactInfo?.telegram || '',
      facebook: newProfile.contactInfo?.facebook || '',
      instagram: newProfile.contactInfo?.instagram || '',
    };
  }
}, { immediate: true });

if (!authStore.isAuthorized) {
  navigateTo('/auth');
}

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Profile' }
];

const fetchProfileData = async () => {
  try {
    loading.value = true;
    const data = await profileStore.fetchProfile();

    if (data.error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load profile'
      });
    }
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
    loading.value = true;

    const updateData = {
      user: {
        firstName: formData.user.firstName,
        lastName: formData.user.lastName,
        email: formData.user.email,
        ...(password.value ? {password: password.value} : {})
      },
      contactInfo: {
        telegram: formData.contactInfo.telegram,
        facebook: formData.contactInfo.facebook,
        instagram: formData.contactInfo.instagram
      }
    };

    await profileStore.updateProfile(updateData);

    showPassword.value = false;
    await fetchProfileData();

    loading.value = false;
};

onMounted(() => {
  fetchProfileData();
});
</script>

<template>
  <div class="profile-page">
    <Breadcrumbs :items="breadcrumbs" />

    <div v-if="loading" class="loading">
      <ProgressSpinner />
    </div>

    <template v-else-if="profileStore.profile">
      <div class="profile-header">
        <div class="avatar-section">
          <img
            :src="profileStore.profile.avatar?.url || '/default-avatar.png'"
            :alt="profileStore.profile.user?.firstName"
            class="profile-avatar"
          >
        </div>
        <div class="profile-info">
          <h1>{{ profileStore.profile.user?.firstName }} {{ profileStore.profile.user?.lastName }}</h1>
          <p class="email">{{ profileStore.profile.user?.email }}</p>
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Articles</span>
              <span class="stat-value">{{ profileStore.profile.articles?.length || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="profile-section">
          <div class="section-header">
            <h2>Profile Settings</h2>
            <Button
              type="submit"
              label="Save Changes"
              :loading="loading"
              class="submit-button"
              form="profile-form"
            />
          </div>

          <form
            id="profile-form"
            @submit.prevent="handleUpdate"
            class="profile-form"
          >
            <div class="form-section">
              <h2>Personal Information</h2>
              <div class="form-group">
                <label for="firstName">First Name</label>
                <InputText
                  id="firstName"
                  v-model="formData.user.firstName"
                  required
                  class="w-full"
                />
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <InputText
                  id="lastName"
                  v-model="formData.user.lastName"
                  required
                  class="w-full"
                />
              </div>
            </div>

            <div class="form-section">
              <h2>Social Media Links</h2>
              <div class="form-group">
                <label for="telegram">
                  <i class="pi pi-telegram" /> Telegram
                </label>
                <InputText
                  id="telegram"
                  v-model="formData.contactInfo.telegram"
                  class="w-full"
                  placeholder="https://t.me/username"
                />
              </div>

              <div class="form-group">
                <label for="facebook">
                  <i class="pi pi-facebook" /> Facebook
                </label>
                <InputText
                  id="facebook"
                  v-model="formData.contactInfo.facebook"
                  class="w-full"
                  placeholder="https://facebook.com/profile"
                />
              </div>

              <div class="form-group">
                <label for="instagram">
                  <i class="pi pi-instagram" /> Instagram
                </label>
                <InputText
                  id="instagram"
                  v-model="formData.contactInfo.instagram"
                  class="w-full"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>

            <div class="form-section">
              <h2>Account Settings</h2>
              <div class="form-group">
                <label for="email">Email</label>
                <InputText
                  id="email"
                  v-model="formData.user.email"
                  type="email"
                  required
                  class="w-full"
                />
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <div class="p-inputgroup">
                  <InputText
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter new password"
                    class="w-full"
                  />
                  <Button
                    type="button"
                    :icon="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                    @click="showPassword = !showPassword"
                    class="password-toggle"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="articles-section">
          <h2>My Articles</h2>
          <div class="articles-grid">
            <article
              v-for="article in profileStore.profile.articles"
              :key="article.id"
              class="article-card"
            >
              <NuxtLink :to="`/articles-preview/${article.slug}`">
                <div class="article-image" v-if="article.image">
                  <img :src="article.image" :alt="article.title">
                </div>
                <div class="article-content">
                  <h3>{{ article.title }}</h3>
                  <p>{{ article.description }}</p>
                  <div class="article-meta">
                    <span class="date">{{ new Date(article.publishedAt || article.createdAt).toLocaleDateString() }}</span>
                    <span class="separator">•</span>
                    <span class="reading-time">{{ calculateReadingTime(article.content) }}</span>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: center;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.profile-info h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.email {
  color: #666;
  margin: 0.5rem 0;
}

.stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4b0082;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.profile-section, .articles-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #6a0dad;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group i {
  color: #6a0dad;
}

.articles-grid {
  display: grid;
  gap: 1.5rem;
}

.article-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
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
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 1rem;
}

.article-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.article-content p {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.article-meta {
  font-size: 0.85rem;
  color: #666;
}

.separator {
  margin: 0 0.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #6a0dad;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.submit-button {
  background-color: #6a0dad !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  font-size: 1rem !important;
  height: auto !important;
}

.submit-button:hover {
  background-color: #4b0082 !important;
}

.form-actions {
  display: none;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .stats {
    justify-content: center;
  }
}

.p-inputgroup {
  display: flex;
  align-items: center;
}

.password-toggle {
  background: none !important;
  border: 1px solid #ced4da !important;
  color: #666 !important;
}

.password-toggle:hover {
  background: rgba(106, 13, 173, 0.1) !important;
  color: #6a0dad !important;
}

.form-group :deep(.p-inputtext) {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
}

.form-group :deep(.p-inputgroup) {
  .p-inputtext {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
  }

  .password-toggle {
    padding: 0.75rem !important;
    font-size: 1rem;
  }
}
</style>
