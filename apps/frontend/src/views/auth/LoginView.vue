<template>
  <div class="auth-container">
    <div class="auth-content">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">
            <div class="logo-icon">
              <i class="pi pi-check-square"></i>
            </div>
          </div>
          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email address</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="form-input"
              :class="{ 'p-invalid': emailError }"
              :disabled="authStore.isLoading"
              autocomplete="email"
            />
            <small v-if="emailError" class="form-error">{{ emailError }}</small>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <PasswordInput
              id="password"
              v-model="password"
              placeholder="Enter your password"
              :invalid="!!passwordError"
              :disabled="authStore.isLoading"
              autocomplete="current-password"
            />
            <small v-if="passwordError" class="form-error">{{ passwordError }}</small>
          </div>

          <Button
            type="submit"
            label="Sign in"
            class="auth-button"
            :loading="authStore.isLoading"
            :disabled="!isFormValid"
            icon="pi pi-sign-in"
          />
        </form>

        <div class="auth-footer">
          <p class="auth-link-text">
            Don't have an account?
            <router-link to="/auth/register" class="auth-link"> Create one here </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import PasswordInput from '@/components/ui/PasswordInput.vue'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// Validation schema
const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
)

const { handleSubmit } = useForm({
  validationSchema: loginSchema,
})

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const isFormValid = computed(() => {
  return email.value && password.value && !emailError.value && !passwordError.value
})

const handleLogin = handleSubmit(async (values) => {
  try {
    await authStore.login(values)
    toast.add({
      severity: 'success',
      summary: 'Welcome back!',
      detail: 'Successfully logged in',
      life: 3000,
    })
    router.push({ name: 'todos' })
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Sign in failed',
      detail: error.response?.data?.message || 'Invalid email or password',
      life: 5000,
    })
  }
})
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  overflow: hidden;
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(148, 163, 184, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(203, 213, 225, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(226, 232, 240, 0.1) 0%, transparent 70%);
  z-index: 1;
}

.auth-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(45deg, rgba(148, 163, 184, 0.03) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(148, 163, 184, 0.03) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(148, 163, 184, 0.03) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(148, 163, 184, 0.03) 75%);
  background-size: 60px 60px;
  background-position:
    0 0,
    0 30px,
    30px -30px,
    -30px 0px;
  animation: subtleShift 25s ease-in-out infinite;
  z-index: 1;
}

@keyframes subtleShift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-5px, -5px);
  }
}

.auth-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.08),
    0 8px 10px -6px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #5a6d82 0%, #667c9a 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  font-size: 2rem;
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.auth-subtitle {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

/* Style all PrimeVue InputText components consistently */
.form-input :deep(.p-inputtext) {
  height: 48px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #ffffff;
  padding: 0 1rem;
}

/* Also style InputText components that are direct children */
:deep(.p-inputtext) {
  height: 48px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #ffffff;
  padding: 0 1rem;
}

:deep(.p-inputtext):focus {
  border-color: #5a6d82;
  box-shadow: 0 0 0 3px rgba(90, 109, 130, 0.1);
}

:deep(.p-invalid) {
  border-color: #ef4444;
}

:deep(.p-invalid):focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Password component specific styling */
.form-input :deep(.p-password) {
  position: relative;
  width: 100%;
}

.form-input :deep(.p-password .p-password-input) {
  width: 100%;
  padding-right: 3rem; /* Make space for the toggle button */
}

.form-input :deep(.p-password .p-password-toggle) {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s ease;
  z-index: 10;
}

.form-input :deep(.p-password .p-password-toggle):hover {
  color: #374151;
  background-color: #f3f4f6;
}

.form-input :deep(.p-inputtext):focus,
.form-input :deep(.p-password-input):focus {
  border-color: #5a6d82;
  box-shadow: 0 0 0 3px rgba(90, 109, 130, 0.1);
}

.form-input :deep(.p-invalid) {
  border-color: #ef4444;
}

.form-input :deep(.p-invalid):focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.auth-button {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  background: linear-gradient(135deg, #5a6d82 0%, #667c9a 100%);
  border: none;
  transition: all 0.2s ease;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(90, 109, 130, 0.4);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
}

.auth-link-text {
  color: #64748b;
  font-size: 0.875rem;
}

.auth-link {
  color: #5a6d82;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: #4e5c6b;
  text-decoration: underline;
}

.auth-background {
  display: none; /* Remove the old awkward side panel */
}

.bg-pattern {
  display: none; /* Remove the old dot pattern */
}

/* Responsive */
@media (max-width: 768px) {
  .auth-background {
    display: none;
  }

  .auth-content {
    padding: 1rem;
  }

  .auth-card {
    padding: 2rem 1.5rem;
  }
}
</style>
