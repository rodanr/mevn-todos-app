import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // Computed
  const isAuthenticated = computed((): boolean => !!token.value && !!user.value)
  const fullName = computed((): string =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  )

  // Actions
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)
      user.value = response.user
      token.value = response.token

      // Persist to localStorage
      localStorage.setItem('auth-token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    isLoading.value = true
    try {
      await authApi.register(credentials)
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')

    // Clear any cached data when logging out
    // This prevents stale data from appearing for the next user
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const initializeAuth = (): void => {
    const storedToken = localStorage.getItem('auth-token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        logout()
      }
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    fullName,
    login,
    register,
    logout,
    initializeAuth,
  }
})
