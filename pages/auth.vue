<script lang="ts" setup>
import Button from 'primevue/button';
import { reactive, ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { useToast } from 'primevue/usetoast';
import { restClient } from '~/openapi/rest-client';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const toast = useToast();
const isLoading = ref(false);
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const showEmailError = ref(false);
const showPasswordError = ref(false);

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
  emit('close');
  router.push('/');
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
    <div class="auth-container">
      <Button 
        icon="pi pi-times"
        text
        rounded
        aria-label="Cancel"
        class="close-btn"
        @click="handleClose"
      />
      <h1>Login</h1>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email"
            v-model="form.email" 
            :disabled="isLoading"
          />
          <span class="error" v-if="showEmailError || v$.email.$error">
            {{ showEmailError ? 'Email is required' : v$.email.$errors[0].$message }}
          </span>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password"
            v-model="form.password" 
            :disabled="isLoading"
          />
          <span class="error" v-if="showPasswordError || v$.password.$error">
            {{ showPasswordError ? 'Password is required' : v$.password.$errors[0].$message }}
          </span>
        </div>
        <button 
          type="submit" 
          :disabled="isLoading || v$.$invalid"
        >
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>
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

.auth-container {
  position: relative;
  background-color: #6a0dad;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  margin: 2rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  margin-bottom: 0.5rem;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
}

button {
  width: 100%;
  background-color: #4b0082;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #5a2d8a;
}

button:disabled {
  background-color: #8b6b9f;
  cursor: not-allowed;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white !important;
  z-index: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

:deep(.p-button.p-button-rounded) {
  width: 2.5rem;
  height: 2.5rem;
}

:deep(.p-button.p-button-text) {
  color: white !important;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

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

:deep(.p-toast-icon-close) {
  opacity: 0.7;
}

:deep(.p-toast-icon-close:hover) {
  opacity: 1;
}

:deep(.p-toast-detail) {
  margin: 0.5rem 0;
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

/* Center toast container */
:deep(.p-toast-top-center) {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
