// Re-export shared types for convenience
export type {
  User,
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilter,
  ApiResponse,
  PaginationMeta,
  PaginatedResponse,
  PaginatedTodosResponse,
} from '@mevn-todos/shared'

// Frontend-specific types that aren't in shared package
export interface AppConfig {
  api: {
    baseUrl: string
  }
}
