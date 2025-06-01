export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface Todo {
  id: string
  name: string
  description: string
  dueDate: string
  isDone: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  name: string
  description: string
  dueDate: string
}

export interface UpdateTodoInput {
  name?: string
  description?: string
  dueDate?: string
  isDone?: boolean
}

export interface TodoFilter {
  isDone?: boolean
  upcoming?: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}
