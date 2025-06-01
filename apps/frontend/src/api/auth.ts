import { apiClient } from './client'
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/v1/auth/login', credentials)
  },

  async register(userData: RegisterCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/v1/auth/register', userData)
  },

  async me(): Promise<User> {
    return apiClient.get<User>('/api/v1/auth/me')
  },

  async refreshToken(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/v1/auth/refresh')
  },
}
