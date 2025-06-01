<template>
  <div id="app">
    <AppHeader v-if="authStore.isAuthenticated" />
    <main class="main-content">
      <RouterView />
    </main>
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 0;
}
</style>
