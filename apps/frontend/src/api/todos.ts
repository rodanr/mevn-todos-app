import { apiClient } from './client'
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter } from '@/types'

export interface PaginatedResponse<T> {
  todos: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export const todosApi = {
  async getTodos(
    filter?: TodoFilter & { page?: number; limit?: number },
  ): Promise<PaginatedResponse<Todo>> {
    const params = new URLSearchParams()

    if (filter?.isDone !== undefined) {
      params.append('isDone', filter.isDone.toString())
    }

    if (filter?.upcoming) {
      params.append('upcoming', 'true')
    }

    if (filter?.page) {
      params.append('page', filter.page.toString())
    }

    if (filter?.limit) {
      params.append('limit', filter.limit.toString())
    }

    const queryString = params.toString()
    const url = `/api/v1/todos${queryString ? `?${queryString}` : ''}`

    return await apiClient.get<PaginatedResponse<Todo>>(url)
  },

  async getTodoById(id: string): Promise<Todo> {
    return await apiClient.get<Todo>(`/api/v1/todos/${id}`)
  },

  async createTodo(todo: CreateTodoInput): Promise<Todo> {
    return await apiClient.post<Todo>('/api/v1/todos', todo)
  },

  async updateTodo(id: string, todo: UpdateTodoInput): Promise<Todo> {
    return await apiClient.patch<Todo>(`/api/v1/todos/${id}`, todo)
  },

  async deleteTodo(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/todos/${id}`)
  },

  async toggleTodo(id: string, isDone: boolean): Promise<Todo> {
    return await apiClient.patch<Todo>(`/api/v1/todos/${id}`, { isDone })
  },
}
