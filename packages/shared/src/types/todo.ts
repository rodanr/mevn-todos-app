export interface Todo {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  isDone: boolean;
  completedAt: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type TodoResponseDto = Todo;

export interface TodoFilter {
  isDone?: boolean;
  upcoming?: boolean;
  overdue?: boolean;
}
