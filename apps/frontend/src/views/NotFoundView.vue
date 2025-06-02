<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-card">
        <div class="not-found-header">
          <div class="not-found-icon">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="error-code">404</div>
          <h1 class="not-found-title">Page Not Found</h1>
          <p class="not-found-subtitle">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div class="not-found-actions">
          <Button
            @click="goHome"
            :label="authStore.isAuthenticated ? 'Go to Todos' : 'Sign In'"
            :icon="authStore.isAuthenticated ? 'pi pi-home' : 'pi pi-sign-in'"
            class="primary-button"
          />
          <Button
            @click="goBack"
            label="Go Back"
            icon="pi pi-arrow-left"
            outlined
            class="secondary-button"
          />
        </div>

        <div class="not-found-footer">
          <p class="helpful-links-text">
            Need help?
            <router-link to="/auth/login" class="helpful-link">Sign in</router-link>
            or
            <router-link to="/auth/register" class="helpful-link">create an account</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()

const goHome = () => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'todos' })
  } else {
    router.push({ name: 'login' })
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  overflow: hidden;
}

.not-found-container::before {
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

.not-found-container::after {
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

.not-found-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.not-found-card {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.08),
    0 8px 10px -6px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.3);
  text-align: center;
}

.not-found-header {
  margin-bottom: 2.5rem;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2.5rem;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.error-code {
  font-size: 4rem;
  font-weight: 800;
  color: #5a6d82;
  margin-bottom: 1rem;
  letter-spacing: -0.05em;
  text-shadow: 0 2px 4px rgba(90, 109, 130, 0.1);
}

.not-found-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

.not-found-subtitle {
  color: #64748b;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.not-found-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.primary-button {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  background: linear-gradient(135deg, #5a6d82 0%, #667c9a 100%);
  border: none;
  transition: all 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(90, 109, 130, 0.4);
}

.secondary-button {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

.secondary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #5a6d82;
  color: #5a6d82;
}

.not-found-footer {
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  padding-top: 1.5rem;
}

.helpful-links-text {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.helpful-link {
  color: #5a6d82;
  font-weight: 600;
  text-decoration: none;
  margin: 0 0.25rem;
  transition: color 0.2s ease;
}

.helpful-link:hover {
  color: #4e5c6b;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .not-found-content {
    padding: 1rem;
  }

  .not-found-card {
    padding: 2rem 1.5rem;
  }

  .error-code {
    font-size: 3rem;
  }

  .not-found-title {
    font-size: 1.5rem;
  }

  .not-found-subtitle {
    font-size: 1rem;
  }

  .not-found-icon {
    width: 64px;
    height: 64px;
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .not-found-actions {
    gap: 0.75rem;
  }

  .helpful-links-text {
    line-height: 1.6;
  }

  .helpful-link {
    display: inline-block;
    margin: 0.125rem 0.25rem;
  }
}
</style>
