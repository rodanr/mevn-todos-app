import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { config } from '@/config'
import type { ApiResponse } from '@mevn-todos/shared'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error) => {
        if (error.response?.status === 401) {
          const currentPath = window.location.pathname
          const isAuthPage = currentPath.includes('/auth/')
          const isLoginRequest = error.config?.url?.includes('/auth/login')

          if (!isAuthPage && !isLoginRequest) {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('user')
            window.location.href = '/auth/login'
          }
        }
        return Promise.reject(error)
      },
    )
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params })
    return response.data.data!
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data)
    return response.data.data!
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data)
    return response.data.data!
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url)
    return response.data.data!
  }
}

export const apiClient = new ApiClient()
