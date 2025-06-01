<template>
  <div class="auth-container">
    <div class="auth-content">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">
            <div class="logo-icon">
              <i class="pi pi-user-plus"></i>
            </div>
          </div>
          <h1 class="auth-title">Create your account</h1>
          <p class="auth-subtitle">Join us to start organizing your tasks</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">First name</label>
              <InputText
                id="firstName"
                v-model="firstName"
                placeholder="First name"
                class="form-input"
                :class="{ 'p-invalid': firstNameError }"
                :disabled="authStore.isLoading"
                autocomplete="given-name"
              />
              <small v-if="firstNameError" class="form-error">{{ firstNameError }}</small>
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Last name</label>
              <InputText
                id="lastName"
                v-model="lastName"
                placeholder="Last name"
                class="form-input"
                :class="{ 'p-invalid': lastNameError }"
                :disabled="authStore.isLoading"
                autocomplete="family-name"
              />
              <small v-if="lastNameError" class="form-error">{{ lastNameError }}</small>
            </div>
          </div>

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
              placeholder="Create a password"
              :invalid="!!passwordError"
              :disabled="authStore.isLoading"
              autocomplete="new-password"
            />
            <small v-if="passwordError" class="form-error">{{ passwordError }}</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm password</label>
            <PasswordInput
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Confirm your password"
              :invalid="!!confirmPasswordError"
              :disabled="authStore.isLoading"
              autocomplete="new-password"
            />
            <small v-if="confirmPasswordError" class="form-error">{{ confirmPasswordError }}</small>
          </div>

          <Button
            type="submit"
            label="Create account"
            class="auth-button"
            :loading="authStore.isLoading"
            :disabled="!isFormValid"
            icon="pi pi-user-plus"
          />
        </form>

        <div class="auth-footer">
          <p class="auth-link-text">
            Already have an account?
            <router-link to="/auth/login" class="auth-link"> Sign in here </router-link>
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
const registerSchema = toTypedSchema(
  z
    .object({
      firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name is too long'),
      lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name is too long'),
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
)

const { handleSubmit } = useForm({
  validationSchema: registerSchema,
})

const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName')
const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField<string>('confirmPassword')

const isFormValid = computed(() => {
  return (
    firstName.value &&
    lastName.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    !firstNameError.value &&
    !lastNameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  )
})

const handleRegister = handleSubmit(async (values) => {
  try {
    await authStore.register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    })

    toast.add({
      severity: 'success',
      summary: 'Account created!',
      detail: 'Your account has been created successfully. Please sign in.',
      life: 5000,
    })

    router.push({ name: 'login' })
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Registration failed',
      detail: error.response?.data?.message || 'Failed to create account',
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
  max-width: 480px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  min-width: 0; /* Allow flex items to shrink below their content size */
}

/* Style all PrimeVue InputText components consistently */
.form-input :deep(.p-inputtext) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #ffffff;
  padding: 0 1rem;
  box-sizing: border-box;
}

/* Also style InputText components that are direct children */
:deep(.p-inputtext) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #ffffff;
  padding: 0 1rem;
  box-sizing: border-box;
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

  .form-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
