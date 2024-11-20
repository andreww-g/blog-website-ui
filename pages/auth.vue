<template>
  <div class="auth-overlay" @click.self="$emit('close')">
    <div class="auth-container">
      <button class="close-btn" @click="$emit('close')">
        <i class="pi pi-times"></i>
      </button>
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
          <span class="error" v-if="v$.email.$error">
            {{ v$.email.$errors[0].$message }}
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
          <span class="error" v-if="v$.password.$error">
            {{ v$.password.$errors[0].$message }}
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

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { useToast } from 'primevue/usetoast';
import { restClient } from '~/openapi/rest-client';

const authStore = useAuthStore();
const toast = useToast();
const isLoading = ref(false);

const form = reactive({
  email: '',
  password: '',
});

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Email is not correct', email),
  },
  password: {
    required: helpers.withMessage('Password is required', required),
  },
};

const v$ = useVuelidate(rules, form);

const submit = async () => {
  if (!await v$.value.$validate()) return;
  isLoading.value = true;

  try {
    const { data, error } = await restClient.post('/v1/auth/login', {
      body: form,
      auth: false,
    });

    if (error) {
      console.error(error);

      if (error.message === 'Forbidden') {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Your account has been blocked' });
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials' });
      }
      return;
    }

    if (data?.data) {
      authStore.setTokens(data.data);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Authorization is successful' });
      navigateTo({ name: 'index' });
    }
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred' });
  } finally {
    isLoading.value = false;
  }
};

defineEmits(['close']);
</script>

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

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
</style>
