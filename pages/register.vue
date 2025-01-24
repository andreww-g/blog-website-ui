<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '~/stores/auth';
import { usePublisherStore } from '~/stores/publisher';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const profileStore = useProfile();
const publisherStore = usePublisherStore();
const loading = ref(false);
const showPassword = ref(false);

const formData = ref({
  user: {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  },
  contactInfo: {
    telegram: null,
    facebook: null,
    instagram: null,
  },
  avatarId: null,
});

if (authStore.isAuthorized) {
  navigateTo('/profile');
}

const handleSubmit = async () => {
  try {
    loading.value = true;

    const { error: registerError } = await publisherStore.createPublisher(formData.value);
    if (registerError) throw registerError;

    const { error: loginError } = await authStore.login({
      email: formData.value.user.email,
      password: formData.value.user.password
    });
    if (loginError) throw loginError;

    await new Promise(resolve => setTimeout(resolve, 500));

    const { error: profileError } = await profileStore.fetchProfile();

    if (profileError) throw profileError;

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Registration successful'
    });

    router.push('/profile');
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Registration failed'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Sign up</h1>
      <form @submit.prevent="handleSubmit" class="register-form">
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
          <div class="password-input">
            <input
              id="password"
              v-model="formData.user.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full"
            />
            <button 
              type="button" 
              class="mask-toggle"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-actions">
          <Button
            type="submit"
            label="Register"
            :loading="loading"
            class="p-button-primary w-full"
          />
        </div>

        <div class="form-footer">
          Already have an account?
          <NuxtLink to="/auth?from=register">Login</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8f9fa;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.form-group :deep(.p-inputtext),
.form-group :deep(.p-password) {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  width: 100%;
  height: 2.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.form-group :deep(.p-password) {
  display: flex;
  align-items: center;
  height: 2.75rem;
  width: 100%;
  position: relative;
}

.form-group :deep(.p-password-input) {
  height: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border: none;
  border-radius: 4px 0 0 4px;
  width: 100%;
  background: transparent;
  position: absolute;
  inset: 0;
}

.form-actions {
  margin-top: 1rem;
}

.form-actions :deep(.p-button) {
  background: #6a0dad;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  height: 2.75rem;
}

.form-actions :deep(.p-button:hover) {
  background: #4b0082;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.form-footer a {
  color: #6a0dad;
  text-decoration: none;
  margin-left: 0.5rem;
}

.form-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
  }
}

.password-input {
  position: relative;
  width: 100%;
  height: 2.75rem;
}

.password-input input {
  width: 100%;
  height: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
}

.mask-toggle {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  min-width: 2.75rem;
  background: transparent;
  border: none;
  border-radius: 0 4px 4px 0;
  color: #666;
  cursor: pointer;
}

.mask-toggle:hover {
  color: #333;
}

.mask-toggle i {
  font-size: 1.1rem;
}
</style>
