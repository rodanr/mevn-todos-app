<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-brand">
        <div class="brand-icon">
          <i class="pi pi-check-square"></i>
        </div>
        <span class="brand-text">{{ appName }}</span>
      </div>

      <div class="header-actions">
        <div class="user-menu">
          <Menu ref="userMenuRef" :model="userMenuItems" :popup="true">
            <template #item="{ item }">
              <div class="menu-item">
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </div>
            </template>
          </Menu>

          <div class="user-avatar" @click="toggleUserMenu" v-tooltip="authStore.fullName">
            <div class="avatar-circle">
              <span class="avatar-initials">{{ userInitials }}</span>
            </div>
            <div class="user-info">
              <span class="user-name">{{ authStore.fullName }}</span>
              <span class="user-email">{{ authStore.user?.email }}</span>
            </div>
            <i class="pi pi-chevron-down dropdown-icon"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Logout Confirmation Dialog -->
    <Dialog
      v-model:visible="showLogoutDialog"
      :modal="true"
      :closable="false"
      :draggable="false"
      class="logout-confirmation-dialog"
      :style="{ width: '420px' }"
      :showHeader="false"
    >
      <!-- Custom Dialog Content -->
      <div class="logout-dialog-content">
        <!-- Icon and Header -->
        <div class="logout-header">
          <div class="logout-icon">
            <i class="pi pi-sign-out"></i>
          </div>
          <h3 class="logout-title">Sign Out</h3>
          <p class="logout-message">
            Are you sure you want to sign out of your account? You'll need to sign in again to
            access your todos.
          </p>
        </div>

        <!-- User Info Card -->
        <div class="logout-user-card">
          <div class="user-card-avatar">
            <span class="user-card-initials">{{ userInitials }}</span>
          </div>
          <div class="user-card-info">
            <div class="user-card-name">{{ authStore.fullName }}</div>
            <div class="user-card-email">{{ authStore.user?.email }}</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="logout-actions">
          <Button
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="logout-cancel-btn"
            @click="cancelLogout"
            :disabled="isLoggingOut"
          />
          <Button
            label="Sign Out"
            icon="pi pi-sign-out"
            severity="danger"
            class="logout-confirm-btn"
            @click="confirmLogout"
            :loading="isLoggingOut"
          />
        </div>
      </div>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth'
import { config } from '@/config'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Dialog from 'primevue/dialog'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const userMenuRef = ref()

const appName = config.app.name

const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const firstName = authStore.user.firstName?.[0] || ''
  const lastName = authStore.user.lastName?.[0] || ''
  return (firstName + lastName).toUpperCase() || 'U'
})

const userMenuItems = computed(() => [
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => {
      // TODO: Navigate to profile page
      toast.add({
        severity: 'info',
        summary: 'Coming Soon',
        detail: 'Profile management is coming soon!',
        life: 3000,
      })
    },
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => {
      // TODO: Navigate to settings page
      toast.add({
        severity: 'info',
        summary: 'Coming Soon',
        detail: 'Settings page is coming soon!',
        life: 3000,
      })
    },
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: handleLogout,
  },
])

const showLogoutDialog = ref(false)
const isLoggingOut = ref(false)

const toggleUserMenu = (event: Event) => {
  userMenuRef.value.toggle(event)
}

const handleLogout = () => {
  showLogoutDialog.value = true
}

const cancelLogout = () => {
  showLogoutDialog.value = false
}

const confirmLogout = async () => {
  isLoggingOut.value = true

  try {
    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    authStore.logout()
    showLogoutDialog.value = false
    router.push({ name: 'login' })

    toast.add({
      severity: 'success',
      summary: 'Signed Out',
      detail: 'You have been successfully signed out',
      life: 3000,
    })
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: #5a6d82;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.125rem;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.user-avatar:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #5a6d82;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-initials {
  color: white;
  font-weight: 600;
  font-size: 0.8125rem;
  line-height: 1;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  color: #94a3b8;
  font-size: 0.75rem;
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.user-avatar:hover .dropdown-icon {
  color: #64748b;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 0.125rem;
}

.menu-item:hover {
  background: #f1f5f9;
}

.menu-item i {
  width: 16px;
  color: #64748b;
}

.menu-item span {
  font-weight: 500;
  color: #374151;
}

/* Custom Logout Dialog Styles */
.logout-confirmation-dialog :deep(.p-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.logout-confirmation-dialog :deep(.p-dialog-content) {
  padding: 0;
  border-radius: 20px;
}

.logout-dialog-content {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
  position: relative;
}

.logout-dialog-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #5a6d82 0%, #667c9a 50%, #5a6d82 100%);
  background-size: 200% 100%;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.logout-header {
  margin-bottom: 2rem;
}

.logout-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #5a6d82 0%, #667c9a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  color: white;
  font-size: 1.75rem;
  box-shadow:
    0 8px 32px rgba(90, 109, 130, 0.3),
    0 4px 16px rgba(102, 124, 154, 0.2);
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 8px 32px rgba(90, 109, 130, 0.3),
      0 4px 16px rgba(102, 124, 154, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow:
      0 12px 40px rgba(90, 109, 130, 0.4),
      0 6px 20px rgba(102, 124, 154, 0.3);
  }
}

.logout-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  letter-spacing: -0.025em;
}

.logout-message {
  font-size: 1rem;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
  font-weight: 400;
  max-width: 340px;
  margin: 0 auto;
}

.logout-user-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
}

.logout-user-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667c9a 0%, #5a6d82 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(90, 109, 130, 0.3);
}

.user-card-initials {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
}

.user-card-info {
  flex: 1;
  text-align: left;
  min-width: 0;
}

.user-card-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card-email {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.logout-cancel-btn,
.logout-confirm-btn {
  height: 48px;
  padding: 0 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.logout-cancel-btn {
  border: 2px solid #e2e8f0;
  color: #64748b;
  background: #ffffff;
}

.logout-cancel-btn:hover:not(:disabled) {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #475569;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logout-confirm-btn {
  background: linear-gradient(135deg, #5a6d82 0%, #667c9a 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(90, 109, 130, 0.3);
}

.logout-confirm-btn:hover:not(:disabled):not(.p-button-loading) {
  background: linear-gradient(135deg, #4a5968 0%, #5a6d82 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(90, 109, 130, 0.4);
}

.logout-confirm-btn.p-button-loading {
  background: linear-gradient(135deg, #5a6d82 0%, #667c9a 100%);
}

.logout-cancel-btn:disabled,
.logout-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Responsive adjustments */
@media (max-width: 500px) {
  .logout-confirmation-dialog :deep(.p-dialog) {
    width: 95vw !important;
    max-width: none !important;
    margin: 1rem;
  }

  .logout-dialog-content {
    padding: 1.5rem;
  }

  .logout-icon {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }

  .logout-title {
    font-size: 1.25rem;
  }

  .logout-message {
    font-size: 0.875rem;
  }

  .logout-user-card {
    padding: 1.25rem;
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .user-card-info {
    text-align: center;
  }

  .logout-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .logout-cancel-btn,
  .logout-confirm-btn {
    width: 100%;
    min-width: auto;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
  }

  .user-info {
    display: none;
  }
}
</style>
