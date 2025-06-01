import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User, LoginInput, LoginOutput, RegisterUserInput } from '@mevn-todos/shared'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Omit<User, 'createdAt' | 'updatedAt'> | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed((): boolean => !!token.value && !!user.value)
  const fullName = computed((): string =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  )

  const login = async (credentials: LoginInput): Promise<LoginOutput> => {
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

  const register = async (credentials: RegisterUserInput): Promise<void> => {
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
