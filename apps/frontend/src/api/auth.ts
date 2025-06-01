import type {
  LoginInput,
  LoginOutput,
  RegisterUserInput,
  RegisterUserOutput,
} from '@mevn-todos/shared'
import { apiClient } from './client'

export const authApi = {
  async login(credentials: LoginInput): Promise<LoginOutput> {
    return apiClient.post<LoginOutput>('/api/v1/auth/login', credentials)
  },

  async register(userData: RegisterUserInput): Promise<RegisterUserOutput> {
    return apiClient.post<RegisterUserOutput>('/api/v1/auth/register', userData)
  },
}
