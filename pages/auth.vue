<script lang="ts" setup>
import Button from 'primevue/button';
import { reactive, ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { useToast } from 'primevue/usetoast';
import { restClient } from '~/openapi/rest-client';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const toast = useToast();
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();

// Redirect if already authorized
if (authStore.isAuthorized) {
  navigateTo('/');
}

const form = reactive({
  email: '',
  password: '',
});

const showEmailError = ref(false);
const showPasswordError = ref(false);
const showPassword = ref(false);

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Email is not correct', email),
    validEmail: helpers.withMessage('Email must be in format example@domain.com', (value: string) => {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
  },
};

const v$ = useVuelidate(rules, form);

const handleClose = () => {
  // Check if we came from register page
  if (route.query.from === 'register') {
    router.push('/register');
  } else {
    emit('close');
    router.push('/');
  }
};

watch(() => form.email, (newVal) => {
  if (newVal === '') {
    showEmailError.value = true;
  } else {
    showEmailError.value = false;
  }
});

watch(() => form.password, (newVal) => {
  if (newVal === '') {
    showPasswordError.value = true;
  } else {
    showPasswordError.value = false;
  }
});

const submit = async () => {
  if (form.email === '') {
    showEmailError.value = true;
  }
  if (form.password === '') {
    showPasswordError.value = true;
  }

  if (!await v$.value.$validate()) return;
  isLoading.value = true;

  try {
    const { data, error } = await restClient.post('/v1/auth/login', {
      body: form,
      auth: false,
    });

    if (error) {
      if (error.status === 500) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unauthorized',
          life: 3000,
          position: 'center',
          class: 'custom-toast'
        });
        return;
      }

      if (error.message === 'Forbidden') {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Your account has been blocked',
          life: 3000,
          position: 'center',
          class: 'custom-toast'
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid credentials',
          life: 3000,
          position: 'center',
          class: 'custom-toast'
        });
      }
      return;
    }

    if (data?.data) {
      authStore.setTokens(data.data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Authorization is successful',
        life: 3000,
        position: 'center',
        class: 'custom-toast'
      });
      emit('close');
      navigateTo({ name: 'index' });
    }
  } catch (e) {
    console.error(e);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unauthorized',
      life: 3000,
      position: 'center',
      class: 'custom-toast'
    });
  } finally {
    isLoading.value = false;
  }
};

const emit = defineEmits(['close']);
</script>

<template>
  <div class="auth-overlay" @click.self="handleClose">
    <div class="auth-card">
      <div class="header">
        <button class="back-button" @click="handleClose">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h1>Login</h1>
      </div>

      <form @submit.prevent="submit" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            :disabled="isLoading"
            class="w-full"
          />
          <span class="error" v-if="showEmailError || v$.email.$error">
            {{ showEmailError ? 'Email is required' : v$.email.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :disabled="isLoading"
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
          <span class="error" v-if="showPasswordError || v$.password.$error">
            {{ showPasswordError ? 'Password is required' : v$.password.$errors[0].$message }}
          </span>
        </div>

        <div class="form-actions">
          <Button
            type="submit"
            :label="isLoading ? 'Loading...' : 'Login'"
            :loading="isLoading"
            :disabled="isLoading || v$.$invalid"
            class="p-button-primary w-full"
          />
        </div>

        <div class="form-footer">
          Don't have an account?
          <NuxtLink to="/register">Sign up</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.header {
  position: relative;
  margin-bottom: 2rem;
}

.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  color: #333;
}

h1 {
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin: 0;
}

.auth-form {
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
}

.form-group input {
  width: 100%;
  height: 2.75rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.password-input {
  position: relative;
  width: 100%;
  height: 2.75rem;
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

.error {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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

.form-actions :deep(.p-button:disabled) {
  background: #8b6b9f;
  cursor: not-allowed;
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
  .auth-card {
    padding: 1.5rem;
  }
}

/* Toast styles */
:deep(.p-toast) {
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}

:deep(.p-toast-message) {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0;
}

:deep(.p-toast-message-error) {
  background: #ffe8e8;
  border-left: 4px solid #ff4444;
}

:deep(.p-toast-message-success) {
  background: #e8ffe8;
  border-left: 4px solid #44ff44;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
