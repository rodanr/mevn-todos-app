import { apiClient } from './client'
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilter,
  PaginatedTodosResponse,
} from '@mevn-todos/shared'

export const todosApi = {
  async getTodos(
    filter?: TodoFilter & { page?: number; limit?: number },
  ): Promise<PaginatedTodosResponse<Todo>> {
    const params = new URLSearchParams()

    if (filter?.isDone) {
      params.append('isDone', filter.isDone.toString())
    }

    if (filter?.upcoming) {
      params.append('upcoming', 'true')
    }

    if (filter?.overdue) {
      params.append('overdue', 'true')
    }

    if (filter?.page) {
      params.append('page', filter.page.toString())
    }

    if (filter?.limit) {
      params.append('limit', filter.limit.toString())
    }

    const queryString = params.toString()
    const url = `/api/v1/todos${queryString ? `?${queryString}` : ''}`

    return await apiClient.get<PaginatedTodosResponse<Todo>>(url)
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
