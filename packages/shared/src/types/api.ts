export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface ValidationErrorResponse {
  error: {
    fieldErrors: Record<string, string[]>;
    formErrors: string[];
  };
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginatedTodosResponse<T> {
  todos: T[];
  pagination: PaginationMeta;
}
